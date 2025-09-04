// // app/Admin/AdminHome.jsx
// import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import AdminNavbar from "./components/AdminNavbar";

// export default function AdminHome() {
//   const router = useRouter();

//   return (
//     <View style={styles.container}>
//       <ScrollView
//         contentContainerStyle={{ paddingBottom: 100 }}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Title */}
//         <Text style={styles.title}>UniFlow CS</Text>

//         {/* Welcome */}
//         <View style={styles.welcomeBox}>
//           <Text style={styles.welcomeText}>Hi Santosh Sable!</Text>
//         </View>

//         {/* Feature Buttons */}
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
//             onPress={() => router.push("/Admin/AdminSubjectMonitor")}
//           >
//             <MaterialCommunityIcons name="chart-line" size={40} color="#146ED7" />
//             <Text style={styles.featureText}>Monitor Subject Progress</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.featureButton}
//             onPress={() => router.push("/Admin/noticeBoard")}
//           >
//            <MaterialCommunityIcons name="bullhorn-outline" size={40} color="#146ED7" />


//             <Text style={styles.featureText}>Send Notice</Text>
//           </TouchableOpacity>
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
//               I&apos;m thrilled to announce that I&apos;ve successfully completed not one, but two internships this summer...
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

//       {/* Bottom Navbar */}
//       <AdminNavbar />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#F5F5F5" },
//   title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginTop: 10, color: "#004AAD" },
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
//   featureRow: { flexDirection: "row", flexWrap: "wrap",justifyContent: "space-around", paddingHorizontal: 15,marginBottom: 15 },
//   featureButton: {
//     backgroundColor: "#B8D8FF",
//     padding: 15,
//     borderRadius: 10,
//     alignItems: "center",
//     width: "47%",
//     marginBottom: 15,
//   },
//   featureText: { fontSize: 14, fontWeight: "600", textAlign: "center", marginTop: 5, },
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
//     alignSelf: "center",
//   },
//   postHeader: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
//   postAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
//   postName: { fontWeight: "bold" },
//   postSubtitle: { fontSize: 12, color: "#555" },
//   postText: { marginVertical: 5 },
//   postImage: { width: "100%", height: 150, borderRadius: 10, marginTop: 5 },
//   postActions: { flexDirection: "row", justifyContent: "space-around", marginTop: 10 },
// });








// // app/Admin/AdminHome.jsx
// import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import AdminNavbar from "./components/AdminNavbar";

// export default function AdminHome() {
//   const router = useRouter();

//   return (
//     <View style={styles.container}>
//       <ScrollView
//         contentContainerStyle={{ paddingBottom: 100 }}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Title */}
//         <Text style={styles.title}>UniFlow CS</Text>

//         {/* Welcome */}
//         <View style={styles.welcomeBox}>
//           <Text style={styles.welcomeText}>Hi Santosh Sable!</Text>
//         </View>

//         {/* Feature Buttons */}
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
//             onPress={() => router.push("/Admin/AdminSubjectMonitor")}
//           >
//             <MaterialCommunityIcons name="chart-line" size={40} color="#146ED7" />
//             <Text style={styles.featureText}>Monitor Subject Progress</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.featureButton}
//             onPress={() => router.push("/Admin/noticeBoard")}
//           >
//            <MaterialCommunityIcons name="bullhorn-outline" size={40} color="#146ED7" />


//             <Text style={styles.featureText}>Send Notice</Text>
//           </TouchableOpacity>
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
//               I&apos;m thrilled to announce that I&apos;ve successfully completed not one, but two internships this summer...
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

//       {/* Bottom Navbar */}
//       <AdminNavbar />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#F5F5F5" },
//   title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginTop: 10, color: "#004AAD" },
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
//   featureRow: { flexDirection: "row", flexWrap: "wrap",justifyContent: "space-around", paddingHorizontal: 15,marginBottom: 15 },
//   featureButton: {
//     backgroundColor: "#B8D8FF",
//     padding: 15,
//     borderRadius: 10,
//     alignItems: "center",
//     width: "47%",
//     marginBottom: 15,
//   },
//   featureText: { fontSize: 14, fontWeight: "600", textAlign: "center", marginTop: 5, },
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
//     alignSelf: "center",
//   },
//   postHeader: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
//   postAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
//   postName: { fontWeight: "bold" },
//   postSubtitle: { fontSize: 12, color: "#555" },
//   postText: { marginVertical: 5 },
//   postImage: { width: "100%", height: 150, borderRadius: 10, marginTop: 5 },
//   postActions: { flexDirection: "row", justifyContent: "space-around", marginTop: 10 },
// });






// app/Admin/AdminHome.jsx
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AdminNavbar from "./components/AdminNavbar";

export default function AdminHome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
      

        {/* Welcome */}
        {/* Page Title */}
              <View style={styles.header}>
                <Text style={styles.pageTitle}>Hii ! Santosh Sabale</Text>
                <Text style={styles.subTitle}>Welcome</Text>
              </View>

        {/* Feature Buttons in one row */}
        <View style={styles.featureRow}>
          <TouchableOpacity
            style={styles.featureButton}
            onPress={() => router.push("/Admin/manageFaculty")}
          >
            <Ionicons name="person-circle-outline" size={26} color="#fff" />
            <Text style={styles.featureText}>Manage Faculty</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureButton}
            onPress={() => router.push("/Admin/AdminSubjectMonitor")}
          >
            <MaterialCommunityIcons name="chart-line" size={26} color="#fff" />
            <Text style={styles.featureText}>Monitor Progress</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureButton}
            onPress={() => router.push("/Admin/noticeBoard")}
          >
            <MaterialCommunityIcons name="bullhorn-outline" size={26} color="#fff" />
            <Text style={styles.featureText}>Send Notice</Text>
          </TouchableOpacity>
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
              I&apos;m thrilled to announce that I&apos;ve successfully completed not one, but two internships this summer...
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

      {/* Bottom Navbar */}
      <AdminNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  // Header
  header: {
    paddingTop: 30,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#E3F0FF",
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
    
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#146ED7",
  },
  subTitle: {
    fontSize: 14,
    color: "#146ED7",
    marginTop: 4,
  },
  // ✅ Updated for smaller feature cards
  featureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  featureButton: {
    flex: 1,
    marginHorizontal: 5,
    height: 80, // smaller height
    backgroundColor: "#007BFF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0056b3",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    padding: 8,
    marginTop: 10,
  },
  featureText: {
    color: "#fff",
    marginTop: 4,
    fontWeight: "600",
    textAlign: "center",
    fontSize: 12,
  },

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
  postActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
});

