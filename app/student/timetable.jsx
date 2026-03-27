// import React, { useMemo, useState } from "react";
// import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from "react-native";

// const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

// // Dummy data: exactly 3 lectures + 3 practicals per day
// const RAW = {
//   Mon: [
//     { title: "Operating Systems", type: "Lecture", time: "09:00–10:00", room: "A101" },
//     { title: "DBMS",               type: "Lecture", time: "10:00–11:00", room: "A101" },
//     { title: "DSA",                type: "Lecture", time: "11:00–12:00", room: "A101" },
//     { title: "OS Lab",             type: "Practical", time: "13:00–14:00", room: "Lab-1" },
//     { title: "DB Lab",             type: "Practical", time: "14:00–15:00", room: "Lab-2" },
//     { title: "DSA Lab",            type: "Practical", time: "15:00–16:00", room: "Lab-3" },
//   ],
//   Tue: [
//     { title: "Computer Networks", type: "Lecture", time: "09:00–10:00", room: "B201" },
//     { title: "Software Engg.",    type: "Lecture", time: "10:00–11:00", room: "B201" },
//     { title: "Theory of Comp.",   type: "Lecture", time: "11:00–12:00", room: "B201" },
//     { title: "CN Lab",            type: "Practical", time: "13:00–14:00", room: "Lab-1" },
//     { title: "SE Lab",            type: "Practical", time: "14:00–15:00", room: "Lab-2" },
//     { title: "TOC Lab",           type: "Practical", time: "15:00–16:00", room: "Lab-3" },
//   ],
//   Wed: [
//     { title: "AI",                 type: "Lecture", time: "09:00–10:00", room: "C301" },
//     { title: "Machine Learning",   type: "Lecture", time: "10:00–11:00", room: "C301" },
//     { title: "IoT",                type: "Lecture", time: "11:00–12:00", room: "C301" },
//     { title: "AI Lab",             type: "Practical", time: "13:00–14:00", room: "Lab-1" },
//     { title: "ML Lab",             type: "Practical", time: "14:00–15:00", room: "Lab-2" },
//     { title: "IoT Lab",            type: "Practical", time: "15:00–16:00", room: "Lab-3" },
//   ],
//   Thu: [
//     { title: "Web Tech",           type: "Lecture", time: "09:00–10:00", room: "D401" },
//     { title: "Cyber Security",     type: "Lecture", time: "10:00–11:00", room: "D401" },
//     { title: "Compiler Design",    type: "Lecture", time: "11:00–12:00", room: "D401" },
//     { title: "WT Lab",             type: "Practical", time: "13:00–14:00", room: "Lab-1" },
//     { title: "CNS Lab",            type: "Practical", time: "14:00–15:00", room: "Lab-2" },
//     { title: "CD Lab",             type: "Practical", time: "15:00–16:00", room: "Lab-3" },
//   ],
//   Fri: [
//     { title: "Java",               type: "Lecture", time: "09:00–10:00", room: "E501" },
//     { title: "Python",             type: "Lecture", time: "10:00–11:00", room: "E501" },
//     { title: "Cloud",              type: "Lecture", time: "11:00–12:00", room: "E501" },
//     { title: "Java Lab",           type: "Practical", time: "13:00–14:00", room: "Lab-1" },
//     { title: "Python Lab",         type: "Practical", time: "14:00–15:00", room: "Lab-2" },
//     { title: "Cloud Lab",          type: "Practical", time: "15:00–16:00", room: "Lab-3" },
//   ],
// };

// export default function MinimalTimetable() {
//   const [day, setDay] = useState(getTodayOr("Mon"));
//   const data = useMemo(() => ({ ...RAW }), []);

//   const list = data[day] || [];
//   const lectures = list.filter((x) => x.type === "Lecture");
//   const practicals = list.filter((x) => x.type === "Practical");

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F9FC" }}>
//       <View style={styles.container}>
//         {/* Title */}
//         <Text style={styles.title}>Timetable</Text>
//         <Text style={styles.subtitle}>Simple. Clear. Weekly.</Text>

