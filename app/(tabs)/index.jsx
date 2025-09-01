// app/index.jsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import * as Animatable from "react-native-animatable";

export default function LandingPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Logo Animation */}
      <Animatable.Image
        animation="zoomIn"
        iterationCount={1}
        duration={1500}
        easing="ease-out"
        source={require("../../assets/images/uniflowcs.png")}
        style={styles.logo}
      />

      {/* Title */}
      <Animatable.Text
        animation="fadeInDown"
        delay={500}
        duration={1200}
        style={styles.title}
      >
        UniFlow CS
      </Animatable.Text>

      {/* Tagline */}
      <Animatable.Text
        animation="fadeInUp"
        delay={1000}
        duration={1200}
        style={styles.tagline}
      >
        Track. Learn. Achieve. Repeat
      </Animatable.Text>

      {/* Buttons with staggered animation */}
      <Animatable.View animation="fadeInUp" delay={1400} duration={1200}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("/student/login")}
        >
          <Text style={styles.buttonText}>Continue as Student</Text>
        </TouchableOpacity>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={1700} duration={1200}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("/Admin/AdminLogin")}
        >
          <Text style={styles.buttonText}>Continue as Admin</Text>
        </TouchableOpacity>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={2000} duration={1200}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("/Faculty/FacultyLogin")}
        >
          <Text style={styles.buttonText}>Continue as Faculty</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  logo: { width: 160, height: 160, marginBottom: 20, resizeMode: "contain" },
  title: { fontSize: 36, fontWeight: "bold", marginBottom: 10, color: "#2d6eefff" },
  tagline: { fontSize: 18, color: "#444", marginBottom: 40, fontStyle: "italic" },
  loginButton: {
    backgroundColor: "#2d6eefff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
    width: 240,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
});

