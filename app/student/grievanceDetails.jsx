import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { db } from "../../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteDoc } from "firebase/firestore";



export default function GrievanceDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [student, setStudent] = useState(null);

useEffect(() => {
  const load = async () => {
    const saved = await AsyncStorage.getItem("student");
    if (saved) setStudent(JSON.parse(saved));
  };
  load();
}, []);


  useEffect(() => {
    const unsub = onSnapshot(doc(db, "grievances", id), (snap) => {
      setData(snap.data());
    });

    return () => unsub();
  }, [id]);

  if (!data) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{data.title}</Text>

      <Text style={styles.label}>Category:</Text>
      <Text style={styles.value}>{data.category}</Text>

      <Text style={styles.label}>Description:</Text>
      <Text style={styles.value}>{data.description}</Text>

      <Text style={styles.label}>Status:</Text>
      <Text style={[
        styles.value,
        { color: getStatusColor(data.status), fontWeight: "bold" }
      ]}>
        {data.status}
      </Text>

      {!data.isAnonymous && (
        <>
          <Text style={styles.label}>Raised by:</Text>
          <Text style={styles.value}>{data.studentName}</Text>
        </>
      )}

      {data.status === "Resolved" &&
 data.awaitingStudentConfirmation &&
 student?.prn === data.studentId && (
  <TouchableOpacity
    style={styles.confirmBtn}
    onPress={async () => {
      await deleteDoc(doc(db, "grievances", id));
      Alert.alert("Thank you! Grievance closed.");
      router.back();
    }}
  >
    <Text style={{ color: "#fff", fontWeight: "bold" }}>
      Confirm Issue Resolved
    </Text>
  </TouchableOpacity>
)}


      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={{ color: "#fff" }}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "red";
    case "In Review":
      return "orange";
    case "Resolved":
      return "green";
    default:
      return "black";
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F9FBFF" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  label: { marginTop: 10, fontWeight: "600" },
  value: { marginTop: 4 },
  backBtn: {
    marginTop: 25,
    backgroundColor: "#146ED7",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmBtn: {
  marginTop: 20,
  backgroundColor: "green",
  padding: 14,
  borderRadius: 10,
  alignItems: "center",
},

});
