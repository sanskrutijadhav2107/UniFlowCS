// // app/student/notice-board.jsx
// import React from "react";
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
// import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
// import BottomNavbar from "./components/BottomNavbar"; 

// export default function NoticeBoard() {
//   const notices = [
//     {
//       id: 1,
//       name: "Prof. Santosh Sabale",
//       text: "All the students be there in class room sharp at 11 am today.",
//     },
//     {
//       id: 2,
//       name: "Prof. Siddesh Jadhav",
//       text: "All the students submit the term work before 31st Aug.",
//     },
//     {
//       id: 3,
//       name: "Prof. Santosh Sabale",
//       text: "There will be no lectures conducted tomorrow.",
//     },
//   ];

//   return (
//     <View style={styles.container}>
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 90 }}
//       >
//         {/* Header */}
//         <Text style={styles.header}>UniFlow CS</Text>
//         <Text style={styles.subHeader}>Announcements</Text>

//         {/* Notices */}
//         {notices.map((notice) => (
//           <View key={notice.id} style={styles.noticeCard}>
//             {/* Teacher Info */}
//             <View style={styles.teacherRow}>
//               <View style={styles.avatar}>
//                 <Text style={styles.avatarText}>{notice.name.charAt(6)}</Text>
//               </View>
//               <Text style={styles.teacherName}>{notice.name}</Text>
//             </View>

//             {/* Notice Text */}
//             <View style={styles.noticeTextBox}>
//               <Text style={styles.noticeText}>{notice.text}</Text>
//             </View>
//           </View>
//         ))}
//       </ScrollView>

//         {/* Bottom Navbar */}
//                   <BottomNavbar active="home" />
//           </View>
//         );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#B3D7FF" },
//   header: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#0C2D57",
//     textAlign: "center",
//     marginTop: 10,
//   },
//   subHeader: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#0C2D57",
//     textAlign: "center",
//     marginVertical: 10,
//   },
//   noticeCard: {
//     backgroundColor: "#F9F9F9",
//     borderRadius: 10,
//     marginHorizontal: 15,
//     marginBottom: 15,
//     padding: 10,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   teacherRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 5,
//   },
//   avatar: {
//     backgroundColor: "#00C2FF",
//     width: 35,
//     height: 35,
//     borderRadius: 20,
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 8,
//   },
//   avatarText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
//   teacherName: { fontWeight: "600", fontSize: 14, color: "#0C2D57" },
//   noticeTextBox: {
//     backgroundColor: "#EFEFEF",
//     borderRadius: 15,
//     padding: 8,
//     marginTop: 5,
//   },
//   noticeText: { fontSize: 13, color: "#333" },

// });



















import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { db } from "../../firebase";
import BottomNavbar from "./components/BottomNavbar";

export default function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotices = async () => {
    try {
      const q = query(collection(db, "notices"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      const noticesList = [];
      querySnapshot.forEach((doc) => {
        noticesList.push({ id: doc.id, ...doc.data() });
      });

      setNotices(noticesList);
    } catch (error) {
      console.error("Error fetching notices: ", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0C2D57" />
        <Text>Loading Notices...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchNotices} />
        }
      >
        <Text style={styles.header}>UniFlow CS</Text>
        <Text style={styles.subHeader}>Announcements</Text>

        {notices.length === 0 ? (
          <Text style={styles.empty}>No notices available 📭</Text>
        ) : (
          notices.map((notice) => (
            <View key={notice.id} style={styles.noticeCard}>
              {/* Teacher Info */}
              <View style={styles.teacherRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {notice.postedBy?.charAt(0)?.toUpperCase() || "A"}
                  </Text>
                </View>
                <Text style={styles.teacherName}>{notice.postedBy || "Admin"}</Text>
              </View>

              {/* Notice Text */}
              <View style={styles.noticeTextBox}>
                <Text style={styles.noticeText}>{notice.description || notice.text}</Text>
                {/* Show image if mediaUrl or imageUrl field exists */}
                {(notice.mediaUrl || notice.imageUrl) && (
                  <Image
                    source={{ uri: notice.mediaUrl || notice.imageUrl }}
                    style={styles.noticeImage}
                  />
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <BottomNavbar active="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#B3D7FF" },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0C2D57",
    textAlign: "center",
    marginTop: 10,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0C2D57",
    textAlign: "center",
    marginVertical: 10,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#555",
  },
  noticeCard: {
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  teacherRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  avatar: {
    backgroundColor: "#00C2FF",
    width: 35,
    height: 35,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  avatarText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  teacherName: { fontWeight: "600", fontSize: 14, color: "#0C2D57" },
  noticeTextBox: {
    backgroundColor: "#EFEFEF",
    borderRadius: 15,
    padding: 8,
    marginTop: 5,
  },
  noticeText: { fontSize: 13, color: "#333" },
  noticeImage: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    marginTop: 10,
  },
});
