// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useRouter } from "expo-router";
// import {
//   collection,
//   doc,
//   onSnapshot,
//   orderBy,
//   query,
//   updateDoc,
//   deleteDoc,
// } from "firebase/firestore";
// import { useEffect, useState } from "react";
// import {
//   FlatList,
//   Image,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   Alert,
// } from "react-native";
// import { db } from "../../firebase";
// import BottomNavbar from "./components/BottomNavbar";

// export default function Marketplace() {
//   const router = useRouter();
//   const [items, setItems] = useState([]);
//   const [student, setStudent] = useState(null);

//   // ✅ Load logged in student
//   useEffect(() => {
//     const loadStudent = async () => {
//       const saved = await AsyncStorage.getItem("student");
//       if (saved) setStudent(JSON.parse(saved));
//     };
//     loadStudent();
//   }, []);

//   // ✅ Real-time marketplace listener with auto-delete logic
//   useEffect(() => {
//     const q = query(
//       collection(db, "marketplace"),
//       orderBy("createdAt", "desc")
//     );

//     const unsub = onSnapshot(q, async (snap) => {
//       const now = Date.now();
//       const data = [];

//       for (const d of snap.docs) {
//         const item = { id: d.id, ...d.data() };

//         // ⏳ If SOLD for more than 60s → delete
//         if (item.isSold && item.soldAt && now - item.soldAt > 60000) {
//           await deleteDoc(doc(db, "marketplace", d.id));
//           continue;
//         }

//         data.push(item);
//       }

//       setItems(data);
//     });

//     return () => unsub();
//   }, []);

//   // ✅ Mark sold / Undo sold
//   const markAsSold = async (id, currentStatus) => {
//     if (!currentStatus) {
//       Alert.alert(
//         "Mark item as sold?",
//         "This item will be permanently deleted after 60 seconds.",
//         [
//           { text: "Cancel", style: "cancel" },
//           {
//             text: "Yes, mark sold",
//             onPress: async () => {
//               await updateDoc(doc(db, "marketplace", id), {
//                 isSold: true,
//                 soldAt: Date.now(), // 🔥 important
//               });
//             },
//           },
//         ]
//       );
//     } else {
//       // ✅ Undo within 60 seconds
//       await updateDoc(doc(db, "marketplace", id), {
//         isSold: false,
//         soldAt: null,
//       });
//     }
//   };

//   const renderItem = ({ item }) => {
//     const isOwner = String(item.sellerId) === String(student?.prn);

//     return (
//       <TouchableOpacity
//         style={[styles.card, item.isSold && { opacity: 0.5 }]}
//         onPress={() =>
//           router.push({
//             pathname: "/student/itemDetails",
//             params: { id: item.id },
//           })
//         }
//       >
//         <Image source={{ uri: item.imageUrl }} style={styles.image} />

//         <View style={{ flex: 1 }}>
//           <Text style={styles.title}>{item.title}</Text>
//           <Text style={styles.price}>₹ {item.price}</Text>
//           <Text style={styles.seller}>by {item.sellerName}</Text>

//           {item.isSold && <Text style={styles.sold}>SOLD</Text>}

//           {isOwner && (
//             <TouchableOpacity
//               style={[
//                 styles.soldBtn,
//                 item.isSold && { backgroundColor: "#777" },
//               ]}
//               onPress={() => markAsSold(item.id, item.isSold)}
//             >
//               <Text style={{ color: "#fff" }}>
//                 {item.isSold ? "Undo Sold" : "Mark as Sold"}
//               </Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={items}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={{ padding: 12, paddingBottom: 120 }}
//       />

//       <TouchableOpacity
//         style={styles.addBtn}
//         onPress={() => router.push("/student/addItem")}
//       >
//         <Text style={styles.plus}>＋</Text>
//       </TouchableOpacity>


//       <BottomNavbar active="marketplace" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#F9FBFF" },
//   card: {
//     flexDirection: "row",
//     backgroundColor: "#fff",
//     padding: 12,
//     borderRadius: 15,
//     marginBottom: 10,
//   },
//   image: {
//     width: 60,
//     height: 60,
//     borderRadius: 10,
//     marginRight: 10,
//   },
//   title: { fontWeight: "600" },
//   price: { color: "#146ED7", fontWeight: "700" },
//   seller: { fontSize: 12, color: "#555" },
//   addBtn: {
//     position: "absolute",
//     bottom: 90,
//     right: 20,
//     backgroundColor: "#146ED7",
//     width: 55,
//     height: 55,
//     borderRadius: 27.5,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   plus: { color: "#fff", fontSize: 28, fontWeight: "bold" },
//   sold: {
//     color: "red",
//     fontWeight: "bold",
//     marginTop: 4,
//   },
//   soldBtn: {
//     marginTop: 6,
//     backgroundColor: "#146ED7",
//     padding: 6,
//     borderRadius: 8,
//     alignSelf: "flex-start",
//   },
// });















