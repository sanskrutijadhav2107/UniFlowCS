// import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import BottomNavbar from "./components/BottomNavbar";

// export default function StudentHome() {
//   const router = useRouter();

//   return (
//     <View style={styles.container}>
//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 90 }}>
//         {/* Header */}
//         <Text style={styles.header}>UniFlow CS</Text>

//         {/* Greeting + GPA */}
//         <View style={styles.gpaCard}>
//           <Image
//             source={{ uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }}
//             style={styles.avatar}
//           />
//           <View style={{ flex: 1 }}>
//             <Text style={styles.greeting}>Hii Sanskruti!</Text>
//             <View style={styles.gpaBar}>
//               <View style={styles.gpaFill}></View>
//             </View>
//             <Text style={styles.gpaText}>GPA : 7.9</Text>
//           </View>
//         </View>

//         {/* Feature Grid */}
//         <View style={styles.grid}>
//           <FeatureCard
//             icon={<MaterialIcons name="menu-book" size={28} color="#2d6eefff" />}
//             title="Notes"
//             subtitle="Learn anytime"
//             onPress={() => router.push("/student/notes")}
//           />
//           <FeatureCard
//             icon={<Ionicons name="notifications" size={28} color="#2d6eefff" />}
//             title="Notice Board"
//             subtitle="Stay Updated"
//             onPress={() => router.push("/student/noticeBoard")}
//           />
//           <FeatureCard
//             icon={<Ionicons name="calendar" size={28} color="#2d6eefff" />}
//             title="TimeTable"
//             subtitle="Know what next"
//             onPress={() => router.push("/student/timetable")}
//           />
//           <FeatureCard
//             icon={<Ionicons name="stats-chart" size={28} color="#2d6eefff" />}
//             title="Dashboard"
//             subtitle="Track your progress"
//             onPress={() => router.push("/student/AcademicDashboard")}
//           />
//           <FeatureCard
//             icon={<FontAwesome5 name="trophy" size={28} color="#2d6eefff" />}
//             title="Leaderboard"
//             subtitle="Be the best"
//             onPress={() => router.push("/student/leaderBoard")}
//           />
//           <FeatureCard
//             icon={<MaterialIcons name="work" size={28} color="#2d6eefff" />}
//             title="Project"
//             subtitle="Build success"
//             onPress={() => router.push("/student/projectManagement")}
//           />
//         </View>

//                 {/* Mock Post */}
//         <View style={styles.postCard}>
//           <View style={styles.postHeader}>
//             <Image
//               source={{ uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }}
//               style={styles.postAvatar}
//             />
//             <View>
//               <Text style={styles.postName}>Shravan Devrukhkar</Text>
//               <Text style={styles.postSubtitle}>3rd Year Diploma Computer Engineering Student</Text>
//             </View>
//           </View>
//           <Text style={styles.postText}>
//             I'm thrilled to announce that I've successfully completed not one, but two internships this summer...
//           </Text>
//           <Image
//             source={{ uri: "https://i.ibb.co/FzYg2dV/certificate-sample.png" }}
//             style={styles.postImage}
//           />
//           <View style={styles.postActions}>
//             <Text>👍 Like</Text>
//             <Text>💬 Comment</Text>
//             <Text>📤 Share</Text>
//           </View>
//         </View>


//         <View style={styles.postCard}>
//           <View style={styles.postHeader}>
//             <Image
//               source={{ uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }}
//               style={styles.postAvatar}
//             />
//             <View>
//               <Text style={styles.postName}>Shravan Devrukhkar</Text>
//               <Text style={styles.postSubtitle}>3rd Year Diploma Computer Engineering Student</Text>
//             </View>
//           </View>
//           <Text style={styles.postText}>
//             I'm thrilled to announce that I've successfully completed not one, but two internships this summer...
//           </Text>
//           <Image
//             source={{ uri: "https://i.ibb.co/FzYg2dV/certificate-sample.png" }}
//             style={styles.postImage}
//           />
//           <View style={styles.postActions}>
//             <Text>👍 Like</Text>
//             <Text>💬 Comment</Text>
//             <Text>📤 Share</Text>
//           </View>
//         </View>


//       </ScrollView>
      

//       {/* Bottom Navbar */}
//       <BottomNavbar active="home" />
//     </View>
//   );
// }

// function FeatureCard({ icon, title, subtitle, onPress }) {
//   return (
//     <TouchableOpacity style={styles.featureCard} onPress={onPress}>
//       {icon}
//       <Text style={styles.featureTitle}>{title}</Text>
//       <Text style={styles.featureSubtitle}>{subtitle}</Text>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#F9FBFF" },
//   header: { fontSize: 22, fontWeight: "bold", color: "#2d6eefff", textAlign: "center", marginVertical: 10 },
//   gpaCard: {
//     flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
//     margin: 10, padding: 12, borderRadius: 15,
//     shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 3,
//   },
//   avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
//   greeting: { fontSize: 16, fontWeight: "bold" },
//   gpaBar: { height: 10, backgroundColor: "#E0E0E0", borderRadius: 5, marginTop: 5, width: "80%" },
//   gpaFill: { height: 10, backgroundColor: "#2d6eefff", borderRadius: 5, width: "79%" },
//   gpaText: { marginTop: 5, fontSize: 12, fontWeight: "bold" },
//   grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around", marginVertical: 10 },
//   featureCard: {
//     width: "40%", backgroundColor: "#fff", padding: 15, borderRadius: 15,
//     alignItems: "center", marginVertical: 8,
//     shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
//   },
//   featureTitle: { fontWeight: "bold", marginTop: 5 },
//   featureSubtitle: { fontSize: 12, color: "#555", textAlign: "center" },

