import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import * as Notifications from "expo-notifications";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { db } from "../../firebase";
import AdminNavbar from "./components/AdminNavbar";

const COLORS = {
  primaryDark: "#1A50C8",
  primary: "#2D6EEF",
  primaryLight: "#60A5FA",
  bg: "#F8FAFF",
  white: "#FFFFFF",
  textMain: "#0F172A",
  textSub: "#64748B",
  accent: "#E0E7FF",
  danger: "#EF4444",
  success: "#10B981"
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAY_MAP = { Sun: 1, Mon: 2, Tue: 3, Wed: 4, Thu: 5, Fri: 6, Sat: 7 };

const two = (n) => String(n).padStart(2, "0");
const toHHMM = (date) => `${two(date.getHours())}:${two(date.getMinutes())}`;

export default function Timetable() {
  // 💡 AUTO-SELECT CURRENT DAY
  const currentDayName = DAYS[new Date().getDay() - 1] || "Mon";
  const [selectedDay, setSelectedDay] = useState(currentDayName);
  
  const [slots, setSlots] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ day: selectedDay, subjectName: "", className: "" });

  const today = new Date();
  const [startTime, setStartTime] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0));
  const [endTime, setEndTime] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0));

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        await ensureNotifPermission();
        const qy = query(collection(db, "timetableSessions"), orderBy("day"));
        const snap = await getDocs(qy);
        setSlots(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (e) {
        Alert.alert("Error", "Could not load timetable.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const timetableData = useMemo(() => {
    const byDay = { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [] };
    for (const s of slots) if (byDay[s.day]) byDay[s.day].push(s);
    for (const d of DAYS) byDay[d].sort((a, b) => (a.start || "").localeCompare(b.start || ""));
    return byDay;
  }, [slots]);

  // 💡 HELPER FOR BATCH TAG COLORS
  const getBatchColor = (batch) => {
    const b = batch.toUpperCase();
    if (b.includes("FY")) return "#6366F1";
    if (b.includes("SY")) return "#F59E0B";
    if (b.includes("TY")) return "#10B981";
    return COLORS.primary;
  };

  const openAdd = (day) => {
    const now = new Date();
    setForm({ day: day || selectedDay, subjectName: "", className: "" });
    setStartTime(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0));
    setEndTime(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0));
    setModalVisible(true);
  };

  const ensureNotifPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") await Notifications.requestPermissionsAsync();
  };

  const scheduleReminder = async ({ day, subjectName, className, start }) => {
    const tm = { hour: parseInt(start.split(":")[0]), minute: parseInt(start.split(":")[1]) };
    const weekday = WEEKDAY_MAP[day];
    let hour = tm.hour;
    let minute = tm.minute - 5;
    if (minute < 0) { minute += 60; hour = (hour + 23) % 24; }
    try {
      return await Notifications.scheduleNotificationAsync({
        content: { title: "Lecture Reminder", body: `${subjectName} starts in 5 mins` },
        trigger: { weekday, hour, minute, repeats: true },
      });
    } catch (e) { return null; }
  };

  const handleSaveSlot = async () => {
    const { day, subjectName, className } = form;
    if (!subjectName.trim() || !className.trim()) {
      Alert.alert("Missing Info", "Please enter the subject and batch details.");
      return;
    }
    setSaving(true);
    try {
      const start = toHHMM(startTime);
      const end = toHHMM(endTime);
      const notificationId = await scheduleReminder({ day, subjectName, className, start });
      const docRef = await addDoc(collection(db, "timetableSessions"), {
        day, subjectName, className, start, end, notificationId, createdAt: new Date().toISOString()
      });
      setSlots([...slots, { id: docRef.id, day, subjectName, className, start, end, notificationId }]);
      setModalVisible(false);
    } catch (e) { Alert.alert("Error", "Save failed"); }
    finally { setSaving(false); }
  };

  const handleDeleteSlot = (slot) => {
    Alert.alert("Remove Lecture", "Are you sure you want to delete this slot?", [
      { text: "Keep it", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: async () => {
          try {
            if (slot.notificationId) await Notifications.cancelScheduledNotificationAsync(slot.notificationId);
            await deleteDoc(doc(db, "timetableSessions", slot.id));
            setSlots(slots.filter(s => s.id !== slot.id));
          } catch (e) { Alert.alert("Error", "Delete failed"); }
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient colors={[COLORS.primaryDark, COLORS.primary]} style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerTitle}>Timetable</Text>
              <Text style={styles.headerSub}>Control the daily flow</Text>
            </View>
            <TouchableOpacity onPress={() => openAdd(selectedDay)} style={styles.addCircle}>
              <Ionicons name="add" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* DAY PICKER */}
      <View style={styles.dayStrip}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
          {DAYS.map(day => (
            <TouchableOpacity 
              key={day} 
              onPress={() => setSelectedDay(day)} 
              style={[styles.dayTab, selectedDay === day && styles.activeDayTab]}
            >
              <Text style={[styles.dayTabText, selectedDay === day && styles.activeDayTabText]}>{day}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* LECTURE LIST */}
      <ScrollView contentContainerStyle={styles.listArea}>
        {loading ? (
          <ActivityIndicator color={COLORS.primary} style={{ marginTop: 40 }} />
        ) : (timetableData[selectedDay] || []).length > 0 ? (
          (timetableData[selectedDay] || []).map((sub) => (
            <View key={sub.id} style={styles.lectureRow}>
              <View style={styles.timeCol}>
                <Text style={styles.timeMain}>{sub.start}</Text>
                <View style={styles.dotLine} />
                <Text style={styles.timeSub}>{sub.end}</Text>
              </View>

              <View style={styles.lectureCard}>
                <View style={styles.cardTop}>
                  <View style={[styles.batchTag, { backgroundColor: getBatchColor(sub.className) }]}>
                    <Text style={styles.batchText}>{sub.className}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleDeleteSlot(sub)}>
                    <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.subjectTitle}>{sub.subjectName}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={80} color={COLORS.accent} />
            <Text style={styles.emptyText}>No classes scheduled for {selectedDay}</Text>
          </View>
        )}
      </ScrollView>

      {/* ADD MODAL */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalSheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Add New Lecture</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}><Ionicons name="close-circle" size={28} color={COLORS.textSub} /></TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Subject</Text>
              <TextInput style={styles.input} placeholder="e.g. Computer Networks" value={form.subjectName} onChangeText={t => setForm({...form, subjectName: t})} />

              <Text style={styles.inputLabel}>Class Batch</Text>
              <TextInput style={styles.input} placeholder="e.g. TY-CS-B" value={form.className} onChangeText={t => setForm({...form, className: t})} />

              <View style={styles.timeGrid}>
                <TouchableOpacity style={styles.timeInput} onPress={() => setShowStartPicker(true)}>
                  <Text style={styles.timeLabel}>Starts</Text>
                  <Text style={styles.timeVal}>{toHHMM(startTime)}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.timeInput} onPress={() => setShowEndPicker(true)}>
                  <Text style={styles.timeLabel}>Ends</Text>
                  <Text style={styles.timeVal}>{toHHMM(endTime)}</Text>
                </TouchableOpacity>
              </View>

              {showStartPicker && <DateTimePicker value={startTime} mode="time" is24Hour onChange={(e, d) => { setShowStartPicker(false); if(d) setStartTime(d); }} />}
              {showEndPicker && <DateTimePicker value={endTime} mode="time" is24Hour onChange={(e, d) => { setShowEndPicker(false); if(d) setEndTime(d); }} />}

              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveSlot} disabled={saving}>
                {saving ? <ActivityIndicator color="white" /> : <Text style={styles.saveBtnText}>Save Schedule</Text>}
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      <AdminNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingBottom: 40, paddingHorizontal: 25, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
  headerTitle: { fontSize: 28, fontWeight: '900', color: 'white' },
  headerSub: { fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  addCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },

  dayStrip: { marginTop: -25 },
  dayTab: { paddingHorizontal: 20, paddingVertical: 12, backgroundColor: 'white', borderRadius: 20, marginRight: 10, elevation: 4 },
  activeDayTab: { backgroundColor: COLORS.primaryDark },
  dayTabText: { fontWeight: '800', color: COLORS.textSub },
  activeDayTabText: { color: 'white' },

  listArea: { padding: 20, paddingBottom: 100 },
  lectureRow: { flexDirection: 'row', marginBottom: 25 },
  timeCol: { width: 60, alignItems: 'center', marginRight: 15 },
  timeMain: { fontSize: 14, fontWeight: '900', color: COLORS.primary },
  timeSub: { fontSize: 12, fontWeight: '600', color: COLORS.textSub },
  dotLine: { width: 2, flex: 1, backgroundColor: COLORS.accent, marginVertical: 5, borderRadius: 1 },

  lectureCard: { flex: 1, backgroundColor: 'white', borderRadius: 20, padding: 15, elevation: 3 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  batchTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  batchText: { fontSize: 10, fontWeight: '900', color: 'white' },
  subjectTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textMain },

  emptyState: { alignItems: 'center', marginTop: 80 },
  emptyText: { color: COLORS.textSub, fontWeight: '700', marginTop: 15 },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: 'white', borderTopLeftRadius: 35, borderTopRightRadius: 35, padding: 25, maxHeight: '85%' },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  sheetTitle: { fontSize: 22, fontWeight: '900', color: COLORS.textMain },
  inputLabel: { fontSize: 12, fontWeight: '800', color: COLORS.textSub, marginBottom: 8, marginTop: 15 },
  input: { backgroundColor: '#F1F5F9', borderRadius: 15, padding: 15, fontWeight: '700', color: COLORS.textMain },
  timeGrid: { flexDirection: 'row', gap: 15, marginTop: 20 },
  timeInput: { flex: 1, backgroundColor: '#EEF2FF', padding: 15, borderRadius: 15, alignItems: 'center' },
  timeLabel: { fontSize: 10, fontWeight: '800', color: COLORS.primary },
  timeVal: { fontSize: 18, fontWeight: '900', color: COLORS.primaryDark },
  saveBtn: { backgroundColor: COLORS.primary, padding: 18, borderRadius: 20, alignItems: 'center', marginTop: 30 },
  saveBtnText: { color: 'white', fontWeight: '900', fontSize: 16 }
});