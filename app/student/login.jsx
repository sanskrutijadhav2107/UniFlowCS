import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login here</Text>
      <Text style={styles.subtitle}>Welcome back! Let’s continue your journey….</Text>

      <TextInput style={styles.input} placeholder="Enter PRN" placeholderTextColor="#555" />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry placeholderTextColor="#555" />

      <TouchableOpacity>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={() => router.push("/student/home")}>
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
  title: { fontSize: 24, fontWeight: "bold", color: "#146ED7", textAlign: "center", marginBottom: 5 },
  subtitle: { fontSize: 14, textAlign: "center", marginBottom: 20 },
  input: { backgroundColor: "#E6F0FF", padding: 12, borderRadius: 8, borderWidth: 1, borderColor: "#146ED7", marginBottom: 15 },
  forgot: { color: "#146ED7", fontSize: 12, textAlign: "right", marginBottom: 20 },
  loginButton: { backgroundColor: "#146ED7", paddingVertical: 12, borderRadius: 8 },
  loginText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "bold" },
  orText: { textAlign: "center", marginVertical: 10, color: "#777" },
  createAccount: { textAlign: "center", color: "#000", fontSize: 14 },
});
