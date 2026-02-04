import { collection, onSnapshot, orderBy, query, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { db } from "../../firebase";

export default function FacultyGrievances() {
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
    await updateDoc(doc(db, "grievances", id), {
      status,
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>{item.description}</Text>
      <Text>By: {item.isAnonymous ? "Anonymous" : item.studentName}</Text>
      <Text style={styles.status}>Status: {item.status}</Text>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => updateStatus(item.id, "In Review")}
        >
          <Text style={{ color: "#fff" }}>In Review</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "green" }]}
          onPress={() => updateStatus(item.id, "Resolved")}
        >
          <Text style={{ color: "#fff" }}>Resolved</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
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
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: { fontWeight: "bold", marginBottom: 5 },
  status: { marginTop: 5, fontWeight: "600" },
  row: { flexDirection: "row", marginTop: 10, gap: 10 },
  btn: {
    backgroundColor: "#146ED7",
    padding: 8,
    borderRadius: 8,
  },
});
