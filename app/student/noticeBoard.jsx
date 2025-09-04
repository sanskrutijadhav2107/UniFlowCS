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



import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";
import BottomNavbar from "./components/BottomNavbar";

export default function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // For full-screen image modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState(null);

  // Request media library permissions on mount
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission required",
            "Please enable media library permissions."
          );
        }
      }
    })();
  }, []);

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

  // Save image from URL to device gallery
  const saveImageToGallery = async (imageUri) => {
    try {
      const fileUri = FileSystem.cacheDirectory + imageUri.split('/').pop();
      const { uri } = await FileSystem.downloadAsync(imageUri, fileUri);
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert("Success", "Image saved to gallery!");
    } catch (error) {
      Alert.alert("Error", "Failed to save image: " + error.message);
    }
  };

  // Open modal to show full-screen image
  const openImageModal = (uri) => {
    setSelectedImageUri(uri);
    setModalVisible(true);
  };

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
        <Text style={styles.header}>Notice Board</Text>
       

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
                  <>
                    <TouchableOpacity onPress={() => openImageModal(notice.mediaUrl || notice.imageUrl)}>
                      <Image
                        source={{ uri: notice.mediaUrl || notice.imageUrl }}
                        style={styles.noticeImage}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.downloadButton}
                      onPress={() => saveImageToGallery(notice.mediaUrl || notice.imageUrl)}
                    >
                      <Text style={styles.downloadText}>Download Image</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Full screen image modal */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalBackground}>
            <Image
              source={{ uri: selectedImageUri }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          </View>
        </TouchableWithoutFeedback>
      </Modal>

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
    marginBottom:10,
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
  downloadButton: {
    backgroundColor: "#146ED7",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: "flex-start",
  },
  downloadText: {
    color: "#fff",
    fontWeight: "600",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "90%",
    height: "80%",
    borderRadius: 10,
  },
});
