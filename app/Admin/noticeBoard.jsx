

// import { Ionicons } from "@expo/vector-icons";
// import * as FileSystem from "expo-file-system";
// import * as ImagePicker from "expo-image-picker";
// import * as MediaLibrary from "expo-media-library";
// import { useEffect, useRef, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   KeyboardAvoidingView,
//   Modal,
//   Platform,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   View,
// } from "react-native";

// import {
//   addDoc,
//   collection,
//   db,
//   onSnapshot,
//   orderBy,
//   query,
//   serverTimestamp,
// } from "../../firebase"; // Adjust path to your firebase.js

// export default function AdminNoticeBoard() {
//   const [notice, setNotice] = useState("");
//   const [notices, setNotices] = useState([]);
//   const [mediaUri, setMediaUri] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedImageUri, setSelectedImageUri] = useState(null);
//   const scrollViewRef = useRef();

//   // Cloudinary config
//   const cloudName = "dveatasry"; // your Cloudinary cloud name
//   const uploadPreset = "unsigned_preset"; // your unsigned upload preset

//   useEffect(() => {
//     // Ask media library permission (required for saving images)
//     (async () => {
//       const { status } = await MediaLibrary.requestPermissionsAsync();
//       if (status !== "granted") {
//         Alert.alert("Permission denied", "Enable media library permissions to save images.");
//       }
//     })();

//     // Real-time listener to Firestore notices collection
//     const q = query(collection(db, "notices"), orderBy("createdAt", "asc"));
//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const fetched = [];
//       snapshot.forEach((doc) => fetched.push({ id: doc.id, ...doc.data() }));
//       setNotices(fetched);
//     });

//     return () => unsubscribe();
//   }, []);

//   // Upload image to Cloudinary
//   const uploadImageToCloudinary = async (uri) => {
//     setUploading(true);
//     const formData = new FormData();
//     formData.append("file", { uri, type: "image/jpeg", name: "upload.jpg" });
//     formData.append("upload_preset", uploadPreset);
//     try {
//       const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
//         method: "POST",
//         body: formData,
//       });
//       const data = await res.json();
//       setUploading(false);
//       return data.secure_url;
//     } catch (error) {
//       Alert.alert("Upload error", error.message);
//       setUploading(false);
//       return null;
//     }
//   };

//   // Pick image
//   const pickImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: false,
//       quality: 1,
//     });
//     if (!result.canceled) {
//       setMediaUri(result.assets[0].uri);
//     }
//   };

//   // Add notice to Firestore (text + optional image)
//   const addNotice = async () => {
//     if (notice.trim() === "" && !mediaUri) return;

//     try {
//       let mediaUrl = null;
//       if (mediaUri) {
//         mediaUrl = await uploadImageToCloudinary(mediaUri);
//       }
//       await addDoc(collection(db, "notices"), {
//         text: notice.trim() || null,
//         mediaUrl: mediaUrl,
//         createdAt: serverTimestamp(),
//         postedBy: "Admin", // Change to logged-in user if applicable
//       });
//       setNotice("");
//       setMediaUri(null);
//     } catch (error) {
//       Alert.alert("Error", "Failed to post notice: " + error.message);
//     }
//   };

//   // Open full-screen image preview modal
//   const openImageModal = (uri) => {
//     setSelectedImageUri(uri);
//     setModalVisible(true);
//   };

//   // Save image locally on device
//   const saveImageToGallery = async (imageUri) => {
//     try {
//       const fileUri = FileSystem.cacheDirectory + imageUri.split("/").pop();
//       const { uri } = await FileSystem.downloadAsync(imageUri, fileUri);
//       await MediaLibrary.saveToLibraryAsync(uri);
//       Alert.alert("Success", "Image saved to gallery!");
//     } catch (error) {
//       Alert.alert("Error", "Failed to save image: " + error.message);
//     }
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         keyboardVerticalOffset={90}
//       >
//          {/* Page Title */}
//                               <View style={styles.header}>
//                                 <Text style={styles.pageTitle}>Notice Board</Text>
//                                 <Text style={styles.subTitle}>Welcome</Text>
//                               </View>

