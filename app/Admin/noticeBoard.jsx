// import React, { useState, useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   Image,
//   SafeAreaView
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import * as ImagePicker from "expo-image-picker";

// export default function NoticeBoard() {
//   const [notice, setNotice] = useState("");
//   const [notices, setNotices] = useState([]);
//   const scrollViewRef = useRef();

//   const addNotice = (mediaUri = null) => {
//     if (notice.trim() !== "" || mediaUri) {
//       setNotices([
//         ...notices,
//         { text: notice, date: new Date(), media: mediaUri }
//       ]);
//       setNotice("");
//     }
//   };

//   const pickImage = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.All,
//       allowsEditing: false,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       addNotice(result.assets[0].uri);
//     }
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         keyboardVerticalOffset={90} // Adjust for navbar height
//       >
//         {/* Header */}
//         <View style={styles.header}>
//           <Text style={styles.headerTitle}>📢 Admin Notice Board</Text>
//         </View>

//         {/* Notices List */}
//         <ScrollView
//           style={styles.list}
//           ref={scrollViewRef}
//           onContentSizeChange={() =>
//             scrollViewRef.current.scrollToEnd({ animated: true })
//           }
//         >
//           {notices.map((n, index) => (
//             <View key={index} style={styles.noticeRow}>
//               {/* Admin Avatar */}
//               <Image
//                 source={{
//                   uri: "https://cdn-icons-png.flaticon.com/512/219/219969.png"
//                 }}
//                 style={styles.avatar}
//               />

//               {/* Chat Bubble */}
//               <View style={styles.noticeBubble}>
//                 {n.media && (
//                   <Image source={{ uri: n.media }} style={styles.noticeImage} />
//                 )}
//                 {n.text ? <Text style={styles.noticeText}>{n.text}</Text> : null}
//                 <Text style={styles.noticeDate}>
//                   {n.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//                 </Text>
//               </View>
//             </View>
//           ))}
//         </ScrollView>

//         {/* Input Bar */}
//         <View style={styles.inputBar}>
//           {/* Attachment Button */}
//           <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
//             <Ionicons name="attach" size={22} color="#0A4D8C" />
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
//           <TouchableOpacity style={styles.sendButton} onPress={() => addNotice()}>
//             <Ionicons name="send" size={20} color="#fff" />
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   header: {
//     backgroundColor: "#B8E6F2",
//     padding: 15,
//     alignItems: "center",
//     borderBottomWidth: 1,
//     borderBottomColor: "#ddd",
//   },
//   headerTitle: { fontSize: 18, fontWeight: "bold" },
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
//     backgroundColor: "#0A4D8C",
//     padding: 10,
//     borderRadius: 50,
//     marginLeft: 5,
//   },
//   iconButton: {
//     padding: 6,
//     marginRight: 5,
//   },
// });











import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
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
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import {
  addDoc,
  collection,
  db,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "../../firebase"; // Adjust path to your firebase.js

export default function AdminNoticeBoard() {
  const [notice, setNotice] = useState("");
  const [notices, setNotices] = useState([]);
  const [mediaUri, setMediaUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const scrollViewRef = useRef();

  // Cloudinary config
  const cloudName = "dveatasry"; // your Cloudinary cloud name
  const uploadPreset = "unsigned_preset"; // your unsigned upload preset

  useEffect(() => {
    // Ask media library permission (required for saving images)
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Enable media library permissions to save images.");
      }
    })();

    // Real-time listener to Firestore notices collection
    const q = query(collection(db, "notices"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = [];
      snapshot.forEach((doc) => fetched.push({ id: doc.id, ...doc.data() }));
      setNotices(fetched);
    });

    return () => unsubscribe();
  }, []);

  // Upload image to Cloudinary
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

  // Pick image
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

  // Add notice to Firestore (text + optional image)
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
        postedBy: "Admin", // Change to logged-in user if applicable
      });
      setNotice("");
      setMediaUri(null);
    } catch (error) {
      Alert.alert("Error", "Failed to post notice: " + error.message);
    }
  };

  // Open full-screen image preview modal
  const openImageModal = (uri) => {
    setSelectedImageUri(uri);
    setModalVisible(true);
  };

  // Save image locally on device
  const saveImageToGallery = async (imageUri) => {
    try {
      const fileUri = FileSystem.cacheDirectory + imageUri.split("/").pop();
      const { uri } = await FileSystem.downloadAsync(imageUri, fileUri);
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert("Success", "Image saved to gallery!");
    } catch (error) {
      Alert.alert("Error", "Failed to save image: " + error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
      >
         {/* Page Title */}
                              <View style={styles.header}>
                                <Text style={styles.pageTitle}>Notice Board</Text>
                                <Text style={styles.subTitle}>Welcome</Text>
                              </View>

        {/* Notices List */}
        <ScrollView
          style={styles.list}
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
        >
          {notices.map((n) => (
            <View key={n.id} style={styles.noticeRow}>
              <Image
                source={{ uri: "https://cdn-icons-png.flaticon.com/512/219/219969.png" }}
                style={styles.avatar}
              />
              <View style={styles.noticeBubble}>
                {n.mediaUrl && (
                  <>
                    <TouchableOpacity onPress={() => openImageModal(n.mediaUrl)}>
                      <Image source={{ uri: n.mediaUrl }} style={styles.noticeImage} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.downloadButton}
                      onPress={() => saveImageToGallery(n.mediaUrl)}
                    >
                      <Text style={styles.downloadText}>Download</Text>
                    </TouchableOpacity>
                  </>
                )}
                {n.text ? <Text style={styles.noticeText}>{n.text}</Text> : null}
                <Text style={styles.noticeDate}>
                  {n.createdAt?.toDate
                    ? n.createdAt.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : ""}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {uploading && (
          <View style={{ padding: 10 }}>
            <ActivityIndicator size="large" color="#2d6eefff" />
            <Text>Uploading Image...</Text>
          </View>
        )}

        {/* Input Bar */}
        <View style={styles.inputBar}>
          {/* Attachment Button */}
          <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
            <Ionicons name="attach" size={22} color="#2d6eefff" />
          </TouchableOpacity>

          {/* Text Input */}
          <TextInput
            style={styles.input}
            placeholder="Type a notice..."
            value={notice}
            onChangeText={setNotice}
            multiline
          />

          {/* Send Button */}
          <TouchableOpacity style={styles.sendButton} onPress={addNotice}>
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Fullscreen Image Modal */}
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

  list: { flex: 1, padding: 10 },
  noticeRow: { flexDirection: "row", marginBottom: 10, alignItems: "flex-end" },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 8 },

  noticeBubble: {
    backgroundColor: "#DCF8C6",
    padding: 10,
    borderRadius: 10,
    maxWidth: "75%",
  },
  noticeText: { fontSize: 15 },
  noticeDate: { fontSize: 11, color: "gray", textAlign: "right", marginTop: 5 },
  noticeImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 5,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
    marginBottom :33,
  },
  input: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#2d6eefff",
    padding: 10,
    borderRadius: 50,
    marginLeft: 5,
  },
  iconButton: {
    padding: 6,
    marginRight: 5,
  },
  downloadButton: {
    backgroundColor: "#2d6eefff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  downloadText: {
    color: "white",
    fontWeight: "600",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.90)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "90%",
    height: "80%",
    borderRadius: 10,
  },
});

