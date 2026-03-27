// import React, { useEffect, useMemo, useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Modal,
//   TextInput,
//   Alert,
//   Platform,
//   KeyboardAvoidingView,
// } from "react-native";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import * as Notifications from "expo-notifications";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import {
//   addDoc,
//   collection,
//   getDocs,
//   orderBy,
//   query,
//   // 🔥 NEW:
//   deleteDoc,
//   doc,
// } from "firebase/firestore";
// import { db } from "../../firebase";
// import BottomNavbar from "./components/BottomNavbar";

// // Foreground notification behaviour
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false, // keep silent in-foreground; change to true if you want sound
//     shouldSetBadge: false,
//   }),
// });

// const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// const WEEKDAY_MAP = { Sun: 1, Mon: 2, Tue: 3, Wed: 4, Thu: 5, Fri: 6, Sat: 7 };

// const two = (n) => String(n).padStart(2, "0");
// const toHHMM = (date) => `${two(date.getHours())}:${two(date.getMinutes())}`;

// export default function Timetable() {
//   const [selectedDay, setSelectedDay] = useState("Mon");
//   const [slots, setSlots] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [form, setForm] = useState({
//     day: "Mon",
//     subjectName: "",
//     className: "",
//   });

//   // Use today's date when creating time objects to avoid timezone shifts
//   const today = new Date();
//   const [startTime, setStartTime] = useState(
//     new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0)
//   );
//   const [endTime, setEndTime] = useState(
//     new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0)
//   );

//   const [showStartPicker, setShowStartPicker] = useState(false);
//   const [showEndPicker, setShowEndPicker] = useState(false);

