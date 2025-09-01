// import React from "react";
// import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
// import { useRouter } from "expo-router";

// export default function Login() {
//   const router = useRouter();

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Login here</Text>
//       <Text style={styles.subtitle}>Welcome back! Let’s continue your journey….</Text>

//       <TextInput style={styles.input} placeholder="Enter PRN" placeholderTextColor="#555" />
//       <TextInput style={styles.input} placeholder="Password" secureTextEntry placeholderTextColor="#555" />

//       <TouchableOpacity>
//         <Text style={styles.forgot}>Forgot Password?</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.loginButton} onPress={() => router.push("/student/homePage")}>
//         <Text style={styles.loginText}>Login</Text>
//       </TouchableOpacity>

//       <Text style={styles.orText}>OR</Text>

//       <TouchableOpacity onPress={() => router.push("/student/register")}>
//         <Text style={styles.createAccount}>Create new account</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#fff" },
//   title: { fontSize: 24, fontWeight: "bold", color: "#2d6eefff", textAlign: "center", marginBottom: 5 },
//   subtitle: { fontSize: 14, textAlign: "center", marginBottom: 80, marginTop : 2},
//   input: { backgroundColor: "#E6F0FF", padding: 16, borderRadius: 8, borderWidth: 1, borderColor: "#2d6eefff", marginBottom: 25 },
//   forgot: { color: "#2d6eefff", fontSize: 12, textAlign: "right", marginBottom: 20 },
//   loginButton: { backgroundColor: "#2d6eefff", paddingVertical: 12, borderRadius: 8 },
//   loginText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "bold" },
//   orText: { textAlign: "center", marginVertical: 10, color: "#777" },
//   createAccount: { textAlign: "center", color: "#000", fontSize: 14 },
// });


























import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { db } from "../../firebase";

export default function Login() {
  const router = useRouter();
  const [prn, setPrn] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!prn || !password) {
      Alert.alert("Error", "Please enter PRN and password");
      return;
    }

    try {
      // Fetch the student document by PRN
      const studentRef = doc(db, "students", prn);
      const studentSnap = await getDoc(studentRef);

      if (!studentSnap.exists()) {
        Alert.alert("Error", "PRN not found");
        return;
      }

      const studentData = studentSnap.data();

      if (studentData.password !== password) {
        Alert.alert("Error", "Incorrect password");
        return;
      }

      // Login successful
      Alert.alert("Success", `Welcome ${studentData.name}!`);
      router.push("/student/homePage");

    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert("Login Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login here</Text>
      <Text style={styles.subtitle}>Welcome back! Let’s continue your journey….</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter PRN"
        placeholderTextColor="#555"
        value={prn}
        onChangeText={setPrn}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        placeholderTextColor="#555"
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>OR</Text>

      <TouchableOpacity onPress={() => router.push("/student/register")}>
        <Text style={styles.createAccount}>Create new account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", color: "#2d6eefff", textAlign: "center", marginBottom: 5 },
  subtitle: { fontSize: 14, textAlign: "center", marginBottom: 80, marginTop: 2 },
  input: { backgroundColor: "#E6F0FF", padding: 16, borderRadius: 8, borderWidth: 1, borderColor: "#2d6eefff", marginBottom: 25 },
  forgot: { color: "#2d6eefff", fontSize: 12, textAlign: "right", marginBottom: 20 },
  loginButton: { backgroundColor: "#2d6eefff", paddingVertical: 12, borderRadius: 8 },
  loginText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "bold" },
  orText: { textAlign: "center", marginVertical: 10, color: "#777" },
  createAccount: { textAlign: "center", color: "#000", fontSize: 14 },
});
