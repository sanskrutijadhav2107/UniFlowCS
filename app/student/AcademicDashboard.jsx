// app/student/marks-gpa.jsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import BottomNavbar from "./components/BottomNavbar"; 

export default function MarksGPA() {
  const [marks, setMarks] = useState({ AJP: "", DA: "", SET: "", OS: "", ED: "" });
  const [gpa, setGpa] = useState(null);

  const handleCalculateGPA = () => {
    const values = Object.values(marks).map((m) => parseFloat(m) || 0);
    const total = values.reduce((sum, v) => sum + v, 0);
    const avg = total / values.length;
    // Convert percentage to GPA (scale 10)
    const gpaValue = ((avg / 100) * 10).toFixed(2);
    setGpa(gpaValue);
  };

  const chartData = [
    { name: "AJP", population: parseFloat(marks.AJP) || 0, color: "#4A90E2", legendFontColor: "#333", legendFontSize: 12 },
    { name: "DA", population: parseFloat(marks.DA) || 0, color: "#F5A623", legendFontColor: "#333", legendFontSize: 12 },
    { name: "SE & T", population: parseFloat(marks.SET) || 0, color: "#50E3C2", legendFontColor: "#333", legendFontSize: 12 },
    { name: "OS", population: parseFloat(marks.OS) || 0, color: "#B8E986", legendFontColor: "#333", legendFontSize: 12 },
    { name: "ED", population: parseFloat(marks.ED) || 0, color: "#9013FE", legendFontColor: "#333", legendFontSize: 12 },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 90 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={styles.header}>Academic Dashboard</Text>

        {/* GPA Card */}
        <View style={styles.gpaCard}>
          <Ionicons name="person-circle" size={40} color="#0C2D57" style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${gpa ? (gpa / 10) * 100 : 0}%` }]} />
            </View>
            <Text style={styles.gpaText}>GPA: {gpa || "0.0"}</Text>
          </View>
        </View>

        {/* Input Fields */}
        {["AJP", "DA", "SE & T", "OS", "ED"].map((subject) => (
          <View key={subject} style={styles.inputRow}>
            <Text style={styles.subject}>{subject} :</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter marks"
              keyboardType="numeric"
              value={marks[subject] || ""}
              onChangeText={(text) => setMarks({ ...marks, [subject]: text })}
            />
          </View>
        ))}

        {/* Calculate Button */}
        <TouchableOpacity style={styles.calcButton} onPress={handleCalculateGPA}>
          <Text style={styles.calcButtonText}>Calculate GPA</Text>
        </TouchableOpacity>

        {/* Pie Chart */}
        <Text style={styles.chartTitle}>MARKS</Text>
        <PieChart
          data={chartData}
          width={Dimensions.get("window").width - 20}
          height={220}
          chartConfig={{
            backgroundColor: "#B3D7FF",
            backgroundGradientFrom: "#B3D7FF",
            backgroundGradientTo: "#B3D7FF",
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </ScrollView>

       {/* Bottom Navbar */}
                 <BottomNavbar active="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#B3D7FF" },
  header: { fontSize: 22, fontWeight: "bold", color: "#0C2D57", textAlign: "center", marginVertical: 10 },
  gpaCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 15,
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 5,
  },
  progressFill: { height: "100%", backgroundColor: "#0C2D57" },
  gpaText: { fontSize: 14, fontWeight: "bold", color: "#0C2D57" },
  inputRow: { flexDirection: "row", alignItems: "center", marginHorizontal: 15, marginTop: 10 },
  subject: { flex: 1, fontWeight: "bold", fontSize: 16 },
  input: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
    width: 120,
    textAlign: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  calcButton: {
    backgroundColor: "#2d6eefff",
    margin: 15,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  calcButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  chartTitle: { textAlign: "center", fontWeight: "bold", fontSize: 16, marginTop: 15 },
 

});