//   const [saving, setSaving] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     (async () => {
//       try {
//         await ensureNotifPermission();
//         const qy = query(collection(db, "timetableSessions"), orderBy("day"));
//         const snap = await getDocs(qy);
//         setSlots(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//       } catch (e) {
//         console.error("Fetch timetable error:", e);
//         Alert.alert("Error", "Could not load timetable.");
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   const timetableData = useMemo(() => {
//     const byDay = { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [] };
//     for (const s of slots) if (byDay[s.day]) byDay[s.day].push(s);
//     for (const d of DAYS) byDay[d].sort((a, b) => (a.start || "").localeCompare(b.start || ""));
//     return byDay;
//   }, [slots]);

//   const openAdd = (day) => {
//     const now = new Date();
//     setForm({
//       day: day || selectedDay,
//       subjectName: "",
//       className: "",
//     });
//     setStartTime(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0));
//     setEndTime(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0));
//     setModalVisible(true);
//   };

//   const ensureNotifPermission = async () => {
//     const { status } = await Notifications.getPermissionsAsync();
//     if (status !== "granted") {
//       const req = await Notifications.requestPermissionsAsync();
//       if (req.status !== "granted") {
//         Alert.alert(
//           "Permission",
//           "Notifications are disabled. Reminders won’t appear until you allow them in Settings."
//         );
//       }
//     }
//   };

//   const parseTime = (hhmm) => {
//     const m = /^(\d{2}):(\d{2})$/.exec(hhmm.trim());
//     if (!m) return null;
//     const hour = Number(m[1]);
//     const minute = Number(m[2]);
//     if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
//     return { hour, minute };
//   };

//   // Schedules exactly one reminder time per week per slot: 5 minutes before the lecture start
//   const scheduleReminder = async ({ day, subjectName, className, start }) => {
//     const tm = parseTime(start);
//     if (!tm) return null;
//     const weekday = WEEKDAY_MAP[day];
//     if (!weekday) return null;

//     // compute 5 minutes before
//     let hour = tm.hour;
//     let minute = tm.minute - 5;
//     if (minute < 0) {
//       minute += 60;
//       hour = (hour + 23) % 24;
//     }

//     try {
//       const id = await Notifications.scheduleNotificationAsync({
//         content: {
//           title: "Upcoming Lecture",
//           body: `${subjectName} (${className}) starts at ${start}`,
//           data: { subjectName, className, start, day },
//         },
//         trigger: {
//           weekday, // 1=Sun ... 7=Sat (we mapped Mon..Sat to 2..7)
//           hour,
//           minute,
//           repeats: true, // weekly at that time → "only 5 min before" each week
//         },
//       });
//       return id;
//     } catch (e) {
//       console.warn("scheduleNotification error:", e);
//       return null;
//     }
//   };

//   const handleSaveSlot = async () => {
//     const { day, subjectName, className } = form;
//     if (!day || !subjectName.trim() || !className.trim()) {
//       Alert.alert("Validation", "Fill all fields (day, subject, class, time).");
//       return;
//     }

//     const start = toHHMM(startTime);
//     const end = toHHMM(endTime);

//     // Optional guard: end must be after start
//     const [sh, sm] = start.split(":").map(Number);
//     const [eh, em] = end.split(":").map(Number);
//     if (eh * 60 + em <= sh * 60 + sm) {
//       Alert.alert("Validation", "End time must be after start time.");
//       return;
//     }

//     setSaving(true);
//     try {
//       const notificationId = await scheduleReminder({
//         day,
//         subjectName: subjectName.trim(),
//         className: className.trim(),
//         start,
//       });

//       const docRef = await addDoc(collection(db, "timetableSessions"), {
//         day,
//         subjectName: subjectName.trim(),
//         className: className.trim(),
//         start,
//         end,
//         notificationId: notificationId || null,
//         createdAt: new Date().toISOString(),
//       });

//       setSlots((prev) => [
//         ...prev,
//         {
//           id: docRef.id,
//           day,
//           subjectName: subjectName.trim(),
//           className: className.trim(),
//           start,
//           end,
//           notificationId: notificationId || null,
//         },
//       ]);

//       setModalVisible(false);
//       Alert.alert("Saved", "Slot saved and 5-minute reminder scheduled.");
//     } catch (e) {
//       console.error("Save slot error:", e);
//       Alert.alert("Error", "Could not save slot.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // 🔥 NEW: delete a slot → cancel notification + delete doc + update UI
//   const handleDeleteSlot = async (slot) => {
//     try {
//       if (slot.notificationId) {
//         try {
//           await Notifications.cancelScheduledNotificationAsync(slot.notificationId);
//         } catch (err) {
//           console.warn("Notification cancel failed (maybe already gone):", err?.message);
//         }
//       }
//       await deleteDoc(doc(db, "timetableSessions", slot.id));
//       setSlots((prev) => prev.filter((s) => s.id !== slot.id));
//       Alert.alert("Deleted", "Slot removed and reminder cancelled.");
//     } catch (e) {
//       console.error("Delete slot error:", e);
//       Alert.alert("Error", "Could not delete slot.");
//     }
//   };

//   const dayStyles = [
//     { color: "#4D96FF", icon: "book-outline" },
//     { color: "#4D96FF", icon: "desktop-outline" },
//     { color: "#4D96FF", icon: "school-outline" },
//     { color: "#4D96FF", icon: "laptop-outline" },
//     { color: "#4D96FF", icon: "stats-chart-outline" },
//     { color: "#4D96FF", icon: "school-outline" },
//   ];

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.pageTitle}>Class Timetable</Text>
//         <Text style={styles.subTitle}>Organize your schedule day by day</Text>
//       </View>

//       {/* Add button */}
//       <View style={{ paddingHorizontal: 18, paddingTop: 12, paddingBottom: 4 }}>
//         <TouchableOpacity style={styles.addBtn} onPress={() => openAdd(selectedDay)}>
//           <Ionicons name="add-circle-outline" size={22} color="#fff" />
//           <Text style={styles.addBtnText}>Add Slot</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Days Row */}
//       <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayRow}>
//         {DAYS.map((day, index) => {
//           const isActive = selectedDay === day;
//           const { color, icon } = dayStyles[index];
//           return (
//             <TouchableOpacity key={day} style={styles.dayItem} onPress={() => setSelectedDay(day)} activeOpacity={0.8}>
//               <View style={[styles.dayCircle, { backgroundColor: isActive ? color : "#E0E0E0" }]}>
//                 <Ionicons name={icon} size={28} color={isActive ? "#fff" : "#666"} />
//               </View>
//               <Text style={[styles.dayLabel, isActive && styles.activeDayLabel]}>{day}</Text>
//               {isActive && <View style={styles.activeLine} />}
//             </TouchableOpacity>
//           );
//         })}
//       </ScrollView>

//       {/* Subjects list */}
//       <ScrollView contentContainerStyle={styles.subjectContainer}>
//         {(loading ? [] : timetableData[selectedDay] || []).map((sub, index) => (
//           <View key={sub.id || index} style={styles.subjectCard}>
//             <View style={styles.cardHeader}>
//               <Ionicons name="book" size={22} color="#fff" />
//               <Text style={styles.subjectName}>{sub.subjectName}</Text>

//               {/* 🔥 NEW: delete button */}
//               <TouchableOpacity
//                 onPress={() =>
//                   Alert.alert(
//                     "Delete slot?",
//                     `${sub.subjectName} (${sub.start}–${sub.end})`,
//                     [
//                       { text: "Cancel", style: "cancel" },
//                       { text: "Delete", style: "destructive", onPress: () => handleDeleteSlot(sub) },
//                     ]
//                   )
//                 }
//                 style={styles.deleteBtn}
//                 hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
//               >
//                 <Ionicons name="trash-outline" size={20} color="#fff" />
//               </TouchableOpacity>
//             </View>

//             <View style={styles.cardBody}>
//               <View style={styles.detailRow}>
//                 <Ionicons name="time-outline" size={20} color="#146ED7" />
//                 <Text style={styles.subjectDetail}>
//                   {sub.start} - {sub.end}
//                 </Text>
//               </View>
//               <View style={styles.detailRow}>
//                 <Ionicons name="people-outline" size={20} color="#146ED7" />
//                 <Text style={styles.subjectDetail}>Class: {sub.className}</Text>
//               </View>
//             </View>
//           </View>
//         ))}
//         {!loading && (timetableData[selectedDay] || []).length === 0 && (
//           <Text style={{ textAlign: "center", color: "#666", marginTop: 8 }}>
//             No slots yet. Tap “Add Slot”.
//           </Text>
//         )}
//       </ScrollView>

//       {/* Add Slot Modal (scrollable body + clock pickers) */}
//       <Modal visible={modalVisible} animationType="slide" transparent>
//         <View style={styles.modalWrap}>
//           <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ width: "100%" }}>
//             <View style={styles.modalCard}>
//               <Text style={styles.modalTitle}>Add Slot</Text>

//               <ScrollView contentContainerStyle={{ paddingBottom: 8 }} keyboardShouldPersistTaps="handled">
//                 {/* Day chips */}
//                 <View style={styles.row}>
//                   <Text style={styles.label}>Day</Text>
//                   <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                     {DAYS.map((d) => (
//                       <TouchableOpacity
//                         key={d}
//                         style={[styles.chip, form.day === d && { backgroundColor: "#146ED7" }]}
//                         onPress={() => setForm((f) => ({ ...f, day: d }))}
//                       >
//                         <Text style={[styles.chipText, form.day === d && { color: "#fff" }]}>{d}</Text>
//                       </TouchableOpacity>
//                     ))}
//                   </ScrollView>
//                 </View>

//                 {/* Subject */}
//                 <View style={styles.row}>
//                   <Text style={styles.label}>Subject</Text>
//                   <TextInput
//                     value={form.subjectName}
//                     onChangeText={(t) => setForm((f) => ({ ...f, subjectName: t }))}
//                     placeholder="e.g., Operating System"
//                     style={styles.input}
//                   />
//                 </View>

//                 {/* Class */}
//                 <View style={styles.row}>
//                   <Text style={styles.label}>Class</Text>
//                   <TextInput
//                     value={form.className}
//                     onChangeText={(t) => setForm((f) => ({ ...f, className: t }))}
//                     placeholder="e.g., TY, SY, FY"
//                     style={styles.input}
//                   />
//                 </View>

//                 {/* Time pickers */}
//                 <View style={[styles.row, { gap: 10 }]}>
//                   <View style={{ flex: 1 }}>
//                     <Text style={styles.label}>Start Time</Text>
//                     <TouchableOpacity style={styles.timeBtn} onPress={() => setShowStartPicker(true)}>
//                       <Ionicons name="time-outline" size={18} color="#146ED7" />
//                       <Text style={styles.timeText}>{toHHMM(startTime)}</Text>
//                     </TouchableOpacity>
//                     {showStartPicker && (
//                       <DateTimePicker
//                         value={startTime}
//                         mode="time"
//                         is24Hour
//                         display={Platform.OS === "ios" ? "spinner" : "clock"}
//                         onChange={(event, date) => {
//                           if (Platform.OS === "android") setShowStartPicker(false);
//                           if (date) {
//                             const d = new Date(startTime);
//                             d.setHours(date.getHours(), date.getMinutes(), 0, 0);
//                             setStartTime(d);
//                           }
//                         }}
//                       />
//                     )}
//                   </View>

//                   <View style={{ flex: 1 }}>
//                     <Text style={styles.label}>End Time</Text>
//                     <TouchableOpacity style={styles.timeBtn} onPress={() => setShowEndPicker(true)}>
//                       <Ionicons name="time-outline" size={18} color="#146ED7" />
//                       <Text style={styles.timeText}>{toHHMM(endTime)}</Text>
//                     </TouchableOpacity>
//                     {showEndPicker && (
//                       <DateTimePicker
//                         value={endTime}
//                         mode="time"
//                         is24Hour
//                         display={Platform.OS === "ios" ? "spinner" : "clock"}
//                         onChange={(event, date) => {
//                           if (Platform.OS === "android") setShowEndPicker(false);
//                           if (date) {
//                             const d = new Date(endTime);
//                             d.setHours(date.getHours(), date.getMinutes(), 0, 0);
//                             setEndTime(d);
//                           }
//                         }}
//                       />
//                     )}
//                   </View>
//                 </View>
//               </ScrollView>

//               {/* Actions */}
//               <View style={styles.modalActions}>
//                 <TouchableOpacity style={[styles.btn, { backgroundColor: "#ccc" }]} onPress={() => setModalVisible(false)} disabled={saving}>
//                   <Text style={styles.btnText}>Cancel</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={[styles.btn, { backgroundColor: "#146ED7" }]}
//                   onPress={handleSaveSlot}
//                   disabled={saving}
//                 >
//                   <Text style={styles.btnText}>{saving ? "Saving..." : "Save"}</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </KeyboardAvoidingView>
//         </View>
//       </Modal>

//       <BottomNavbar />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#F3F7FD" },

//   header: {
//     paddingTop: 30, paddingBottom: 20, paddingHorizontal: 20,
//     backgroundColor: "#E3F0FF",
//     borderBottomLeftRadius: 18, borderBottomRightRadius: 18,
//     shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 6,
//     shadowOffset: { width: 0, height: 3 }, elevation: 6,
//   },
//   pageTitle: { fontSize: 24, fontWeight: "800", color: "#146ED7" },
//   subTitle: { fontSize: 14, color: "#146ED7", marginTop: 4 },

//   dayRow: { flexDirection: "row", paddingHorizontal: 15, marginVertical: 20, alignItems: "center" },
//   dayItem: { alignItems: "center", marginHorizontal: 12 },
//   dayCircle: {
//     width: 70, height: 70, borderRadius: 35, justifyContent: "center", alignItems: "center",
//     marginTop: 5, marginBottom: 10, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 6,
//     shadowOffset: { width: 0, height: 3 }, elevation: 5,
//   },
//   dayLabel: { fontSize: 14, fontWeight: "600", color: "#666" },
//   activeDayLabel: { color: "#146ED7", fontWeight: "700" },
//   activeLine: { height: 3, width: 32, backgroundColor: "#146ED7", borderRadius: 2, marginTop: 6 },

//   subjectContainer: { paddingHorizontal: 18, paddingBottom: 90 },
//   subjectCard: {
//     backgroundColor: "#fff", borderRadius: 16, marginBottom: 24,
//     shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 6,
//     shadowOffset: { width: 0, height: 4 }, elevation: 5, overflow: "hidden",
//   },
//   cardHeader: { flexDirection: "row", alignItems: "center", backgroundColor: "#146ED7", paddingVertical: 12, paddingHorizontal: 16 },
//   subjectName: { flex: 1, fontSize: 20, fontWeight: "700", color: "#fff", marginLeft: 10 },
//   // 🔥 NEW:
//   deleteBtn: { paddingLeft: 10, paddingVertical: 6 },

//   cardBody: { padding: 18 },
//   detailRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
//   subjectDetail: { fontSize: 16, color: "#333", marginLeft: 10 },

//   addBtn: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#146ED7", paddingVertical: 10, borderRadius: 10, justifyContent: "center" },
//   addBtnText: { color: "#fff", fontWeight: "700" },

//   modalWrap: { flex: 1, backgroundColor: "rgba(0,0,0,0.25)", justifyContent: "center", alignItems: "center", padding: 18 },
//   modalCard: { width: "100%", backgroundColor: "#fff", borderRadius: 14, padding: 16, maxHeight: "85%" },
//   modalTitle: { fontSize: 18, fontWeight: "800", marginBottom: 12, color: "#111" },

//   row: { marginBottom: 12 },
//   label: { fontSize: 12, fontWeight: "700", color: "#555", marginBottom: 6 },
//   input: { backgroundColor: "#EEF4FF", padding: 10, borderRadius: 8, borderWidth: 1, borderColor: "#CFE0FF" },

//   chip: { backgroundColor: "#EEF4FF", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: "#CFE0FF" },
//   chipText: { color: "#146ED7", fontWeight: "700" },

//   timeBtn: {
//     flexDirection: "row", alignItems: "center", gap: 8,
//     backgroundColor: "#EEF4FF", padding: 10, borderRadius: 8,
//     borderWidth: 1, borderColor: "#CFE0FF",
//   },
//   timeText: { fontWeight: "700", color: "#146ED7" },

//   modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 10 },
//   btn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 },
//   btnText: { color: "#fff", fontWeight: "800" },
// });









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
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { db } from "../../firebase";
import BottomNavbar from "./components/BottomNavbar";

// Foreground notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAY_MAP = { Sun: 1, Mon: 2, Tue: 3, Wed: 4, Thu: 5, Fri: 6, Sat: 7 };

const COLORS = {
  primary: "#2D6EEF",
  secondary: "#1A50C8",
  accent: "#E0E7FF",
  bg: "#F8FAFF",
  white: "#FFFFFF",
  textMain: "#1E293B",
  textSub: "#64748B",
  danger: "#EF4444",
};

const two = (n) => String(n).padStart(2, "0");
const toHHMM = (date) => `${two(date.getHours())}:${two(date.getMinutes())}`;

export default function Timetable() {
  const [selectedDay, setSelectedDay] = useState("Mon");
  const [slots, setSlots] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ day: "Mon", subjectName: "", className: "" });

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
        console.error("Fetch error:", e);
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

  const openAdd = (day) => {
    setForm({ day: day || selectedDay, subjectName: "", className: "" });
    setModalVisible(true);
  };

  const ensureNotifPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") await Notifications.requestPermissionsAsync();
  };

  const parseTime = (hhmm) => {
    const m = /^(\d{2}):(\d{2})$/.exec(hhmm.trim());
    if (!m) return null;
    return { hour: Number(m[1]), minute: Number(m[2]) };
  };

  const scheduleReminder = async ({ day, subjectName, className, start }) => {
    const tm = parseTime(start);
    if (!tm) return null;
    const weekday = WEEKDAY_MAP[day];
    let hour = tm.hour;
    let minute = tm.minute - 5;
    if (minute < 0) { minute += 60; hour = (hour + 23) % 24; }
    try {
      return await Notifications.scheduleNotificationAsync({
        content: { title: "Lecture Starting Soon", body: `${subjectName} in 5 mins`, data: { start, day } },
        trigger: { weekday, hour, minute, repeats: true },
      });
    } catch (e) { return null; }
  };

  const handleSaveSlot = async () => {
    const { day, subjectName, className } = form;
    if (!subjectName.trim() || !className.trim()) {
      Alert.alert("Validation", "Please fill all fields.");
      return;
    }
    const start = toHHMM(startTime);
    const end = toHHMM(endTime);
    setSaving(true);
    try {
      const notificationId = await scheduleReminder({ day, subjectName: subjectName.trim(), className: className.trim(), start });
      const docRef = await addDoc(collection(db, "timetableSessions"), {
        day, subjectName: subjectName.trim(), className: className.trim(), start, end, notificationId: notificationId || null, createdAt: new Date().toISOString(),
      });
      setSlots((prev) => [...prev, { id: docRef.id, day, subjectName: subjectName.trim(), className: className.trim(), start, end, notificationId }]);
      setModalVisible(false);
    } catch (e) { Alert.alert("Error", "Save failed."); } finally { setSaving(false); }
  };

  const handleDeleteSlot = async (slot) => {
    try {
      if (slot.notificationId) await Notifications.cancelScheduledNotificationAsync(slot.notificationId);
      await deleteDoc(doc(db, "timetableSessions", slot.id));
      setSlots((prev) => prev.filter((s) => s.id !== slot.id));
    } catch (e) { Alert.alert("Error", "Delete failed."); }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <LinearGradient colors={[COLORS.secondary, COLORS.primary]} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Timetable</Text>
            <Text style={styles.headerSub}>Manage your class hours</Text>
          </View>
          <TouchableOpacity onPress={() => openAdd(selectedDay)} style={styles.headerAddBtn}>
            <Ionicons name="add" size={28} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daySelector}>
          {DAYS.map((day) => (
            <TouchableOpacity 
              key={day} 
              onPress={() => setSelectedDay(day)}
              style={[styles.dayTab, selectedDay === day && styles.activeDayTab]}
            >
              <Text style={[styles.dayTabText, selectedDay === day && styles.activeDayTabText]}>{day}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        {loading ? (
           <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
        ) : timetableData[selectedDay]?.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={80} color="#CBD5E1" />
            <Text style={styles.emptyText}>No lectures for {selectedDay}</Text>
          </View>
        ) : (
          timetableData[selectedDay].map((sub) => (
            <View key={sub.id} style={styles.lectureCard}>
              <View style={styles.timeLine}>
                <Text style={styles.startTime}>{sub.start}</Text>
                <View style={styles.dot} />
                <View style={styles.line} />
                <Text style={styles.endTime}>{sub.end}</Text>
              </View>

              <View style={styles.mainInfo}>
                <View style={styles.infoContent}>
                  <Text style={styles.subjectText} numberOfLines={1}>{sub.subjectName}</Text>
                  <View style={styles.classRow}>
                    <Ionicons name="location-outline" size={14} color={COLORS.textSub} />
                    <Text style={styles.classText}>{sub.className}</Text>
                  </View>
                </View>

                <TouchableOpacity 
                  onPress={() => Alert.alert("Delete", "Remove this lecture?", [
                    { text: "Cancel", style: "cancel" },
                    { text: "Delete", style: "destructive", onPress: () => handleDeleteSlot(sub) }
                  ])}
                  style={styles.trashBtn}
                >
                  <Ionicons name="trash-bin-outline" size={18} color={COLORS.danger} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Lecture</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.textMain} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Subject Name</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="e.g. Operating Systems"
                  value={form.subjectName}
                  onChangeText={(t) => setForm({...form, subjectName: t})}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Class / Semester</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="e.g. TY-CS Room 5"
                  value={form.className}
                  onChangeText={(t) => setForm({...form, className: t})}
                />
              </View>

              <View style={styles.timeRow}>
                <TouchableOpacity style={styles.timePickerBtn} onPress={() => setShowStartPicker(true)}>
                  <Text style={styles.inputLabel}>Starts At</Text>
                  <Text style={styles.timeValueText}>{toHHMM(startTime)}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.timePickerBtn} onPress={() => setShowEndPicker(true)}>
                  <Text style={styles.inputLabel}>Ends At</Text>
                  <Text style={styles.timeValueText}>{toHHMM(endTime)}</Text>
                </TouchableOpacity>
              </View>

              {showStartPicker && (
                <DateTimePicker value={startTime} mode="time" is24Hour display="default"
                  onChange={(e, d) => { setShowStartPicker(false); if(d) setStartTime(d); }}
                />
              )}
              {showEndPicker && (
                <DateTimePicker value={endTime} mode="time" is24Hour display="default"
                  onChange={(e, d) => { setShowEndPicker(false); if(d) setEndTime(d); }}
                />
              )}

              <TouchableOpacity 
                style={[styles.saveButton, saving && { opacity: 0.7 }]} 
                onPress={handleSaveSlot}
                disabled={saving}
              >
                <Text style={styles.saveButtonText}>{saving ? "Saving..." : "Add to Timetable"}</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      <BottomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: '900', color: 'white' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  headerAddBtn: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 14 },

  daySelector: { flexDirection: 'row' },
  dayTab: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20, marginRight: 10 },
  activeDayTab: { backgroundColor: 'white' },
  dayTabText: { color: 'rgba(255,255,255,0.8)', fontWeight: 'bold', fontSize: 14 },
  activeDayTabText: { color: COLORS.primary },

  listContainer: { padding: 20, paddingBottom: 100 },
  lectureCard: { flexDirection: 'row', marginBottom: 25 },
  timeLine: { alignItems: 'center', width: 50, marginRight: 15 },
  startTime: { fontSize: 13, fontWeight: '800', color: COLORS.textMain },
  endTime: { fontSize: 12, fontWeight: '600', color: COLORS.textSub },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary, marginVertical: 6 },
  line: { width: 2, flex: 1, backgroundColor: '#E2E8F0', borderRadius: 1 },

  mainInfo: { 
    flex: 1, 
    backgroundColor: 'white', 
    borderRadius: 22, 
    padding: 18, 
    flexDirection: 'row', 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2
  },
  infoContent: { flex: 1 },
  subjectText: { fontSize: 17, fontWeight: '900', color: COLORS.textMain, marginBottom: 4 },
  classRow: { flexDirection: 'row', alignItems: 'center' },
  classText: { fontSize: 13, color: COLORS.textSub, marginLeft: 4, fontWeight: '700' },
  trashBtn: { padding: 10, backgroundColor: '#FFF1F2', borderRadius: 12 },

  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: COLORS.textSub, marginTop: 15, fontWeight: '700', fontSize: 15 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 35, borderTopRightRadius: 35, padding: 25, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  modalTitle: { fontSize: 22, fontWeight: '900', color: COLORS.textMain },

  formGroup: { marginBottom: 18 },
  inputLabel: { fontSize: 12, fontWeight: '800', color: COLORS.textSub, marginBottom: 8, textTransform: 'uppercase' },
  input: { backgroundColor: COLORS.bg, padding: 16, borderRadius: 16, fontSize: 15, fontWeight: '700', color: COLORS.textMain, borderWidth: 1, borderColor: '#EDF2F7' },
  
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  timePickerBtn: { flex: 0.47, backgroundColor: COLORS.bg, padding: 16, borderRadius: 16, borderLeftWidth: 4, borderLeftColor: COLORS.primary },
  timeValueText: { fontSize: 18, fontWeight: '900', color: COLORS.primary, marginTop: 4 },

  saveButton: { backgroundColor: COLORS.primary, padding: 18, borderRadius: 20, alignItems: 'center', marginTop: 10, elevation: 4 },
  saveButtonText: { color: 'white', fontSize: 16, fontWeight: '900' }
});
