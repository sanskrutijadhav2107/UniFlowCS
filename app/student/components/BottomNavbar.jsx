// // components/BottomNavbar.jsx
// import React from "react";
// import { View, TouchableOpacity, StyleSheet } from "react-native";
// import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
// import { useRouter } from "expo-router";

// export default function BottomNavbar() {
//   const router = useRouter();

//   return (
//     <View style={styles.bottomNav}>
//       <TouchableOpacity onPress={() => router.push("/student/homePage")}>
//         <Ionicons name="home" size={28} color="#fff" />
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => router.push("/student/notes")}>
//         <Ionicons name="document-text" size={28} color="#fff" />
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.addButton}
//         onPress={() => router.push("/student/addPost")}
//       >
//         <Ionicons name="add" size={28} color="#2d6eefff" />
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => router.push("/student/leaderBoard")}>
//         <FontAwesome5 name="trophy" size={28} color="#fff" />
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => router.push("/student/profile")}>
//         <Ionicons name="person" size={28} color="#fff" />
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   bottomNav: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     alignItems: "center",
//     backgroundColor: "#2d6eefff",
//     position: "absolute",
//     bottom: 15,
//     left: 20,
//     right: 20,
//     borderRadius: 40,
//     paddingVertical: 4,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 4,
//     marginBottom: 40,
//   },
//   addButton: {
//     backgroundColor: "#fff",
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOpacity: 0.15,
//     shadowRadius: 5,
//     elevation: 4,
//   },
// });














import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function BottomNavbar() {
  const router = useRouter();

  return (
    <View style={styles.bottomNavContainer}>
      <View style={styles.bottomNav}>
        <NavIcon
          label="Home"
          icon="home-outline"
          onPress={() => router.push("/student/homePage")}
        />
        <NavIcon
          label="Notes"
          icon="cloud-upload-outline"
          onPress={() => router.push("/student/notes")}
        />
        <NavIcon
          label="New"
          icon="add-circle-outline" 
          onPress={() => router.push("/student/post")}
        />
        <NavIcon
          label="LeaderBoard"
          icon="trophy-outline"
          onPress={() => router.push("/student/leaderBoard")}
        />
       
        <NavIcon
          label="Profile"
          icon="person-outline"
          onPress={() => router.push("/student/profile")}
        />
      </View>
    </View>
  );
}

function NavIcon({ label, icon, onPress }) {
  return (
    <TouchableOpacity style={styles.navItem} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name={icon} size={28} color="#fff" />
      <Text style={styles.navLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bottomNavContainer: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: "center", // centers the inner view
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: 350, 
    backgroundColor: "#2d6eefff",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 5,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    alignSelf: "center", 
    marginBottom: 30,
  },
  navItem: { alignItems: "center" },
  navLabel: { fontSize: 12, color: "#fff", marginTop: 2 },
});







