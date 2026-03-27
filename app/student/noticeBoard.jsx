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
//   StatusBar,
//   SafeAreaView,
// } from "react-native";

// import { collection, getDocs, orderBy, query } from "firebase/firestore";
// import { db } from "../../firebase";
// import BottomNavbar from "./components/BottomNavbar";

// export default function NoticeBoard() {
//   const [notices, setNotices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   // Full-screen image modal
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedImageUri, setSelectedImageUri] = useState(null);

//   // Request media library permissions on mount (logic unchanged)
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

//   // --- Backend fetch: UNCHANGED ---
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

//   // Save image to gallery (logic unchanged)
//   const saveImageToGallery = async (imageUri) => {
//     try {
//       const fileUri = FileSystem.cacheDirectory + imageUri.split("/").pop();
//       const { uri } = await FileSystem.downloadAsync(imageUri, fileUri);
//       await MediaLibrary.saveToLibraryAsync(uri);
//       Alert.alert("Saved", "Image saved to gallery.");
//     } catch (error) {
//       Alert.alert("Error", "Failed to save image: " + error.message);
//     }
//   };

//   const openImageModal = (uri) => {
//     setSelectedImageUri(uri);
//     setModalVisible(true);
//   };

//   if (loading) {
//     return (
//       <View style={styles.loader}>
//         <StatusBar barStyle="dark-content" />
//         <ActivityIndicator size="large" color="#2d6eefff" />
//         <Text style={styles.loaderText}>Fetching the latest notices…</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.safe}>
//       <StatusBar barStyle="dark-content" />
//       <View style={styles.container}>
//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={{ paddingBottom: 90 }}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={fetchNotices}
//               tintColor="#2d6eefff"
//               colors={["#2d6eefff"]}
//             />
//           }
//         >
//           <Text style={styles.header}>Notice Board</Text>
//           <Text style={styles.subHeader}>
//             Stay updated with recent announcements
//           </Text>

//           {notices.length === 0 ? (
//             <View style={styles.emptyWrap}>
//               <View style={styles.emptyBadge}>
//                 <Text style={styles.emptyBadgeText}>📭</Text>
//               </View>
//               <Text style={styles.emptyTitle}>No notices yet</Text>
//               <Text style={styles.emptyText}>
//                 Pull down to refresh or check back later.
//               </Text>
//             </View>
//           ) : (
//             notices.map((notice) => {
//               const image = notice.mediaUrl || notice.imageUrl;
//               const postedBy = notice.postedBy || "Admin";
//               const initial =
//                 (postedBy && postedBy.charAt(0).toUpperCase()) || "A";

//               return (
//                 <View key={notice.id} style={styles.noticeCard}>
//                   {/* Header row */}
//                   <View style={styles.teacherRow}>
//                     <View style={styles.avatar}>
//                       <Text style={styles.avatarText}>{initial}</Text>
//                     </View>
//                     <View style={{ flex: 1 }}>
//                       <Text style={styles.teacherName}>{postedBy}</Text>
//                       <Text style={styles.metaText}>
//                         {notice.title || "Announcement"}
//                       </Text>
//                     </View>
//                   </View>

//                   {/* Body */}
//                   <View style={styles.noticeTextBox}>
//                     <Text style={styles.noticeText}>
//                       {notice.description || notice.text}
//                     </Text>

//                     {image ? (
//                       <>
//                         <TouchableOpacity
//                           activeOpacity={0.85}
//                           onPress={() => openImageModal(image)}
//                           style={styles.imageWrap}
//                         >
//                           <Image source={{ uri: image }} style={styles.noticeImage} />
//                           <View style={styles.imageOverlay}>
//                             <Text style={styles.imageHint}>Tap to view</Text>
//                           </View>
//                         </TouchableOpacity>

//                         <View style={styles.actionsRow}>
//                           <TouchableOpacity
//                             style={styles.primaryBtn}
//                             onPress={() => saveImageToGallery(image)}
//                             activeOpacity={0.8}
//                           >
//                             <Text style={styles.primaryBtnText}>
//                               Download Image
//                             </Text>
//                           </TouchableOpacity>
//                         </View>
//                       </>
//                     ) : null}
//                   </View>
//                 </View>
//               );
//             })
//           )}
//         </ScrollView>

//         {/* Full screen image modal */}
//         <Modal visible={modalVisible} transparent animationType="fade">
//           <View style={styles.modalBackground}>
//             <TouchableOpacity
//               style={styles.closePill}
//               activeOpacity={0.8}
//               onPress={() => setModalVisible(false)}
//             >
//               <Text style={styles.closePillText}>Close</Text>
//             </TouchableOpacity>

//             <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
//               <View style={styles.fullWrap}>
//                 {selectedImageUri ? (
//                   <Image
//                     source={{ uri: selectedImageUri }}
//                     style={styles.fullImage}
//                     resizeMode="contain"
//                   />
//                 ) : null}
//               </View>
//             </TouchableWithoutFeedback>
//           </View>
//         </Modal>