//         {/* Day selector */}
//         <View style={styles.tabRow}>
//           {DAYS.map((d) => {
//             const active = d === day;
//             return (
//               <TouchableOpacity
//                 key={d}
//                 onPress={() => setDay(d)}
//                 activeOpacity={0.9}
//                 style={[styles.tab, active && styles.tabActive]}
//               >
//                 <Text style={[styles.tabText, active && styles.tabTextActive]}>{d}</Text>
//               </TouchableOpacity>
//             );
//           })}
//         </View>

//         {/* Day summary */}
//         <View style={styles.summary}>
//           <Text style={styles.summaryText}>
//             {day} · {lectures.length} Lectures · {practicals.length} Practicals
//           </Text>
//         </View>

//         {/* Sessions */}
//         <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24 }}>
//           <Section label="Lectures" />
//           {lectures.map((s, i) => (
//             <Row key={`lec-${i}`} title={s.title} time={s.time} room={s.room} variant="lec" />
//           ))}

//           <Section label="Practicals" top={16} />
//           {practicals.map((s, i) => (
//             <Row key={`prac-${i}`} title={s.title} time={s.time} room={s.room} variant="prac" />
//           ))}
//         </ScrollView>
//       </View>
//     </SafeAreaView>
//   );
// }

// /* ---- tiny components ---- */

// function Section({ label, top }) {
//   return (
//     <View style={{ marginTop: top || 8, marginBottom: 6 }}>
//       <Text style={styles.section}>{label}</Text>
//       <View style={styles.hr} />
//     </View>
//   );
// }

// function Row({ title, time, room, variant }) {
//   const isLecture = variant === "lec";
//   return (
//     <View style={[styles.row]}>
//       <View style={[styles.dot, { backgroundColor: isLecture ? "#1A73E8" : "#0BA36A" }]} />
//       <View style={{ flex: 1 }}>
//         <Text style={styles.rowTitle} numberOfLines={1}>{title}</Text>
//         <Text style={styles.rowMeta}>{time}  •  {room}</Text>
//       </View>
//       <Text style={[styles.tag, isLecture ? styles.tagLec : styles.tagPrac]}>
//         {isLecture ? "Lecture" : "Practical"}
//       </Text>
//     </View>
//   );
// }

// /* ---- helpers ---- */

// function getTodayOr(fallback) {
//   const idx = new Date().getDay(); // 0=Sun..6=Sat
//   const map = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
//   const name = map[idx] || fallback;
//   return DAYS.includes(name) ? name : fallback;
// }

// /* ---- styles ---- */

// const ACCENT = "#1A73E8";
// const TEXT = "#0E1B2A";
// const MUTED = "#6A7A90";
// const LINE = "#E6ECF5";
// const BG = "#F7F9FC";
// const CHIP = "#EFF4FB";

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: BG },

//   title: { fontSize: 22, fontWeight: "800", color: TEXT },
//   subtitle: { fontSize: 12, color: MUTED, marginTop: 2, marginBottom: 10 },

//   tabRow: { flexDirection: "row", marginBottom: 10 },
//   tab: {
//     paddingVertical: 8,
//     paddingHorizontal: 14,
//     borderRadius: 999,
//     borderWidth: 1,
//     borderColor: LINE,
//     backgroundColor: CHIP,
//     marginRight: 8,
//   },
//   tabActive: { backgroundColor: "#E9F2FF", borderColor: "#D6E7FF" },
//   tabText: { color: TEXT, fontWeight: "700", fontSize: 12 },
//   tabTextActive: { color: ACCENT },

//   summary: {
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: LINE,
//     backgroundColor: "#FFFFFF",
//     marginBottom: 6,
//   },
//   summaryText: { color: TEXT, fontWeight: "700" },

//   section: { color: MUTED, fontWeight: "800", fontSize: 11, letterSpacing: 0.2 },
//   hr: { height: 1, backgroundColor: LINE, marginTop: 6, marginBottom: 4, width: "100%" },

//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: LINE,
//   },
//   dot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
//   rowTitle: { color: TEXT, fontWeight: "800", fontSize: 14 },
//   rowMeta: { color: MUTED, fontWeight: "600", fontSize: 12, marginTop: 2 },
//   tag: {
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 999,
//     fontSize: 10,
//     fontWeight: "900",
//     overflow: "hidden",
//   },
//   tagLec: { backgroundColor: "#EAF3FF", color: ACCENT },
//   tagPrac: { backgroundColor: "#E9FFF4", color: "#0BA36A" },
// });










