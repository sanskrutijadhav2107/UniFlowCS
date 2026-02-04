import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { db } from "../../firebase";
import BottomNavbar from "./components/BottomNavbar";

export default function Marketplace() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [student, setStudent] = useState(null);

  // ✅ Load logged in student
  useEffect(() => {
    const loadStudent = async () => {
      const saved = await AsyncStorage.getItem("student");
      if (saved) setStudent(JSON.parse(saved));
    };
    loadStudent();
  }, []);

  // ✅ Real-time marketplace listener with auto-delete logic
  useEffect(() => {
    const q = query(
      collection(db, "marketplace"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, async (snap) => {
      const now = Date.now();
      const data = [];

      for (const d of snap.docs) {
        const item = { id: d.id, ...d.data() };

        // ⏳ If SOLD for more than 60s → delete
        if (item.isSold && item.soldAt && now - item.soldAt > 60000) {
          await deleteDoc(doc(db, "marketplace", d.id));
          continue;
        }

        data.push(item);
      }

      setItems(data);
    });

    return () => unsub();
  }, []);

  // ✅ Mark sold / Undo sold
  const markAsSold = async (id, currentStatus) => {
    if (!currentStatus) {
      Alert.alert(
        "Mark item as sold?",
        "This item will be permanently deleted after 60 seconds.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Yes, mark sold",
            onPress: async () => {
              await updateDoc(doc(db, "marketplace", id), {
                isSold: true,
                soldAt: Date.now(), // 🔥 important
              });
            },
          },
        ]
      );
    } else {
      // ✅ Undo within 60 seconds
      await updateDoc(doc(db, "marketplace", id), {
        isSold: false,
        soldAt: null,
      });
    }
  };

  const renderItem = ({ item }) => {
    const isOwner = String(item.sellerId) === String(student?.prn);

    return (
      <TouchableOpacity
        style={[styles.card, item.isSold && { opacity: 0.5 }]}
        onPress={() =>
          router.push({
            pathname: "/student/itemDetails",
            params: { id: item.id },
          })
        }
      >
        <Image source={{ uri: item.imageUrl }} style={styles.image} />

        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.price}>₹ {item.price}</Text>
          <Text style={styles.seller}>by {item.sellerName}</Text>

          {item.isSold && <Text style={styles.sold}>SOLD</Text>}

          {isOwner && (
            <TouchableOpacity
              style={[
                styles.soldBtn,
                item.isSold && { backgroundColor: "#777" },
              ]}
              onPress={() => markAsSold(item.id, item.isSold)}
            >
              <Text style={{ color: "#fff" }}>
                {item.isSold ? "Undo Sold" : "Mark as Sold"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

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
  sold: {
    color: "red",
    fontWeight: "bold",
    marginTop: 4,
  },
  soldBtn: {
    marginTop: 6,
    backgroundColor: "#146ED7",
    padding: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
});
