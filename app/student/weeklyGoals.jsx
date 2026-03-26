import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../firebase";
import BottomNavbar from "./components/BottomNavbar";

const COLORS = {
  primary: "#2D6EEF",
  primaryLight: "#EBF0FD",
  bg: "#F8FAFF",
  white: "#FFFFFF",
  success: "#10B981",
  danger: "#EF4444",
  textPrimary: "#0F172A",
  textSecondary: "#475569",
};

export default function WeeklyGoals() {
  const [student, setStudent] = useState(null);
  const [goals, setGoals] = useState([]);
  const [goalTitle, setGoalTitle] = useState("");
  const [targetDay, setTargetDay] = useState("Monday");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const getWeekNumber = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    return Math.ceil((((now - start) / 86400000) + start.getDay() + 1) / 7);
  };

  const currentWeek = getWeekNumber();
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const load = async () => {
      const saved = await AsyncStorage.getItem("student");
      if (saved) setStudent(JSON.parse(saved));
    };
    load();
  }, []);

  useEffect(() => {
    if (!student?.prn) return;
    const q = query(
      collection(db, "weeklyGoals"),
      where("studentId", "==", student.prn),
      where("weekNumber", "==", currentWeek),
      where("year", "==", currentYear)
    );
    const unsub = onSnapshot(q, (snap) => {
      setGoals(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [student]);

  const addGoal = async () => {
    if (!goalTitle.trim()) {
      Alert.alert("Wait!", "Please enter a goal title first.");
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

  const toggleComplete = async (goal) => {
    await updateDoc(doc(db, "weeklyGoals", goal.id), { isCompleted: !goal.isCompleted });
  };

  const deleteGoal = async (goalId) => {
    Alert.alert("Delete Goal", "Are you sure?", [
      { text: "Cancel" },
      { text: "Delete", onPress: async () => await deleteDoc(doc(db, "weeklyGoals", goalId)), style: "destructive" }
    ]);
  };

  const renderGoal = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity 
        style={[styles.checkCircle, item.isCompleted && styles.checkCircleActive]} 
        onPress={() => toggleComplete(item)}
      >
        {item.isCompleted && <Ionicons name="checkmark" size={16} color="white" />}
      </TouchableOpacity>
      
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={[styles.goalText, item.isCompleted && styles.completedGoal]}>{item.title}</Text>
        <View style={styles.dayBadge}>
          <Feather name="calendar" size={10} color={COLORS.primary} />
          <Text style={styles.targetText}>{item.targetDay}</Text>
        </View>
      </View>

      <TouchableOpacity onPress={() => deleteGoal(item.id)} style={styles.deleteIcon}>
        <Feather name="trash-2" size={18} color={COLORS.danger} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#2D6EEF", "#1A50C8"]} style={styles.headerSection}>
        <Text style={styles.headerTitle}>Weekly Goals</Text>
        <Text style={styles.headerSub}>Week {currentWeek}, {currentYear}</Text>
      </LinearGradient>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <View style={styles.inputWrapper}>
          <View style={styles.addRow}>
            <TextInput
              style={styles.input}
              placeholder="What's your next goal?"
              placeholderTextColor="#94A3B8"
              value={goalTitle}
              onChangeText={setGoalTitle}
            />
            <TouchableOpacity style={styles.addBtn} onPress={addGoal}>
              <Ionicons name="add" size={28} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayRow}>
            {days.map((day) => (
              <TouchableOpacity
                key={day}
                onPress={() => setTargetDay(day)}
                style={[styles.dayBtn, targetDay === day && styles.selectedDay]}
              >
                <Text style={[styles.dayBtnText, targetDay === day && styles.selectedDayText]}>
                  {day.slice(0, 3)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <FlatList
          data={goals}
          keyExtractor={(item) => item.id}
          renderItem={renderGoal}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Feather name="target" size={50} color="#CBD5E1" />
              <Text style={styles.emptyText}>No goals set for this week yet.</Text>
            </View>
          }
        />
      </KeyboardAvoidingView>

      <BottomNavbar active="goals" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  headerSection: { paddingTop: 60, paddingBottom: 30, paddingHorizontal: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerTitle: { fontSize: 28, fontWeight: "800", color: "white" },
  headerSub: { fontSize: 14, color: "rgba(255,255,255,0.7)", marginTop: 4 },
  inputWrapper: { padding: 20, backgroundColor: 'white', marginTop: -20, marginHorizontal: 20, borderRadius: 20, elevation: 5 },
  addRow: { flexDirection: "row", alignItems: "center" },
  input: { flex: 1, backgroundColor: "#F1F5F9", padding: 15, borderRadius: 12, fontSize: 16, color: COLORS.textPrimary },
  addBtn: { marginLeft: 12, backgroundColor: COLORS.primary, width: 50, height: 50, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  dayRow: { marginTop: 15 },
  dayBtn: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10, backgroundColor: "#F1F5F9", marginRight: 8 },
  selectedDay: { backgroundColor: COLORS.primary },
  dayBtnText: { color: COLORS.textSecondary, fontWeight: "700", fontSize: 12 },
  selectedDayText: { color: "white" },
  listContainer: { padding: 20, paddingBottom: 120 },
  card: { flexDirection: "row", alignItems: "center", backgroundColor: "white", padding: 16, borderRadius: 16, marginBottom: 12, elevation: 2 },
  checkCircle: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: COLORS.primary, justifyContent: "center", alignItems: "center" },
  checkCircleActive: { backgroundColor: COLORS.success, borderColor: COLORS.success },
  goalText: { fontSize: 16, fontWeight: "600", color: COLORS.textPrimary },
  completedGoal: { textDecorationLine: "line-through", color: "#94A3B8" },
  dayBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 4, backgroundColor: COLORS.primaryLight, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  targetText: { fontSize: 10, color: COLORS.primary, fontWeight: "700", marginLeft: 4 },
  deleteIcon: { padding: 8 },
  emptyState: { alignItems: "center", marginTop: 50 },
  emptyText: { color: "#94A3B8", marginTop: 10, fontSize: 16 },
});