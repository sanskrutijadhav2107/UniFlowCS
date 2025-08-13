import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function StudentHome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 90 }}>
        
        {/* Header */}
        <Text style={styles.header}>UniFlow CS</Text>

        {/* Greeting + GPA */}
        <View style={styles.gpaCard}>
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }}
            style={styles.avatar}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>Hii Sanskruti!</Text>
            <View style={styles.gpaBar}>
              <View style={styles.gpaFill}></View>
            </View>
            <Text style={styles.gpaText}>GPA : 7.9</Text>
          </View>
        </View>

        {/* Feature Grid with Navigation */}
        <View style={styles.grid}>
          <FeatureCard
            icon={<MaterialIcons name="menu-book" size={28} color="#146ED7" />}
            title="Notes"
            subtitle="Learn anytime"
            onPress={() => router.push("/student/notes")}
          />
          <FeatureCard
            icon={<Ionicons name="notifications" size={28} color="#146ED7" />}
            title="Notice Board"
            subtitle="Stay Updated"
            onPress={() => router.push("/student/noticeBoard")}
          />
          <FeatureCard
            icon={<Ionicons name="calendar" size={28} color="#146ED7" />}
            title="TimeTable"
            subtitle="Know what next"
            onPress={() => router.push("/student/timetable")}
          />
          <FeatureCard
            icon={<Ionicons name="stats-chart" size={28} color="#146ED7" />}
            title="Dashboard"
            subtitle="Track your progress"
            onPress={() => router.push("/student/AcademicDashboard")}
          />
          <FeatureCard
            icon={<FontAwesome5 name="trophy" size={28} color="#146ED7" />}
            title="Leaderboard"
            subtitle="Be the best"
            onPress={() => router.push("/student/leaderboard")}
          />
          <FeatureCard
            icon={<MaterialIcons name="work" size={28} color="#146ED7" />}
            title="Project"
            subtitle="Build success"
            onPress={() => router.push("/student/projects")}
          />
        </View>

        {/* Mock Post */}
        <View style={styles.postCard}>
          <View style={styles.postHeader}>
            <Image
              source={{ uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }}
              style={styles.postAvatar}
            />
            <View>
              <Text style={styles.postName}>Shravan Devrukhkar</Text>
              <Text style={styles.postSubtitle}>3rd Year Diploma Computer Engineering Student</Text>
            </View>
          </View>
          <Text style={styles.postText}>
            I'm thrilled to announce that I've successfully completed not one, but two internships this summer...
          </Text>
          <Image
            source={{ uri: "https://i.ibb.co/FzYg2dV/certificate-sample.png" }}
            style={styles.postImage}
          />
          <View style={styles.postActions}>
            <Text>👍 Like</Text>
            <Text>💬 Comment</Text>
            <Text>📤 Share</Text>
          </View>
        </View>

      </ScrollView>

      {/* Floating Rounded Bottom Navbar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity><Ionicons name="home" size={28} color="#146ED7" /></TouchableOpacity>
        <TouchableOpacity><Ionicons name="document-text" size={28} color="#146ED7" /></TouchableOpacity>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity><FontAwesome5 name="trophy" size={28} color="#146ED7" /></TouchableOpacity>
        <TouchableOpacity><Ionicons name="person" size={28} color="#146ED7" /></TouchableOpacity>
      </View>
    </View>
  );
}

function FeatureCard({ icon, title, subtitle, onPress }) {
  return (
    <TouchableOpacity style={styles.featureCard} onPress={onPress}>
      {icon}
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FBFF" },
  header: { fontSize: 22, fontWeight: "bold", color: "#146ED7", textAlign: "center", marginVertical: 10 },
  gpaCard: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
    margin: 10, padding: 12, borderRadius: 15,
    shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 3
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  greeting: { fontSize: 16, fontWeight: "bold" },
  gpaBar: { height: 10, backgroundColor: "#E0E0E0", borderRadius: 5, marginTop: 5, width: "80%" },
  gpaFill: { height: 10, backgroundColor: "#146ED7", borderRadius: 5, width: "79%" },
  gpaText: { marginTop: 5, fontSize: 12, fontWeight: "bold" },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around", marginVertical: 10 },
  featureCard: {
    width: "40%", backgroundColor: "#fff", padding: 15, borderRadius: 15,
    alignItems: "center", marginVertical: 8,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 3, elevation: 2
  },
  featureTitle: { fontWeight: "bold", marginTop: 5 },
  featureSubtitle: { fontSize: 12, color: "#555", textAlign: "center" },
  postCard: { backgroundColor: "#fff", padding: 12, margin: 10, borderRadius: 15,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2
  },
  postHeader: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  postAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  postName: { fontWeight: "bold" },
  postSubtitle: { fontSize: 12, color: "#555" },
  postText: { marginVertical: 5 },
  postImage: { width: "100%", height: 150, borderRadius: 10, marginTop: 5 },
  postActions: { flexDirection: "row", justifyContent: "space-around", marginTop: 10 },
  bottomNav: {
    flexDirection: "row", justifyContent: "space-around", alignItems: "center",
    backgroundColor: "#fff", position: "absolute", bottom: 15, left: 20, right: 20,
    borderRadius: 40, paddingVertical: 10,
    shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 6, elevation: 4
  },
  addButton: {
    backgroundColor: "#146ED7", width: 50, height: 50, borderRadius: 25,
    justifyContent: "center", alignItems: "center", shadowColor: "#000",
    shadowOpacity: 0.15, shadowRadius: 5, elevation: 4
  }
});














