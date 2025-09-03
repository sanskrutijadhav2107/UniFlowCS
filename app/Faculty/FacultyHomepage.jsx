
// import React from "react";
// import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import { useRouter } from "expo-router";

// export default function App() {
//   const router = useRouter(); // ✅ Initialize router here

//   return (
//     <View style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         {/* Title */}
//         <Text style={styles.title}>Uniflow-CS</Text>

//         {/* Feature Buttons */}
//         <View style={styles.buttonGrid}>
//           <FeatureButton
//             onPress={() => router.push("/Faculty/FacultyUploadNotes")}
//             label="Upload Notes"
//             icon="cloud-upload-outline"
//           />
//           <FeatureButton
//             onPress={() => router.push("/Faculty/FacultyNotice")}
//             label="Notice"
//             icon="document-text-outline"
//           />
//         </View>

//         {/* Feed Posts */}
//         {[1, 2, 3].map((item) => (
//           <View key={item} style={styles.postCard}>
//             <View style={styles.postHeader}>
//               <Image
//                 source={{ uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }}
//                 style={styles.postAvatar}
//               />
//               <View>
//                 <Text style={styles.postName}>Shravan Devrukhkar</Text>
//                 <Text style={styles.postSubtitle}>
//                   3rd Year Diploma Computer Engineering Student
//                 </Text>
//               </View>
//             </View>
//             <Text style={styles.postText}>
//               I'm thrilled to announce that I've successfully completed not one, but two internships this summer...
//             </Text>
//             <Image
//               source={{ uri: "https://i.ibb.co/FzYg2dV/certificate-sample.png" }}
//               style={styles.postImage}
//             />
//             <View style={styles.postActions}>
//               <Text>👍 Like</Text>
//               <Text>💬 Comment</Text>
//               <Text>📤 Share</Text>
//             </View>
//           </View>
//         ))}
//       </ScrollView>

//       {/* Bottom Navigation */}
//       {/* <View style={styles.bottomNavContainer}>
//         <View style={styles.bottomNav}>
//           <NavIcon label="Home" icon="home-outline" />
//           <NavIcon label="Upload Notes" icon="cloud-upload-outline" />
//           <NavIcon label="Ranking" icon="trophy-outline" />
//           <NavIcon label="TimeTable" icon="calendar-outline" />
//           <NavIcon label="Profile" icon="person-outline" />
//         </View>
//       </View> */}

//       <View style={styles.bottomNavContainer}>
//   <View style={styles.bottomNav}>
//     <NavIcon
//       label="Home"
//       icon="home-outline"
//     />
//     <NavIcon
//       label="Upload Notes"
//       icon="cloud-upload-outline"
//       onPress={() => router.push("/Faculty/FacultyUploadNotes")}
//     />
//     <NavIcon
//       label="Ranking"
//       icon="trophy-outline"
//       onPress={() => router.push("/Faculty/FacultyLeaderBoard")}
//     />
//     <NavIcon
//       label="TimeTable"
//       icon="calendar-outline"
//       onPress={() => router.push("Faculty/FacultyTimeTable")}
//     />
//     <NavIcon
//       label="Profile"
//       icon="person-outline"
//       onPress={() => router.push("Faculty/FacultyProfile")}
//     />
//   </View>
// </View>
//     </View>
//   );
// }

// function FeatureButton({ label, icon, onPress }) {
//   return (
//     <TouchableOpacity style={styles.featureButton} onPress={onPress}>
//       <Ionicons name={icon} size={28} color="#fff" />
//       <Text style={styles.featureText}>{label}</Text>
//     </TouchableOpacity>
//   );
// }

