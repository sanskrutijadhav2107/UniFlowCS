import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import BottomNavbar from "./components/BottomNavbar";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";

export default function Marketplace() {
  const router = useRouter();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "marketplace"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setItems(data);
    });

    return () => unsub();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
  source={{
    uri:
      item.imageUrl ||
      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  }}
  style={styles.image}
/>

      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>₹ {item.price}</Text>
        <Text style={styles.seller}>by {item.sellerName}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12, paddingBottom: 120 }}
      />

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => router.push("/student/addItem")}
      >
        <Text style={styles.plus}>＋</Text>
      </TouchableOpacity>

      <BottomNavbar active="marketplace" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FBFF" },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 15,
    marginBottom: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  title: { fontWeight: "600" },
  price: { color: "#146ED7", fontWeight: "700" },
  seller: { fontSize: 12, color: "#555" },
  addBtn: {
    position: "absolute",
    bottom: 90,
    right: 20,
    backgroundColor: "#146ED7",
    width: 55,
    height: 55,
    borderRadius: 27.5,
    justifyContent: "center",
    alignItems: "center",
  },
  plus: { color: "#fff", fontSize: 28, fontWeight: "bold" },
});