//         <BottomNavbar active="home" />
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: "#EAF2FF" },
//   container: { flex: 1, backgroundColor: "#EAF2FF" },

//   header: {
//     fontSize: 24,
//     fontWeight: "800",
//     color: "#2d6eefff",
//     textAlign: "center",
//     marginTop: 6,
//   },
//   subHeader: {
//     fontSize: 12,
//     textAlign: "center",
//     color: "#3E5B85",
//     marginBottom: 12,
//     marginTop: 2,
//   },

//   loader: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#EAF2FF",
//   },
//   loaderText: { marginTop: 10, color: "#2d6eefff", fontSize: 13 },

//   emptyWrap: { alignItems: "center", marginTop: 50, paddingHorizontal: 24 },
//   emptyBadge: {
//     backgroundColor: "#F0F6FF",
//     borderWidth: 1,
//     borderColor: "#D1E1FF",
//     width: 70,
//     height: 70,
//     borderRadius: 16,
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 12,
//   },
//   emptyBadgeText: { fontSize: 30 },
//   emptyTitle: { fontSize: 16, fontWeight: "700", color: "#2d6eefff", marginBottom: 4 },
//   emptyText: { textAlign: "center", fontSize: 13, color: "#516C97" },

//   noticeCard: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 14,
//     marginHorizontal: 16,
//     marginBottom: 14,
//     padding: 12,
//     borderWidth: 1,
//     borderColor: "rgba(12,45,87,0.06)",
//     shadowColor: "#2d6eefff",
//     shadowOpacity: 0.06,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 4 },
//     elevation: 2,
//   },

//   teacherRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
//   avatar: {
//     backgroundColor: "#0C8CE9",
//     width: 40,
//     height: 40,
//     borderRadius: 12,
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 10,
//   },
//   avatarText: { color: "#fff", fontWeight: "800", fontSize: 16 },
//   teacherName: { fontWeight: "700", fontSize: 15, color: "#0C2D57" },
//   metaText: { marginTop: 2, fontSize: 11, color: "#6D86AC" },

//   noticeTextBox: {
//     backgroundColor: "#F7FAFF",
//     borderRadius: 12,
//     padding: 10,
//     borderWidth: 1,
//     borderColor: "#E3EDFF",
//   },
//   noticeText: { fontSize: 13.5, color: "#2A3649", lineHeight: 20 },

//   imageWrap: {
//     marginTop: 10,
//     borderRadius: 12,
//     overflow: "hidden",
//     borderWidth: 1,
//     borderColor: "#E3EDFF",
//   },
//   noticeImage: { width: "100%", height: 170 },
//   imageOverlay: {
//     position: "absolute",
//     right: 8,
//     bottom: 8,
//     backgroundColor: "rgba(12,45,87,0.9)",
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 999,
//   },
//   imageHint: { color: "#fff", fontSize: 11, fontWeight: "600" },

//   actionsRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 10,
//     // removed `gap` for compatibility
//   },
//   primaryBtn: {
//     backgroundColor: "#146ED7",
//     paddingVertical: 8,
//     paddingHorizontal: 14,
//     borderRadius: 10,
//     marginRight: 8, // manual spacing instead of `gap`
//   },
//   primaryBtnText: {
//     color: "#fff",
//     fontWeight: "700",
//     fontSize: 12.5,
//     letterSpacing: 0.2,
//   },

//   modalBackground: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.92)",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 16,
//   },
//   closePill: {
//     position: "absolute",
//     top: 50,
//     right: 20,
//     backgroundColor: "rgba(255,255,255,0.12)",
//     borderWidth: 1,
//     borderColor: "rgba(255,255,255,0.25)",
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 999,
//     zIndex: 10,
//   },
//   closePillText: { color: "#fff", fontWeight: "700", fontSize: 12 },

//   fullWrap: { width: "100%", height: "80%", alignItems: "center", justifyContent: "center" },
//   fullImage: { width: "100%", height: "100%", borderRadius: 12 },
// });
























import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import { LinearGradient } from "expo-linear-gradient";
import * as MediaLibrary from "expo-media-library";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { db } from "../../firebase";
import BottomNavbar from "./components/BottomNavbar";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const COLORS = {
  primaryDark: "#1A50C8",
  primary: "#2D6EEF",
  primaryLight: "#60A5FA",
  bg: "#F8FAFF",
  white: "#FFFFFF",
  textMain: "#0F172A",
  textSub: "#64748B",
  accent: "#146ED7",
};

