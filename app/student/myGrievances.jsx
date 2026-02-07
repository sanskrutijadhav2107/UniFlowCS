import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { db } from "../../firebase";
import BottomNavbar from "./components/BottomNavbar";

export default function MyGrievances() {
  const router = useRouter();
  const [grievances, setGrievances] = useState([]);
  const [prn, setPrn] = useState(null);

  // 🔹 Load PRN once from storage
  useEffect(() => {
    const load = async () => {
      const saved = await AsyncStorage.getItem("student");
      if (saved) {
        const parsed = JSON.parse(saved);
        setPrn(parsed.prn);
      }
    };
    load();
  }, []);

  // 🔹 Attach Firebase listener safely (NO infinite loop, NO duplicate listeners)
  useEffect(() => {
    if (!prn) return;

    let unsubscribed = false;

    const q = query(
      collection(db, "grievances"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      if (unsubscribed) return;

      const data = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((g) => g.studentId === prn);

      setGrievances(data);
    });

    return () => {
      unsubscribed = true;
      unsub();
    };
  }, [prn]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "red";
      case "In Review":
        return "orange";
      case "Resolved":
        return "green";
      default:
        return "#146ED7";
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/student/grievanceDetails",
          params: { id: item.id },
        })
      }
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text>{item.description}</Text>
      <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
        Status: {item.status}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FBFF" }}>
      <FlatList
        data={grievances}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
      />

      {/* ➕ Add Grievance Button */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => router.push("/student/addGrievance")}
      >
        <Text style={styles.plus}>＋</Text>
      </TouchableOpacity>

      <BottomNavbar active="grievance" />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: { fontWeight: "bold", marginBottom: 5 },
  status: { marginTop: 8, fontWeight: "600" },
  addBtn: {
    position: "absolute",
    bottom: 90,
    right: 20,
    backgroundColor: "#146ED7",
    width: 55,
    height: 55,
    borderRadius: 27.5,
    justifyContent: "center",
    alignItems: "center",
  },
  plus: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
});
