// app/Admin/AddFaculty.jsx
import React, { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import {
  setDoc,
  doc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../firebase";

export default function AddFaculty() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [education, setEducation] = useState("");
  const [password, setPassword] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [year, setYear] = useState(""); // 1 / 2 / 3
  const [loadingSubjects, setLoadingSubjects] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoadingSubjects(true);
        const snap = await getDocs(collection(db, "subjects"));
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setSubjects(list);
      } catch (err) {
        console.error("Error fetching subjects:", err);
        Alert.alert("Error", "Could not fetch subjects. Check Firestore rules & network.");
      } finally {
        setLoadingSubjects(false);
      }
    };

    fetchSubjects();
  }, []);

  const normalizePhone = (raw) => {
    const digits = raw.replace(/\D/g, "");
    if (digits.length > 10) return digits.slice(-10);
    return digits;
  };

  const handleAddFaculty = async () => {
    try {
      const phoneStr = normalizePhone(phone);
      if (!name.trim() || !email.trim() || !phoneStr || !education.trim() || !password) {
        Alert.alert("Validation", "Please fill all fields.");
        return;
      }
      if (phoneStr.length !== 10) {
        Alert.alert("Validation", "Phone must be 10 digits.");
        return;
      }
      if (!selectedSubject) {
        Alert.alert("Validation", "Please choose a subject.");
        return;
      }
      if (!["1", "2", "3"].includes(String(year))) {
        Alert.alert("Validation", "Year must be 1, 2 or 3.");
        return;
      }

      const phoneDocId = phoneStr; // string doc id
      const phoneNumber = Number(phoneStr); // numeric field

      // Faculty doc
      await setDoc(
        doc(db, "faculty", phoneDocId),
        {
          name: name.trim(),
          email: email.trim(),
          phone: phoneNumber,
          education: education.trim(),
          password,
          role: "faculty",
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      // Faculty assignment doc
      const assignmentDocId = `${phoneDocId}_${selectedSubject}`;
      await setDoc(
        doc(db, "facultyAssignments", assignmentDocId),
        {
          facultyId: phoneDocId,
          facultyName: name.trim(),
          subjectId: selectedSubject,
          subjectName: subjects.find((s) => s.id === selectedSubject)?.name || "",
          year: Number(year),
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      Alert.alert("Success", "Faculty added and subject assigned ✅");
      router.back();
    } catch (err) {
      console.error("AddFaculty error:", err);
      Alert.alert("Error", err.message || "Could not add faculty");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Faculty</Text>

      <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Phone Number (10 digits)" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Education" value={education} onChangeText={setEducation} />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="Year (1 / 2 / 3)" value={year} onChangeText={setYear} keyboardType="numeric" />

      <View style={styles.pickerWrapper}>
        <Text style={styles.pickerLabel}>Assign Subject:</Text>
        <View style={styles.picker}>
          <Picker selectedValue={selectedSubject} onValueChange={(v) => setSelectedSubject(v)}>
            <Picker.Item label={loadingSubjects ? "Loading subjects..." : "Select subject"} value="" />
            {subjects.map((s) => (
              <Picker.Item key={s.id} label={`${s.name} (${s.id})`} value={s.id} />
            ))}
          </Picker>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleAddFaculty}>
        <Text style={styles.buttonText}>Save Faculty & Assign Subject</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "700", color: "#2d6eefff", textAlign: "center", marginBottom: 24 },
  input: {
    backgroundColor: "#E6F0FF",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2d6eefff",
    marginBottom: 12,
  },
  pickerWrapper: { marginBottom: 16 },
  pickerLabel: { fontSize: 14, fontWeight: "600", marginBottom: 6 },
  picker: { backgroundColor: "#E6F0FF", borderRadius: 8 },
  button: { backgroundColor: "#2d6eefff", paddingVertical: 14, borderRadius: 8, marginTop: 8 },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "700" },
});