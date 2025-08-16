// import React from "react";

// // This file is the entry point for the Expo Router, which allows you to use file-based
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
// } from "react-native";
// import {
//   Ionicons,
//   FontAwesome5,
//   MaterialCommunityIcons,
// } from "@expo/vector-icons";
// import { router } from "expo-router";

// export default function AdminHome() {
//   return (
//     <View style={styles.container}>
//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* Title */}
//         <Text style={styles.title}>UniFlow CS</Text>

//         {/* Welcome */}
//         <View style={styles.welcomeBox}>
//           <Text style={styles.welcomeText}>Hi Santosh Sable!</Text>
//         </View>

//         {/* Two feature buttons */}
//         <View style={styles.featureRow}>
//           <TouchableOpacity
//             style={styles.featureButton}
//             onPress={() => router.push("/Admin/manageFaculty")}
//           >
//             <Ionicons name="person-circle-outline" size={40} color="#146ED7" />
//             <Text style={styles.featureText}>Manage Faculty</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.featureButton}
//             onPress={() => alert("Monitor Subject Progress Clicked")}
//           >
//             <MaterialCommunityIcons
//               name="chart-line"
//               size={40}
//               color="#146ED7"
//             />
//             <Text style={styles.featureText}>Monitor Subject Progress</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Post Section */}
//         <View style={styles.postCard}>
//           {/* Profile */}
//           <View style={styles.profileRow}>
//             <Ionicons
//               name="person-circle"
//               size={40}
//               color="#146ED7"
//               style={{ marginRight: 10 }}
//             />
//             <View style={{ flex: 1 }}>
//               <Text style={styles.profileName}>Shravan Devrukhkar</Text>
//               <Text style={styles.profileSub}>
//                 3rd Year Diploma Computer Engineering Student | 1w
//               </Text>
//             </View>
//             <Ionicons name="ellipsis-vertical" size={20} color="#555" />
//           </View>

//           {/* Post text */}
//           <Text style={styles.postText}>
//             I&apos;m thrilled to announce that I&apos;ve successfully completed
//             not one, but two internships this summer, each offering unique
//             experiences and valuable hands-on skills...
//           </Text>

//           {/* Certificates (icon version) */}
//           <View style={styles.certificateRow}>
//             <MaterialCommunityIcons
//               name="certificate-outline"
//               size={60}
//               color="#FFA500"
//             />
//             <MaterialCommunityIcons
//               name="certificate-outline"
//               size={60}
//               color="#FFD700"
//             />
//           </View>

//           {/* Likes */}
//           <View style={styles.likeRow}>
//             <Ionicons name="thumbs-up" size={18} color="#146ED7" />
//             <Text style={styles.likes}>You and 10 others</Text>
//           </View>

//           {/* Actions */}
//           <View style={styles.actionRow}>
//             <TouchableOpacity style={styles.actionBtn}>
//               <Ionicons name="thumbs-up-outline" size={20} color="#555" />
//               <Text style={styles.actionText}>Like</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.actionBtn}>
//               <Ionicons name="chatbubble-outline" size={20} color="#555" />
//               <Text style={styles.actionText}>Comment</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.actionBtn}>
//               <Ionicons name="share-outline" size={20} color="#555" />
//               <Text style={styles.actionText}>Repost</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.actionBtn}>
//               <Ionicons name="send-outline" size={20} color="#555" />
//               <Text style={styles.actionText}>Send</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>