//    postCard: {
//     backgroundColor: "#fff", padding: 12, margin: 10, borderRadius: 15,
//     shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2
//   },
//   postHeader: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
//   postAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
//   postName: { fontWeight: "bold" },
//   postSubtitle: { fontSize: 12, color: "#555" },
//   postText: { marginVertical: 5 },
//   postImage: { width: "100%", height: 150, borderRadius: 10, marginTop: 5 },
//   postActions: { flexDirection: "row", justifyContent: "space-around", marginTop: 10 },
// });



import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BottomNavbar from "./components/BottomNavbar";

export default function StudentHome() {
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [likes, setLikes] = useState(0);

  // ✅ Load student data
  const loadStudent = async () => {
    try {
      const savedUser = await AsyncStorage.getItem("currentUser");
      if (savedUser) setStudent(JSON.parse(savedUser));
    } catch (e) {
      console.error("Error loading student:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStudent();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("currentUser");
    router.push("/student/login");
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2d6eefff" />
        <Text>Loading your profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadStudent} />}
      >
        {/* Header with logout */}
        <View style={styles.headerRow}>
          <Text style={styles.header}>UniFlow CS</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#2d6eefff" />
          </TouchableOpacity>
        </View>

        {/* Greeting + GPA */}
        <View style={styles.gpaCard}>
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }}
            style={styles.avatar}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>Hi {student?.name || "Student"}!</Text>
            <View style={styles.gpaBar}>
              <View style={styles.gpaFill}></View>
            </View>
            <Text style={styles.gpaText}>PRN: {student?.prn}</Text>
            <Text style={styles.gpaText}>Year: {student?.year}</Text>
            <Text style={styles.gpaText}>Semester: {student?.semester}</Text>
          </View>
        </View>

        {/* Feature Grid */}
        <View style={styles.grid}>
          <FeatureCard
            icon={<MaterialIcons name="menu-book" size={28} color="#2d6eefff" />}
            title="Notes"
            subtitle="Learn anytime"
            onPress={() => router.push("/student/notes")}
          />
          <FeatureCard
            icon={<Ionicons name="notifications" size={28} color="#2d6eefff" />}
            title="Notice Board"
            subtitle="Stay Updated"
            onPress={() => router.push("/student/noticeBoard")}
          />
          <FeatureCard
            icon={<Ionicons name="calendar" size={28} color="#2d6eefff" />}
            title="TimeTable"
            subtitle="Know what next"
            onPress={() => router.push("/student/timetable")}
          />
          <FeatureCard
            icon={<Ionicons name="stats-chart" size={28} color="#2d6eefff" />}
            title="Dashboard"
            subtitle="Track your progress"
            onPress={() => router.push("/student/AcademicDashboard")}
          />
          <FeatureCard
            icon={<FontAwesome5 name="trophy" size={28} color="#2d6eefff" />}
            title="Leaderboard"
            subtitle="Be the best"
            onPress={() => router.push("/student/leaderBoard")}
          />
          <FeatureCard
            icon={<MaterialIcons name="work" size={28} color="#2d6eefff" />}
            title="Project"
            subtitle="Build success"
            onPress={() => router.push("/student/projectManagement")}
          />
        </View>

        {/* Post Card */}
        <View style={styles.postCard}>
          <View style={styles.postHeader}>
            <Image
              source={{ uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }}
              style={styles.postAvatar}
            />
            <View>
              <Text style={styles.postName}>{student?.name || "Student"}</Text>
              <Text style={styles.postSubtitle}>
                {student?.year} Year Computer Engineering Student
              </Text>
            </View>
          </View>
          <Text style={styles.postText}>
            Excited to be part of UniFlow 🚀! Let&apos;s learn and grow together.
          </Text>
          <Image
            source={{ uri: "https://i.ibb.co/FzYg2dV/certificate-sample.png" }}
            style={styles.postImage}
          />
          <View style={styles.postActions}>
            <TouchableOpacity onPress={() => setLikes(likes + 1)}>
              <Text>👍 Like ({likes})</Text>
            </TouchableOpacity>
            <Text>💬 Comment</Text>
            <Text>📤 Share</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navbar */}
      <BottomNavbar active="home" />
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  header: { fontSize: 22, fontWeight: "bold", color: "#2d6eefff" },
  gpaCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 10,
    padding: 12,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  greeting: { fontSize: 16, fontWeight: "bold" },
  gpaBar: {
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    marginTop: 5,
    width: "80%",
  },
  gpaFill: { height: 10, backgroundColor: "#2d6eefff", borderRadius: 5, width: "79%" },
  gpaText: { marginTop: 5, fontSize: 12, fontWeight: "bold" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  featureCard: {
    width: "40%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  featureTitle: { fontWeight: "bold", marginTop: 5 },
  featureSubtitle: { fontSize: 12, color: "#555", textAlign: "center" },
  postCard: {
    backgroundColor: "#fff",
    padding: 12,
    margin: 10,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  postHeader: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  postAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  postName: { fontWeight: "bold" },
  postSubtitle: { fontSize: 12, color: "#555" },
  postText: { marginVertical: 5 },
  postImage: { width: "100%", height: 150, borderRadius: 10, marginTop: 5 },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
});
