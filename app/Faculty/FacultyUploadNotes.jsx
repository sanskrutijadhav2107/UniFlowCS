import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  serverTimestamp,
  where,
} from "firebase/firestore";
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
import { db } from "../../firebase";

// 🔑 Cloudinary Config (if you’re still using Cloudinary)
const CLOUD_NAME = "dveatasry";
const UPLOAD_PRESET = "unsigned_preset";

export default function UploadNotes() {
  const router = useRouter();
  const [faculty, setFaculty] = useState(null);
  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [notesData, setNotesData] = useState({}); // subjectId → array of notes (per unit)

  // Load faculty + subjects
  useEffect(() => {
    const fetchFacultyAndSubjects = async () => {
      try {
        const stored = await AsyncStorage.getItem("faculty");
        if (!stored) {
          Alert.alert("Error", "No faculty logged in");
          router.push("/Faculty/FacultyLogin");
          return;
        }

        const facultyData = JSON.parse(stored);
        setFaculty(facultyData);

        // Get assigned subjects
        const q = query(
          collection(db, "facultyAssignments"),
          where("facultyId", "==", facultyData.id)
        );
        const snap = await getDocs(q);

        if (snap.empty) {
          setAssignedSubjects([]);
        } else {
          const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setAssignedSubjects(list);

          // Load notes for each subject
          const notesState = {};
          for (const sub of list) {
            const nq = query(
              collection(db, "notes"),
              where("subjectId", "==", sub.subjectId)
            );
            const nsnap = await getDocs(nq);

            const unitNotes = Array(6).fill(null); // 6 units
            nsnap.docs.forEach((d) => {
              const nd = d.data();
              unitNotes[nd.unit - 1] = { id: d.id, ...nd };
            });

            notesState[sub.subjectId] = unitNotes;
          }
          setNotesData(notesState);
        }
      } catch (error) {
        console.error("Error loading faculty/subjects:", error);
        Alert.alert("Error", "Could not load faculty subjects");
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyAndSubjects();
  }, [router]);

  // Upload new note
  const handleUpload = async (subject, unitIndex) => {
    try {
      const res = await DocumentPicker.getDocumentAsync({ type: "/" });
      if (res.canceled) return;
      const file = res.assets[0];

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        type: file.mimeType || "application/pdf",
        name: file.name || `unit-${unitIndex + 1}.pdf`,
      });
      formData.append("upload_preset", UPLOAD_PRESET);

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await cloudRes.json();
      if (!data.secure_url) throw new Error("Cloudinary upload failed");

      const fileUrl = data.secure_url;

      // Delete old note if exists
      const oldNote = notesData[subject.subjectId][unitIndex];
      if (oldNote) {
        await deleteDoc(doc(db, "notes", oldNote.id));
      }

      // Add new note
      const docRef = await addDoc(collection(db, "notes"), {
        subjectId: subject.subjectId,
        subjectName: subject.subjectName,
        unit: unitIndex + 1,
        fileUrl,
        uploadedBy: faculty?.name,
        uploadedAt: serverTimestamp(),
        locked: false, // ✅ Default unlocked
      });

      // Update local state
      setNotesData((prev) => {
        const updated = { ...prev };
        updated[subject.subjectId][unitIndex] = {
          id: docRef.id,
          subjectId: subject.subjectId,
          unit: unitIndex + 1,
          fileUrl,
          locked: false,
        };
        return updated;
      });

      Alert.alert("✅ Success", `Unit ${unitIndex + 1} notes uploaded!`);
    } catch (err) {
      console.error("Upload error:", err);
      Alert.alert("❌ Error", err.message || "Failed to upload notes");
    }
  };

  // Delete note
  const handleDelete = async (subject, unitIndex) => {
    try {
      const note = notesData[subject.subjectId][unitIndex];
      if (!note) return;

      await deleteDoc(doc(db, "notes", note.id));

      // Update state
      setNotesData((prev) => {
        const updated = { ...prev };
        updated[subject.subjectId][unitIndex] = null;
        return updated;
      });

      Alert.alert("🗑 Deleted", `Unit ${unitIndex + 1} notes removed`);
    } catch (err) {
      console.error("Delete error:", err);
      Alert.alert("❌ Error", "Could not delete note");
    }
  };

  // Lock/Unlock note
  const toggleLock = async (subject, unitIndex) => {
    try {
      const note = notesData[subject.subjectId][unitIndex];
      if (!note) return;

      const noteRef = doc(db, "notes", note.id);
      const newLocked = !note.locked;

      await updateDoc(noteRef, { locked: newLocked });

      // Update state
      setNotesData((prev) => {
        const updated = { ...prev };
        updated[subject.subjectId][unitIndex] = {
          ...note,
          locked: newLocked,
        };
        return updated;
      });

      Alert.alert(
        "🔒 Status Changed",
        `Unit ${unitIndex + 1} is now ${newLocked ? "Locked" : "Unlocked"}`
      );
    } catch (err) {
      console.error("Lock toggle error:", err);
      Alert.alert("❌ Error", "Could not change lock status");
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            selectedSubject ? setSelectedSubject(null) : router.back()
          }
        >
          <Ionicons name="arrow-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Uniflow-CS</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Subject List */}
      {!selectedSubject ? (
        <ScrollView contentContainerStyle={styles.subjectList}>
          {assignedSubjects.length === 0 ? (
            <Text style={{ textAlign: "center", marginTop: 20, color: "#555" }}>
              No subjects assigned 📚
            </Text>
          ) : (
            assignedSubjects.map((sub) => (
              <TouchableOpacity
                key={sub.subjectId}
                style={styles.subjectCard}
                onPress={() => setSelectedSubject(sub)}
              >
                <Text style={styles.subjectCardText}>{sub.subjectName}</Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      ) : (
        // Unit Upload Section
        <View style={styles.unitsContainer}>
          {notesData[selectedSubject.subjectId]?.map((note, idx) => (
            <View key={idx} style={styles.unitRow}>
              <Text style={styles.unitText}>Unit {idx + 1}</Text>

              {note ? (
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <TouchableOpacity
                    onPress={() => Linking.openURL(note.fileUrl)}
                    style={styles.actionBtn}
                  >
                    <Text style={styles.openText}>Open</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => toggleLock(selectedSubject, idx)}
                    style={styles.actionBtn}
                  >
                    <Text style={{ color: note.locked ? "#DC3545" : "#28A745" }}>
                      {note.locked ? "Unlock" : "Lock"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(selectedSubject, idx)}
                    style={styles.actionBtn}
                  >
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => handleUpload(selectedSubject, idx)}
                  style={styles.actionBtn}
                >
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