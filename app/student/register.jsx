import { useRouter } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { db } from "../../firebase";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [prn, setPrn] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (!name || !prn || !year || !semester || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      // Save all student details in Firestore including password
      await setDoc(doc(db, "students", prn), {   // using PRN as document ID
        role: "student",
        prn,
        name,
        year,
        semester,
        linkedin,
        password,
        confirmPassword,
        createdAt: new Date().toISOString(),
      });

      Alert.alert("Success", "Account created successfully 🎉");
      router.push("/student/login"); // go to login page
    } catch (error) {
      console.error("Registration Error: ", error);
      Alert.alert("Registration Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="PRN" value={prn} onChangeText={setPrn} />
      <TextInput style={styles.input} placeholder="Year" value={year} onChangeText={setYear} />
      <TextInput style={styles.input} placeholder="Semester" value={semester} onChangeText={setSemester} />
      <TextInput style={styles.input} placeholder="LinkedIn ID" value={linkedin} onChangeText={setLinkedin} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/student/login")}>
        <Text style={styles.haveAccount}>Already have account?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", color: "#146ED7", textAlign: "center", marginBottom: 20 },
  input: { backgroundColor: "#E6F0FF", padding: 12, borderRadius: 8, borderWidth: 1, borderColor: "#146ED7", marginBottom: 15 },
  registerButton: { backgroundColor: "#146ED7", paddingVertical: 12, borderRadius: 8, marginTop: 10 },
  registerText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "bold" },
  haveAccount: { textAlign: "center", color: "#146ED7", fontSize: 14, marginTop: 15 },
});
