
// app/Student/StudentNotesPage.jsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
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

const MAX_UNITS = 6; // adjust if your subjects have different unit counts

export default function StudentNotesPage() {
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [subjectsWithNotes, setSubjectsWithNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotesForStudent = async () => {
      try {
        setLoading(true);

        // 1) Load student from AsyncStorage
        const stored = await AsyncStorage.getItem("student");
        if (!stored) {
          Alert.alert("Not logged in", "Please log in to view notes.");
          router.push("/Student/StudentLogin"); // adjust path to your login
          return;
        }

        const studentData = JSON.parse(stored);

        // Expect studentData.semester to exist
        const semester = Number(studentData?.semester);
        if (!semester || Number.isNaN(semester)) {
          Alert.alert(
            "Missing data",
            "Your profile doesn't have a semester set. Please update your student profile."
          );
          router.push("/Student/StudentProfile"); // optional: redirect to profile edit
          return;
        }

        setStudent(studentData);

        // 2) Query subjects collection for this semester (match by doc id being subject code)
        const subjQuery = query(
          collection(db, "subjects"),
          where("semester", "==", semester)
        );
        const subjSnap = await getDocs(subjQuery);

        if (subjSnap.empty) {
          setSubjectsWithNotes([]);
          return;
        }

        const subjectsList = [];

        // 3) For each subject doc fetch notes by subjectId (doc id) and only unlocked notes
        for (const subjDoc of subjSnap.docs) {
          const subject = { id: subjDoc.id, ...subjDoc.data() };

          // query notes where subjectId == subjDoc.id and locked == false
          const notesQuery = query(
            collection(db, "notes"),
            where("subjectId", "==", subjDoc.id),
            where("locked", "==", false)
          );

          const notesSnap = await getDocs(notesQuery);

          // fill unit slots
          const unitNotes = Array(MAX_UNITS).fill(null);

          notesSnap.docs.forEach((nDoc) => {
            const n = nDoc.data();
            // validate unit number
            const u = Number(n.unit);
            if (!Number.isNaN(u) && u >= 1 && u <= MAX_UNITS) {
              unitNotes[u - 1] = { id: nDoc.id, ...n };
            }
          });

          subject.notes = unitNotes;
          subjectsList.push(subject);
        }

        setSubjectsWithNotes(subjectsList);
      } catch (err) {
        console.error("Error fetching notes:", err);
        Alert.alert("Error", err.message || "Failed to load notes");
      } finally {
        setLoading(false);
      }
    };

    fetchNotesForStudent();
  }, [router]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#146ED7" />
        <Text>Loading notes...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
      <Text style={styles.header}>📚 Notes — Semester {student?.semester}</Text>

      {subjectsWithNotes.length === 0 ? (
        <Text style={styles.emptyText}>No subjects found for your semester.</Text>
      ) : (
        subjectsWithNotes.map((subj) => (
          <View key={subj.id} style={styles.card}>
            <Text style={styles.subjectTitle}>
              {subj.name} <Text style={{ color: "#777" }}>({subj.id})</Text>
            </Text>

            {subj.notes.map((note, idx) => (
              <View key={idx} style={styles.unitRow}>
                <Text style={styles.unitText}>Unit {idx + 1}</Text>

                {note ? (
                  <TouchableOpacity
                    onPress={() => {
                      if (!note.fileUrl) {
                        Alert.alert("File missing", "This note does not have a downloadable file.");
                        return;
                      }
                      Linking.openURL(note.fileUrl).catch(() =>
                        Alert.alert("Open failed", "Could not open the file URL.")
                      );
                    }}
                    style={styles.openBtn}
                  >
                    <Text style={styles.openText}>Open</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.lockedText}>Not available</Text>
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
  subjectTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10, color: "#333" },
  unitRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  unitText: { fontSize: 15, color: "#333" },
  openBtn: { backgroundColor: "#146ED7", paddingVertical: 6, paddingHorizontal: 14, borderRadius: 6 },
  openText: { color: "#fff", fontWeight: "700" },
  lockedText: { color: "#DC3545", fontWeight: "700" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});