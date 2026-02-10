import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import BottomNavbar from "./components/BottomNavbar";

export default function AcademicDashboard() {
  const [student, setStudent] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [marksData, setMarksData] = useState([]);

  useEffect(() => {
    const load = async () => {
      const saved = await AsyncStorage.getItem("student");
      if (saved) setStudent(JSON.parse(saved));
    };
    load();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "subjects"), (snap) => {
      const data = snap.docs.map((d) => d.data());
      setSubjects(data);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!student?.prn) return;

    const q = query(
      collection(db, "marks"),
      where("studentId", "==", student.prn)
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => d.data());
      setMarksData(data);
    });

    return () => unsub();
  }, [student]);

  const getGradePoint = (marks) => {
    if (marks > 95) return 10.0;
    if (marks >= 91) return 9.5;
    if (marks >= 86) return 9.0;
    if (marks >= 81) return 8.5;
    if (marks >= 76) return 8.0;
    if (marks >= 71) return 7.5;
    if (marks >= 66) return 7.0;
    if (marks >= 61) return 6.5;
    if (marks >= 56) return 6.0;
    if (marks >= 51) return 5.5;
    if (marks >= 46) return 5.0;
    if (marks >= 41) return 4.5;
    if (marks === 40) return 4.0;
    return 0.0;
  };

  const calculateSGPA = (semesterMarks) => {
    let totalCredits = 0;
    let weightedPoints = 0;

    semesterMarks.forEach((m) => {
      const subject = subjects.find((s) => s.code === m.subjectCode);
      if (!subject) return;

      const credits = Number(subject.credits);
      const gradePoint = getGradePoint(m.marks);

      weightedPoints += gradePoint * credits;
      totalCredits += credits;
    });

    return totalCredits
      ? {
          sgpa: (weightedPoints / totalCredits).toFixed(2),
          credits: totalCredits,
        }
      : null;
  };

  // Group by semester
  const semesters = {};
  marksData.forEach((m) => {
    if (!semesters[m.semester]) semesters[m.semester] = [];
    semesters[m.semester].push(m);
  });

  const semesterNumbers = Object.keys(semesters)
    .map(Number)
    .sort((a, b) => a - b);

  // Precompute SGPA data
  const sgpaData = {};
  semesterNumbers.forEach((sem) => {
    sgpaData[sem] = calculateSGPA(semesters[sem]);
  });

  // GPA calculation (odd + even pairing)
  const yearGPAs = [];
  for (let i = 0; i < semesterNumbers.length; i++) {
    const sem = semesterNumbers[i];

    if (sem % 2 !== 0) {
      const nextSem = sem + 1;

      if (sgpaData[sem] && sgpaData[nextSem]) {
        const totalWeighted =
          sgpaData[sem].sgpa * sgpaData[sem].credits +
          sgpaData[nextSem].sgpa * sgpaData[nextSem].credits;

        const totalCredits =
          sgpaData[sem].credits + sgpaData[nextSem].credits;

        const gpa = (totalWeighted / totalCredits).toFixed(2);

        yearGPAs.push({
          year: Math.ceil(sem / 2),
          sem1: sem,
          sem2: nextSem,
          gpa,
        });
      }
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <Text style={styles.header}>📘 Academic Dashboard</Text>

        {semesterNumbers.map((sem) => (
          <View key={sem} style={styles.card}>
            <Text style={styles.semTitle}>Semester {sem}</Text>
            <Text style={styles.sgpa}>
              SGPA: {sgpaData[sem]?.sgpa}
            </Text>
          </View>
        ))}

        {yearGPAs.map((y, i) => (
          <View key={i} style={styles.gpaCard}>
            <Text style={styles.gpaTitle}>
              🎓 Year {y.year} GPA (Sem {y.sem1} & {y.sem2})
            </Text>
            <Text style={styles.gpaValue}>{y.gpa}</Text>
          </View>
        ))}
      </ScrollView>

      <BottomNavbar active="dashboard" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FBFF", padding: 16 },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  semTitle: { fontSize: 16, fontWeight: "bold" },
  sgpa: {
    fontSize: 15,
    fontWeight: "600",
    color: "#146ED7",
    marginTop: 6,
  },
  gpaCard: {
    backgroundColor: "#E6F0FF",
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
  },
  gpaTitle: {
    fontWeight: "bold",
    marginBottom: 6,
    color: "#0C2D57",
  },
  gpaValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#146ED7",
  },
});
