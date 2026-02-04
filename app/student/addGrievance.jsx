import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  Switch,
} from "react-native";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { useRouter } from "expo-router";

export default function AddGrievance() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !category.trim()) {
      Alert.alert("All fields are required");
      return;
    }

    const saved = await AsyncStorage.getItem("student");
    const student = saved ? JSON.parse(saved) : null;

    await addDoc(collection(db, "grievances"), {
      title,
      description,
      category,
      isAnonymous,
      studentName: isAnonymous ? "Anonymous" : student?.name,
      studentId: student?.prn,   // 🔥 always store
      status: "Pending",
      createdAt: serverTimestamp(),
    });

    Alert.alert("Grievance Submitted!");
    router.back();
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Title"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        placeholder="Description"
        style={[styles.input, { height: 100 }]}
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <TextInput
        placeholder="Category (e.g. Infrastructure, Faculty, Exam)"
        style={styles.input}
        value={category}
        onChangeText={setCategory}
      />

      <View style={styles.row}>
        <Text>Submit Anonymously</Text>
        <Switch value={isAnonymous} onValueChange={setIsAnonymous} />
      </View>

      <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
        <Text style={{ color: "#fff", fontWeight: "700" }}>
          Submit Grievance
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F9FBFF" },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  btn: {
    backgroundColor: "#146ED7",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
});
