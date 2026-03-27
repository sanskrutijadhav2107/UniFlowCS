// import AsyncStorage from "@react-native-async-storage/async-storage";
// import {
//   collection,
//   onSnapshot,
//   orderBy,
//   query,
// } from "firebase/firestore";
// import { useEffect, useState } from "react";
// import {
//   FlatList,
//   Linking,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { db } from "../../firebase";
// import BottomNavbar from "./components/BottomNavbar";

// export default function PlacementHub() {
//   const [student, setStudent] = useState(null);
//   const [opportunities, setOpportunities] = useState([]);

//   // ✅ Load student info
//   useEffect(() => {
//     const loadStudent = async () => {
//       const saved = await AsyncStorage.getItem("student");
//       if (saved) setStudent(JSON.parse(saved));
//     };
//     loadStudent();
//   }, []);

//   // ✅ Load and filter opportunities
//   useEffect(() => {
//     if (!student?.semester) return;

//     const q = query(
//       collection(db, "opportunities"),
//       orderBy("createdAt", "desc")
//     );

//     const unsub = onSnapshot(q, (snap) => {
//       const all = snap.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));

//       // 🔥 Filter by eligibility
//       const filtered = all.filter((opp) =>
//         opp.eligibleSemesters?.includes(student.semester)
//       );

//       setOpportunities(filtered);
//     });

//     return () => unsub();
//   }, [student]);

//   const openLink = (url) => {
//     Linking.openURL(url);
//   };

//   const renderItem = ({ item }) => (
//     <View style={styles.card}>
//       <Text style={styles.title}>{item.title}</Text>

//       <Text style={styles.company}>
//         {item.company} • {item.type}
//       </Text>

//       <Text style={styles.description}>
//         {item.description}
//       </Text>

//       <Text style={styles.deadline}>
//         Deadline: {item.deadline}
//       </Text>

//       <TouchableOpacity
//         style={styles.applyBtn}
//         onPress={() => openLink(item.applyLink)}
//       >
//         <Text style={styles.applyText}>Apply Now</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={opportunities}
//         keyExtractor={(item) => item.id}
//         renderItem={renderItem}
//         contentContainerStyle={{ paddingBottom: 120 }}
//       />

//       <BottomNavbar active="placement" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F9FBFF",
//     padding: 16,
//   },

//   card: {
//     backgroundColor: "#fff",
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 12,
//     elevation: 3,
//   },

//   title: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },

//   company: {
//     marginTop: 4,
//     color: "#146ED7",
//     fontWeight: "600",
//   },

//   description: {
//     marginTop: 8,
//     color: "#444",
//   },

//   deadline: {
//     marginTop: 8,
//     color: "red",
//     fontWeight: "600",
//   },

//   applyBtn: {
//     marginTop: 12,
//     backgroundColor: "#146ED7",
//     padding: 10,
//     borderRadius: 8,
//     alignItems: "center",
//   },

//   applyText: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
// });










import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  FlatList,
  Linking,
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
  accent: "#EF4444", // For deadlines
};

export default function PlacementHub() {
  const [student, setStudent] = useState(null);
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    const loadStudent = async () => {
      const saved = await AsyncStorage.getItem("student");
      if (saved) setStudent(JSON.parse(saved));
    };
    loadStudent();
  }, []);

  useEffect(() => {
    if (!student?.semester) return;

    const q = query(collection(db, "opportunities"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const all = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const filtered = all.filter((opp) => opp.eligibleSemesters?.includes(student.semester));
      setOpportunities(filtered);
    });

    return () => unsub();
  }, [student]);

  const openLink = (url) => {
    if (url) Linking.openURL(url);
  };

  const renderItem = ({ item }) => {
    const isInternship = item.type?.toLowerCase().includes("intern");
    
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.companyIcon}>
            <MaterialCommunityIcons name="office-building" size={24} color={COLORS.primary} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.companyName}>{item.company}</Text>
            <View style={styles.row}>
              <MaterialCommunityIcons name="briefcase-outline" size={14} color={COLORS.textSub} />
              <Text style={styles.jobType}>{item.type}</Text>
            </View>
          </View>
          <View style={[styles.typeBadge, { backgroundColor: isInternship ? "#F0FDF4" : "#EFF6FF" }]}>
            <Text style={[styles.typeBadgeText, { color: isInternship ? "#16A34A" : COLORS.primary }]}>
              {item.type}
            </Text>
          </View>
        </View>

        <Text style={styles.jobTitle}>{item.title}</Text>
        <Text style={styles.description} numberOfLines={3}>{item.description}</Text>

        <View style={styles.divider} />

        <View style={styles.footer}>
          <View style={styles.deadlineBox}>
            <MaterialCommunityIcons name="calendar-clock" size={16} color={COLORS.accent} />
            <Text style={styles.deadlineText}>Ends: {item.deadline}</Text>
          </View>
          
          <TouchableOpacity
            style={styles.applyBtn}
            onPress={() => openLink(item.applyLink)}
            activeOpacity={0.8}
          >
            <Text style={styles.applyText}>Apply Now</Text>
            <MaterialCommunityIcons name="arrow-right" size={16} color="white" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* CAMPUS BUZZ HEADER */}
      <LinearGradient 
        colors={[COLORS.primaryDark, COLORS.primary, COLORS.primaryLight]} 
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} 
        style={styles.header}
      >
        <SafeAreaView>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>Placement Hub</Text>
              <Text style={styles.headerSub}>Exclusive for Semester {student?.semester}</Text>
            </View>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="briefcase-check-outline" size={26} color="white" />
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <FlatList
        data={opportunities}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <MaterialCommunityIcons name="tray-alert" size={60} color={COLORS.textSub} />
            <Text style={styles.emptyText}>No new opportunities for your semester.</Text>
          </View>
        }
      />

      <BottomNavbar active="placement" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    height: 170,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    justifyContent: 'center',
    elevation: 8,
  },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Platform.OS === 'android' ? 10 : 0 },
  headerTitle: { color: 'white', fontSize: 26, fontWeight: '900', letterSpacing: -0.5 },
  headerSub: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '600' },
  iconCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },

  listContent: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 120 },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 4 },
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  companyIcon: { width: 45, height: 45, backgroundColor: '#F1F6FF', borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  companyName: { fontSize: 16, fontWeight: '800', color: COLORS.textMain },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  jobType: { fontSize: 12, color: COLORS.textSub, fontWeight: '600', marginLeft: 4 },
  
  typeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  typeBadgeText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },

  jobTitle: { fontSize: 18, fontWeight: '900', color: COLORS.textMain, marginBottom: 8 },
  description: { fontSize: 13, color: COLORS.textSub, lineHeight: 20, marginBottom: 15 },
  
  divider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 15 },

  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  deadlineBox: { flexDirection: 'row', alignItems: 'center' },
  deadlineText: { fontSize: 12, fontWeight: '700', color: COLORS.accent, marginLeft: 5 },

  applyBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    elevation: 2,
  },
  applyText: { color: 'white', fontWeight: '800', fontSize: 13 },

  emptyWrap: { alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 10, color: COLORS.textSub, fontWeight: '600', textAlign: 'center', paddingHorizontal: 40 }
});
