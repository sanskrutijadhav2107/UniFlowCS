// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useEffect } from "react";
// import { useRouter } from "expo-router";

// import React, { useState } from "react";
// import {
//   View,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   Text,
//   Image,
//   Alert,
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import { addDoc, collection, serverTimestamp } from "firebase/firestore";
// import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
// import { db, storage } from "../../firebase";

// export default function AddItem() {
//   const router = useRouter();   // 🔥 THIS LINE
//   const [title, setTitle] = useState("");
//   const [price, setPrice] = useState("");
//   const [image, setImage] = useState(null);
//   const [student, setStudent] = useState(null);
//   const [contact, setContact] = useState("");

  


//   useEffect(() => {
//   const loadStudent = async () => {
//     const saved = await AsyncStorage.getItem("student");
//     if (saved) {
//       setStudent(JSON.parse(saved));
//     }
//   };
//   loadStudent();
// }, []);


//   const pickImage = async () => {
//     const res = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 0.7,
//     });

//     if (!res.canceled) {
//       setImage(res.assets[0].uri);
//     }
//   };

//   const uploadImage = async () => {
//     const response = await fetch(image);
//     const blob = await response.blob();

//     const storageRef = ref(storage, `marketplace/${Date.now()}.jpg`);
//     await uploadBytes(storageRef, blob);

//     return await getDownloadURL(storageRef);
//   };

//  const handleListItem = async () => {
//   if (
//     !title.trim() ||
//     !price.trim() ||
//     !contact.trim() ||
//     !image
//   ) {
//     Alert.alert("All fields are compulsory");
//     return;
//   }

//   if (isNaN(price) || Number(price) <= 0) {
//     Alert.alert("Enter a valid price");
//     return;
//   }

//   // ✅ Contact validation (exactly 10 digits)
//   const phoneRegex = /^[0-9]{10}$/;

//   if (!phoneRegex.test(contact.trim())) {
//     Alert.alert("Enter valid 10 digit contact number");
//     return;
//   }



//   const saved = await AsyncStorage.getItem("student");
//   const studentData = saved ? JSON.parse(saved) : null;

//   const imageUrl = await uploadImage();

//   await addDoc(collection(db, "marketplace"), {
//     title,
//     price: Number(price),
//     imageUrl,
//     sellerName: studentData?.name || "Student",
//     sellerId: studentData?.prn,
//     contactInfo: contact,
//     createdAt: serverTimestamp(),
//     isSold: false,
//   });

//   Alert.alert("Item Listed!");

// router.back(); // 👈 go back to marketplace automatically

// };


//   return (
//   <View style={styles.container}>
//     <TextInput
//       placeholder="Item name"
//       style={styles.input}
//       value={title}
//       onChangeText={setTitle}
//     />

//     <TextInput
//       placeholder="Price"
//       style={styles.input}
//       value={price}
//       onChangeText={setPrice}
//       keyboardType="numeric"
//     />

//     {/* ✅ THIS WAS MISSING FROM UI */}
//     <TextInput
//       placeholder="Contact info (phone / whatsapp / meet location)"
//       style={styles.input}
//       value={contact}
//       onChangeText={setContact}
//     />

//     <TouchableOpacity style={styles.pickBtn} onPress={pickImage}>
//       <Text style={{ color: "#fff" }}>Pick Image</Text>
//     </TouchableOpacity>

//     {image && <Image source={{ uri: image }} style={styles.preview} />}

//     <TouchableOpacity style={styles.listBtn} onPress={handleListItem}>
//       <Text style={{ color: "#fff", fontWeight: "700" }}>List Item</Text>
//     </TouchableOpacity>
//   </View>
// );

// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: "#F9FBFF" },
//   input: {
//     backgroundColor: "#fff",
//     padding: 12,
//     borderRadius: 12,
//     marginBottom: 10,
//   },
//   pickBtn: {
//     backgroundColor: "#146ED7",
//     padding: 12,
//     borderRadius: 10,
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   preview: {
//     width: "100%",
//     height: 180,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   listBtn: {
//     backgroundColor: "#2d6eefff",
//     padding: 14,
//     borderRadius: 12,
//     alignItems: "center",
//   },
// });







import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db, storage } from "../../firebase";

