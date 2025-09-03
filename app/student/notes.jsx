import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, getDocs, query, where } from "firebase/firestore";
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
import { db } from "../../firebase";

export default function StudentNotesPage() {
  const [student, setStudent] = useState(null);
  const [subjectsWithNotes, setSubjectsWithNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        // 1️⃣ Get student data from AsyncStorage
        const stored = await AsyncStorage.getItem("student");
        let studentData;
        if (!stored) {
          // Mock student (testing only)
          studentData = { semester: 5, name: "Test Student" };
        } else {
          studentData = JSON.parse(stored);
        }
        setStudent(studentData);

        // 2️⃣ Get subjects of student's semester
        const subjQuery = query(
          collection(db, "subjects"),
          where("semester", "==", studentData.semester)
        );
        const subjSnap = await getDocs(subjQuery);

        if (subjSnap.empty) {
          setSubjectsWithNotes([]);
          return;
        }

        const subjectsList = [];

        // 3️⃣ For each subject, fetch notes by subjectName
        for (const subjDoc of subjSnap.docs) {
          const subject = { id: subjDoc.id, ...subjDoc.data() };

          const notesSnap = await getDocs(
            query(
              collection(db, "notes"),
              where("subjectName", "==", subject.name)
            )
          );

          const unitNotes = Array(6).fill(null);
          notesSnap.docs.forEach((n) => {
            const noteData = n.data();
            if (noteData.locked === false || noteData.locked === undefined) {
              unitNotes[noteData.unit - 1] = { id: n.id, ...noteData };
            }
          });

          subject.notes = unitNotes;
          subjectsList.push(subject);
        }

        setSubjectsWithNotes(subjectsList);
      } catch (err) {
        console.error("Error fetching notes:", err);
        Alert.alert("Error", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#146ED7" />
        <Text>Loading notes...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>📚 Notes for Semester {student?.semester}</Text>

      {subjectsWithNotes.length === 0 ? (
        <Text style={styles.emptyText}>No subjects found for your semester.</Text>
      ) : (
        subjectsWithNotes.map((subj) => (
          <View key={subj.id} style={styles.card}>
            <Text style={styles.subjectTitle}>{subj.name}</Text>

            {subj.notes.map((note, idx) => (
              <View key={idx} style={styles.unitRow}>
                <Text style={styles.unitText}>Unit {idx + 1}</Text>

                {note ? (
                  <TouchableOpacity
                    onPress={() => Linking.openURL(note.fileUrl)}
                    style={styles.openBtn}
                  >
                    <Text style={styles.openText}>Open</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.lockedText}>Locked 🔒</Text>
                )}
              </View>
            ))}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5", padding: 10 },
  header: { fontSize: 20, fontWeight: "bold", color: "#146ED7", marginBottom: 15, textAlign: "center" },
  emptyText: { textAlign: "center", marginTop: 20, fontSize: 16, color: "#555" },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  subjectTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#333" },
  unitRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  unitText: { fontSize: 15, color: "#333" },
  openBtn: { backgroundColor: "#146ED7", paddingVertical: 5, paddingHorizontal: 12, borderRadius: 6 },
  openText: { color: "#fff", fontWeight: "bold" },
  lockedText: { color: "#DC3545", fontWeight: "bold" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});