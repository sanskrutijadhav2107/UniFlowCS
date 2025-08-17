import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function FacultyLogin() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Faculty Login</Text>
      <Text style={styles.subtitle}>Welcome back!</Text>

      {/* Phone Number Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Phone Number"
        keyboardType="phone-pad"
        placeholderTextColor="#555"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        placeholderTextColor="#555"
      />

      {/* Forgot Password */}
      <TouchableOpacity>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => router.push("/Faculty/FacultyHomepage")}
      >
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", color: "#146ED7", textAlign: "center", marginBottom: 5 },
  subtitle: { fontSize: 14, textAlign: "center", marginBottom: 20 },
  input: {
    backgroundColor: "#E6F0FF",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#146ED7",
    marginBottom: 15,
  },
  forgot: { color: "#146ED7", fontSize: 12, textAlign: "right", marginBottom: 20 },
  loginButton: { backgroundColor: "#146ED7", paddingVertical: 12, borderRadius: 8 },
  loginText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "bold" },
  orText: { textAlign: "center", marginVertical: 10, color: "#777" },
  createAccount: { textAlign: "center", color: "#000", fontSize: 14 },
});
