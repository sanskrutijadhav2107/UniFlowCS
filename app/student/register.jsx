import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Register() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up and take charge of your future</Text>

      <TextInput style={styles.input} placeholder="Name" placeholderTextColor="#555" />
      <TextInput style={styles.input} placeholder="PRN" placeholderTextColor="#555" />
      <TextInput style={styles.input} placeholder="Studying Year" placeholderTextColor="#555" />
      <TextInput style={styles.input} placeholder="Semester" placeholderTextColor="#555" />
      <TextInput style={styles.input} placeholder="LinkedIn ID" placeholderTextColor="#555" />
      <TextInput style={styles.input} placeholder="Create Password" secureTextEntry placeholderTextColor="#555" />
      <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry placeholderTextColor="#555" />

      <TouchableOpacity style={styles.registerButton} onPress={() => router.push("/student/homePage")}>
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
  title: { fontSize: 24, fontWeight: "bold", color: "#146ED7", textAlign: "center", marginBottom: 5 },
  subtitle: { fontSize: 14, textAlign: "center", marginBottom: 20 },
  input: { backgroundColor: "#E6F0FF", padding: 12, borderRadius: 8, borderWidth: 1, borderColor: "#146ED7", marginBottom: 15 },
  registerButton: { backgroundColor: "#146ED7", paddingVertical: 12, borderRadius: 8, marginTop: 10 },
  registerText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "bold" },
  haveAccount: { textAlign: "center", color: "#146ED7", fontSize: 14, marginTop: 15 },
});
