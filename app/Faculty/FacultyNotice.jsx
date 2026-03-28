
// import { Ionicons } from "@expo/vector-icons";
// import * as ImagePicker from "expo-image-picker"; 
// import { useEffect, useRef, useState } from "react";
// import {
//   ActivityIndicator,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
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
// } from "../../firebase"; // Adjust path for your project

// export default function NoticeBoard() {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [mediaUri, setMediaUri] = useState(null); // Added for selected image URI
//   const [uploading, setUploading] = useState(false); // Upload image loading state
//   const [notices, setNotices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const scrollViewRef = useRef();

//   // Cloudinary details
//   const cloudName = "dveatasry"; // Your Cloudinary cloud name
//   const uploadPreset = "unsigned_preset"; // Your unsigned upload preset

//   useEffect(() => {
//     const q = query(collection(db, "notices"), orderBy("createdAt", "desc"));
//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const fetched = [];
//       snapshot.forEach((doc) => {
//         fetched.push({ id: doc.id, ...doc.data() });
//       });
//       setNotices(fetched);
//       setLoading(false);
//     });
//     return () => unsubscribe();
//   }, []);

//   // Upload image to Cloudinary and return secure URL
//   const uploadImageToCloudinary = async (uri) => {
//     setUploading(true);
//     let formData = new FormData();
//     formData.append("file", {
//       uri: uri,
//       type: "image/jpeg",
//       name: "upload.jpg",
//     });
//     formData.append("upload_preset", uploadPreset);

//     try {
//       const response = await fetch(
//         `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
//         {
//           method: "POST",
//           body: formData,
//         }
//       );
//       const data = await response.json();
//       setUploading(false);
//       return data.secure_url;
//     } catch (error) {
//       console.error("Cloudinary upload error:", error);
//       setUploading(false);
//       return null;
//     }
//   };

//   // Add notice with optional media URI
//   const addNotice = async () => {
//     if (!title.trim() && !description.trim() && !mediaUri) return;

//     try {
//       let mediaUrl = null;
//       if (mediaUri) {
//         mediaUrl = await uploadImageToCloudinary(mediaUri);
//       }
//       await addDoc(collection(db, "notices"), {
//         title: title.trim() || null,
//         description: description.trim() || null,
//         mediaUrl: mediaUrl,
//         createdAt: serverTimestamp(),
//         postedBy: "faculty", // Replace with auth user if available
//       });

//       setTitle("");
//       setDescription("");
//       setMediaUri(null);
//     } catch (err) {
//       console.error("Failed to add notice:", err);
//     }
//   };

//   // Pick image from library and set mediaUri
//   const pickImage = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: false,
//       quality: 1,
//     });
//     if (!result.canceled) {
//       setMediaUri(result.assets[0].uri);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loader}>
//         <ActivityIndicator size="large" color="#146ED7" />
//         <Text>Loading notices...</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         keyboardVerticalOffset={90}
//       >
//         {/* Header */}
//         <View style={styles.header}>
//           <Text style={styles.headerTitle}> Faculty Notice Board</Text>
//         </View>

//         {/* Notices List */}
//         <ScrollView
//           style={styles.list}
//           ref={scrollViewRef}
//           onContentSizeChange={() =>
//             scrollViewRef.current.scrollToEnd({ animated: true })
//           }
//         >
//           {notices.length === 0 && (
//             <Text style={{ textAlign: "center", marginTop: 20 }}>
//               No notices yet
//             </Text>
//           )}
//           {notices.map((n) => (
//             <View key={n.id} style={styles.noticeRow}>
//               <Image
//                 source={{
//                   uri:
//                     "https://cdn-icons-png.flaticon.com/512/219/219969.png",
//                 }}
//                 style={styles.avatar}
//               />
//               <View style={styles.noticeCard}>
//                 {n.title && <Text style={styles.noticeTitle}>{n.title}</Text>}
//                 {n.description && (
//                   <Text style={styles.noticeText}>{n.description}</Text>
//                 )}
//                 {n.mediaUrl && (
//                   <Image
//                     source={{ uri: n.mediaUrl }}
//                     style={styles.noticeImage}
//                   />
//                 )}
//                 <Text style={styles.noticeInfo}>
//                   {n.createdAt?.toDate
//                     ? n.createdAt.toDate().toLocaleTimeString([], {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })
//                     : ""}
//                   {n.postedBy ? " · " + n.postedBy : ""}
//                 </Text>
//               </View>
//             </View>
//           ))}
//         </ScrollView>