//         {/* Notices List */}
//         <ScrollView
//           style={styles.list}
//           ref={scrollViewRef}
//           onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
//         >
//           {notices.map((n) => (
//             <View key={n.id} style={styles.noticeRow}>
//               <Image
//                 source={{ uri: "https://cdn-icons-png.flaticon.com/512/219/219969.png" }}
//                 style={styles.avatar}
//               />
//               <View style={styles.noticeBubble}>
//                 {n.mediaUrl && (
//                   <>
//                     <TouchableOpacity onPress={() => openImageModal(n.mediaUrl)}>
//                       <Image source={{ uri: n.mediaUrl }} style={styles.noticeImage} />
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                       style={styles.downloadButton}
//                       onPress={() => saveImageToGallery(n.mediaUrl)}
//                     >
//                       <Text style={styles.downloadText}>Download</Text>
//                     </TouchableOpacity>
//                   </>
//                 )}
//                 {n.text ? <Text style={styles.noticeText}>{n.text}</Text> : null}
//                 <Text style={styles.noticeDate}>
//                   {n.createdAt?.toDate
//                     ? n.createdAt.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//                     : ""}
//                 </Text>
//               </View>
//             </View>
//           ))}
//         </ScrollView>

//         {uploading && (
//           <View style={{ padding: 10 }}>
//             <ActivityIndicator size="large" color="#2d6eefff" />
//             <Text>Uploading Image...</Text>
//           </View>
//         )}

//         {/* Input Bar */}
//         <View style={styles.inputBar}>
//           {/* Attachment Button */}
//           <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
//             <Ionicons name="attach" size={22} color="#2d6eefff" />
//           </TouchableOpacity>

//           {/* Text Input */}
//           <TextInput
//             style={styles.input}
//             placeholder="Type a notice..."
//             value={notice}
//             onChangeText={setNotice}
//             multiline
//           />

//           {/* Send Button */}
//           <TouchableOpacity style={styles.sendButton} onPress={addNotice}>
//             <Ionicons name="send" size={20} color="#fff" />
//           </TouchableOpacity>
//         </View>

//         {/* Fullscreen Image Modal */}
//         <Modal visible={modalVisible} transparent animationType="fade">
//           <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
//             <View style={styles.modalBackground}>
//               <Image source={{ uri: selectedImageUri }} style={styles.fullImage} resizeMode="contain" />
//             </View>
//           </TouchableWithoutFeedback>
//         </Modal>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }


// const styles = StyleSheet.create({
//   // Header
//   header: {
//     paddingTop: 30,
//     paddingBottom: 20,
//     paddingHorizontal: 20,
//     backgroundColor: "#E3F0FF",
//     borderBottomLeftRadius: 18,
//     borderBottomRightRadius: 18,
//     shadowColor: "#000",
//     shadowOpacity: 0.15,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 3 },
//     elevation: 6,
    
//   },
//   pageTitle: {
//     fontSize: 24,
//     fontWeight: "800",
//     color: "#146ED7",
//   },
//   subTitle: {
//     fontSize: 14,
//     color: "#146ED7",
//     marginTop: 4,
//   },

//   list: { flex: 1, padding: 10 },
//   noticeRow: { flexDirection: "row", marginBottom: 10, alignItems: "flex-end" },
//   avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 8 },

//   noticeBubble: {
//     backgroundColor: "#DCF8C6",
//     padding: 10,
//     borderRadius: 10,
//     maxWidth: "75%",
//   },
//   noticeText: { fontSize: 15 },
//   noticeDate: { fontSize: 11, color: "gray", textAlign: "right", marginTop: 5 },
//   noticeImage: {
//     width: 150,
//     height: 150,
//     borderRadius: 8,
//     marginBottom: 5,
//   },
//   inputBar: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 8,
//     borderTopWidth: 1,
//     borderTopColor: "#ddd",
//     backgroundColor: "#fff",
//     marginBottom :33,
//   },
//   input: {
//     flex: 1,
//     backgroundColor: "#F0F0F0",
//     borderRadius: 20,
//     paddingHorizontal: 15,
//     paddingVertical: 8,
//     fontSize: 15,
//     maxHeight: 100,
//   },
//   sendButton: {
//     backgroundColor: "#2d6eefff",
//     padding: 10,
//     borderRadius: 50,
//     marginLeft: 5,
//   },
//   iconButton: {
//     padding: 6,
//     marginRight: 5,
//   },
//   downloadButton: {
//     backgroundColor: "#2d6eefff",
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 16,
//     alignSelf: "flex-start",
//     marginBottom: 5,
//   },
//   downloadText: {
//     color: "white",
//     fontWeight: "600",
//   },
//   modalBackground: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.90)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   fullImage: {
//     width: "90%",
//     height: "80%",
//     borderRadius: 10,
//   },
// });






