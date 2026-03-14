import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../firebase";
import BottomNavbar from "./components/BottomNavbar";

export default function WeeklyGoals() {
  const [student, setStudent] = useState(null);
  const [goals, setGoals] = useState([]);
  const [goalTitle, setGoalTitle] = useState("");
  const [targetDay, setTargetDay] = useState("Monday");

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // get week number
  const getWeekNumber = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now - start;
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.ceil(diff / oneWeek);
  };

  const currentWeek = getWeekNumber();
  const currentYear = new Date().getFullYear();

  // Load student
  useEffect(() => {
    const load = async () => {
      const saved = await AsyncStorage.getItem("student");
      if (saved) setStudent(JSON.parse(saved));
    };
    load();
  }, []);

  // Load goals for THIS WEEK ONLY
  useEffect(() => {
    if (!student?.prn) return;

    const q = query(
      collection(db, "weeklyGoals"),
      where("studentId", "==", student.prn),
      where("weekNumber", "==", currentWeek),
      where("year", "==", currentYear)
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setGoals(data);
    });

    return () => unsub();
  }, [student]);

  // Add goal
  const addGoal = async () => {
    if (!goalTitle.trim()) {
      Alert.alert("Enter a goal first");
      return;
    }

    await addDoc(collection(db, "weeklyGoals"), {
      studentId: student.prn,
      title: goalTitle,
      targetDay: targetDay,
      weekNumber: currentWeek,
      year: currentYear,
      isCompleted: false,
      createdAt: serverTimestamp(),
    });

    setGoalTitle("");
  };

  // Toggle complete
  const toggleComplete = async (goal) => {
    await updateDoc(doc(db, "weeklyGoals", goal.id), {
      isCompleted: !goal.isCompleted,
    });
  };

  // Delete goal
  const deleteGoal = async (goalId) => {
    await deleteDoc(doc(db, "weeklyGoals", goalId));
  };

  const renderGoal = ({ item }) => (
    <View style={styles.card}>
      <Text
        style={[
          styles.goalText,
          item.isCompleted && styles.completedGoal,
        ]}
      >
        {item.title}
      </Text>

      <Text style={styles.target}>
        Target: {item.targetDay}
      </Text>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.completeBtn}
          onPress={() => toggleComplete(item)}
        >
          <Text style={styles.btnText}>
            {item.isCompleted ? "Undo" : "Complete"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => deleteGoal(item.id)}
        >
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Weekly Goals</Text>

      {/* Goal input */}
      <View style={styles.addRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter new goal..."
          value={goalTitle}
          onChangeText={setGoalTitle}
        />

        <TouchableOpacity style={styles.addBtn} onPress={addGoal}>
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Target day selector */}
      <View style={styles.dayRow}>
        {days.map((day) => (
          <TouchableOpacity
            key={day}
            onPress={() => setTargetDay(day)}
            style={[
              styles.dayBtn,
              targetDay === day && styles.selectedDay,
            ]}
          >
            <Text
              style={{
                color: targetDay === day ? "#fff" : "#146ED7",
                fontWeight: "bold",
              }}
            >
              {day.slice(0, 3)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Goal list */}
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={renderGoal}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      <BottomNavbar active="goals" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F9FBFF",
  },

  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },

  addRow: {
    flexDirection: "row",
    marginBottom: 10,
  },

  input: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
  },

  addBtn: {
    marginLeft: 10,
    backgroundColor: "#146ED7",
    paddingHorizontal: 18,
    justifyContent: "center",
    borderRadius: 10,
  },

  addText: {
    color: "#fff",
    fontWeight: "bold",
  },

  dayRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },

  dayBtn: {
    padding: 8,
    margin: 4,
    borderRadius: 8,
    backgroundColor: "#E6F0FF",
  },

  selectedDay: {
    backgroundColor: "#146ED7",
  },

  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },

  goalText: {
    fontSize: 15,
    fontWeight: "600",
  },

  completedGoal: {
    textDecorationLine: "line-through",
    color: "gray",
  },

  target: {
    marginTop: 4,
    color: "#146ED7",
    fontWeight: "600",
  },

  row: {
    flexDirection: "row",
    marginTop: 10,
  },

  completeBtn: {
    backgroundColor: "#146ED7",
    padding: 8,
    borderRadius: 8,
    marginRight: 10,
  },

  deleteBtn: {
    backgroundColor: "red",
    padding: 8,
    borderRadius: 8,
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});