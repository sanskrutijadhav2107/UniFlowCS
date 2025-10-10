
// import * as FileSystem from "expo-file-system";
// import * as MediaLibrary from "expo-media-library";
// import { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   Modal,
//   Platform,
//   RefreshControl,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   View,
// } from "react-native";

// import { collection, getDocs, orderBy, query } from "firebase/firestore";
// import { db } from "../../firebase";
// import BottomNavbar from "./components/BottomNavbar";

// export default function NoticeBoard() {
//   const [notices, setNotices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   // For full-screen image modal
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedImageUri, setSelectedImageUri] = useState(null);

//   // Request media library permissions on mount
//   useEffect(() => {
//     (async () => {
//       if (Platform.OS !== "web") {
//         const { status } = await MediaLibrary.requestPermissionsAsync();
//         if (status !== "granted") {
//           Alert.alert(
//             "Permission required",
//             "Please enable media library permissions."
//           );
//         }
//       }
//     })();
//   }, []);

//   const fetchNotices = async () => {
//     try {
//       const q = query(collection(db, "notices"), orderBy("createdAt", "desc"));
//       const querySnapshot = await getDocs(q);

//       const noticesList = [];
//       querySnapshot.forEach((doc) => {
//         noticesList.push({ id: doc.id, ...doc.data() });
//       });

//       setNotices(noticesList);
//     } catch (error) {
//       console.error("Error fetching notices: ", error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchNotices();
//   }, []);

//   // Save image from URL to device gallery
//   const saveImageToGallery = async (imageUri) => {
//     try {
//       const fileUri = FileSystem.cacheDirectory + imageUri.split('/').pop();
//       const { uri } = await FileSystem.downloadAsync(imageUri, fileUri);
//       await MediaLibrary.saveToLibraryAsync(uri);
//       Alert.alert("Success", "Image saved to gallery!");
//     } catch (error) {
//       Alert.alert("Error", "Failed to save image: " + error.message);
//     }
//   };

//   // Open modal to show full-screen image
//   const openImageModal = (uri) => {
//     setSelectedImageUri(uri);
//     setModalVisible(true);
//   };

//   if (loading) {
//     return (
//       <View style={styles.loader}>
//         <ActivityIndicator size="large" color="#0C2D57" />
//         <Text>Loading Notices...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 90 }}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={fetchNotices} />
//         }
//       >
//         <Text style={styles.header}>Notice Board</Text>
       

//         {notices.length === 0 ? (
//           <Text style={styles.empty}>No notices available 📭</Text>
//         ) : (
//           notices.map((notice) => (
//             <View key={notice.id} style={styles.noticeCard}>
//               {/* Teacher Info */}
//               <View style={styles.teacherRow}>
//                 <View style={styles.avatar}>
//                   <Text style={styles.avatarText}>
//                     {notice.postedBy?.charAt(0)?.toUpperCase() || "A"}
//                   </Text>
//                 </View>
//                 <Text style={styles.teacherName}>{notice.postedBy || "Admin"}</Text>
//               </View>

//               {/* Notice Text */}
//               <View style={styles.noticeTextBox}>
//                 <Text style={styles.noticeText}>{notice.description || notice.text}</Text>

//                 {/* Show image if mediaUrl or imageUrl field exists */}
//                 {(notice.mediaUrl || notice.imageUrl) && (
//                   <>
//                     <TouchableOpacity onPress={() => openImageModal(notice.mediaUrl || notice.imageUrl)}>
//                       <Image
//                         source={{ uri: notice.mediaUrl || notice.imageUrl }}
//                         style={styles.noticeImage}
//                       />
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                       style={styles.downloadButton}
//                       onPress={() => saveImageToGallery(notice.mediaUrl || notice.imageUrl)}
//                     >
//                       <Text style={styles.downloadText}>Download Image</Text>
//                     </TouchableOpacity>
//                   </>
//                 )}
//               </View>
//             </View>
//           ))
//         )}
//       </ScrollView>

//       {/* Full screen image modal */}
//       <Modal visible={modalVisible} transparent={true} animationType="fade">
//         <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
//           <View style={styles.modalBackground}>
//             <Image
//               source={{ uri: selectedImageUri }}
//               style={styles.fullImage}
//               resizeMode="contain"
//             />
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>

//       <BottomNavbar active="home" />
//     </View>
//   );
// }


// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#B3D7FF" },
//   header: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#0C2D57",
//     textAlign: "center",
//     marginTop: 10,
//     marginBottom:10,
//   },
  

//   loader: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   empty: {
//     textAlign: "center",
//     marginTop: 50,
//     fontSize: 16,
//     color: "#555",
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
//   noticeImage: {
//     width: "100%",
//     height: 150,
//     borderRadius: 12,
//     marginTop: 10,
//   },
//   downloadButton: {
//     backgroundColor: "#146ED7",
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//     marginTop: 10,
//     alignSelf: "flex-start",
//   },
//   downloadText: {
//     color: "#fff",
//     fontWeight: "600",
//   },
//   modalBackground: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.9)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   fullImage: {
//     width: "90%",
//     height: "80%",
//     borderRadius: 10,
//   },
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
  StatusBar,
  SafeAreaView,
} from "react-native";

import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";
import BottomNavbar from "./components/BottomNavbar";

