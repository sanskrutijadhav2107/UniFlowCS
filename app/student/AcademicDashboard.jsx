// // app/student/marks-gpa.jsx
// import React, { useState } from "react";
// import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Dimensions } from "react-native";
// import { PieChart } from "react-native-chart-kit";
// import { Ionicons, MaterialIcons } from "@expo/vector-icons";
// import BottomNavbar from "./components/BottomNavbar"; 

// export default function MarksGPA() {
//   const [marks, setMarks] = useState({ AJP: "", DA: "", SET: "", OS: "", ED: "" });
//   const [gpa, setGpa] = useState(null);

//   const handleCalculateGPA = () => {
//     const values = Object.values(marks).map((m) => parseFloat(m) || 0);
//     const total = values.reduce((sum, v) => sum + v, 0);
//     const avg = total / values.length;
//     // Convert percentage to GPA (scale 10)
//     const gpaValue = ((avg / 100) * 10).toFixed(2);
//     setGpa(gpaValue);
//   };

//   const chartData = [
//     { name: "AJP", population: parseFloat(marks.AJP) || 0, color: "#4A90E2", legendFontColor: "#333", legendFontSize: 12 },
//     { name: "DA", population: parseFloat(marks.DA) || 0, color: "#F5A623", legendFontColor: "#333", legendFontSize: 12 },
//     { name: "SE & T", population: parseFloat(marks.SET) || 0, color: "#50E3C2", legendFontColor: "#333", legendFontSize: 12 },
//     { name: "OS", population: parseFloat(marks.OS) || 0, color: "#B8E986", legendFontColor: "#333", legendFontSize: 12 },
//     { name: "ED", population: parseFloat(marks.ED) || 0, color: "#9013FE", legendFontColor: "#333", legendFontSize: 12 },
//   ];

//   return (
//     <View style={styles.container}>
//       <ScrollView contentContainerStyle={{ paddingBottom: 90 }} showsVerticalScrollIndicator={false}>
//         {/* Header */}
//         <Text style={styles.header}>Academic Dashboard</Text>

//         {/* GPA Card */}
//         <View style={styles.gpaCard}>
//           <Ionicons name="person-circle" size={40} color="#0C2D57" style={{ marginRight: 10 }} />
//           <View style={{ flex: 1 }}>
//             <View style={styles.progressBar}>
//               <View style={[styles.progressFill, { width: `${gpa ? (gpa / 10) * 100 : 0}%` }]} />
//             </View>
//             <Text style={styles.gpaText}>GPA: {gpa || "0.0"}</Text>
//           </View>
//         </View>

//         {/* Input Fields */}
//         {["AJP", "DA", "SE & T", "OS", "ED"].map((subject) => (
//           <View key={subject} style={styles.inputRow}>
//             <Text style={styles.subject}>{subject} :</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Enter marks"
//               keyboardType="numeric"
//               value={marks[subject] || ""}
//               onChangeText={(text) => setMarks({ ...marks, [subject]: text })}
//             />
//           </View>
//         ))}

//         {/* Calculate Button */}
//         <TouchableOpacity style={styles.calcButton} onPress={handleCalculateGPA}>
//           <Text style={styles.calcButtonText}>Calculate GPA</Text>
//         </TouchableOpacity>

//         {/* Pie Chart */}
//         <Text style={styles.chartTitle}>MARKS</Text>
//         <PieChart
//           data={chartData}
//           width={Dimensions.get("window").width - 20}
//           height={220}
//           chartConfig={{
//             backgroundColor: "#B3D7FF",
//             backgroundGradientFrom: "#B3D7FF",
//             backgroundGradientTo: "#B3D7FF",
//             color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//           }}
//           accessor="population"
//           backgroundColor="transparent"
//           paddingLeft="15"
//           absolute
//         />
//       </ScrollView>