const COLORS = {
  primary: "#2D6EEF",
  secondary: "#1A50C8",
  bg: "#F8FAFF",
  white: "#FFFFFF",
  border: "#E2E8F0",
  textMain: "#0F172A",
  textSub: "#64748B",
};

export default function AddItem() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [contact, setContact] = useState("");
  const [uploading, setUploading] = useState(false);

  // --- LOGIC (RETAINED) ---
  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!res.canceled) {
      setImage(res.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    const response = await fetch(image);
    const blob = await response.blob();
    const storageRef = ref(storage, `marketplace/${Date.now()}.jpg`);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  };

  const handleListItem = async () => {
    if (!title.trim() || !price.trim() || !contact.trim() || !image) {
      Alert.alert("Required", "All fields are compulsory");
      return;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(contact.trim())) {
      Alert.alert("Invalid Contact", "Enter valid 10 digit contact number");
      return;
    }

    setUploading(true);
    try {
      const saved = await AsyncStorage.getItem("student");
      const studentData = saved ? JSON.parse(saved) : null;
      const imageUrl = await uploadImage();

      await addDoc(collection(db, "marketplace"), {
        title,
        price: Number(price),
        imageUrl,
        sellerName: studentData?.name || "Student",
        sellerId: studentData?.prn,
        contactInfo: contact,
        createdAt: serverTimestamp(),
        isSold: false,
      });

      Alert.alert("Success", "Item Listed Successfully!");
      router.back();
    } catch (e) {
      Alert.alert("Error", "Could not list item.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      
      <LinearGradient colors={[COLORS.secondary, COLORS.primary]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sell an Item</Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* IMAGE PICKER SECTION */}
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage} activeOpacity={0.8}>
          {image ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.previewImage} />
              <View style={styles.editBadge}>
                <Ionicons name="camera" size={18} color="white" />
              </View>
            </View>
          ) : (
            <View style={styles.placeholder}>
              <MaterialCommunityIcons name="image-plus" size={50} color={COLORS.primary} />
              <Text style={styles.placeholderText}>Upload Item Photo</Text>
              <Text style={styles.placeholderSub}>JPG or PNG (Max 5MB)</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* INPUT FORM */}
        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Product Title</Text>
            <TextInput
              placeholder="What are you selling?"
              style={styles.input}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Price (₹)</Text>
            <TextInput
              placeholder="e.g. 500"
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contact Number</Text>
            <TextInput
              placeholder="10-digit mobile number"
              style={styles.input}
              value={contact}
              onChangeText={setContact}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          <TouchableOpacity 
            style={[styles.listBtn, uploading && { opacity: 0.7 }]} 
            onPress={handleListItem}
            disabled={uploading}
          >
            <Text style={styles.listBtnText}>
              {uploading ? "Uploading..." : "Publish Listing"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 45,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 12, marginRight: 15 },
  headerTitle: { fontSize: 22, fontWeight: "900", color: "white" },

  scrollContent: { padding: 20, paddingBottom: 50 },
  
  imagePicker: {
    width: '100%',
    height: 220,
    backgroundColor: 'white',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  imageContainer: { width: '100%', height: '100%' },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  editBadge: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 15,
    elevation: 5,
  },
  placeholder: { alignItems: 'center' },
  placeholderText: { marginTop: 10, fontSize: 16, fontWeight: '800', color: COLORS.textMain },
  placeholderSub: { fontSize: 12, color: COLORS.textSub, marginTop: 4 },

  formCard: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 12, fontWeight: '800', color: COLORS.textSub, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    backgroundColor: COLORS.bg,
    padding: 15,
    borderRadius: 15,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textMain,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  listBtn: {
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
    elevation: 4,
  },
  listBtnText: { color: 'white', fontSize: 16, fontWeight: '900' },
});