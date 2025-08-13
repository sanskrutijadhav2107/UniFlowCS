import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";

export default function LandingPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* App Name */}
      <Text style={styles.title}>UniFlow CS</Text>
      <Text style={styles.tagline}>Track. Learn. Achieve. Repeat</Text>

      {/* Illustration */}
      {/* <Image
        source={require("../assets/images/image.png")} // Replace with your image
        style={styles.image}
        resizeMode="contain"
      /> */}

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.loginButton]}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.loginText}>Login as Student</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.loginButton]}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.loginText}>Login as Administrator</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.registerButton]}
          onPress={() => router.push("student/register")}
        >
          <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0F9FF",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#146ED7",
    marginBottom: 5,
  },
  tagline: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 250,
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  loginButton: {
    backgroundColor: "#146ED7",
  },
  registerButton: {
    backgroundColor: "#ccc",
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});