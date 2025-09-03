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





// import { useRouter } from "expo-router";
// import { doc, getDoc } from "firebase/firestore";
// import { useState } from "react";
// import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from "react-native";
// import { Ionicons } from "@expo/vector-icons";  // ✅ icons
// import { db } from "../../firebase";

// export default function Login() {
//   const router = useRouter();
//   const [prn, setPrn] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false); 

//   const handleLogin = async () => {


//     if (prn.length !== 14) {
//   Alert.alert("Error", "PRN must be exactly 14 digits");
//   return;
// }

//     if (!prn || !password) {
//       Alert.alert("Error", "Please enter PRN and password");
//       return;
//     }

//     try {
//       const studentRef = doc(db, "students", prn);
//       const studentSnap = await getDoc(studentRef);

//       if (!studentSnap.exists()) {
//         Alert.alert("Error", "PRN not found");
//         return;
//       }

//       const studentData = studentSnap.data();

//       if (studentData.password !== password) {
//         Alert.alert("Error", "Incorrect password");
//         return;
//       }

//       Alert.alert("Success", `Welcome ${studentData.name}!`);
//       router.push("/student/homePage");
//     } catch (error) {
//       console.error("Login Error:", error);
//       Alert.alert("Login Error", error.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Image 
//         source={require("../../assets/images/uniflowcs.png")} 
//         style={styles.logo} 
//         resizeMode="contain"
//       />
//       <Text style={styles.title}>Login here</Text>
//       <Text style={styles.subtitle}>Welcome back! Let’s continue your journey….</Text>

//       {/* PRN Input with icon */}
//       <View style={styles.inputRow}>
//         <Ionicons name="id-card-outline" size={20} color="#2d6eefff" style={styles.icon} />
//         <TextInput
//           style={styles.input}
//           placeholder="Enter PRN"
//           placeholderTextColor="#555"
//           value={prn}
//           keyboardType="numeric"
//           maxLength={14}
//           onChangeText={(text) => setPrn(text.replace(/[^0-9]/g, ""))} // ✅ only digits
//         />
//       </View>



//          {/* Password Input with Icon + Eye Toggle */}
//       <View style={styles.inputRow}>
//         <Ionicons name="lock-closed-outline" size={20} color="#146ED7" style={styles.icon} />
//         <TextInput
//           style={styles.input}
//           placeholder="Password"
//           secureTextEntry={!showPassword}
//           placeholderTextColor="#555"
//           value={password}
//           onChangeText={setPassword}
//         />
//         <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//           <Ionicons
//             name={showPassword ? "eye-off-outline" : "eye-outline"}
//             size={20}
//             color="#146ED7"
//           />
//         </TouchableOpacity>
//       </View>


//       <TouchableOpacity>
//         <Text style={styles.forgot}>Forgot Password?</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
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
//   container: { flex: 1, padding: 20, justifyContent: "flex-start", backgroundColor: "#fff" },
//   title: { fontSize: 24, fontWeight: "bold", color: "#2d6eefff", textAlign: "center", marginBottom: 5 },
//   subtitle: { fontSize: 14, textAlign: "center", marginBottom: 40, marginTop: 2 },

//   // Input row with icon
//   inputRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#E6F0FF",
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#2d6eefff",
//     marginBottom: 25,
//     paddingHorizontal: 10,
//   },
//   icon: { marginRight: 8 },
//   input: { flex: 1, padding: 14, fontSize: 14 },

//   forgot: { color: "#2d6eefff", fontSize: 12, textAlign: "right", marginBottom: 20 },
//   loginButton: { backgroundColor: "#2d6eefff", paddingVertical: 12, borderRadius: 8 },
//   loginText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "bold" },
//   orText: { textAlign: "center", marginVertical: 10, color: "#777" },
//   createAccount: { textAlign: "center", color: "#000", fontSize: 14 },

//   logo: {
//     width: 120,
//     height: 120,
//     alignSelf: "center",
//     marginBottom: 10,
//     marginTop: 40,
//   },
// });
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ add
import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../firebase";

export default function Login() {
  const router = useRouter();
  const [prn, setPrn] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (prn.length !== 14) {
      Alert.alert("Error", "PRN must be exactly 14 digits");
      return;
    }

    if (!prn || !password) {
      Alert.alert("Error", "Please enter PRN and password");
      return;
    }

    try {
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

      // ✅ Save user in AsyncStorage for homepage use
      await AsyncStorage.setItem(
        "currentUser",
        JSON.stringify({ prn, ...studentData })
      );

      Alert.alert("Success", `Welcome ${studentData.name}!`);
      router.push("/student/homePage");
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert("Login Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/uniflowcs.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Login here</Text>
      <Text style={styles.subtitle}>
        Welcome back! Let’s continue your journey…
      </Text>

      {/* PRN Input */}
      <View style={styles.inputRow}>
        <Ionicons name="id-card-outline" size={20} color="#2d6eefff" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Enter PRN"
          placeholderTextColor="#555"
          value={prn}
          keyboardType="numeric"
          maxLength={14}
          onChangeText={(text) => setPrn(text.replace(/[^0-9]/g, ""))}
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputRow}>
        <Ionicons name="lock-closed-outline" size={20} color="#146ED7" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!showPassword}
          placeholderTextColor="#555"
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#146ED7"
          />
        </TouchableOpacity>
      </View>

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
  container: { flex: 1, padding: 20, justifyContent: "flex-start", backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", color: "#2d6eefff", textAlign: "center", marginBottom: 5 },
  subtitle: { fontSize: 14, textAlign: "center", marginBottom: 40, marginTop: 2 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6F0FF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2d6eefff",
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  icon: { marginRight: 8 },
  input: { flex: 1, padding: 14, fontSize: 14 },
  forgot: { color: "#2d6eefff", fontSize: 12, textAlign: "right", marginBottom: 20 },
  loginButton: { backgroundColor: "#2d6eefff", paddingVertical: 12, borderRadius: 8 },
  loginText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "bold" },
  orText: { textAlign: "center", marginVertical: 10, color: "#777" },
  createAccount: { textAlign: "center", color: "#000", fontSize: 14 },
  logo: { width: 120, height: 120, alignSelf: "center", marginBottom: 10, marginTop: 40 },
});
