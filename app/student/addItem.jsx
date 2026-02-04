import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { useRouter } from "expo-router";

import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../firebase";

export default function AddItem() {
  const router = useRouter();   // 🔥 THIS LINE
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [student, setStudent] = useState(null);
  const [contact, setContact] = useState("");

  


  useEffect(() => {
  const loadStudent = async () => {
    const saved = await AsyncStorage.getItem("student");
    if (saved) {
      setStudent(JSON.parse(saved));
    }
  };
  loadStudent();
}, []);


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
  if (
    !title.trim() ||
    !price.trim() ||
    !contact.trim() ||
    !image
  ) {
    Alert.alert("All fields are compulsory");
    return;
  }

  if (isNaN(price) || Number(price) <= 0) {
    Alert.alert("Enter a valid price");
    return;
  }

  // ✅ Contact validation (exactly 10 digits)
  const phoneRegex = /^[0-9]{10}$/;

  if (!phoneRegex.test(contact.trim())) {
    Alert.alert("Enter valid 10 digit contact number");
    return;
  }



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

  Alert.alert("Item Listed!");

router.back(); // 👈 go back to marketplace automatically

};


  return (
  <View style={styles.container}>
    <TextInput
      placeholder="Item name"
      style={styles.input}
      value={title}
      onChangeText={setTitle}
    />

    <TextInput
      placeholder="Price"
      style={styles.input}
      value={price}
      onChangeText={setPrice}
      keyboardType="numeric"
    />

    {/* ✅ THIS WAS MISSING FROM UI */}
    <TextInput
      placeholder="Contact info (phone / whatsapp / meet location)"
      style={styles.input}
      value={contact}
      onChangeText={setContact}
    />

    <TouchableOpacity style={styles.pickBtn} onPress={pickImage}>
      <Text style={{ color: "#fff" }}>Pick Image</Text>
    </TouchableOpacity>

    {image && <Image source={{ uri: image }} style={styles.preview} />}

    <TouchableOpacity style={styles.listBtn} onPress={handleListItem}>
      <Text style={{ color: "#fff", fontWeight: "700" }}>List Item</Text>
    </TouchableOpacity>
  </View>
);

}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F9FBFF" },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  pickBtn: {
    backgroundColor: "#146ED7",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  preview: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  listBtn: {
    backgroundColor: "#2d6eefff",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
});