import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo, useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const RAW = {
  Mon: [
    { title: "Operating Systems", type: "Lecture", time: "09:00–10:00", room: "A101" },
    { title: "DBMS",               type: "Lecture", time: "10:00–11:00", room: "A101" },
    { title: "DSA",                type: "Lecture", time: "11:00–12:00", room: "A101" },
    { title: "OS Lab",             type: "Practical", time: "13:00–14:00", room: "Lab-1" },
    { title: "DB Lab",             type: "Practical", time: "14:00–15:00", room: "Lab-2" },
    { title: "DSA Lab",            type: "Practical", time: "15:00–16:00", room: "Lab-3" },
  ],
  Tue: [
    { title: "Computer Networks", type: "Lecture", time: "09:00–10:00", room: "B201" },
    { title: "Software Engg.",    type: "Lecture", time: "10:00–11:00", room: "B201" },
    { title: "Theory of Comp.",   type: "Lecture", time: "11:00–12:00", room: "B201" },
    { title: "CN Lab",            type: "Practical", time: "13:00–14:00", room: "Lab-1" },
    { title: "SE Lab",            type: "Practical", time: "14:00–15:00", room: "Lab-2" },
    { title: "TOC Lab",           type: "Practical", time: "15:00–16:00", room: "Lab-3" },
  ],
  Wed: [
    { title: "AI",                 type: "Lecture", time: "09:00–10:00", room: "C301" },
    { title: "Machine Learning",   type: "Lecture", time: "10:00–11:00", room: "C301" },
    { title: "IoT",                type: "Lecture", time: "11:00–12:00", room: "C301" },
    { title: "AI Lab",             type: "Practical", time: "13:00–14:00", room: "Lab-1" },
    { title: "ML Lab",             type: "Practical", time: "14:00–15:00", room: "Lab-2" },
    { title: "IoT Lab",            type: "Practical", time: "15:00–16:00", room: "Lab-3" },
  ],
  Thu: [
    { title: "Web Tech",           type: "Lecture", time: "09:00–10:00", room: "D401" },
    { title: "Cyber Security",     type: "Lecture", time: "10:00–11:00", room: "D401" },
    { title: "Compiler Design",    type: "Lecture", time: "11:00–12:00", room: "D401" },
    { title: "WT Lab",             type: "Practical", time: "13:00–14:00", room: "Lab-1" },
    { title: "CNS Lab",            type: "Practical", time: "14:00–15:00", room: "Lab-2" },
    { title: "CD Lab",             type: "Practical", time: "15:00–16:00", room: "Lab-3" },
  ],
  Fri: [
    { title: "Java",               type: "Lecture", time: "09:00–10:00", room: "E501" },
    { title: "Python",             type: "Lecture", time: "10:00–11:00", room: "E501" },
    { title: "Cloud",              type: "Lecture", time: "11:00–12:00", room: "E501" },
    { title: "Java Lab",           type: "Practical", time: "13:00–14:00", room: "Lab-1" },
    { title: "Python Lab",         type: "Practical", time: "14:00–15:00", room: "Lab-2" },
    { title: "Cloud Lab",          type: "Practical", time: "15:00–16:00", room: "Lab-3" },
  ],
};

const COLORS = {
  primaryDark: "#1A50C8",
  primary: "#2D6EEF",
  primaryLight: "#60A5FA",
  bg: "#F8FAFF",
  white: "#FFFFFF",
  textMain: "#0F172A",
  textSub: "#64748B",
  lecAccent: "#2D6EEF",
  pracAccent: "#10B981",
};