//        {/* Bottom Navbar */}
//                  <BottomNavbar active="home" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#B3D7FF" },
//   header: { fontSize: 22, fontWeight: "bold", color: "#0C2D57", textAlign: "center", marginVertical: 10 },
//   gpaCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     marginHorizontal: 15,
//     padding: 10,
//     borderRadius: 10,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   progressBar: {
//     height: 8,
//     backgroundColor: "#E0E0E0",
//     borderRadius: 5,
//     overflow: "hidden",
//     marginBottom: 5,
//   },
//   progressFill: { height: "100%", backgroundColor: "#0C2D57" },
//   gpaText: { fontSize: 14, fontWeight: "bold", color: "#0C2D57" },
//   inputRow: { flexDirection: "row", alignItems: "center", marginHorizontal: 15, marginTop: 10 },
//   subject: { flex: 1, fontWeight: "bold", fontSize: 16 },
//   input: {
//     backgroundColor: "#fff",
//     padding: 8,
//     borderRadius: 8,
//     width: 120,
//     textAlign: "center",
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   calcButton: {
//     backgroundColor: "#2d6eefff",
//     margin: 15,
//     padding: 12,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   calcButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
//   chartTitle: { textAlign: "center", fontWeight: "bold", fontSize: 16, marginTop: 15 },
 

// });






// app/student/marks-gpa.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PieChart } from "react-native-chart-kit";
import { LinearGradient } from "expo-linear-gradient";
import BottomNavbar from "./components/BottomNavbar";

export default function MarksGPA() {
  const subjects = ["AJP", "DA", "SE&T", "OS", "ED"];

  const [sem1, setSem1] = useState({ AJP: "", DA: "", SET: "", OS: "", ED: "" });
  const [sem2, setSem2] = useState({ AJP: "", DA: "", SET: "", OS: "", ED: "" });
  const [sgpa1, setSgpa1] = useState(null);
  const [sgpa2, setSgpa2] = useState(null);
  const [gpa, setGpa] = useState(null);

  const calculateSGPA = (marks) => {
    const total = Object.values(marks).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
    const avg = total / 5; // 5 subjects
    return parseFloat(((avg / 100) * 10).toFixed(2)); // Convert to GPA scale (out of 10)
  };

  const handleCalculate = () => {
    const sem1Sgpa = calculateSGPA(sem1);
    const sem2Sgpa = calculateSGPA(sem2);
    const finalGpa = ((sem1Sgpa + sem2Sgpa) / 2).toFixed(2);
    setSgpa1(sem1Sgpa);
    setSgpa2(sem2Sgpa);
    setGpa(finalGpa);
  };

  const chartData = [
    {
      name: "Sem 1 SGPA",
      population: sgpa1 ? sgpa1 * 10 : 0,
      color: "#4A90E2",
      legendFontColor: "#333",
      legendFontSize: 12,
    },
    {
      name: "Sem 2 SGPA",
      population: sgpa2 ? sgpa2 * 10 : 0,
      color: "#F5A623",
      legendFontColor: "#333",
      legendFontSize: 12,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <LinearGradient colors={["#fff", "#fff"]} style={styles.header}>
          <Text style={styles.headerText}>📘 Academic Dashboard</Text>
        </LinearGradient>
        
        {/* GPA Summary */}
        <View style={styles.gpaCard}>
          <Ionicons name="school-outline" size={40} color="#2d6eefff" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.gpaText}>SGPA (Sem 1): {sgpa1 || "0.0"}</Text>
            <Text style={styles.gpaText}>SGPA (Sem 2): {sgpa2 || "0.0"}</Text>
            <Text style={styles.finalGpaText}>GPA (Average): {gpa || "0.0"}</Text>
          </View>
        </View>

        {/* SEMESTER 1 */}
        <Text style={styles.sectionTitle}>Semester 1 Marks</Text>
        {subjects.map((subj) => (
          <View key={subj} style={styles.inputRow}>
            <Text style={styles.label}>{subj} :</Text>
            <TextInput
              style={styles.input}
              placeholder="0-100"
              keyboardType="numeric"
              value={sem1[subj]}
              onChangeText={(text) =>
                setSem1({ ...sem1, [subj]: text.replace(/[^0-9]/g, "") })
              }
            />
          </View>
        ))}

        {/* SEMESTER 2 */}
        <Text style={styles.sectionTitle}>Semester 2 Marks</Text>
        {subjects.map((subj) => (
          <View key={subj} style={styles.inputRow}>
            <Text style={styles.label}>{subj} :</Text>
            <TextInput
              style={styles.input}
              placeholder="0-100"
              keyboardType="numeric"
              value={sem2[subj]}
              onChangeText={(text) =>
                setSem2({ ...sem2, [subj]: text.replace(/[^0-9]/g, "") })
              }
            />
          </View>
        ))}

        {/* Calculate Button */}
        <TouchableOpacity style={styles.calcButton} onPress={handleCalculate}>
          <LinearGradient colors={["#2d6eefff", "#4A90E2"]} style={styles.gradientButton}>
            <Ionicons name="calculator-outline" size={22} color="#fff" />
            <Text style={styles.calcText}>Calculate GPA</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Chart */}
        {gpa && (
          <>
            <Text style={styles.chartTitle}>🎓 SGPA Comparison</Text>
            <PieChart
              data={chartData}
              width={Dimensions.get("window").width - 20}
              height={220}
              chartConfig={{
                backgroundColor: "#E6F0FF",
                backgroundGradientFrom: "#E6F0FF",
                backgroundGradientTo: "#E6F0FF",
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </>
        )}
      </ScrollView>

      <BottomNavbar active="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFF" },
  header: {
    paddingVertical: 18,
    alignItems: "center",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerText: { color: "#2d6eefff", fontSize: 20, fontWeight: "bold" },
  gpaCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 15,
    padding: 15,
    borderRadius: 12,
    elevation: 3,
  },
  gpaText: { fontSize: 15, fontWeight: "600", color: "#2d6eefff" },
  finalGpaText: { fontSize: 17, fontWeight: "bold", color: "#0C2D57", marginTop: 5 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0C2D57",
    marginLeft: 15,
    marginTop: 10,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
    marginTop: 8,
    justifyContent: "space-between",
  },
  label: { flex: 1, fontWeight: "bold", fontSize: 15, color: "#333" },
  input: {
    backgroundColor: "#E6F0FF",
    padding: 8,
    borderRadius: 8,
    width: 120,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#2d6eefff",
  },
  calcButton: {
    marginHorizontal: 15,
    marginVertical: 20,
    borderRadius: 8,
    overflow: "hidden",
  },
  gradientButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 8,
  },
  calcText: { color: "#fff", fontWeight: "bold", fontSize: 16, marginLeft: 8 },
  chartTitle: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    marginVertical: 15,
    color: "#0C2D57",
  },
});

