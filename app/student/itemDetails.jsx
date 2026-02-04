import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { db } from "../../firebase";

export default function ItemDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "marketplace", id), (snap) => {
      setData(snap.data());
    });

    return () => unsub();
  }, [id]);

  if (!data) return null;

  return (
    <View style={styles.container}>
      <Image source={{ uri: data.imageUrl }} style={styles.image} />

      <Text style={styles.title}>{data.title}</Text>
      <Text style={styles.price}>₹ {data.price}</Text>
      <Text style={styles.seller}>Seller: {data.sellerName}</Text>
      <Text style={styles.contact}>
        Contact: {data.contactInfo || "Ask seller in college"}
      </Text>
      
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={{ color: "#fff" }}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F9FBFF" },
  image: { width: "100%", height: 250, borderRadius: 15 },
  title: { fontSize: 22, fontWeight: "bold", marginTop: 15 },
  price: { fontSize: 18, color: "#146ED7", marginTop: 5 },
  seller: { marginTop: 10 },
  contact: { marginTop: 5 },
  backBtn: {
    marginTop: 20,
    backgroundColor: "#146ED7",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
});
