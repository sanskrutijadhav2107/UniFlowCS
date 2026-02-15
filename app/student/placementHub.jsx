import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking,
} from "react-native";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../../firebase";
import BottomNavbar from "./components/BottomNavbar";

export default function PlacementHub() {
  const [student, setStudent] = useState(null);
  const [opportunities, setOpportunities] = useState([]);

  // ✅ Load student info
  useEffect(() => {
    const loadStudent = async () => {
      const saved = await AsyncStorage.getItem("student");
      if (saved) setStudent(JSON.parse(saved));
    };
    loadStudent();
  }, []);

  // ✅ Load and filter opportunities
  useEffect(() => {
    if (!student?.semester) return;

    const q = query(
      collection(db, "opportunities"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const all = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // 🔥 Filter by eligibility
      const filtered = all.filter((opp) =>
        opp.eligibleSemesters?.includes(student.semester)
      );

      setOpportunities(filtered);
    });

    return () => unsub();
  }, [student]);

  const openLink = (url) => {
    Linking.openURL(url);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>

      <Text style={styles.company}>
        {item.company} • {item.type}
      </Text>

      <Text style={styles.description}>
        {item.description}
      </Text>

      <Text style={styles.deadline}>
        Deadline: {item.deadline}
      </Text>

      <TouchableOpacity
        style={styles.applyBtn}
        onPress={() => openLink(item.applyLink)}
      >
        <Text style={styles.applyText}>Apply Now</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={opportunities}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      <BottomNavbar active="placement" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FBFF",
    padding: 16,
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
  },

  company: {
    marginTop: 4,
    color: "#146ED7",
    fontWeight: "600",
  },

  description: {
    marginTop: 8,
    color: "#444",
  },

  deadline: {
    marginTop: 8,
    color: "red",
    fontWeight: "600",
  },

  applyBtn: {
    marginTop: 12,
    backgroundColor: "#146ED7",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  applyText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