import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../firebase";
import BottomNavbar from "./components/BottomNavbar";

const COLORS = {
  primaryDark: "#1A50C8",
  primary: "#2D6EEF",
  primaryLight: "#60A5FA",
  bg: "#F8FAFF",
  white: "#FFFFFF",
  textMain: "#0F172A",
  textSub: "#64748B",
  accent: "#10B981", // Green for prices
  error: "#EF4444", // Red for sold
};

export default function Marketplace() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const loadStudent = async () => {
      const saved = await AsyncStorage.getItem("student");
      if (saved) setStudent(JSON.parse(saved));
    };
    loadStudent();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "marketplace"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, async (snap) => {
      const now = Date.now();
      const data = [];
      for (const d of snap.docs) {
        const item = { id: d.id, ...d.data() };
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

  const markAsSold = async (id, currentStatus) => {
    if (!currentStatus) {
      Alert.alert(
        "Mark as Sold?",
        "This item will be hidden and deleted in 60 seconds.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Yes, Mark Sold",
            onPress: async () => {
              await updateDoc(doc(db, "marketplace", id), {
                isSold: true,
                soldAt: Date.now(),
              });
            },
          },
        ]
      );
    } else {
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
        activeOpacity={0.9}
        style={[styles.card, item.isSold && styles.soldCard]}
        onPress={() => router.push({ pathname: "/student/itemDetails", params: { id: item.id } })}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
          {item.isSold && (
            <View style={styles.soldOverlay}>
              <Text style={styles.soldLabelText}>SOLD</Text>
            </View>
          )}
        </View>

        <View style={styles.cardInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.priceText}>₹{item.price}</Text>
          </View>

          <View style={styles.sellerRow}>
            <MaterialCommunityIcons name="account-circle-outline" size={14} color={COLORS.textSub} />
            <Text style={styles.sellerName}>{item.sellerName}</Text>
          </View>

          {isOwner && (
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.manageBtn, item.isSold && styles.undoBtn]}
              onPress={() => markAsSold(item.id, item.isSold)}
            >
              <MaterialCommunityIcons 
                name={item.isSold ? "refresh" : "check-circle-outline"} 
                size={14} 
                color="white" 
              />
              <Text style={styles.manageBtnText}>
                {item.isSold ? "Undo Sold" : "Mark Sold"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <LinearGradient 
        colors={[COLORS.primaryDark, COLORS.primary, COLORS.primaryLight]} 
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} 
        style={styles.header}
      >
        <SafeAreaView>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>Campus Store</Text>
              <Text style={styles.headerSub}>Buy & Sell within Campus</Text>
            </View>
            <TouchableOpacity style={styles.cartCircle}>
              <MaterialCommunityIcons name="shopping-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <MaterialCommunityIcons name="store-remove-outline" size={60} color={COLORS.textSub} />
            <Text style={styles.emptyText}>No items for sale yet.</Text>
          </View>
        }
      />

      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.fab}
        onPress={() => router.push("/student/addItem")}
      >
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          style={styles.fabGradient}
        >
          <MaterialCommunityIcons name="plus" size={30} color="white"  />
        </LinearGradient>
      </TouchableOpacity>

      <BottomNavbar active="marketplace" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    height: 160,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    justifyContent: 'center',
    elevation: 8,
  },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Platform.OS === 'android' ? 10 : 0 },
  headerTitle: { color: 'white', fontSize: 26, fontWeight: '900' },
  headerSub: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '600' },
  cartCircle: { width: 45, height: 45, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },

  listContent: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 150 },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginBottom: 14,
    flexDirection: 'row',
    padding: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 4 },
  },
  soldCard: { opacity: 0.7 },
  imageContainer: { position: 'relative' },
  image: { width: 90, height: 90, borderRadius: 15, backgroundColor: '#F1F5F9' },
  soldOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  soldLabelText: { color: 'white', fontWeight: '900', fontSize: 12, letterSpacing: 1 },

  cardInfo: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: 16, fontWeight: '800', color: COLORS.textMain, flex: 1, marginRight: 5 },
  priceText: { fontSize: 16, fontWeight: '900', color: COLORS.primary },
  
  sellerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  sellerName: { fontSize: 12, color: COLORS.textSub, marginLeft: 4, fontWeight: '600' },

  manageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  undoBtn: { backgroundColor: COLORS.textSub },
  manageBtnText: { color: 'white', fontSize: 11, fontWeight: '800', marginLeft: 5 },

  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
  },
  fabGradient: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' ,marginBottom:19},

  emptyWrap: { alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 10, color: COLORS.textSub, fontWeight: '600' }
});