// import AsyncStorage from "@react-native-async-storage/async-storage";
// import {
//   collection,
//   onSnapshot,
//   query,
//   where,
// } from "firebase/firestore";
// import { useEffect, useState } from "react";
// import {
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";
// import { db } from "../../firebase";
// import BottomNavbar from "./components/BottomNavbar";

// export default function AcademicDashboard() {
//   const [student, setStudent] = useState(null);
//   const [subjects, setSubjects] = useState([]);
//   const [marksData, setMarksData] = useState([]);

//   useEffect(() => {
//     const load = async () => {
//       const saved = await AsyncStorage.getItem("student");
//       if (saved) setStudent(JSON.parse(saved));
//     };
//     load();
//   }, []);

//   useEffect(() => {
//     const unsub = onSnapshot(collection(db, "subjects"), (snap) => {
//       const data = snap.docs.map((d) => d.data());
//       setSubjects(data);
//     });
//     return () => unsub();
//   }, []);

//   useEffect(() => {
//     if (!student?.prn) return;

//     const q = query(
//       collection(db, "marks"),
//       where("studentId", "==", student.prn)
//     );

//     const unsub = onSnapshot(q, (snap) => {
//       const data = snap.docs.map((d) => d.data());
//       setMarksData(data);
//     });

//     return () => unsub();
//   }, [student]);

//   const getGradePoint = (marks) => {
//     if (marks > 95) return 10.0;
//     if (marks >= 91) return 9.5;
//     if (marks >= 86) return 9.0;
//     if (marks >= 81) return 8.5;
//     if (marks >= 76) return 8.0;
//     if (marks >= 71) return 7.5;
//     if (marks >= 66) return 7.0;
//     if (marks >= 61) return 6.5;
//     if (marks >= 56) return 6.0;
//     if (marks >= 51) return 5.5;
//     if (marks >= 46) return 5.0;
//     if (marks >= 41) return 4.5;
//     if (marks === 40) return 4.0;
//     return 0.0;
//   };

//   const calculateSGPA = (semesterMarks) => {
//     let totalCredits = 0;
//     let weightedPoints = 0;

//     semesterMarks.forEach((m) => {
//       const subject = subjects.find((s) => s.code === m.subjectCode);
//       if (!subject) return;

//       const credits = Number(subject.credits);
//       const gradePoint = getGradePoint(m.marks);

//       weightedPoints += gradePoint * credits;
//       totalCredits += credits;
//     });

//     return totalCredits
//       ? {
//           sgpa: (weightedPoints / totalCredits).toFixed(2),
//           credits: totalCredits,
//         }
//       : null;
//   };

//   // Group by semester
//   const semesters = {};
//   marksData.forEach((m) => {
//     if (!semesters[m.semester]) semesters[m.semester] = [];
//     semesters[m.semester].push(m);
//   });

//   const semesterNumbers = Object.keys(semesters)
//     .map(Number)
//     .sort((a, b) => a - b);

//   // Precompute SGPA data
//   const sgpaData = {};
//   semesterNumbers.forEach((sem) => {
//     sgpaData[sem] = calculateSGPA(semesters[sem]);
//   });

//   // GPA calculation (odd + even pairing)
//   const yearGPAs = [];
//   for (let i = 0; i < semesterNumbers.length; i++) {
//     const sem = semesterNumbers[i];

//     if (sem % 2 !== 0) {
//       const nextSem = sem + 1;

//       if (sgpaData[sem] && sgpaData[nextSem]) {
//         const totalWeighted =
//           sgpaData[sem].sgpa * sgpaData[sem].credits +
//           sgpaData[nextSem].sgpa * sgpaData[nextSem].credits;

//         const totalCredits =
//           sgpaData[sem].credits + sgpaData[nextSem].credits;

//         const gpa = (totalWeighted / totalCredits).toFixed(2);

//         yearGPAs.push({
//           year: Math.ceil(sem / 2),
//           sem1: sem,
//           sem2: nextSem,
//           gpa,
//         });
//       }
//     }
//   }

//   return (
//     <View style={styles.container}>
//       <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
//         <Text style={styles.header}>📘 Academic Dashboard</Text>