export default function MinimalTimetable() {
  const [day, setDay] = useState(getTodayOr("Mon"));
  const data = useMemo(() => ({ ...RAW }), []);

  const list = data[day] || [];
  const lectures = list.filter((x) => x.type === "Lecture");
  const practicals = list.filter((x) => x.type === "Practical");

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* CAMPUS BUZZ HEADER */}
      <LinearGradient 
        colors={[COLORS.primaryDark, COLORS.primary, COLORS.primaryLight]} 
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} 
        style={styles.header}
      >
        <SafeAreaView>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>Timetable</Text>
              <Text style={styles.headerSub}>Weekly Schedule • Semester 4</Text>
            </View>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="calendar-clock" size={26} color="white" />
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* DAY SELECTOR - Floating Pill Style */}
      <View style={styles.selectorWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayScroll}>
          {DAYS.map((d) => {
            const active = d === day;
            return (
              <TouchableOpacity
                key={d}
                onPress={() => setDay(d)}
                style={[styles.dayTab, active && styles.dayTabActive]}
              >
                <Text style={[styles.dayText, active && styles.dayTextActive]}>{d}</Text>
                {active && <View style={styles.activeDot} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView 
        style={styles.scroll} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Section label="Academic Lectures" icon="book-open-variant" color={COLORS.lecAccent} />
        {lectures.map((s, i) => (
          <TimetableCard key={`lec-${i}`} data={s} variant="lec" />
        ))}

        <Section label="Practical Sessions" icon="flask-outline" color={COLORS.pracAccent} top={25} />
        {practicals.map((s, i) => (
          <TimetableCard key={`prac-${i}`} data={s} variant="prac" />
        ))}
      </ScrollView>
    </View>
  );
}

/* ---- Sub-Components ---- */

function Section({ label, icon, color, top }) {
  return (
    <View style={[styles.sectionHeader, { marginTop: top || 10 }]}>
      <View style={[styles.sectionIcon, { backgroundColor: color + '15' }]}>
        <MaterialCommunityIcons name={icon} size={16} color={color} />
      </View>
      <Text style={styles.sectionLabel}>{label}</Text>
    </View>
  );
}

function TimetableCard({ data, variant }) {
  const isLec = variant === "lec";
  const accentColor = isLec ? COLORS.lecAccent : COLORS.pracAccent;

  return (
    <View style={styles.card}>
      <View style={[styles.sideIndicator, { backgroundColor: accentColor }]} />
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <Text style={styles.cardTitle}>{data.title}</Text>
          <View style={[styles.typeTag, { backgroundColor: accentColor + '10' }]}>
            <Text style={[styles.typeTagText, { color: accentColor }]}>{data.type}</Text>
          </View>
        </View>
        
        <View style={styles.cardBottom}>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="clock-outline" size={14} color={COLORS.textSub} />
            <Text style={styles.metaText}>{data.time}</Text>
          </View>
          <View style={[styles.metaItem, { marginLeft: 15 }]}>
            <MaterialCommunityIcons name="map-marker-outline" size={14} color={COLORS.textSub} />
            <Text style={styles.metaText}>{data.room}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

/* ---- Helper ---- */

function getTodayOr(fallback) {
  const idx = new Date().getDay();
  const map = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const name = map[idx] || fallback;
  return DAYS.includes(name) ? name : fallback;
}

/* ---- Styles ---- */

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    height: 160,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    justifyContent: 'center',
    elevation: 8,
  },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Platform.OS === 'android' ? 10 : 0 },
  headerTitle: { color: 'white', fontSize: 28, fontWeight: '900', letterSpacing: -0.5 },
  headerSub: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '600' },
  iconCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },

  selectorWrapper: { marginTop: -25, zIndex: 10 },
  dayScroll: { paddingHorizontal: 20, paddingBottom: 10 },
  dayTab: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 10,
    alignItems: 'center',
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
  },
  dayTabActive: { backgroundColor: COLORS.primary },
  dayText: { fontSize: 14, fontWeight: '800', color: COLORS.textSub },
  dayTextActive: { color: COLORS.white },
  activeDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: COLORS.white, marginTop: 4 },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 100 },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sectionIcon: { width: 28, height: 28, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  sectionLabel: { fontSize: 13, fontWeight: '800', color: COLORS.textSub, textTransform: 'uppercase', letterSpacing: 0.5 },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginBottom: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
  },
  sideIndicator: { width: 5 },
  cardBody: { flex: 1, padding: 16 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: COLORS.textMain, flex: 1, marginRight: 10 },
  typeTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  typeTagText: { fontSize: 10, fontWeight: '900' },
  cardBottom: { flexDirection: 'row', alignItems: 'center' },
  metaItem: { flexDirection: 'row', alignItems: 'center' },
  metaText: { fontSize: 12, color: COLORS.textSub, fontWeight: '600', marginLeft: 5 },
});