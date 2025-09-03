import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { db } from "../../firebase";

export default function AddFaculty() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [education, setEducation] = useState("");
  const [password, setPassword] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");

  // fetch subjects from Firestore
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const snap = await getDocs(collection(db, "subjects"));
        const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setSubjects(list);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        Alert.alert("Error", "Could not fetch subjects");
      }
    };
    fetchSubjects();
  }, []);

  // Add Faculty + Assign Subject
  const handleAddFaculty = async () => {
  if (!name || !email || !phone || !education || !password || !selectedSubject) {
    Alert.alert("Error", "Please fill all fields");
    return;
  }

  try {
    // Add Faculty
    const facultyRef = await addDoc(collection(db, "faculty"), {
      name,
      email,
      phone,
      education,
      password,
      role: "faculty",
      createdAt: serverTimestamp(),
    });

    // Dynamic academic year
    const getAcademicYear = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      return month >= 6 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
    };

    // Assign Subject
    await addDoc(collection(db, "facultyAssignments"), {
      facultyId: facultyRef.id,
      facultyName: name,
      subjectId: selectedSubject,
      subjectName: subjects.find((s) => s.id === selectedSubject)?.name || "",
      academicYear: getAcademicYear(),
      createdAt: serverTimestamp(),
    });

    Alert.alert("Success", "Faculty added and subject assigned ✅");
    router.back(); // go back to ManageFaculty
  } catch (error) {
    console.error("Error adding faculty:", error);
    Alert.alert("Error", error.message);
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Faculty</Text>

      <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Education (e.g. PHD, MTech)" value={education} onChangeText={setEducation} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

      {/* Subject Picker */}
      <View style={styles.pickerWrapper}>
        <Text style={styles.pickerLabel}>Assign Subject:</Text>
        <Picker selectedValue={selectedSubject} onValueChange={setSelectedSubject} style={styles.picker}>
          <Picker.Item label="Select Subject" value="" />
          {subjects.map((subj) => (
            <Picker.Item key={subj.id} label={subj.name} value={subj.id} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleAddFaculty}>
        <Text style={styles.buttonText}>Save Faculty</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#fff", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "bold", color: "#2d6eefff", textAlign: "center", marginBottom: 20 },
  input: {
    backgroundColor: "#E6F0FF",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2d6eefff",
    marginBottom: 15,
  },
  pickerWrapper: { marginBottom: 20 },
  pickerLabel: { fontSize: 14, fontWeight: "500", marginBottom: 5 },
  picker: { backgroundColor: "#E6F0FF", borderRadius: 8 },
  button: { backgroundColor: "#2d6eefff", paddingVertical: 14, borderRadius: 8, marginTop: 10 },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "bold" },
});