//         {semesterNumbers.map((sem) => (
//           <View key={sem} style={styles.card}>
//             <Text style={styles.semTitle}>Semester {sem}</Text>
//             <Text style={styles.sgpa}>
//               SGPA: {sgpaData[sem]?.sgpa}
//             </Text>
//           </View>
//         ))}

//         {yearGPAs.map((y, i) => (
//           <View key={i} style={styles.gpaCard}>
//             <Text style={styles.gpaTitle}>
//               🎓 Year {y.year} GPA (Sem {y.sem1} & {y.sem2})
//             </Text>
//             <Text style={styles.gpaValue}>{y.gpa}</Text>
//           </View>
//         ))}
//       </ScrollView>

//       <BottomNavbar active="dashboard" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#F9FBFF", padding: 16 },
//   header: {
//     fontSize: 22,
//     fontWeight: "bold",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   card: {
//     backgroundColor: "#fff",
//     padding: 14,
//     borderRadius: 12,
//     marginBottom: 12,
//   },
//   semTitle: { fontSize: 16, fontWeight: "bold" },
//   sgpa: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: "#146ED7",
//     marginTop: 6,
//   },
//   gpaCard: {
//     backgroundColor: "#E6F0FF",
//     padding: 16,
//     borderRadius: 12,
//     marginTop: 10,
//     alignItems: "center",
//   },
//   gpaTitle: {
//     fontWeight: "bold",
//     marginBottom: 6,
//     color: "#0C2D57",
//   },
//   gpaValue: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#146ED7",
//   },
// });







import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ProgressChart } from "react-native-chart-kit";
import { db } from "../../firebase";
import BottomNavbar from "./components/BottomNavbar";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// EXACT Campus Buzz Color Palette
const COLORS = {
  primaryDark: "#1A50C8", // Dark Blue from your theme
  primary: "#2D6EEF",     // Core Primary Blue
  primaryLight: "#60A5FA", // Light Blue highlight
  success: "#10B981",
  danger: "#EF4444",
  bg: "#F8FAFF",
  white: "#FFFFFF",
  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  gold: "#F59E0B",
};

