// import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
// import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
// import { useEffect, useState } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useRouter } from "expo-router";
// import { db } from "../../firebase";
// import BottomNavbar from "./components/BottomNavbar";

// export default function MyGrievances() {
//   const router = useRouter();
//   const [grievances, setGrievances] = useState([]);
//   const [prn, setPrn] = useState(null);

//   // 🔹 Load PRN once from storage
//   useEffect(() => {
//     const load = async () => {
//       const saved = await AsyncStorage.getItem("student");
//       if (saved) {
//         const parsed = JSON.parse(saved);
//         setPrn(parsed.prn);
//       }
//     };
//     load();
//   }, []);

//   // 🔹 Attach Firebase listener safely (NO infinite loop, NO duplicate listeners)
//   useEffect(() => {
//     if (!prn) return;

//     let unsubscribed = false;

//     const q = query(
//       collection(db, "grievances"),
//       orderBy("createdAt", "desc")
//     );

//     const unsub = onSnapshot(q, (snap) => {
//       if (unsubscribed) return;

//       const data = snap.docs
//         .map((d) => ({ id: d.id, ...d.data() }))
//         .filter((g) => g.studentId === prn);

//       setGrievances(data);
//     });

//     return () => {
//       unsubscribed = true;
//       unsub();
//     };
//   }, [prn]);

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Pending":
//         return "red";
//       case "In Review":
//         return "orange";
//       case "Resolved":
//         return "green";
//       default:
//         return "#146ED7";
//     }
//   };

//   const renderItem = ({ item }) => (
//     <TouchableOpacity
//       style={styles.card}
//       onPress={() =>
//         router.push({
//           pathname: "/student/grievanceDetails",
//           params: { id: item.id },
//         })
//       }
//     >
//       <Text style={styles.title}>{item.title}</Text>
//       <Text>{item.description}</Text>
//       <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
//         Status: {item.status}
//       </Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={{ flex: 1, backgroundColor: "#F9FBFF" }}>
//       <FlatList
//         data={grievances}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
//       />

//       {/* ➕ Add Grievance Button */}
//       <TouchableOpacity
//         style={styles.addBtn}
//         onPress={() => router.push("/student/addGrievance")}
//       >
//         <Text style={styles.plus}>＋</Text>
//       </TouchableOpacity>

//       <BottomNavbar active="grievance" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: "#fff",
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   title: { fontWeight: "bold", marginBottom: 5 },
//   status: { marginTop: 8, fontWeight: "600" },
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
//   plus: {
//     color: "#fff",
//     fontSize: 28,
//     fontWeight: "bold",
//   },
// });






import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { db } from "../../firebase";
import BottomNavbar from "./components/BottomNavbar";

const COLORS = {
  primary: "#2D6EEF",
  secondary: "#1A50C8",
  bg: "#F8FAFF",
  white: "#FFFFFF",
  pending: "#EF4444",
  review: "#F59E0B",
  resolved: "#10B981",
  textMain: "#1E293B",
  textSub: "#64748B",
};

export default function MyGrievances() {
  const router = useRouter();
  const [grievances, setGrievances] = useState([]);
  const [prn, setPrn] = useState(null);

  // --- LOGIC (UNTOUCHED) ---
  useEffect(() => {
    const load = async () => {
      const saved = await AsyncStorage.getItem("student");
      if (saved) {
        const parsed = JSON.parse(saved);
        setPrn(parsed.prn);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!prn) return;
    let unsubscribed = false;
    const q = query(collection(db, "grievances"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      if (unsubscribed) return;
      const data = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((g) => g.studentId === prn);
      setGrievances(data);
    });
    return () => {
      unsubscribed = true;
      unsub();
    };
  }, [prn]);

  const getStatusStyles = (status) => {
    switch (status) {
      case "Pending": return { color: COLORS.pending, bg: "#FEE2E2", icon: "alert-circle" };
      case "In Review": return { color: COLORS.review, bg: "#FEF3C7", icon: "eye" };
      case "Resolved": return { color: COLORS.resolved, bg: "#D1FAE5", icon: "checkmark-circle" };
      default: return { color: COLORS.primary, bg: "#E0E7FF", icon: "help-circle" };
    }
  };

  const renderItem = ({ item }) => {
    const statusInfo = getStatusStyles(item.status);
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: "/student/grievanceDetails",
            params: { id: item.id },
          })
        }
      >
        <View style={styles.cardTop}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
            <MaterialCommunityIcons name={statusInfo.icon} size={14} color={statusInfo.color} />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>{item.status}</Text>
          </View>
        </View>
        
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        
        <View style={styles.cardFooter}>
          <Text style={styles.dateText}>
            Ticket ID: {item.id.substring(0, 8).toUpperCase()}
          </Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.textSub} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* 🏛 HEADER */}
      <LinearGradient colors={[COLORS.secondary, COLORS.primary]} style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Support Center</Text>
            <Text style={styles.headerSub}>Track your reported issues</Text>
          </View>
          <View style={styles.badgeCount}>
            <Text style={styles.countText}>{grievances.length}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* 📜 LIST */}
      <FlatList
        data={grievances}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="clipboard-check-outline" size={80} color="#CBD5E1" />
            <Text style={styles.emptyText}>No grievances found</Text>
          </View>
        }
      />

      {/* ➕ FLOAT ACTION BUTTON */}
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.addBtn}
        onPress={() => router.push("/student/addGrievance")}
      >
        <LinearGradient
          colors={[COLORS.primary, COLORS.secondary]}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={32} color="white" />
        </LinearGradient>
      </TouchableOpacity>

      <BottomNavbar active="grievance" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 45,
    paddingBottom: 30,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    elevation: 8,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: "900", color: "white" },
  headerSub: { fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: "600" },
  badgeCount: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 15 },
  countText: { color: 'white', fontWeight: '900' },

  listContainer: { padding: 20, paddingBottom: 160 },
  card: {
    backgroundColor: "white",
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  title: { fontSize: 17, fontWeight: "800", color: COLORS.textMain, flex: 1, marginRight: 10 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusText: { fontSize: 11, fontWeight: "800", marginLeft: 4 },
  
  description: { fontSize: 14, color: COLORS.textSub, lineHeight: 20, marginBottom: 15 },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 12 },
  dateText: { fontSize: 11, fontWeight: "700", color: COLORS.textSub, letterSpacing: 0.5 },

  addBtn: {
    position: "absolute",
    bottom: 95,
    right: 25,
    borderRadius: 30,
    elevation: 10,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  fabGradient: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' ,marginBottom:19},
  
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: COLORS.textSub, marginTop: 15, fontWeight: '700', fontSize: 16 }
});

