import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from "react-native";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

// Dummy data: exactly 3 lectures + 3 practicals per day
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

export default function MinimalTimetable() {
  const [day, setDay] = useState(getTodayOr("Mon"));
  const data = useMemo(() => ({ ...RAW }), []);

  const list = data[day] || [];
  const lectures = list.filter((x) => x.type === "Lecture");
  const practicals = list.filter((x) => x.type === "Practical");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F9FC" }}>
      <View style={styles.container}>
        {/* Title */}
        <Text style={styles.title}>Timetable</Text>
        <Text style={styles.subtitle}>Simple. Clear. Weekly.</Text>

        {/* Day selector */}
        <View style={styles.tabRow}>
          {DAYS.map((d) => {
            const active = d === day;
            return (
              <TouchableOpacity
                key={d}
                onPress={() => setDay(d)}
                activeOpacity={0.9}
                style={[styles.tab, active && styles.tabActive]}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>{d}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Day summary */}
        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            {day} · {lectures.length} Lectures · {practicals.length} Practicals
          </Text>
        </View>

        {/* Sessions */}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24 }}>
          <Section label="Lectures" />
          {lectures.map((s, i) => (
            <Row key={`lec-${i}`} title={s.title} time={s.time} room={s.room} variant="lec" />
          ))}

          <Section label="Practicals" top={16} />
          {practicals.map((s, i) => (
            <Row key={`prac-${i}`} title={s.title} time={s.time} room={s.room} variant="prac" />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

/* ---- tiny components ---- */

function Section({ label, top }) {
  return (
    <View style={{ marginTop: top || 8, marginBottom: 6 }}>
      <Text style={styles.section}>{label}</Text>
      <View style={styles.hr} />
    </View>
  );
}

function Row({ title, time, room, variant }) {
  const isLecture = variant === "lec";
  return (
    <View style={[styles.row]}>
      <View style={[styles.dot, { backgroundColor: isLecture ? "#1A73E8" : "#0BA36A" }]} />
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle} numberOfLines={1}>{title}</Text>
        <Text style={styles.rowMeta}>{time}  •  {room}</Text>
      </View>
      <Text style={[styles.tag, isLecture ? styles.tagLec : styles.tagPrac]}>
        {isLecture ? "Lecture" : "Practical"}
      </Text>
    </View>
  );
}

/* ---- helpers ---- */

function getTodayOr(fallback) {
  const idx = new Date().getDay(); // 0=Sun..6=Sat
  const map = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const name = map[idx] || fallback;
  return DAYS.includes(name) ? name : fallback;
}

/* ---- styles ---- */

const ACCENT = "#1A73E8";
const TEXT = "#0E1B2A";
const MUTED = "#6A7A90";
const LINE = "#E6ECF5";
const BG = "#F7F9FC";
const CHIP = "#EFF4FB";

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: BG },

  title: { fontSize: 22, fontWeight: "800", color: TEXT },
  subtitle: { fontSize: 12, color: MUTED, marginTop: 2, marginBottom: 10 },

  tabRow: { flexDirection: "row", marginBottom: 10 },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: LINE,
    backgroundColor: CHIP,
    marginRight: 8,
  },
  tabActive: { backgroundColor: "#E9F2FF", borderColor: "#D6E7FF" },
  tabText: { color: TEXT, fontWeight: "700", fontSize: 12 },
  tabTextActive: { color: ACCENT },

  summary: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: LINE,
    backgroundColor: "#FFFFFF",
    marginBottom: 6,
  },
  summaryText: { color: TEXT, fontWeight: "700" },

  section: { color: MUTED, fontWeight: "800", fontSize: 11, letterSpacing: 0.2 },
  hr: { height: 1, backgroundColor: LINE, marginTop: 6, marginBottom: 4, width: "100%" },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: LINE,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  rowTitle: { color: TEXT, fontWeight: "800", fontSize: 14 },
  rowMeta: { color: MUTED, fontWeight: "600", fontSize: 12, marginTop: 2 },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 10,
    fontWeight: "900",
    overflow: "hidden",
  },
  tagLec: { backgroundColor: "#EAF3FF", color: ACCENT },
  tagPrac: { backgroundColor: "#E9FFF4", color: "#0BA36A" },
});