import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  addDoc,
  collection,
  db,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "../../firebase";

const COLORS = {
  primaryDark: "#1A50C8",
  primary: "#2D6EEF",
  primaryLight: "#60A5FA",
  bg: "#F8FAFF",
  white: "#FFFFFF",
  textMain: "#0F172A",
  textSub: "#64748B",
  accent: "#E0E7FF",
};

export default function AdminNoticeBoard() {
  const [notice, setNotice] = useState("");
  const [notices, setNotices] = useState([]);
  const [mediaUri, setMediaUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const scrollViewRef = useRef();
  const [adminName, setAdminName] = useState("");
  const [adminPhoto, setAdminPhoto] = useState(""); 
  // Cloudinary config
  const cloudName = "dveatasry"; 
  const uploadPreset = "unsigned_preset"; 
  

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Enable media library permissions.");
      }
    })();

    const q = query(collection(db, "notices"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = [];
      snapshot.forEach((doc) => fetched.push({ id: doc.id, ...doc.data() }));
      setNotices(fetched);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
  const loadAdmin = async () => {
    const data = await AsyncStorage.getItem("admin");

    if (data) {
      const parsed = JSON.parse(data);

      // adjust if needed
      setAdminName(parsed.name || parsed.fullName || "Admin");
setAdminPhoto(parsed.photo || "");
    }
  };

  loadAdmin();
}, []);

  const uploadImageToCloudinary = async (uri) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", { uri, type: "image/jpeg", name: "upload.jpg" });
    formData.append("upload_preset", uploadPreset);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setUploading(false);
      return data.secure_url;
    } catch (error) {
      Alert.alert("Upload error", error.message);
      setUploading(false);
      return null;
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled) {
      setMediaUri(result.assets[0].uri);
    }
  };

  const addNotice = async () => {
    if (notice.trim() === "" && !mediaUri) return;
    try {
      let mediaUrl = null;
      if (mediaUri) {
        mediaUrl = await uploadImageToCloudinary(mediaUri);
      }
      await addDoc(collection(db, "notices"), {
        text: notice.trim() || null,
        mediaUrl: mediaUrl,
        createdAt: serverTimestamp(),
        postedBy: adminName,
        authorPhoto: adminPhoto || null,
      });
      setNotice("");
      setMediaUri(null);
    } catch (error) {
      Alert.alert("Error", "Failed to post notice: " + error.message);
    }
  };

  const openImageModal = (uri) => {
    setSelectedImageUri(uri);
    setModalVisible(true);
  };

  const saveImageToGallery = async (imageUri) => {
    try {
      const fileUri = FileSystem.cacheDirectory + imageUri.split("/").pop();
      const { uri } = await FileSystem.downloadAsync(imageUri, fileUri);
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert("Success", "Saved to gallery!");
    } catch (error) {
      Alert.alert("Error", "Failed to save: " + error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* 🛠 KEYBOARD AVOIDING VIEW FIXED */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        // This offset is crucial: 90-100 is usually the sweet spot for Expo Router headers
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 100} 
      >
        {/* HEADER */}
        <LinearGradient 
          colors={[COLORS.primaryDark, COLORS.primary, COLORS.primaryLight]} 
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>Notice Board</Text>
              <Text style={styles.headerSub}>Campus Announcements</Text>
            </View>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="bullhorn-variant" size={24} color="white" />
            </View>
          </View>
        </LinearGradient>

        {/* NOTICES LIST */}
        <ScrollView
          style={styles.list}
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled" // Allows clicking buttons while keyboard is up
        >
          {notices.map((n) => (
            <View key={n.id} style={styles.noticeRow}>
              <Image
                source={{
                  uri:
                    n.authorPhoto ||
                    `https://ui-avatars.com/api/?name=${n.postedBy || "A"}&background=2D6EEF&color=fff`,
                }}
                style={styles.avatar}
              />
              <View style={styles.noticeBubble}>
                {n.mediaUrl && (
                  <View style={styles.imageWrapper}>
                    <TouchableOpacity onPress={() => openImageModal(n.mediaUrl)} activeOpacity={0.9}>
                      <Image source={{ uri: n.mediaUrl }} style={styles.noticeImage} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.downloadFloatingBtn}
                      onPress={() => saveImageToGallery(n.mediaUrl)}
                    >
                      <Ionicons name="download-outline" size={18} color="white" />
                    </TouchableOpacity>
                  </View>
                )}
                {n.text ? <Text style={styles.noticeText}>{n.text}</Text> : null}
                <Text style={styles.noticeDate}>
                   {n.createdAt?.toDate ? n.createdAt.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "..."}
                </Text>
              </View>
            </View>
          ))}
          {/* Add a little spacer at the bottom of the list */}
          <View style={{ height: 20 }} />
        </ScrollView>

        {/* INPUT AREA */}
        <View style={styles.bottomSection}>
          {mediaUri && (
            <View style={styles.previewBar}>
               <Image source={{ uri: mediaUri }} style={styles.smallPreview} />
               <Text style={styles.previewText}>Image Ready</Text>
               <TouchableOpacity onPress={() => setMediaUri(null)}>
                  <Ionicons name="close-circle" size={22} color={COLORS.textSub} />
               </TouchableOpacity>
            </View>
          )}

          {uploading && (
            <View style={styles.uploadingBar}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.uploadingText}>Uploading Image...</Text>
            </View>
          )}

          <View style={styles.inputBar}>
            <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
              <Ionicons name="camera-outline" size={26} color={COLORS.primary} />
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Write a notice..."
              value={notice}
              onChangeText={setNotice}
              multiline
              placeholderTextColor="#94A3B8"
            />

            <TouchableOpacity 
              style={[styles.sendButton, (!notice.trim() && !mediaUri) && styles.sendDisabled]} 
              onPress={addNotice}
              disabled={!notice.trim() && !mediaUri}
            >
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Image Modal */}
        <Modal visible={modalVisible} transparent animationType="fade">
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalBackground}>
              <Image source={{ uri: selectedImageUri }} style={styles.fullImage} resizeMode="contain" />
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    paddingTop: Platform.OS === 'ios' ? 10 : 45,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: "900", color: "#fff" },
  headerSub: { fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: "600" },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },

  list: { flex: 1, padding: 15 },
  noticeRow: { flexDirection: "row", marginBottom: 15, alignItems: "flex-end" },
  avatar: { width: 32, height: 32, borderRadius: 10, marginRight: 8 },
  noticeBubble: {
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 2,
    maxWidth: "85%",
    elevation: 2,
  },
  noticeText: { fontSize: 15, color: COLORS.textMain, lineHeight: 20 },
  noticeDate: { fontSize: 10, color: COLORS.textSub, textAlign: "right", marginTop: 4 },
  
  imageWrapper: { position: 'relative', marginBottom: 6 },
  noticeImage: { width: 200, height: 140, borderRadius: 12 },
  downloadFloatingBtn: { position: 'absolute', bottom: 5, right: 5, backgroundColor: 'rgba(0,0,0,0.5)', padding: 5, borderRadius: 8 },

  bottomSection: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20, // 👈 Extra padding for visibility
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFF",
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 5,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  input: { flex: 1, fontSize: 15, maxHeight: 120, color: COLORS.textMain, paddingHorizontal: 10 },
  sendButton: { backgroundColor: COLORS.primary, width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  sendDisabled: { backgroundColor: '#CBD5E1' },
  iconButton: { padding: 5 },

  previewBar: { flexDirection: 'row', alignItems: 'center', padding: 8, marginBottom: 8, backgroundColor: '#EFF6FF', borderRadius: 12 },
  smallPreview: { width: 35, height: 35, borderRadius: 6, marginRight: 10 },
  previewText: { flex: 1, fontSize: 12, fontWeight: '700', color: COLORS.primary },
  
  uploadingBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingBottom: 10 },
  uploadingText: { marginLeft: 8, fontSize: 12, color: COLORS.primary, fontWeight: '600' },

  modalBackground: { flex: 1, backgroundColor: "rgba(0,0,0,0.9)", justifyContent: "center", alignItems: "center" },
  fullImage: { width: "90%", height: "80%" },
});