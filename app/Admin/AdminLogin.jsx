// import React from "react";
// import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
// import { useRouter } from "expo-router";

// export default function AdminLogin() {
//   const router = useRouter();

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Admin Login</Text>
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
//         onPress={() => router.push("/Admin/AdminHome")}
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



// import { useRouter } from "expo-router";
// import { collection, getDocs, query, where } from "firebase/firestore";
// import { useState } from "react";
// import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View , Image} from "react-native";
// import { db } from "../../firebase";

// export default function AdminLogin() {
//   const router = useRouter();
//   const [phone, setPhone] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async () => {
//   if (!phone || !password) {
//     Alert.alert("Error", "Please enter phone number and password");
//     return;
//   }

//   setLoading(true);

//   try {
//     // Convert phone input to number for Firestore
//     const phoneNumber = Number(phone);

//     const q = query(collection(db, "admin"), where("phone", "==", phoneNumber));
//     const querySnapshot = await getDocs(q);

//     if (querySnapshot.empty) {
//       Alert.alert("Error", "Admin not found");
//       return;
//     }

//     const adminData = querySnapshot.docs[0].data();

//     if (adminData.password !== password) {
//       Alert.alert("Error", "Incorrect password");
//       return;
//     }

//     // if (adminData.role !== "admin") {
//     //   Alert.alert("Error", "User is not an admin");
//     //   return;
//     // }

//     Alert.alert("Success", `Welcome ${adminData.name}!`);
//     router.push("/Admin/AdminHome");

//   } catch (error) {
//     console.error("Admin Login Error:", error);
//     Alert.alert("Login Error", error.message);
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <View style={styles.container}>
//       <Image 
//             source={require("../../assets/images/uniflowcs.png")} 
//             style={styles.logo} 
//             resizeMode="contain"
//           />
//       <Text style={styles.title}>Admin Login</Text>
//       <Text style={styles.subtitle}>Welcome back!</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Enter Phone Number"
//         keyboardType="phone-pad"
//         placeholderTextColor="#555"
//         value={phone}
//         onChangeText={setPhone}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         secureTextEntry
//         placeholderTextColor="#555"
//         value={password}
//         onChangeText={setPassword}
//       />

//       <TouchableOpacity>
//         <Text style={styles.forgot}>Forgot Password?</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={[styles.loginButton, loading && { opacity: 0.6 }]}
//         onPress={handleLogin}
//         disabled={loading}
//       >
//         <Text style={styles.loginText}>{loading ? "Logging in..." : "Login"}</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, justifyContent: "flex-start", backgroundColor: "#fff" },
//   title: { fontSize: 30, fontWeight: "bold", color: "#146ED7", textAlign: "center", marginBottom: 15 },
//   subtitle: { fontSize: 18, textAlign: "center", marginBottom: 40 },
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
//   loginButton: { backgroundColor: "#146ED7", paddingVertical: 12, borderRadius: 8, marginTop: 20 },
//   loginText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "bold" },
//    logo: {
//   width: 120,   // adjust as per your logo size
//   height: 120,
//   alignSelf: "center",
//  marginBottom: 10, // increase this number to push "Login here" further down
//   marginTop: 40,
// },
// });











import { useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // ✅ for icons
import { db } from "../../firebase";

export default function AdminLogin() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁️ toggle state
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert("Error", "Please enter phone number and password");
      return;
    }

    if (phone.length !== 10) {
      Alert.alert("Error", "Phone number must be exactly 10 digits");
      return;
    }

    setLoading(true);

    try {
      const phoneNumber = Number(phone);

      const q = query(collection(db, "admin"), where("phone", "==", phoneNumber));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert("Error", "Admin not found");
        return;
      }

      const adminData = querySnapshot.docs[0].data();

      if (adminData.password !== password) {
        Alert.alert("Error", "Incorrect password");
        return;
      }

      Alert.alert("Success", `Welcome ${adminData.name}!`);
      router.push("/Admin/AdminHome");

    } catch (error) {
      console.error("Admin Login Error:", error);
      Alert.alert("Login Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require("../../assets/images/uniflowcs.png")} 
        style={styles.logo} 
        resizeMode="contain"
      />
      <Text style={styles.title}>Admin Login</Text>
      <Text style={styles.subtitle}>Welcome back!</Text>

      {/* Phone Input with Icon */}
      <View style={styles.inputRow}>
        <Ionicons name="call-outline" size={20} color="#146ED7" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Enter Phone Number"
          keyboardType="numeric"
          maxLength={10}
          placeholderTextColor="#555"
          value={phone}
          onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ""))} // only digits
        />
      </View>

      {/* Password Input with Icon + Eye Toggle */}
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
  container: { flex: 1, padding: 20, justifyContent: "flex-start", backgroundColor: "#fff" },
  title: { fontSize: 30, fontWeight: "bold", color: "#146ED7", textAlign: "center", marginBottom: 15 },
  subtitle: { fontSize: 18, textAlign: "center", marginBottom: 40 },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6F0FF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#146ED7",
    marginBottom: 25,
    paddingHorizontal: 10,
    height: 50,
  },
  icon: { marginRight: 8 },
  input: { flex: 1, fontSize: 16, color: "#000" },

  forgot: { color: "#146ED7", fontSize: 12, textAlign: "right", marginBottom: 20 },
  loginButton: { backgroundColor: "#146ED7", paddingVertical: 12, borderRadius: 8, marginTop: 20 },
  loginText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "bold" },

  logo: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginBottom: 10,
    marginTop: 40,
  },
});
