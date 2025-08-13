// app/index.jsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function LandingPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>UniFlow CS</Text>
      <Text style={styles.tagline}>Track. Learn. Achieve. Repeat</Text>

      {/* Go to Login */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => router.push("/student/login")}
      >
        <Text style={styles.buttonText}>Login as Student
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => router.push("/student/login")}
      >
        <Text style={styles.buttonText}>Login as Administrator</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => router.push("/student/login")}
      >
        <Text style={styles.buttonText}>Login as Faculty</Text>
      </TouchableOpacity>

      {/* Go to Register */}
      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => router.push("/student/register")}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 5, color: "#146ED7" },
  tagline: { fontSize: 16, color: "#333", marginBottom: 20 },
  loginButton: {
    backgroundColor: "#146ED7",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    width: 200,
    alignItems: "center",
  },
  registerButton: {
    backgroundColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    width: 150,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
