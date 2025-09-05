
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker"; 
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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
} from "../../firebase"; // Adjust path for your project

export default function NoticeBoard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaUri, setMediaUri] = useState(null); // Added for selected image URI
  const [uploading, setUploading] = useState(false); // Upload image loading state
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollViewRef = useRef();

  // Cloudinary details
  const cloudName = "dveatasry"; // Your Cloudinary cloud name
  const uploadPreset = "unsigned_preset"; // Your unsigned upload preset

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

  // Upload image to Cloudinary and return secure URL
  const uploadImageToCloudinary = async (uri) => {
    setUploading(true);
    let formData = new FormData();
    formData.append("file", {
      uri: uri,
      type: "image/jpeg",
      name: "upload.jpg",
    });
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      setUploading(false);
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      setUploading(false);
      return null;
    }
  };

  // Add notice with optional media URI
  const addNotice = async () => {
    if (!title.trim() && !description.trim() && !mediaUri) return;

    try {
      let mediaUrl = null;
      if (mediaUri) {
        mediaUrl = await uploadImageToCloudinary(mediaUri);
      }
      await addDoc(collection(db, "notices"), {
        title: title.trim() || null,
        description: description.trim() || null,
        mediaUrl: mediaUrl,
        createdAt: serverTimestamp(),
        postedBy: "faculty", // Replace with auth user if available
      });

      setTitle("");
      setDescription("");
      setMediaUri(null);
    } catch (err) {
      console.error("Failed to add notice:", err);
    }
  };

  // Pick image from library and set mediaUri
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled) {
      setMediaUri(result.assets[0].uri);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#146ED7" />
        <Text>Loading notices...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}> Faculty Notice Board</Text>
        </View>

        {/* Notices List */}
        <ScrollView
          style={styles.list}
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current.scrollToEnd({ animated: true })
          }
        >
          {notices.length === 0 && (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No notices yet
            </Text>
          )}
          {notices.map((n) => (
            <View key={n.id} style={styles.noticeRow}>
              <Image
                source={{
                  uri:
                    "https://cdn-icons-png.flaticon.com/512/219/219969.png",
                }}
                style={styles.avatar}
              />
              <View style={styles.noticeCard}>
                {n.title && <Text style={styles.noticeTitle}>{n.title}</Text>}
                {n.description && (
                  <Text style={styles.noticeText}>{n.description}</Text>
                )}
                {n.mediaUrl && (
                  <Image
                    source={{ uri: n.mediaUrl }}
                    style={styles.noticeImage}
                  />
                )}
                <Text style={styles.noticeInfo}>
                  {n.createdAt?.toDate
                    ? n.createdAt.toDate().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                  {n.postedBy ? " · " + n.postedBy : ""}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {uploading && (
          <View style={{ padding: 10 }}>
            <ActivityIndicator size="large" color="#146ED7" />
            <Text>Uploading Image...</Text>
          </View>
        )}

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <View style={{ flex: 1 }}>
            <TextInput
              style={styles.input}
              placeholder="Notice Title"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.input}
              placeholder="Notice Description"
              value={description}
              onChangeText={setDescription}
              multiline
              placeholderTextColor="#777"
            />
            {/* Show selected image preview */}
            {mediaUri && (
              <Image source={{ uri: mediaUri }} style={styles.previewImage} />
            )}
          </View>

          {/* Attachment Button */}
          <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
            <Ionicons name="attach" size={24} color="#146ED7" />
          </TouchableOpacity>

          {/* Send Button */}
          <TouchableOpacity style={styles.sendButton} onPress={addNotice}>
            <Ionicons name="send" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#146ED7",
    padding: 15,
    alignItems: "center",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    elevation: 4,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },

  list: { flex: 1, padding: 12 },
  noticeRow: { flexDirection: "row", marginBottom: 12, alignItems: "flex-start" },
  avatar: { width: 42, height: 42, borderRadius: 21, marginRight: 10 },

  noticeCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    maxWidth: "75%",
    borderWidth: 1,
    borderColor: "#E3E8F0",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  noticeTitle: { fontSize: 17, fontWeight: "bold", color: "#146ED7", marginBottom: 4 },
  noticeText: { fontSize: 15, color: "#333" },
  noticeImage: {
    width: 180,
    height: 140,
    borderRadius: 8,
    marginVertical: 8,
  },
  noticeInfo: { fontSize: 11, color: "#666", marginTop: 5, textAlign: "right" },

  inputBar: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
    marginBottom:15,
  },
  input: {
    backgroundColor: "#E6F0FF",
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#146ED7",
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginVertical: 6,
    alignSelf: "center",
  },
  iconButton: {
    padding: 6,
    marginLeft: 6,
    marginTop: 6,
  },
  sendButton: {
    backgroundColor: "#146ED7",
    padding: 12,
    borderRadius: 50,
    marginLeft: 6,
    marginTop: 6,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