//       {/* Bottom Navigation */}
//       <View style={styles.bottomNav}>
//         <TouchableOpacity onPress={() => alert("Home Clicked")}>
//           <Ionicons name="home" size={26} color="#146ED7" />
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => router.push("/Admin/noticeBoard")}>
//           <Ionicons name="document-text" size={26} color="#146ED7" />
//         </TouchableOpacity>
//         {/* <TouchableOpacity onPress={() => alert("Add Clicked")}>
//           <View style={styles.addButton}>
//             <Ionicons name="add" size={28} color="#146ED7" />
//           </View>
//         </TouchableOpacity> */}
//         <TouchableOpacity onPress={() => alert("Achievements Clicked")}>
//           <FontAwesome5 name="trophy" size={26} color="#146ED7" />
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => router.push("/Admin/AdminProfile")}>
//           <Ionicons name="person-circle-outline" size={26} color="#146ED7" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#F5F5F5" },
//   title: {
//     fontSize: 22,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginTop: 10,
//     color: "#004AAD",
//   },
//   welcomeBox: {
//     backgroundColor: "#fff",
//     margin: 15,
//     padding: 10,
//     borderRadius: 12,
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#ccc",
//   },
//   welcomeText: { fontSize: 16, fontWeight: "500" },
//   featureRow: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginBottom: 15,
//   },
//   featureButton: {
//     backgroundColor: "#B8D8FF",
//     padding: 15,
//     borderRadius: 10,
//     alignItems: "center",
//     width: "40%",
//   },
//   featureText: {
//     fontSize: 14,
//     fontWeight: "600",
//     textAlign: "center",
//     marginTop: 5,
//   },
//   postCard: {
//     backgroundColor: "#fff",
//     padding: 10,
//     borderRadius: 10,
//     marginHorizontal: 10,
//     marginBottom: 15,
//   },
//   profileRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   profileName: { fontWeight: "bold", fontSize: 14 },
//   profileSub: { fontSize: 12, color: "#666" },
//   postText: { fontSize: 14, marginBottom: 10, color: "#333" },
//   certificateRow: {
//     flexDirection: "row",
//     gap: 15,
//     marginVertical: 8,
//   },
//   likeRow: { flexDirection: "row", alignItems: "center", marginVertical: 5 },
//   likes: { fontSize: 12, color: "#555", marginLeft: 5 },
//   actionRow: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     paddingTop: 5,
//     borderTopWidth: 1,
//     borderColor: "#eee",
//   },
//   actionBtn: { alignItems: "center" },
//   actionText: { fontSize: 12, color: "#555" },
//   bottomNav: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     alignItems: "center",
//     backgroundColor: "#E6F0FA",
//     marginHorizontal: 15,
//     marginBottom: 10,
//     paddingVertical: 10,
//     borderRadius: 30,
//   },
//   addButton: {
//     backgroundColor: "#0A4D8C",
//     padding: 10,
//     borderRadius: 50,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });



import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function AdminHome() {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Title */}
        <Text style={styles.title}>UniFlow CS</Text>

        {/* Welcome */}
        <View style={styles.welcomeBox}>
          <Text style={styles.welcomeText}>Hi Santosh Sable!</Text>
        </View>

        {/* Two feature buttons */}
        <View style={styles.featureRow}>
          <TouchableOpacity
            style={styles.featureButton}
            onPress={() => router.push("/Admin/manageFaculty")}
          >
            <Ionicons name="person-circle-outline" size={40} color="#146ED7" />
            <Text style={styles.featureText}>Manage Faculty</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureButton}
            onPress={() => router.push("/Admin/AdminSubjectMonitor")}
          >
            <MaterialCommunityIcons name="chart-line" size={40} color="#146ED7" />
            <Text style={styles.featureText}>Monitor Subject Progress</Text>
          </TouchableOpacity>
        </View>

        {/* Feed Posts (from previous page) */}
        {[1, 2, 3].map((item) => (
          <View key={item} style={styles.postCard}>
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
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => alert("Home Clicked")}>
          <Ionicons name="home" size={26} color="#146ED7" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/Admin/noticeBoard")}>
          <Ionicons name="document-text" size={26} color="#146ED7" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => alert("Achievements Clicked")}>
          <FontAwesome5 name="trophy" size={26} color="#146ED7" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/Admin/AdminProfile")}>
          <Ionicons name="person-circle-outline" size={26} color="#146ED7" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginTop: 10, color: "#004AAD" },
  welcomeBox: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  welcomeText: { fontSize: 16, fontWeight: "500" },
  featureRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: 15 },
  featureButton: {
    backgroundColor: "#B8D8FF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "40%",
  },
  featureText: { fontSize: 14, fontWeight: "600", textAlign: "center", marginTop: 5 },

  /* Post card styles (from previous page) */
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
    alignSelf: "center",
  },
  postHeader: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  postAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  postName: { fontWeight: "bold" },
  postSubtitle: { fontSize: 12, color: "#555" },
  postText: { marginVertical: 5 },
  postImage: { width: "100%", height: 150, borderRadius: 10, marginTop: 5 },
  postActions: { flexDirection: "row", justifyContent: "space-around", marginTop: 10 },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#E6F0FA",
    marginHorizontal: 15,
    marginBottom: 10,
    paddingVertical: 10,
    borderRadius: 30,
  },
});