export default function AcademicDashboard() {
  const [student, setStudent] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [marksData, setMarksData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const saved = await AsyncStorage.getItem("student");
      if (saved) setStudent(JSON.parse(saved));
      setLoading(false);
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
    const q = query(collection(db, "marks"), where("studentId", "==", student.prn));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => d.data());
      setMarksData(data);
    });
    return () => unsub();
  }, [student]);

  // --- LOGIC (STRICTLY UNCHANGED) ---
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
    return totalCredits ? { sgpa: (weightedPoints / totalCredits).toFixed(2), credits: totalCredits } : null;
  };

  const semesters = {};
  marksData.forEach((m) => {
    if (!semesters[m.semester]) semesters[m.semester] = [];
    semesters[m.semester].push(m);
  });

  const semesterNumbers = Object.keys(semesters).map(Number).sort((a, b) => a - b);
  const sgpaData = {};
  semesterNumbers.forEach((sem) => { sgpaData[sem] = calculateSGPA(semesters[sem]); });

  const yearGPAs = [];
  for (let i = 0; i < semesterNumbers.length; i++) {
    const sem = semesterNumbers[i];
    if (sem % 2 !== 0) {
      const nextSem = sem + 1;
      if (sgpaData[sem] && sgpaData[nextSem]) {
        const totalW = sgpaData[sem].sgpa * sgpaData[sem].credits + sgpaData[nextSem].sgpa * sgpaData[nextSem].credits;
        const totalC = sgpaData[sem].credits + sgpaData[nextSem].credits;
        yearGPAs.push({ year: Math.ceil(sem / 2), gpa: (totalW / totalC).toFixed(2), sem1: sem, sem2: nextSem });
      }
    }
  }

  if (loading) return <View style={styles.center}><ActivityIndicator color={COLORS.primary} /></View>;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 120 }}
        contentInsetAdjustmentBehavior="never"
      >
        
        {/* CORRECTED: Campus Buzz Triple-Blue Gradient */}
        <LinearGradient 
          colors={[COLORS.primaryDark, COLORS.primary, COLORS.primaryLight]} 
          start={{ x: 0, y: 0 }} 
          end={{ x: 1, y: 0 }} 
          style={styles.header}
        >
          <View style={styles.statusSpacer} />
          <Text style={styles.headerTitle}>Academic Performance</Text>
          <Text style={styles.quote}>Your journey, tracked in real-time.</Text>
        </LinearGradient>

        <View style={styles.content}>
          {/* YEARLY MILESTONES */}
          {yearGPAs.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Yearly Progress</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {yearGPAs.map((y, i) => (
                  <View key={i} style={styles.yearCard}>
                    <MaterialCommunityIcons name="trophy-variant" size={26} color={COLORS.gold} />
                    <Text style={styles.yearTitle}>Year {y.year}</Text>
                    <Text style={styles.yearGpa}>{y.gpa}</Text>
                    <Text style={styles.yearSems}>S0{y.sem1} & S0{y.sem2}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* SEMESTER BREAKDOWN */}
          <Text style={styles.sectionTitle}>Semester Insights</Text>
          {semesterNumbers.map((sem) => (
            <View key={sem} style={styles.semCard}>
              <View style={styles.semHeader}>
                <Text style={styles.semName}>Semester {sem}</Text>
                <View style={styles.sgpaChip}>
                  <Text style={styles.sgpaText}>SGPA: {sgpaData[sem]?.sgpa}</Text>
                </View>
              </View>

              <View style={styles.subjectList}>
                {semesters[sem].map((m, idx) => {
                  const sub = subjects.find(s => s.code === m.subjectCode);
                  const isPass = m.marks >= 40;
                  return (
                    <View key={idx} style={styles.subjectRow}>
                      <ProgressChart
                        data={{ data: [m.marks / 100] }}
                        width={45}
                        height={45}
                        strokeWidth={5}
                        radius={16}
                        chartConfig={{
                          backgroundColor: "#fff",
                          backgroundGradientFrom: "#fff",
                          backgroundGradientTo: "#fff",
                          color: (opacity = 1) => isPass ? `rgba(45, 110, 239, ${opacity})` : `rgba(239, 68, 68, ${opacity})`,
                        }}
                        hideLegend={true}
                      />
                      <View style={styles.subjectInfo}>
                        <Text style={styles.subjectName} numberOfLines={1}>{sub?.name || m.subjectCode}</Text>
                        <Text style={styles.subjectMeta}>{m.marks}% Performance</Text>
                      </View>
                      <MaterialCommunityIcons 
                        name={isPass ? "check-decagram" : "alert-circle-outline"} 
                        size={22} 
                        color={isPass ? COLORS.success : COLORS.danger} 
                      />
                    </View>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <BottomNavbar active="dashboard" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    paddingBottom: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  statusSpacer: {
    height: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 50,
  },
  headerTitle: { 
    color: 'white', 
    fontSize: 24, 
    fontWeight: '900', 
    letterSpacing: 0.5,
    marginBottom: 8
  },
  quote: { 
    color: 'rgba(255,255,255,0.8)', 
    fontSize: 13, 
    fontStyle: 'italic', 
    fontWeight: '500' 
  },
  content: { padding: 20 },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: COLORS.textPrimary, marginBottom: 15 },
  yearCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 30,
    marginRight: 15,
    alignItems: 'center',
    width: 140,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.1,
  },
  yearTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textSecondary, marginTop: 8 },
  yearGpa: { fontSize: 24, fontWeight: '900', color: COLORS.primary },
  yearSems: { fontSize: 10, color: COLORS.textSecondary, fontWeight: '700' },
  semCard: {
    backgroundColor: 'white',
    borderRadius: 32,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
  },
  semHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  semName: { fontSize: 19, fontWeight: '800', color: COLORS.textPrimary },
  sgpaChip: { backgroundColor: '#F0F5FF', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 14 },
  sgpaText: { color: COLORS.primary, fontWeight: '800', fontSize: 13 },
  subjectList: { gap: 12 },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FBFF',
    padding: 12,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#F0F3F9',
  },
  subjectInfo: { flex: 1, marginLeft: 15 },
  subjectName: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  subjectMeta: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2, fontWeight: '600' },
});