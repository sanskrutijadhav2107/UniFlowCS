

// app/Admin/AdminLogin.jsx
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../firebase";

/**
 * AdminLogin
 * - Looks up admin by numeric phone in "admin" collection
 * - Saves admin profile to AsyncStorage under "admin"
 * - (Optional) If admin acts as faculty too, saves same object under "faculty"
 * - Navigates to AdminHome
 */

export default function AdminLogin() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      // basic validations
      if (!phone || !password) {
        Alert.alert("Error", "Please enter phone number and password");
        return;
      }
      const digits = phone.replace(/\D/g, "");
      if (digits.length !== 10) {
        Alert.alert("Error", "Phone number must be exactly 10 digits");
        return;
      }

      setLoading(true);

      const phoneNumber = Number(digits);

      // query admin collection for that phone number
      const q = query(collection(db, "admin"), where("phone", "==", phoneNumber));
      const snap = await getDocs(q);

      if (snap.empty) {
        Alert.alert("Error", "Admin not found. Check phone number.");
        return;
      }

      // take first matched admin doc
      const docSnap = snap.docs[0];
      const adminData = { id: docSnap.id, ...docSnap.data() };

      // password check (in production use proper auth)
      if (adminData.password !== password) {
        Alert.alert("Error", "Incorrect password");
        return;
      }

      // Save admin profile to AsyncStorage for use across app
      // store minimal safe fields; you can store full object if you need
      const profileToSave = {
        id: adminData.id,
        name: adminData.name || "",
        phone: adminData.phone || phoneNumber,
        email: adminData.email || "",
        role: adminData.role || "admin",
        // add whatever fields you need later (designation, subjects etc.)
      };

      await AsyncStorage.setItem("admin", JSON.stringify(profileToSave));

      // Optional: if admin should also be treated as faculty in other parts of the app,
      // save the same profile under "faculty" key so faculty pages will pick it up.
      // Uncomment below if you assign admin as a faculty in 'faculty' collection too.
      // await AsyncStorage.setItem("faculty", JSON.stringify(profileToSave));

      Alert.alert("Success", `Welcome ${profileToSave.name || "Admin"}!`);

      // navigate to AdminHome (replace with the exact route you use)
      router.push("/Admin/AdminHome");
    } catch (err) {
      console.error("Admin Login Error:", err);
      Alert.alert("Login Error", err.message || "Something went wrong");
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

      <View style={styles.inputRow}>
        <Ionicons name="call-outline" size={20} color="#146ED7" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Enter Phone Number"
          keyboardType="numeric"
          maxLength={10}
          placeholderTextColor="#555"
          value={phone}
          onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ""))}
        />
      </View>

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
        <TouchableOpacity onPress={() => setShowPassword((s) => !s)}>
          <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#146ED7" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.loginButton, loading && { opacity: 0.7 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginText}>Login</Text>
        )}
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
    marginBottom: 16,
    paddingHorizontal: 10,
    height: 50,
  },
  icon: { marginRight: 8 },
  input: { flex: 1, fontSize: 16, color: "#000" },

  forgot: { color: "#146ED7", fontSize: 12, textAlign: "right", marginBottom: 12 },
  loginButton: { backgroundColor: "#146ED7", paddingVertical: 12, borderRadius: 8, marginTop: 8 },
  loginText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "bold" },

  logo: { width: 120, height: 120, alignSelf: "center", marginBottom: 10, marginTop: 40 },
});