import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function RegisterPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Create Account</Text>

      {/* Input Fields */}
      <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#aaa" />
      <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" placeholderTextColor="#aaa" />
      <TextInput style={styles.input} placeholder="Phone Number" keyboardType="phone-pad" placeholderTextColor="#aaa" />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry placeholderTextColor="#aaa" />
      <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry placeholderTextColor="#aaa" />

      {/* Register Button */}
      <TouchableOpacity style={styles.button} onPress={() => router.push("/home")}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      {/* Already have an account */}
      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.loginLink}>Already have an account? Login</Text>
      </TouchableOpacity>


    </View>
  );
}

// Reusable Nav Icon Component
const NavIcon = ({ label, icon, onPress }) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress}>
    <Ionicons name={icon} size={22} color="#fff" />
    <Text style={styles.navLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fd",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2b2d42",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#3f51b5",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#ffffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  loginLink: {
    marginTop: 15,
    textAlign: "center",
    color: "#3f51b5",
    fontWeight: "500",
  },

});
