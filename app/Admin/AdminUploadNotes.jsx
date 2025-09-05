// app/Faculty/FacultyUploadNotes.jsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
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
import { db, storage } from "../../firebase";
import BottomNavbar from "./components/AdminNavbar";

/**
 * FacultyUploadNotes
 * - Uses AsyncStorage key "faculty" (should contain an object with `.id` and `.name`)
 * - Expects facultyAssignments collection to exist with field subjectId/subjectName
 * - Expects a notes collection used to store metadata of uploaded files
 *
 * IMPORTANT:
 * - On Android with Expo Go you may hit a DocumentPicker limitation — create a dev build or test on a real device.
 */

export default function FacultyUploadNotes() {
  const router = useRouter();
  const [faculty, setFaculty] = useState(null);
  const [assignedSubjects, setAssignedSubjects] = useState([]); // { subjectId, subjectName, ... }
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [notesData, setNotesData] = useState({}); // subjectId -> [unit1..unit6] with note objects or null

  useEffect(() => {
    const fetchFacultyAndSubjects = async () => {
      try {
        setLoading(true);
        const stored = await AsyncStorage.getItem("faculty");
        if (!stored) {
          Alert.alert("Not logged in", "Please log in as faculty or admin.");
          router.push("/Faculty/FacultyLogin");
          return;
        }

        const facultyData = JSON.parse(stored);
        // We expect facultyData to contain at least { id: "phoneString", name: "Name" }
        setFaculty(facultyData);

        // 1) fetch assignments for this faculty
        const faQuery = query(
          collection(db, "facultyAssignments"),
          where("facultyId", "==", facultyData.id)
        );
        const faSnap = await getDocs(faQuery);
        const assignments = faSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setAssignedSubjects(assignments);

        // 2) for each assigned subject load notes (units)
        const notesState = {};
        for (const sub of assignments) {
          const nq = query(collection(db, "notes"), where("subjectId", "==", sub.subjectId));
          const nsnap = await getDocs(nq);

          // initialize 6 unit slots
          const unitNotes = Array(6).fill(null);

          nsnap.docs.forEach((nDoc) => {
            const n = nDoc.data();
            if (n && typeof n.unit === "number" && n.unit >= 1 && n.unit <= 6) {
              unitNotes[n.unit - 1] = { id: nDoc.id, ...n };
            }
          });

          notesState[sub.subjectId] = unitNotes;
        }

        setNotesData(notesState);
      } catch (err) {
        console.error("fetchFacultyAndSubjects error:", err);
        Alert.alert("Error", "Could not load subjects or notes. Check network & rules.");
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyAndSubjects();
  }, [router]);

  // helper: convert local file uri to blob
  const uriToBlob = async (uri) => {
    const resp = await fetch(uri);
    const blob = await resp.blob();
    return blob;
  };

  // DocumentPicker shape normalization
  const extractPickedFile = (res) => {
    // shape returned by some expo versions: { type: "success", uri, name, size }
    if (res?.type === "success" && res.uri) {
      return { uri: res.uri, name: res.name || "file" };
    }
    // shape: { assets: [{ uri, name, size, mimeType }], canceled: false }
    if (Array.isArray(res?.assets) && res.assets.length > 0) {
      const a = res.assets[0];
      return { uri: a.uri, name: a.name || "file" };
    }
    // fallback
    if (res?.uri) {
      return { uri: res.uri, name: res.name || "file" };
    }
    return null;
  };

  // Upload new file for subject/unitIndex
  const handleUpload = async (subject, unitIndex) => {
    try {
      const res = await DocumentPicker.getDocumentAsync({ type: "*/*" });
      console.log("Picker result:", res);
      const filePicked = extractPickedFile(res);
      if (!filePicked) {
        Alert.alert("Picker", "No file picked or picker cancelled.");
        return;
      }
      const { uri, name } = filePicked;
      if (!uri) throw new Error("No file URI returned by picker.");

      // Android/Expo note: sometimes picker fails on Expo Go. Show helpful message if so.
      // Convert to blob
      const blob = await uriToBlob(uri);

      // storage path
      const safeName = (name || `unit-${unitIndex + 1}`).replace(/\s+/g, "_");
      const path = `notes/${subject.subjectId}/unit-${unitIndex + 1}-${Date.now()}-${safeName}`;

      // upload to firebase storage
      const sRef = storageRef(storage, path);
      await uploadBytes(sRef, blob);

      const downloadUrl = await getDownloadURL(sRef);

      // delete old note (storage + firestore) if exists
      const oldNote = notesData[subject.subjectId]?.[unitIndex];
      if (oldNote) {
        try {
          if (oldNote.storagePath) {
            const oldRef = storageRef(storage, oldNote.storagePath);
            await deleteObject(oldRef).catch((e) => console.warn("deleteObject old:", e.message));
          }
          await deleteDoc(firestoreDoc(db, "notes", oldNote.id)).catch((e) =>
            console.warn("deleteDoc old:", e.message)
          );
        } catch (cleanupErr) {
          console.warn("Cleanup error:", cleanupErr);
        }
      }

      // add new metadata doc
      const docRef = await addDoc(collection(db, "notes"), {
        subjectId: subject.subjectId,
        subjectName: subject.subjectName || "",
        unit: unitIndex + 1,
        fileUrl: downloadUrl,
        storagePath: path,
        uploadedBy: faculty?.name || "",
        uploadedById: faculty?.id || faculty?.phone?.toString() || "",
        uploadedAt: serverTimestamp(),
        locked: false,
      });

      // update local state
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

      Alert.alert("Uploaded", `Unit ${unitIndex + 1} uploaded successfully.`);
    } catch (err) {
      console.error("Upload error:", err);

      if (
        err?.message?.includes("ActivityNotFoundException") ||
        err?.message?.includes("OPEN_DOCUMENT")
      ) {
        Alert.alert(
          "Picker not available",
          "Expo Go on Android may not support full file picking. To fully test file picking on Android create an Expo dev build or test on a real device."
        );
        return;
      }

      Alert.alert("Upload failed", err.message || "Try again");
    }
  };

  // Delete note (storage + firestore)
  const handleDelete = async (subject, unitIndex) => {
    try {
      const note = notesData[subject.subjectId]?.[unitIndex];
      if (!note) return Alert.alert("No note", "Nothing to delete for this unit.");

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

      Alert.alert("Deleted", `Unit ${unitIndex + 1} deleted.`);
    } catch (err) {
      console.error("Delete error:", err);
      Alert.alert("Delete failed", err.message || "Could not delete note");
    }
  };

  // Toggle lock/unlock
  const toggleLock = async (subject, unitIndex) => {
    try {
      const note = notesData[subject.subjectId]?.[unitIndex];
      if (!note) return Alert.alert("No note", "Upload a note before locking/unlocking.");

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
        <Text style={styles.headerTitle}>Upload Notes</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* subject list */}
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

      <BottomNavbar />
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
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },

  subjectList: { padding: 15, paddingBottom: 80 },
  subjectCard: {
    backgroundColor: "#0056b3",
    borderRadius: 12,
    paddingVertical: 30,
    alignItems: "center",
    marginBottom: 15,
    elevation: 4,
  },
  subjectCardText: { fontSize: 20, fontWeight: "bold", color: "#fff" },

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
  unitText: { fontSize: 16, fontWeight: "bold", color: "#333" },
  actionBtn: { paddingHorizontal: 10, paddingVertical: 5 },
  uploadText: { color: "#007BFF", fontWeight: "bold" },
  openText: { color: "#28A745", fontWeight: "bold" },
  deleteText: { color: "#DC3545", fontWeight: "bold" },
});