export default function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Full-screen image modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState(null);

  // Request media library permissions on mount (logic unchanged)
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

  // --- Backend fetch: UNCHANGED ---
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

  // Save image to gallery (logic unchanged)
  const saveImageToGallery = async (imageUri) => {
    try {
      const fileUri = FileSystem.cacheDirectory + imageUri.split("/").pop();
      const { uri } = await FileSystem.downloadAsync(imageUri, fileUri);
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert("Saved", "Image saved to gallery.");
    } catch (error) {
      Alert.alert("Error", "Failed to save image: " + error.message);
    }
  };

  const openImageModal = (uri) => {
    setSelectedImageUri(uri);
    setModalVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color="#2d6eefff" />
        <Text style={styles.loaderText}>Fetching the latest notices…</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 90 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchNotices}
              tintColor="#2d6eefff"
              colors={["#2d6eefff"]}
            />
          }
        >
          <Text style={styles.header}>Notice Board</Text>
          <Text style={styles.subHeader}>
            Stay updated with recent announcements
          </Text>

          {notices.length === 0 ? (
            <View style={styles.emptyWrap}>
              <View style={styles.emptyBadge}>
                <Text style={styles.emptyBadgeText}>📭</Text>
              </View>
              <Text style={styles.emptyTitle}>No notices yet</Text>
              <Text style={styles.emptyText}>
                Pull down to refresh or check back later.
              </Text>
            </View>
          ) : (
            notices.map((notice) => {
              const image = notice.mediaUrl || notice.imageUrl;
              const postedBy = notice.postedBy || "Admin";
              const initial =
                (postedBy && postedBy.charAt(0).toUpperCase()) || "A";

              return (
                <View key={notice.id} style={styles.noticeCard}>
                  {/* Header row */}
                  <View style={styles.teacherRow}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{initial}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.teacherName}>{postedBy}</Text>
                      <Text style={styles.metaText}>
                        {notice.title || "Announcement"}
                      </Text>
                    </View>
                  </View>

                  {/* Body */}
                  <View style={styles.noticeTextBox}>
                    <Text style={styles.noticeText}>
                      {notice.description || notice.text}
                    </Text>

                    {image ? (
                      <>
                        <TouchableOpacity
                          activeOpacity={0.85}
                          onPress={() => openImageModal(image)}
                          style={styles.imageWrap}
                        >
                          <Image source={{ uri: image }} style={styles.noticeImage} />
                          <View style={styles.imageOverlay}>
                            <Text style={styles.imageHint}>Tap to view</Text>
                          </View>
                        </TouchableOpacity>

                        <View style={styles.actionsRow}>
                          <TouchableOpacity
                            style={styles.primaryBtn}
                            onPress={() => saveImageToGallery(image)}
                            activeOpacity={0.8}
                          >
                            <Text style={styles.primaryBtnText}>
                              Download Image
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </>
                    ) : null}
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        {/* Full screen image modal */}
        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={styles.modalBackground}>
            <TouchableOpacity
              style={styles.closePill}
              activeOpacity={0.8}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closePillText}>Close</Text>
            </TouchableOpacity>

            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
              <View style={styles.fullWrap}>
                {selectedImageUri ? (
                  <Image
                    source={{ uri: selectedImageUri }}
                    style={styles.fullImage}
                    resizeMode="contain"
                  />
                ) : null}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </Modal>

        <BottomNavbar active="home" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#EAF2FF" },
  container: { flex: 1, backgroundColor: "#EAF2FF" },

  header: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2d6eefff",
    textAlign: "center",
    marginTop: 6,
  },
  subHeader: {
    fontSize: 12,
    textAlign: "center",
    color: "#3E5B85",
    marginBottom: 12,
    marginTop: 2,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EAF2FF",
  },
  loaderText: { marginTop: 10, color: "#2d6eefff", fontSize: 13 },

  emptyWrap: { alignItems: "center", marginTop: 50, paddingHorizontal: 24 },
  emptyBadge: {
    backgroundColor: "#F0F6FF",
    borderWidth: 1,
    borderColor: "#D1E1FF",
    width: 70,
    height: 70,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  emptyBadgeText: { fontSize: 30 },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: "#2d6eefff", marginBottom: 4 },
  emptyText: { textAlign: "center", fontSize: 13, color: "#516C97" },

  noticeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(12,45,87,0.06)",
    shadowColor: "#2d6eefff",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  teacherRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  avatar: {
    backgroundColor: "#0C8CE9",
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  teacherName: { fontWeight: "700", fontSize: 15, color: "#0C2D57" },
  metaText: { marginTop: 2, fontSize: 11, color: "#6D86AC" },

  noticeTextBox: {
    backgroundColor: "#F7FAFF",
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E3EDFF",
  },
  noticeText: { fontSize: 13.5, color: "#2A3649", lineHeight: 20 },

  imageWrap: {
    marginTop: 10,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E3EDFF",
  },
  noticeImage: { width: "100%", height: 170 },
  imageOverlay: {
    position: "absolute",
    right: 8,
    bottom: 8,
    backgroundColor: "rgba(12,45,87,0.9)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  imageHint: { color: "#fff", fontSize: 11, fontWeight: "600" },

  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    // removed `gap` for compatibility
  },
  primaryBtn: {
    backgroundColor: "#146ED7",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginRight: 8, // manual spacing instead of `gap`
  },
  primaryBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12.5,
    letterSpacing: 0.2,
  },

  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.92)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  closePill: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    zIndex: 10,
  },
  closePillText: { color: "#fff", fontWeight: "700", fontSize: 12 },

  fullWrap: { width: "100%", height: "80%", alignItems: "center", justifyContent: "center" },
  fullImage: { width: "100%", height: "100%", borderRadius: 12 },
});
