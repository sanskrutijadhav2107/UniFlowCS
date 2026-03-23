import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../../firebase";

export default function EnterMarks() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [students, setStudents] = useState([]);
  const [marksMap, setMarksMap] = useState({});
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [facultyId, setFacultyId] = useState(null);
  const [savedMap, setSavedMap] = useState({});
 

useEffect(() => {
  const loadFaculty = async () => {
    const data = await AsyncStorage.getItem("faculty");

    if (data) {
      const parsed = JSON.parse(data);

      // adjust if needed (important)
      setFacultyId(parsed.id || parsed.uid || parsed.facultyId || parsed.phone);
    }
  };

  loadFaculty();
}, []);

useEffect(() => {
  if (!facultyId) return;

  const loadAssignedSubjects = async () => {
    try {
      // 1️⃣ Get assignments for this faculty
      const q = query(
        collection(db, "facultyAssignments"),
        where("facultyId", "==", facultyId)
      );

      const snap = await getDocs(q);

      const assignedSubjectIds = snap.docs.map((d) => d.data().subjectId);

      if (assignedSubjectIds.length === 0) {
        setSubjects([]);
        return;
      }

      // 2️⃣ Get subjects matching those IDs
      const subjectsSnap = await getDocs(collection(db, "subjects"));

      const filtered = subjectsSnap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((sub) => assignedSubjectIds.includes(sub.code));

      setSubjects(filtered);
    } catch (e) {
      console.log("Subject load error:", e);
    }
  };

  loadAssignedSubjects();
}, [facultyId]);

  // 🔹 When subject selected → load students + existing marks
  useEffect(() => {
    if (!selectedSubject) return;

    const loadStudentsAndMarks = async () => {
      setLoadingStudents(true);

      // 1️⃣ Get students of that semester
      const sq = query(
        collection(db, "students"),
        where("semester", "==", selectedSubject.semester)
      );
      const studentSnap = await getDocs(sq);
      const studentList = studentSnap.docs.map((d) => d.data());

      // 2️⃣ Get all marks of this subject at once
      const mq = query(
        collection(db, "marks"),
        where("subjectCode", "==", selectedSubject.code)
      );
      const marksSnap = await getDocs(mq);

      const existingMarks = {};
        const savedStatus = {};

        marksSnap.forEach((doc) => {
          const data = doc.data();
          existingMarks[data.studentId] = data.marks.toString();
          savedStatus[data.studentId] = true; // ✅ mark as saved
        });

      // 3️⃣ Prepare map
      const initialMap = {};
      studentList.forEach((s) => {
        initialMap[s.prn] = existingMarks[s.prn] || "";
      });

      setStudents(studentList);
      setMarksMap(initialMap);
      setSavedMap(savedStatus); // ✅ add this
      setLoadingStudents(false);
    };

    loadStudentsAndMarks();
  }, [selectedSubject]);

  // 🔹 Save (overwrite, never duplicate)
  const submitMarks = async (student) => {
    const mark = marksMap[student.prn];
    if (mark === "") {
      Alert.alert("Enter marks first");
      return;
    }

    const docId = `${student.prn}_${selectedSubject.code}`;

    await setDoc(doc(db, "marks", docId), {
      studentId: student.prn,
      studentName: student.name,
      subjectCode: selectedSubject.code,
      subjectName: selectedSubject.name,
      semester: selectedSubject.semester,
      credits: selectedSubject.credits,
      marks: Number(mark),
      updatedAt: new Date(),
    });

    setSavedMap((prev) => ({
      ...prev,
      [student.prn]: true,
    }));
    Alert.alert(`Saved for ${student.name}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🧑‍🏫 Enter Marks</Text>

      {/* Subjects */}
      <FlatList
        data={subjects}
        horizontal
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.subjectCard,
              selectedSubject?.id === item.id && styles.selectedCard,
            ]}
            onPress={() => setSelectedSubject(item)}
          >
            <Text style={styles.subjectText}>{item.name}</Text>
            <Text style={styles.creditText}>
              Sem {item.semester} • {item.credits} credits
            </Text>
          </TouchableOpacity>
        )}
      />

      {selectedSubject && (
        <>
          <Text style={styles.subheading}>
            Students — Semester {selectedSubject.semester}
          </Text>

          {loadingStudents ? (
            <ActivityIndicator size="large" />
          ) : (
            <FlatList
              data={students}
              keyExtractor={(item) => item.prn}
              renderItem={({ item }) => (
                
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.prn}>{item.prn}</Text>
                  </View>

                  <TextInput
                    style={styles.input}
                    placeholder="Marks"
                    keyboardType="numeric"
                    value={marksMap[item.prn]}
                    onChangeText={(t) => {
                      const clean = t.replace(/[^0-9]/g, "");

                      setMarksMap({
                        ...marksMap,
                        [item.prn]: clean,
                      });
                    
                      // 🔄 mark as unsaved if edited
                      setSavedMap({
                        ...savedMap,
                        [item.prn]: false,
                      });
                    }}
                  />

                  <TouchableOpacity
                    style={[
                      styles.saveBtn,
                      savedMap[item.prn] && styles.savedBtn,
                    ]}
                    onPress={() => submitMarks(item)}
                    disabled={savedMap[item.prn]}
                  >
                    <Text style={{ color: "#fff" }}>
                      {savedMap[item.prn] ? "Saved" : "Save"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F9FBFF" },
  header: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 15 },
  subjectCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginRight: 10,
    width: 170,
    elevation: 3,
  },
  selectedCard: { borderWidth: 2, borderColor: "#146ED7" },
  subjectText: { fontWeight: "bold" },
  creditText: { fontSize: 12, color: "#555", marginTop: 4 },
  subheading: { marginVertical: 15, fontWeight: "600" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
  },
  name: { fontWeight: "bold" },
  prn: { fontSize: 12, color: "#666" },
  input: {
    backgroundColor: "#E6F0FF",
    borderRadius: 8,
    padding: 8,
    width: 70,
    marginHorizontal: 8,
    textAlign: "center",
  },
  saveBtn: {
    backgroundColor: "#146ED7",
    padding: 8,
    borderRadius: 8,
  },
  savedBtn: {
    backgroundColor: "#999",
  },
});
