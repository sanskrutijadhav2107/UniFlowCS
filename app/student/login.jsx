
// app/student/Login.jsx
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
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
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Basic validations
    const prnTrim = prn.replace(/[^0-9]/g, "");
    if (prnTrim.length !== 14) {
      Alert.alert("Validation", "PRN must be exactly 14 digits.");
      return;
    }
    if (!password) {
      Alert.alert("Validation", "Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      const studentRef = doc(db, "students", prnTrim);
      const studentSnap = await getDoc(studentRef);

      if (!studentSnap.exists()) {
        Alert.alert("Login failed", "PRN not found.");
        return;
      }

      const studentData = studentSnap.data();

      if (studentData.password !== password) {
        Alert.alert("Login failed", "Incorrect password.");
        return;
      }

      // Save the normalized student object to AsyncStorage
      const studentToStore = {
        id: prnTrim,
        prn: prnTrim,
        ...studentData,
      };

      await AsyncStorage.setItem("student", JSON.stringify(studentToStore));

      Alert.alert("Welcome", `Hi ${studentData.name || "Student"}!`);
      router.push("/student/homePage");
    } catch (err) {
      console.error("Login Error:", err);
      Alert.alert("Login Error", err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <Image
        source={require("../../assets/images/uniflowcs.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Student Login</Text>
      <Text style={styles.subtitle}>Welcome back — sign in to continue</Text>

      {/* PRN input */}
      <View style={styles.inputRow}>
        <Ionicons name="id-card-outline" size={20} color="#2d6eefff" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Enter PRN (14 digits)"
          placeholderTextColor="#666"
          value={prn}
          keyboardType="numeric"
          maxLength={14}
          onChangeText={(text) => setPrn(text.replace(/[^0-9]/g, ""))}
          autoCapitalize="none"
          returnKeyType="next"
        />
      </View>

      {/* Password input */}
      <View style={styles.inputRow}>
        <Ionicons name="lock-closed-outline" size={20} color="#2d6eefff" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          returnKeyType="done"
        />
        <TouchableOpacity onPress={() => setShowPassword((s) => !s)}>
          <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#2d6eefff" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.loginButton, loading ? { opacity: 0.7 } : null]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.loginText}>{loading ? "Signing in..." : "Login"}</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>OR</Text>

      <TouchableOpacity onPress={() => router.push("/student/register")}>
        <Text style={styles.createAccount}>Create new account</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "flex-start", backgroundColor: "#fff" },
  logo: { width: 120, height: 120, alignSelf: "center", marginBottom: 10, marginTop: 36 },
  title: { fontSize: 24, fontWeight: "700", color: "#2d6eefff", textAlign: "center", marginBottom: 6 },
  subtitle: { fontSize: 14, textAlign: "center", marginBottom: 24, color: "#555" },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6F0FF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2d6eefff",
    marginBottom: 18,
    paddingHorizontal: 10,
    height: 50,
  },
  icon: { marginRight: 8 },
  input: { flex: 1, fontSize: 15, color: "#000" },

  forgot: { color: "#2d6eefff", fontSize: 12, textAlign: "right", marginBottom: 18 },

  loginButton: { backgroundColor: "#2d6eefff", paddingVertical: 14, borderRadius: 8 },
  loginText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "700" },

  orText: { textAlign: "center", marginVertical: 12, color: "#777" },
  createAccount: { textAlign: "center", color: "#000", fontSize: 14 },
});