// // function NavIcon({ label, icon }) {
// //   return (
// //     <TouchableOpacity style={styles.navItem}>
// //       <Ionicons name={icon} size={24} color="#fff" />
// //       <Text style={styles.navLabel}>{label}</Text>
// //     </TouchableOpacity>
// //   );
// // }
// function NavIcon({ label, icon, onPress }) {
//   return (
//     <TouchableOpacity style={styles.navItem} onPress={onPress}>
//       <Ionicons name={icon} size={26} color="#fff" />
//       <Text style={styles.navLabel}>{label}</Text>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff" },
//   scrollContent: { alignItems: "center", paddingVertical: 20 },
//   title: { fontSize: 24, fontWeight: "bold", color: "#0047FF", marginBottom: 20 },
//   buttonGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginBottom: 20 },
//   featureButton: {
//     width: 140,
//     height: 80,
//     backgroundColor: "#007BFF",
//     borderRadius: 10,
//     justifyContent: "center",
//     alignItems: "center",
//     margin: 8,
//     borderWidth: 1,
//     borderColor: "#0056b3",
//     shadowColor: "#000",
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 5,
//   },
//   featureText: { color: "#fff", marginTop: 5, fontWeight: "bold" },
//   bottomNavContainer: { alignItems: "center", paddingVertical: 10, backgroundColor: "#fff" },
//   bottomNav: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     width: "90%",
//     backgroundColor: "#2d6eefff",
//     borderRadius: 30,
//     paddingVertical: 10,
//     paddingHorizontal: 5,
//     elevation: 5,
//     shadowColor: "#000",
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     shadowOffset: { width: 0, height: 3 },
//     marginBottom: 50
    
//   },
//   navItem: { alignItems: "center" },
//   navLabel: { fontSize: 12, color: "#fff" },
//   postCard: {
//     width: "90%",
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     shadowColor: "#000",
//     shadowOpacity: 0.15,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 3 },
//     elevation: 5,
    
//   },
//   postHeader: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
//   postAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
//   postName: { fontWeight: "bold" },
//   postSubtitle: { fontSize: 12, color: "#555" },
//   postText: { marginVertical: 5 },
//   postImage: { width: "100%", height: 150, borderRadius: 10, marginTop: 5 },
//   postActions: { flexDirection: "row", justifyContent: "space-around", marginTop: 10 },
// });









import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";
import BottomNavbar from "./components/BottomNavbar"; 

export default function FacultyHomePage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* ✅ Scrollable content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Title */}
        <Text style={styles.title}>Uniflow-CS</Text>

        {/* Feature Buttons */}
        <View style={styles.buttonGrid}>
          <FeatureButton
            onPress={() => router.push("/Faculty/FacultyUploadNotes")}
            label="Upload Notes"
            icon="cloud-upload-outline"
          />
          <FeatureButton
            onPress={() => router.push("/Faculty/FacultyNotice")}
            label="Notice"
            icon="document-text-outline"
          />
        </View>

        {/* Feed Posts */}
        {[1, 2, 3].map((item) => (
          <View key={item} style={styles.postCard}>
            <View style={styles.postHeader}>
              <Image
                source={{ uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }}
                style={styles.postAvatar}
              />
              <View>
                <Text style={styles.postName}>Shravan Devrukhkar</Text>
                <Text style={styles.postSubtitle}>
                  3rd Year Diploma Computer Engineering Student
                </Text>
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
        ))}
      </ScrollView>

      {/* ✅ Bottom Navbar (part of flex layout, not absolute) */}
      <BottomNavbar />
    </View>
  );
}

function FeatureButton({ label, icon, onPress }) {
  return (
    <TouchableOpacity style={styles.featureButton} onPress={onPress}>
      <Ionicons name={icon} size={28} color="#fff" />
      <Text style={styles.featureText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex : 1,
    backgroundColor: "#fff",
  },

  // ✅ content scrolls but stops above navbar
  scrollContent: {
    alignItems: "center",
    paddingVertical: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0047FF",
    marginBottom: 20,
  },

  buttonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },

  featureButton: {
    width: 140,
    height: 80,
    backgroundColor: "#007BFF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
    borderWidth: 1,
    borderColor: "#0056b3",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  featureText: { color: "#fff", marginTop: 5, fontWeight: "bold" },

  postCard: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  postHeader: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  postAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  postName: { fontWeight: "bold" },
  postSubtitle: { fontSize: 12, color: "#555" },
  postText: { marginVertical: 5 },
  postImage: { width: "100%", height: 150, borderRadius: 10, marginTop: 5 },
  postActions: { flexDirection: "row", justifyContent: "space-around", marginTop: 10 },
});