//         {uploading && (
//           <View style={{ padding: 10 }}>
//             <ActivityIndicator size="large" color="#146ED7" />
//             <Text>Uploading Image...</Text>
//           </View>
//         )}

//         {/* Input Bar */}
//         <View style={styles.inputBar}>
//           <View style={{ flex: 1 }}>
//             <TextInput
//               style={styles.input}
//               placeholder="Notice Title"
//               value={title}
//               onChangeText={setTitle}
//               placeholderTextColor="#888"
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Notice Description"
//               value={description}
//               onChangeText={setDescription}
//               multiline
//               placeholderTextColor="#777"
//             />
//             {/* Show selected image preview */}
//             {mediaUri && (
//               <Image source={{ uri: mediaUri }} style={styles.previewImage} />
//             )}
//           </View>

//           {/* Attachment Button */}
//           <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
//             <Ionicons name="attach" size={24} color="#146ED7" />
//           </TouchableOpacity>

//           {/* Send Button */}
//           <TouchableOpacity style={styles.sendButton} onPress={addNotice}>
//             <Ionicons name="send" size={22} color="#fff" />
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   header: {
//     backgroundColor: "#146ED7",
//     padding: 15,
//     alignItems: "center",
//     borderBottomLeftRadius: 15,
//     borderBottomRightRadius: 15,
//     elevation: 4,
//   },
//   headerTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },

//   list: { flex: 1, padding: 12 },
//   noticeRow: { flexDirection: "row", marginBottom: 12, alignItems: "flex-start" },
//   avatar: { width: 42, height: 42, borderRadius: 21, marginRight: 10 },

//   noticeCard: {
//     backgroundColor: "#fff",
//     padding: 12,
//     borderRadius: 12,
//     maxWidth: "75%",
//     borderWidth: 1,
//     borderColor: "#E3E8F0",
//     shadowColor: "#000",
//     shadowOpacity: 0.08,
//     shadowRadius: 4,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 2,
//   },
//   noticeTitle: { fontSize: 17, fontWeight: "bold", color: "#146ED7", marginBottom: 4 },
//   noticeText: { fontSize: 15, color: "#333" },
//   noticeImage: {
//     width: 180,
//     height: 140,
//     borderRadius: 8,
//     marginVertical: 8,
//   },
//   noticeInfo: { fontSize: 11, color: "#666", marginTop: 5, textAlign: "right" },

//   inputBar: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     padding: 10,
//     borderTopWidth: 1,
//     borderTopColor: "#ddd",
//     backgroundColor: "#fff",
//     marginBottom:15,
//   },
//   input: {
//     backgroundColor: "#E6F0FF",
//     borderRadius: 18,
//     paddingHorizontal: 15,
//     paddingVertical: 8,
//     fontSize: 15,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: "#146ED7",
//   },
//   previewImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 10,
//     marginVertical: 6,
//     alignSelf: "center",
//   },
//   iconButton: {
//     padding: 6,
//     marginLeft: 6,
//     marginTop: 6,
//   },
//   sendButton: {
//     backgroundColor: "#146ED7",
//     padding: 12,
//     borderRadius: 50,
//     marginLeft: 6,
//     marginTop: 6,
//   },
//   loader: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });








import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../firebase"; // Adjust path to your firebase config

// 🎨 BRAND UNIFIED COLORS
const COLORS = {
  primaryDark: "#1A50C8",
  primary: "#2D6EEF",
  bg: "#F8FAFF",
  white: "#FFFFFF",
  textMain: "#1E293B",
  textSub: "#64748B",
  danger: "#EF4444",
  accent: "#E0E7FF",
};

export default function NoticeBoard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaUri, setMediaUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [facultyName, setFacultyName] = useState("");
  const scrollViewRef = useRef();
  const [facultyPhoto, setFacultyPhoto] = useState("");

  // Cloudinary Config
  const cloudName = "dveatasry";
  const uploadPreset = "unsigned_preset";

  useEffect(() => {
    const q = query(collection(db, "notices"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = [];
      snapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() });
      });
      setNotices(fetched);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
  const loadFaculty = async () => {
    const data = await AsyncStorage.getItem("faculty");

    if (data) {
      const parsed = JSON.parse(data);

      // adjust if needed
      setFacultyName(parsed.name || parsed.fullName || "Faculty");
      setFacultyPhoto(parsed.photo || "");    }
  };

  loadFaculty();
}, []);

  const uploadImageToCloudinary = async (uri) => {
    setUploading(true);
    let formData = new FormData();
    formData.append("file", { uri: uri, type: "image/jpeg", name: "upload.jpg" });
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary Error:", error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const addNotice = async () => {
    if (!title.trim() && !description.trim() && !mediaUri) return;
    try {
      let mediaUrl = null;
      if (mediaUri) mediaUrl = await uploadImageToCloudinary(mediaUri);
      
      await addDoc(collection(db, "notices"), {
        title: title.trim() || null,
        description: description.trim() || null,
        mediaUrl: mediaUrl,
        createdAt: serverTimestamp(),
        postedBy: facultyName,
        authorPhoto: facultyPhoto || null, 
      });

      setTitle("");
      setDescription("");
      setMediaUri(null);
      // Auto scroll to bottom after posting
      scrollViewRef.current?.scrollToEnd({ animated: true });
    } catch (err) {
      console.error("Firebase Error:", err);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.7,
    });
    if (!result.canceled) setMediaUri(result.assets[0].uri);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 12, color: COLORS.textSub, fontWeight: '600' }}>Syncing Notices...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 25}
      >
        {/* BRANDED HEADER */}
        <LinearGradient colors={[COLORS.primaryDark, COLORS.primary]} style={styles.header}>
          <Text style={styles.headerTitle}>Notice Board</Text>
          <Text style={styles.headerSub}>Official Faculty Announcements</Text>
        </LinearGradient>

        {/* NOTICES FEED */}
        <ScrollView
          style={styles.list}
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          {notices.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="clipboard-text-outline" size={60} color="#CBD5E1" />
              <Text style={styles.emptyText}>No active notices yet</Text>
            </View>
          ) : (
            notices.map((n) => (
              <View key={n.id} style={styles.noticeCard}>
                <View style={styles.cardHeader}>
                  <Image
                    source={{
                      uri:
                        n.authorPhoto ||
                        `https://ui-avatars.com/api/?name=${n.postedBy || "F"}&background=2D6EEF&color=fff`,
                    }}
                    style={styles.avatar}
                  />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.authorName}>{n.postedBy || "Faculty"}</Text>
                    <Text style={styles.timeText}>
                      {n.createdAt?.toDate ? n.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                    </Text>
                  </View>
                  <MaterialCommunityIcons name="pin-outline" size={18} color={COLORS.textSub} />
                </View>

                {n.title && <Text style={styles.noticeTitle}>{n.title}</Text>}
                {n.description && <Text style={styles.noticeText}>{n.description}</Text>}
                
                {n.mediaUrl && (
                  <Image source={{ uri: n.mediaUrl }} style={styles.noticeImage} />
                )}
              </View>
            ))
          )}
        </ScrollView>

        {/* COMPOSER / INPUT SECTION (Fixed at Bottom) */}
        <View style={styles.composerContainer}>
          {uploading && (
            <View style={styles.uploadingOverlay}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.uploadingText}>Publishing Media...</Text>
            </View>
          )}

          <View style={styles.inputCard}>
            <TextInput
              style={styles.titleInput}
              placeholder="Notice Subject"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#94A3B8"
            />
            <TextInput
              style={styles.descInput}
              placeholder="What's the update?"
              value={description}
              onChangeText={setDescription}
              multiline
              placeholderTextColor="#94A3B8"
            />

            {mediaUri && (
              <View style={styles.previewContainer}>
                <Image source={{ uri: mediaUri }} style={styles.previewImage} />
                <TouchableOpacity style={styles.removeImg} onPress={() => setMediaUri(null)}>
                  <Ionicons name="close-circle" size={24} color={COLORS.danger} />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.actionRow}>
              <TouchableOpacity onPress={pickImage} style={styles.attachBtn}>
                <Feather name="image" size={20} color={COLORS.primary} />
                <Text style={styles.attachText}>Attach Photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.sendBtn} onPress={addNotice}>
                <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.sendGrad}>
                  <Feather name="send" size={18} color="white" />
                  <Text style={styles.sendBtnText}>Post</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  
  header: {
    paddingTop: Platform.OS === 'ios' ? 20 : 50,
    paddingBottom: 25,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    elevation: 10,
  },
  headerTitle: { fontSize: 24, fontWeight: "900", color: "white" },
  headerSub: { fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: "600", marginTop: 2 },

  list: { flex: 1, padding: 15 },
  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: COLORS.textSub, marginTop: 10, fontWeight: '600' },

  noticeCard: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 18,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  authorCircle: { width: 42, height: 42, borderRadius: 21, backgroundColor: COLORS.accent, justifyContent: 'center', alignItems: 'center' },
  authorLetter: { color: COLORS.primary, fontWeight: 'bold', fontSize: 18 },
  authorName: { fontSize: 15, fontWeight: '800', color: COLORS.textMain },
  timeText: { fontSize: 11, color: COLORS.textSub, fontWeight: '600' },
  
  noticeTitle: { fontSize: 18, fontWeight: "800", color: COLORS.primary, marginBottom: 8 },
  noticeText: { fontSize: 15, color: COLORS.textMain, lineHeight: 22 },
  noticeImage: { width: '100%', height: 220, borderRadius: 18, marginTop: 15 },

  composerContainer: { 
    padding: 15, 
    backgroundColor: 'white', 
    borderTopLeftRadius: 35, 
    borderTopRightRadius: 35, 
    elevation: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  inputCard: { backgroundColor: COLORS.bg, borderRadius: 22, padding: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  titleInput: { fontSize: 16, fontWeight: '800', color: COLORS.textMain, marginBottom: 4, paddingHorizontal: 8 },
  descInput: { fontSize: 14, color: COLORS.textMain, minHeight: 45, paddingHorizontal: 8, textAlignVertical: 'top' },
  
  previewContainer: { alignSelf: 'center', marginVertical: 12, position: 'relative' },
  previewImage: { width: 140, height: 90, borderRadius: 12, borderWidth: 2, borderColor: 'white' },
  removeImg: { position: 'absolute', top: -12, right: -12, backgroundColor: 'white', borderRadius: 15 },

  actionRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    borderTopWidth: 1, 
    borderTopColor: '#E2E8F0', 
    paddingTop: 12,
    marginTop: 8
  },
  attachBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12 },
  attachText: { marginLeft: 8, color: COLORS.primary, fontWeight: '800', fontSize: 13 },
  
  sendBtn: { borderRadius: 16, overflow: 'hidden', elevation: 4 },
  sendGrad: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 22 },
  sendBtnText: { color: 'white', fontWeight: '900', marginLeft: 8 },
  
  uploadingOverlay: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  uploadingText: { marginLeft: 10, fontSize: 12, color: COLORS.primary, fontWeight: '800' },

  avatar: {
  width: 42,
  height: 42,
  borderRadius: 21,
},
});