export default function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission required", "Please enable media library permissions.");
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

  const saveImageToGallery = async (imageUri) => {
    try {
      const fileUri = FileSystem.cacheDirectory + imageUri.split("/").pop();
      const { uri } = await FileSystem.downloadAsync(imageUri, fileUri);
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert("Success", "Notice saved to your gallery.");
    } catch (error) {
      Alert.alert("Error", "Failed to save: " + error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* CAMPUS BUZZ HEADER */}
      <LinearGradient 
        colors={[COLORS.primaryDark, COLORS.primary, COLORS.primaryLight]} 
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} 
        style={styles.header}
      >
        <SafeAreaView>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>Notice Board</Text>
              <Text style={styles.headerSub}>Official Campus Announcements</Text>
            </View>
            <View style={styles.bellCircle}>
              <MaterialCommunityIcons name="bell-ring-outline" size={24} color="white" />
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchNotices} tintColor={COLORS.primary} />
        }
      >
        {notices.length === 0 ? (
          <View style={styles.emptyWrap}>
            <MaterialCommunityIcons name="text-box-remove-outline" size={80} color={COLORS.textSub} />
            <Text style={styles.emptyTitle}>No New Notices</Text>
            <Text style={styles.emptySub}>Everything is up to date!</Text>
          </View>
        ) : (
          notices.map((notice) => {
            const image = notice.mediaUrl || notice.imageUrl;
            const postedBy = notice.postedBy || "University Admin";
            const initial = postedBy.charAt(0).toUpperCase();

            return (
              <View key={notice.id} style={styles.noticeCard}>
                {/* Notice Header - Now displays NAME */}
                <View style={styles.teacherRow}>
                  <LinearGradient colors={[COLORS.primary, COLORS.primaryLight]} style={styles.avatar}>
                    <Text style={styles.avatarText}>{initial}</Text>
                  </LinearGradient>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.teacherName}>{postedBy}</Text>
                    <Text style={styles.noticeTitleText}>{notice.title || "Announcement"}</Text>
                  </View>
                  <MaterialCommunityIcons name="dots-vertical" size={20} color={COLORS.textSub} />
                </View>

                {/* Notice Body */}
                <View style={styles.bodyContent}>
                  <Text style={styles.noticeBodyText}>
                    {notice.description || notice.text}
                  </Text>

                  {image && (
                    <View style={styles.imageContainer}>
                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => {
                          setSelectedImageUri(image);
                          setModalVisible(true);
                        }}
                      >
                        <Image source={{ uri: image }} style={styles.noticeImage} />
                        <View style={styles.zoomIcon}>
                          <MaterialCommunityIcons name="magnify-plus" size={18} color="white" />
                        </View>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.downloadFloat}
                        onPress={() => saveImageToGallery(image)}
                      >
                        <MaterialCommunityIcons name="download" size={20} color="white" />
                        <Text style={styles.downloadText}>Save to Gallery</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Image Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
            <MaterialCommunityIcons name="close" size={28} color="white" />
          </TouchableOpacity>
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.fullWrap}>
              <Image source={{ uri: selectedImageUri }} style={styles.fullImage} resizeMode="contain" />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>

      <BottomNavbar active="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: COLORS.bg },
  loader: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.bg },
  
  header: {
    height: 160,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    justifyContent: 'center',
    elevation: 10,
  },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Platform.OS === 'android' ? 10 : 0 },
  headerTitle: { color: 'white', fontSize: 26, fontWeight: '900', letterSpacing: -0.5 },
  headerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600' },
  bellCircle: { width: 45, height: 45, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },

  scroll: { flex: 1, marginTop: -25 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 110 },

  emptyWrap: { alignItems: "center", marginTop: 80 },
  emptyTitle: { fontSize: 18, fontWeight: "800", color: COLORS.textMain, marginTop: 15 },
  emptySub: { fontSize: 14, color: COLORS.textSub, marginTop: 5 },

  noticeCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    marginBottom: 16,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 5 },
  },

  teacherRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  avatar: { width: 45, height: 45, borderRadius: 15, justifyContent: "center", alignItems: "center", marginRight: 12 },
  avatarText: { color: "#fff", fontWeight: "900", fontSize: 18 },
  teacherName: { fontWeight: "800", fontSize: 16, color: COLORS.textMain },
  noticeTitleText: { fontSize: 12, color: COLORS.primary, fontWeight: '700', marginTop: 2 },

  bodyContent: { paddingTop: 5 },
  noticeBodyText: { fontSize: 14, color: "#475569", lineHeight: 22, fontWeight: '500' },

  imageContainer: { marginTop: 15, borderRadius: 20, overflow: 'hidden', position: 'relative' },
  noticeImage: { width: "100%", height: 200, backgroundColor: '#F1F5F9' },
  zoomIcon: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(0,0,0,0.5)', padding: 6, borderRadius: 10 },
  
  downloadFloat: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    position: 'absolute',
    bottom: 12,
    right: 12,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 12,
    elevation: 5,
  },
  downloadText: { color: 'white', fontWeight: '800', fontSize: 11, marginLeft: 6 },

  modalBackground: { flex: 1, backgroundColor: "rgba(0,0,0,0.95)", justifyContent: "center" },
  closeBtn: { position: "absolute", top: 50, right: 25, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 20 },
  fullWrap: { width: SCREEN_WIDTH, height: "80%" },
  fullImage: { width: "100%", height: "100%" },
});

