// import React from "react";
// import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
// import { useRouter } from "expo-router";

// export default function FacultyLogin() {
//   const router = useRouter();

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Faculty Login</Text>
//       <Text style={styles.subtitle}>Welcome back!</Text>

//       {/* Phone Number Input */}
//       <TextInput
//         style={styles.input}
//         placeholder="Enter Phone Number"
//         keyboardType="phone-pad"
//         placeholderTextColor="#555"
//       />

//       {/* Password Input */}
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         secureTextEntry
//         placeholderTextColor="#555"
//       />

//       {/* Forgot Password */}
//       <TouchableOpacity>
//         <Text style={styles.forgot}>Forgot Password?</Text>
//       </TouchableOpacity>

//       {/* Login Button */}
//       <TouchableOpacity
//         style={styles.loginButton}
//         onPress={() => router.push("/Faculty/FacultyHomepage")}
//       >
//         <Text style={styles.loginText}>Login</Text>
//       </TouchableOpacity>

      

      
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#fff" },
//   title: { fontSize: 30, fontWeight: "bold", color: "#146ED7", textAlign: "center", marginBottom: 15},
//   subtitle: { fontSize: 18, textAlign: "center", marginBottom: 60 },
//   input: {
//     backgroundColor: "#E6F0FF",
//     padding: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#146ED7",
//     marginBottom: 30,
//     height: 50
//   },
//   forgot: { color: "#146ED7", fontSize: 12, textAlign: "right", marginBottom: 20 },
//   loginButton: { backgroundColor: "#146ED7", paddingVertical: 12, borderRadius: 8 , marginTop: 20},
//   loginText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "bold" },
//   orText: { textAlign: "center", marginVertical: 10, color: "#777" },
//   createAccount: { textAlign: "center", color: "#000", fontSize: 14 },
// });





import { useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { db } from "../../firebase"; // adjust path if needed

export default function FacultyLogin() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert("Error", "Please enter phone number and password");
      return;
    }

    setLoading(true);

    try {
      // Convert phone input to number
      const phoneNumber = Number(phone);

      // Query faculty collection by phone field
      const q = query(collection(db, "faculty"), where("phone", "==", phoneNumber));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert("Error", "Faculty not found");
        return;
      }

      const facultyData = querySnapshot.docs[0].data();

      if (facultyData.password !== password) {
        Alert.alert("Error", "Incorrect password");
        return;
      }

      // Successful login
      Alert.alert("Success", `Welcome ${facultyData.name}!`);
      router.push("/Faculty/FacultyHomepage");

    } catch (error) {
      console.error("Faculty Login Error:", error);
      Alert.alert("Login Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Faculty Login</Text>
      <Text style={styles.subtitle}>Welcome back!</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Phone Number"
        keyboardType="phone-pad"
        placeholderTextColor="#555"
        value={phone}
        onChangeText={setPhone}
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

      <TouchableOpacity
        style={[styles.loginButton, loading && { opacity: 0.6 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.loginText}>{loading ? "Logging in..." : "Login"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#fff" },
  title: { fontSize: 30, fontWeight: "bold", color: "#146ED7", textAlign: "center", marginBottom: 15 },
  subtitle: { fontSize: 18, textAlign: "center", marginBottom: 60 },
  input: {
    backgroundColor: "#E6F0FF",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#146ED7",
    marginBottom: 30,
    height: 50
  },
  forgot: { color: "#146ED7", fontSize: 12, textAlign: "right", marginBottom: 20 },
  loginButton: { backgroundColor: "#146ED7", paddingVertical: 12, borderRadius: 8, marginTop: 20 },
  loginText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "bold" },
});
