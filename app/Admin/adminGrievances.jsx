// import {
//   collection,
//   onSnapshot,
//   orderBy,
//   query,
//   doc,
//   updateDoc,
// } from "firebase/firestore";
// import { useEffect, useState } from "react";
// import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
// import { db } from "../../firebase";

// export default function AdminGrievances() {
//   const [grievances, setGrievances] = useState([]);

//   useEffect(() => {
//     const q = query(
//       collection(db, "grievances"),
//       orderBy("createdAt", "desc")
//     );

//     const unsub = onSnapshot(q, (snap) => {
//       const data = snap.docs.map((d) => ({
//         id: d.id,
//         ...d.data(),
//       }));
//       setGrievances(data);
//     });

//     return () => unsub();
//   }, []);

//   const updateStatus = async (id, status) => {
//     await updateDoc(doc(db, "grievances", id), { status });
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Pending": return "red";
//       case "In Review": return "orange";
//       case "Resolved": return "green";
//       default: return "#146ED7";
//     }
//   };

//   const renderItem = ({ item }) => (
//     <View style={styles.card}>
//       <Text style={styles.title}>{item.title}</Text>
//       <Text style={styles.category}>Category: {item.category}</Text>
//       <Text>{item.description}</Text>

//       <Text style={styles.by}>
//         By: {item.isAnonymous ? "Anonymous" : item.studentName}
//       </Text>

//       <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
//         Status: {item.status}
//       </Text>

//       <View style={styles.row}>
//         <TouchableOpacity
//           style={styles.btn}
//           onPress={() => updateStatus(item.id, "In Review")}
//         >
//           <Text style={styles.btnText}>In Review</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.btn, { backgroundColor: "green" }]}
//           onPress={async () => {
//             await updateDoc(doc(db, "grievances", item.id), {
//               status: "Resolved", 
//               awaitingStudentConfirmation: true,
//             });
//           }}

//         >
//           <Text style={styles.btnText}>Resolved</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>Admin Grievance Panel</Text>

//       <FlatList
//         data={grievances}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: "#F9FBFF" },
//   heading: {
//     fontSize: 22,
//     fontWeight: "bold",
//     marginBottom: 15,
//     textAlign: "center",
//   },
//   card: {
//     backgroundColor: "#fff",
//     padding: 12,
//     borderRadius: 12,
//     marginBottom: 10,
//   },
//   title: { fontWeight: "bold", fontSize: 16 },
//   category: { marginTop: 4, color: "#666" },
//   by: { marginTop: 4, fontStyle: "italic" },
//   status: { marginTop: 6, fontWeight: "bold" },
//   row: { flexDirection: "row", marginTop: 10, gap: 10 },
//   btn: {
//     backgroundColor: "#146ED7",
//     padding: 8,
//     borderRadius: 8,
//   },
//   btnText: { color: "#fff" },
// });










import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { db } from "../../firebase";

const COLORS = {
  primaryDark: "#1A50C8",
  primary: "#2D6EEF",
  bg: "#F8FAFF",
  white: "#FFFFFF",
  textMain: "#0F172A",
  textSub: "#64748B",
  pending: "#EF4444",
  review: "#F59E0B",
  resolved: "#10B981",
  cardBg: "#FFFFFF"
};

export default function AdminGrievances() {
  const [grievances, setGrievances] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "grievances"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setGrievances(data);
    });

    return () => unsub();
  }, []);

  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, "grievances", id), { status });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending": return { color: COLORS.pending, bg: "#FEF2F2", icon: "alert-circle-outline" };
      case "In Review": return { color: COLORS.review, bg: "#FFFBEB", icon: "eye-outline" };
      case "Resolved": return { color: COLORS.resolved, bg: "#ECFDF5", icon: "check-circle-outline" };
      default: return { color: COLORS.primary, bg: "#EFF6FF", icon: "help-circle-outline" };
    }
  };

  const renderItem = ({ item }) => {
    const statusTheme = getStatusStyle(item.status);

    return (
      <View style={styles.card}>
        {/* Card Header: Category & Status Badge */}
        <View style={styles.cardHeader}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category || "General"}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusTheme.bg }]}>
            <MaterialCommunityIcons name={statusTheme.icon} size={14} color={statusTheme.color} />
            <Text style={[styles.statusText, { color: statusTheme.color }]}>{item.status}</Text>
          </View>
        </View>

        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description} numberOfLines={3}>{item.description}</Text>

        <View style={styles.infoRow}>
          <View style={styles.authorBox}>
            <Ionicons name={item.isAnonymous ? "eye-off-outline" : "person-outline"} size={14} color={COLORS.textSub} />
            <Text style={styles.byText}>
              {item.isAnonymous ? "Anonymous Student" : item.studentName}
            </Text>
          </View>
          <Text style={styles.dateText}>
            {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : "Just now"}
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.actionBtn, styles.reviewBtn]}
            onPress={() => updateStatus(item.id, "In Review")}
          >
            <MaterialCommunityIcons name="clock-outline" size={16} color={COLORS.review} />
            <Text style={styles.reviewBtnText}>Review</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.actionBtn, styles.resolveBtn]}
            onPress={async () => {
              await updateDoc(doc(db, "grievances", item.id), {
                status: "Resolved", 
                awaitingStudentConfirmation: true,
              });
            }}
          >
            <MaterialCommunityIcons name="check-all" size={16} color={COLORS.white} />
            <Text style={styles.resolveBtnText}>Resolve</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* BRANDED HEADER */}
      <LinearGradient 
        colors={[COLORS.primaryDark, COLORS.primary]} 
        style={styles.header}
      >
        <SafeAreaView>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>Grievance Panel</Text>
              <Text style={styles.headerSub}>Managing {grievances.length} active cases</Text>
            </View>
            <View style={styles.headerIcon}>
              <MaterialCommunityIcons name="shield-text-outline" size={26} color="white" />
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <FlatList
        data={grievances}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listPadding}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
             <MaterialCommunityIcons name="sticker-check-outline" size={60} color={COLORS.textSub} />
             <Text style={styles.emptyText}>All caught up! No grievances found.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    paddingTop: Platform.OS === 'ios' ? 10 : 40,
    paddingBottom: 25,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    elevation: 8,
  },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: "900", color: "#fff" },
  headerSub: { fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: "600" },
  headerIcon: { width: 45, height: 45, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },

  listPadding: { padding: 20, paddingBottom: 40 },

  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  categoryBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  categoryText: { fontSize: 11, fontWeight: '800', color: COLORS.textSub, textTransform: 'uppercase' },
  
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 4 },
  statusText: { fontSize: 12, fontWeight: '800' },

  title: { fontSize: 17, fontWeight: "800", color: COLORS.textMain, marginBottom: 6 },
  description: { fontSize: 14, color: COLORS.textSub, lineHeight: 20, marginBottom: 15 },

  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  authorBox: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  byText: { fontSize: 12, color: COLORS.textSub, fontWeight: '600' },
  dateText: { fontSize: 11, color: COLORS.textSub, fontWeight: '500' },

  divider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 15 },

  actionRow: { flexDirection: 'row', gap: 12 },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8
  },
  reviewBtn: { backgroundColor: '#FFFBEB', borderWidth: 1, borderColor: '#FEF3C7' },
  reviewBtnText: { color: COLORS.review, fontWeight: '800', fontSize: 14 },
  
  resolveBtn: { backgroundColor: COLORS.resolved },
  resolveBtnText: { color: COLORS.white, fontWeight: '800', fontSize: 14 },

  emptyWrap: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: COLORS.textSub, fontWeight: '600', marginTop: 15 }
});