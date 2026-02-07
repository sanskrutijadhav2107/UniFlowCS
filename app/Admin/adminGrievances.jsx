import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { db } from "../../firebase";

export default function AdminGrievances() {
  const [grievances, setGrievances] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "grievances"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setGrievances(data);
    });

    return () => unsub();
  }, []);

  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, "grievances", id), { status });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "red";
      case "In Review": return "orange";
      case "Resolved": return "green";
      default: return "#146ED7";
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.category}>Category: {item.category}</Text>
      <Text>{item.description}</Text>

      <Text style={styles.by}>
        By: {item.isAnonymous ? "Anonymous" : item.studentName}
      </Text>

      <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
        Status: {item.status}
      </Text>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => updateStatus(item.id, "In Review")}
        >
          <Text style={styles.btnText}>In Review</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "green" }]}
          onPress={async () => {
            await updateDoc(doc(db, "grievances", item.id), {
              status: "Resolved", 
              awaitingStudentConfirmation: true,
            });
          }}

        >
          <Text style={styles.btnText}>Resolved</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Admin Grievance Panel</Text>

      <FlatList
        data={grievances}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F9FBFF" },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  title: { fontWeight: "bold", fontSize: 16 },
  category: { marginTop: 4, color: "#666" },
  by: { marginTop: 4, fontStyle: "italic" },
  status: { marginTop: 6, fontWeight: "bold" },
  row: { flexDirection: "row", marginTop: 10, gap: 10 },
  btn: {
    backgroundColor: "#146ED7",
    padding: 8,
    borderRadius: 8,
  },
  btnText: { color: "#fff" },
});
