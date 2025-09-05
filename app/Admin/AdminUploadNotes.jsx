

// app/Admin/AdminUploadNotes.jsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import {
  addDoc,
  collection,
  deleteDoc,
  doc as firestoreDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import {
  deleteObject,
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";

import { db, storage } from "../../firebase";

/**
 * AdminUploadNotes
 * - admin stored in AsyncStorage under "admin" (fallback to "faculty")
 * - fetches facultyAssignments where facultyId == admin.id
 * - uploads files to Firebase Storage and tracks metadata in Firestore 'notes' collection
 */

export default function AdminUploadNotes() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [notesData, setNotesData] = useState({}); // subjectId => [unit1..6]
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState(null);

  useEffect(() => {
  const fetchFacultyAndSubjects = async () => {
    try {
      // read admin from AsyncStorage (try several keys)
      const storedAdminJson = await AsyncStorage.getItem("admin") 
        || await AsyncStorage.getItem("faculty") 
        || await AsyncStorage.getItem("currentUser");
      const adminObj = storedAdminJson ? JSON.parse(storedAdminJson) : null;
      if (!adminObj) {
        Alert.alert("Not logged in", "Please login as admin/faculty.");
        router.push("/Admin/AdminLogin");
        return;
      }
      console.log("ADMIN OBJ:", adminObj);
      setAdmin(adminObj);

      // build candidate keys (strings) to compare with facultyAssignments.facultyId
      const adminIdCandidates = [
        adminObj.id,
        adminObj.phone,
        (adminObj.phone || "").toString(),
        (adminObj.id || "").toString()
      ].filter(Boolean).map(x => String(x));

      // Try to query using the most likely candidate first (string)
      let assignmentsSnap = null;
      for (const candidate of adminIdCandidates) {
        const q = query(collection(db, "facultyAssignments"), where("facultyId", "==", candidate));
        const snap = await getDocs(q);
        console.log("Query candidate", candidate, "->", snap.size);
        if (!snap.empty) {
          assignmentsSnap = snap;
          break;
        }
      }

      // If still null, fetch all assignments and filter locally (safe fallback)
      let assignmentsDocs = [];
      if (!assignmentsSnap) {
        const all = await getDocs(collection(db, "facultyAssignments"));
        assignmentsDocs = all.docs.map(d => ({ id: d.id, ...d.data() }));
        // filter locally
        assignmentsDocs = assignmentsDocs.filter(a => adminIdCandidates.includes(String(a.facultyId)));
      } else {
        assignmentsDocs = assignmentsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      }

      console.log("ASSIGNMENTS FOUND:", assignmentsDocs);
      setAssignedSubjects(assignmentsDocs);

      // load notes for each assignment (same as before)...
      const notesState = {};
      for (const sub of assignmentsDocs) {
        const nq = query(collection(db, "notes"), where("subjectId", "==", sub.subjectId));
        const nsnap = await getDocs(nq);
        const unitNotes = Array(6).fill(null);
        nsnap.docs.forEach((d) => {
          const nd = d.data();
          if (nd && typeof nd.unit === "number") unitNotes[nd.unit - 1] = { id: d.id, ...nd };
        });
        notesState[sub.subjectId] = unitNotes;
      }
      setNotesData(notesState);
    } catch (err) {
      console.error("fetchFacultyAndSubjects error:", err);
      Alert.alert("Error", "Could not load subjects. Check network & rules.");
    } finally {
      setLoading(false);
    }
  };

  fetchFacultyAndSubjects();
}, [router]);
  // helper: convert uri to blob (works in RN)
  const uriToBlob = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  // helper: normalize DocumentPicker result to { uri, name }
  const extractPickedFile = (res) => {
    if (!res) return null;
    if (res.type === "success" && res.uri) {
      return { uri: res.uri, name: res.name || "file" };
    }
    if (Array.isArray(res.assets) && res.assets.length > 0) {
      const a = res.assets[0];
      return { uri: a.uri, name: a.name || "file" };
    }
    if (res.uri) {
      return { uri: res.uri, name: res.name || "file" };
    }
    return null;
  };

  // Upload for admin (same logic as faculty)
  const handleUpload = async (subject, unitIndex) => {
    try {
      const pickerRes = await DocumentPicker.getDocumentAsync({ type: "*/*" });
      console.log("Picker result:", pickerRes);
      const picked = extractPickedFile(pickerRes);
      if (!picked) {
        Alert.alert("No file", "No file selected or picker cancelled.");
        return;
      }
      const { uri, name } = picked;
      if (!uri) throw new Error("File URI missing");

      // convert to blob
      const blob = await uriToBlob(uri);

      // storage path - deterministic folder per subject, unique filename with timestamp
      const safeName = (name || `unit-${unitIndex + 1}`).replace(/\s+/g, "_");
      const path = `notes/${subject.subjectId}/unit-${unitIndex + 1}-${Date.now()}-${safeName}`;

      // upload bytes
      const sRef = storageRef(storage, path);
      await uploadBytes(sRef, blob);

      // get url
      const downloadUrl = await getDownloadURL(sRef);

      // delete old note if exists (remove storage + doc)
      const old = notesData[subject.subjectId]?.[unitIndex];
      if (old) {
        try {
          if (old.storagePath) {
            const oldRef = storageRef(storage, old.storagePath);
            await deleteObject(oldRef).catch((e) => console.warn("deleteObject old:", e.message));
          }
          await deleteDoc(firestoreDoc(db, "notes", old.id)).catch((e) =>
            console.warn("deleteDoc old:", e.message)
          );
        } catch (cleanupErr) {
          console.warn("Cleanup error:", cleanupErr);
        }
      }

      // add firestore doc
      const docRef = await addDoc(collection(db, "notes"), {
        subjectId: subject.subjectId,
        subjectName: subject.subjectName || "",
        unit: unitIndex + 1,
        fileUrl: downloadUrl,
        storagePath: path,
        uploadedBy: admin?.name || "",
        uploadedById: admin?.id || admin?.phone || "",
        uploadedAt: serverTimestamp(),
        locked: false,
      });

      // update state
      setNotesData((prev) => {
        const updated = { ...prev };
        if (!updated[subject.subjectId]) updated[subject.subjectId] = Array(6).fill(null);
        updated[subject.subjectId][unitIndex] = {
          id: docRef.id,
          subjectId: subject.subjectId,
          unit: unitIndex + 1,
          fileUrl: downloadUrl,
          storagePath: path,
          locked: false,
        };
        return updated;
      });

      Alert.alert("Uploaded", `Unit ${unitIndex + 1} uploaded`);
    } catch (err) {
      console.error("Upload error:", err);
      if (
        err?.message?.includes("ActivityNotFoundException") ||
        err?.message?.includes("OPEN_DOCUMENT")
      ) {
        Alert.alert(
          "Picker not available",
          "Expo Go on Android may not support full file picking. Create a dev build or test on a real device."
        );
        return;
      }
      Alert.alert("Upload failed", err.message || "Try again");
    }
  };

  // delete note (storage + firestore)
  const handleDelete = async (subject, unitIndex) => {
    try {
      const note = notesData[subject.subjectId]?.[unitIndex];
      if (!note) return Alert.alert("No note", "Nothing to delete");

      if (note.storagePath) {
        const sRef = storageRef(storage, note.storagePath);
        await deleteObject(sRef).catch((e) => console.warn("deleteObject:", e.message));
      }

      await deleteDoc(firestoreDoc(db, "notes", note.id));

      setNotesData((prev) => {
        const updated = { ...prev };
        updated[subject.subjectId][unitIndex] = null;
        return updated;
      });

      Alert.alert("Deleted", `Unit ${unitIndex + 1} deleted`);
    } catch (err) {
      console.error("Delete error:", err);
      Alert.alert("Delete failed", err.message || "Could not delete");
    }
  };

  // toggle lock/unlock
  const toggleLock = async (subject, unitIndex) => {
    try {
      const note = notesData[subject.subjectId]?.[unitIndex];
      if (!note) return Alert.alert("No note", "Upload note first");

      const noteRef = firestoreDoc(db, "notes", note.id);
      const newLocked = !note.locked;
      await updateDoc(noteRef, { locked: newLocked });

      setNotesData((prev) => {
        const updated = { ...prev };
        updated[subject.subjectId][unitIndex] = { ...note, locked: newLocked };
        return updated;
      });

      Alert.alert("Status updated", `Unit ${unitIndex + 1} is now ${newLocked ? "Locked" : "Unlocked"}`);
    } catch (err) {
      console.error("toggleLock error:", err);
      Alert.alert("Could not change lock", err.message || "Try again");
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Loading your subjects...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => (selectedSubject ? setSelectedSubject(null) : router.back())}>
          <Ionicons name="arrow-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Upload Notes</Text>
        <View style={{ width: 24 }} />
      </View>

      {!selectedSubject ? (
        <ScrollView contentContainerStyle={styles.subjectList}>
          {assignedSubjects.length === 0 ? (
            <Text style={{ textAlign: "center", marginTop: 20 }}>No subjects assigned 📚</Text>
          ) : (
            assignedSubjects.map((s) => (
              <TouchableOpacity key={s.subjectId} style={styles.subjectCard} onPress={() => setSelectedSubject(s)}>
                <Text style={styles.subjectCardText}>{s.subjectName}</Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      ) : (
        <View style={styles.unitsContainer}>
          {(notesData[selectedSubject.subjectId] || Array(6).fill(null)).map((note, idx) => (
            <View key={idx} style={styles.unitRow}>
              <Text style={styles.unitText}>Unit {idx + 1}</Text>

              {note ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity onPress={() => Linking.openURL(note.fileUrl)} style={styles.actionBtn}>
                    <Text style={styles.openText}>Open</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => toggleLock(selectedSubject, idx)} style={styles.actionBtn}>
                    <Text style={{ color: note.locked ? "#DC3545" : "#28A745" }}>{note.locked ? "Unlock" : "Lock"}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleDelete(selectedSubject, idx)} style={styles.actionBtn}>
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity onPress={() => handleUpload(selectedSubject, idx)} style={styles.actionBtn}>
                  <Text style={styles.uploadText}>Upload</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },

  centered: { flex: 1, justifyContent: "center", alignItems: "center" },

  subjectList: { padding: 15, paddingBottom: 80 },
  subjectCard: {
    backgroundColor: "#0056b3",
    borderRadius: 12,
    paddingVertical: 24,
    alignItems: "center",
    marginBottom: 12,
    elevation: 4,
  },
  subjectCardText: { fontSize: 18, fontWeight: "700", color: "#fff" },

  unitsContainer: { flex: 1, padding: 15 },
  unitRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 3,
  },
  unitText: { fontSize: 16, fontWeight: "700", color: "#333" },
  actionBtn: { paddingHorizontal: 10, paddingVertical: 5 },
  uploadText: { color: "#007BFF", fontWeight: "700" },
  openText: { color: "#28A745", fontWeight: "700" },
  deleteText: { color: "#DC3545", fontWeight: "700" },
});