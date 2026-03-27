// import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { LinearGradient } from "expo-linear-gradient";
// import { useFocusEffect, useRouter } from "expo-router";
// import { collection, onSnapshot, query, where } from "firebase/firestore";
// import { useCallback, useEffect, useRef, useState } from "react";
// import {
//   ActivityIndicator,
//   Animated,
//   Dimensions,
//   Image,
//   RefreshControl,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View
// } from "react-native";
// import UniversalPostsFeed from "../../components/ui/UniversalPostsFeed";
// import { db } from "../../firebase";
// import BottomNavbar from "./components/BottomNavbar";

// const { width: SCREEN_WIDTH } = Dimensions.get("window");
// const TILE_WIDTH = (SCREEN_WIDTH - 60) / 3;

// const COLORS = {
//   primary: "#2D6EEF",
//   primaryDark: "#1A50C8",
//   primaryLight: "#EBF0FD",
//   accent: "#F5A623",
//   bg: "#F8FAFF",
//   white: "#FFFFFF",
//   textPrimary: "#0F172A",
//   textSecondary: "#475569",
//   textMuted: "#94A3B8",
//   success: "#10B981",
//   danger: "#EF4444",
//   warning: "#F59E0B",
//   cardShadow: "rgba(45, 110, 239, 0.12)",
// };

// function PressableCard({ children, style, onPress }) {
//   const scale = useRef(new Animated.Value(1)).current;
//   const onPressIn = () => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
//   const onPressOut = () => Animated.spring(scale, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start();

//   return (
//     <TouchableOpacity activeOpacity={0.9} onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
//       <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
//     </TouchableOpacity>
//   );
// }

// const FEATURE_ITEMS = [
//   { icon: "menu-book", lib: "MaterialIcons", title: "Notes", subtitle: "Learn", route: "/student/notes", color: "#2D6EEF", bg: "#EBF0FD" },
//   { icon: "notifications", lib: "Ionicons", title: "Notices", subtitle: "Updates", route: "/student/noticeBoard", color: "#8B5CF6", bg: "#F3EEFF" },
//   { icon: "calendar", lib: "Ionicons", title: "Schedule", subtitle: "Classes", route: "/student/timetable", color: "#06B6D4", bg: "#E0F8FD" },
//   { icon: "stats-chart", lib: "Ionicons", title: "Progress", subtitle: "Grades", route: "/student/AcademicDashboard", color: "#22C55E", bg: "#EDFAF3" },
//   { icon: "trophy", lib: "FontAwesome5", title: "Rank", subtitle: "Badges", route: "/student/leaderBoard", color: "#F59E0B", bg: "#FFF8E6" },
//   { icon: "work", lib: "MaterialIcons", title: "Projects", subtitle: "Build", route: "/student/projectManagement", color: "#EC4899", bg: "#FEF0F7" },
//   { icon: "store", lib: "MaterialIcons", title: "Shop", subtitle: "Deals", route: "/student/marketplace", color: "#14B8A6", bg: "#E6FAF8" },
//   { icon: "briefcase", lib: "Ionicons", title: "Jobs", subtitle: "Career", route: "/student/placementHub", color: "#6366F1", bg: "#EEEFFE" },
//   { icon: "checkmark-done", lib: "Ionicons", title: "Goals", subtitle: "Tasks", route: "/student/weeklyGoals", color: "#F97316", bg: "#FEF3EC" },
// ];

// function FeatureIcon({ item }) {
//   const size = 20;
//   if (item.lib === "MaterialIcons") return <MaterialIcons name={item.icon} size={size} color={item.color} />;
//   if (item.lib === "FontAwesome5") return <FontAwesome5 name={item.icon} size={size - 2} color={item.color} />;
//   return <Ionicons name={item.icon} size={size} color={item.color} />;
// }

// export default function StudentHome() {
//   const router = useRouter();
//   const [student, setStudent] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [todayThought, setTodayThought] = useState(null);
  
//   const [goalStats, setGoalStats] = useState({ done: 0, total: 0, percent: 0 });

//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(30)).current;

//   useFocusEffect(
//     useCallback(() => {
//       const loadData = async () => {
//         try {
//           const saved = await AsyncStorage.getItem("student");
//           if (!saved) { router.replace("/student/login"); return; }
//           const parsed = JSON.parse(saved);
//           setStudent(parsed);
          
//           Animated.parallel([
//             Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
//             Animated.spring(slideAnim, { toValue: 0, tension: 20, useNativeDriver: true }),
//           ]).start();
//         } catch (err) { console.error(err); } finally { setLoading(false); setRefreshing(false); }
//       };
//       loadData();
//     }, [router])
//   );

//   useEffect(() => {
//     if (!student?.prn) return;
//     const now = new Date();
//     const start = new Date(now.getFullYear(), 0, 1);
//     const currentWeek = Math.ceil((((now - start) / 86400000) + start.getDay() + 1) / 7);

//     const q = query(
//       collection(db, "weeklyGoals"),
//       where("studentId", "==", student.prn),
//       where("weekNumber", "==", currentWeek)
//     );

//     const unsub = onSnapshot(q, (snap) => {
//       const goals = snap.docs.map(d => d.data());
//       const done = goals.filter(g => g.isCompleted).length;
//       const total = goals.length;
//       const percent = total > 0 ? Math.round((done / total) * 100) : 0;
//       setGoalStats({ done, total, percent });
//     });
//     return () => unsub();
//   }, [student]);

//   useEffect(() => {
//     const unsub = onSnapshot(collection(db, "dailyThoughts"), (snap) => {
//       const thoughts = snap.docs.map((d) => d.data());
//       if (thoughts.length > 0) {
//         const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
//         setTodayThought(thoughts[dayOfYear % thoughts.length]);
//       }
//     });
//     return () => unsub();
//   }, []);

//   const onRefresh = useCallback(() => { setRefreshing(true); }, []);

//   const greeting = () => {
//     const h = new Date().getHours();
//     if (h < 12) return { text: "Good Morning", icon: "sunny-outline" };
//     if (h < 18) return { text: "Good Afternoon", icon: "partly-sunny-outline" };
//     return { text: "Good Evening", icon: "moon-outline" };
//   };

//   if (loading) return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={COLORS.primary} /></View>;

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" />
//       <ScrollView 
//         showsVerticalScrollIndicator={false} 
//         contentContainerStyle={styles.scrollContent}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
//       >
//         <LinearGradient colors={[COLORS.primaryDark, COLORS.primary, "#60A5FA"]} style={styles.header}>
//           <View style={styles.circleDeco} />
//           <View style={styles.headerTop}>
//             <View>
//               <View style={styles.greetingRow}>
//                 <Ionicons name={greeting().icon} size={16} color="rgba(255,255,255,0.8)" />
//                 <Text style={styles.greetingText}>{greeting().text}</Text>
//               </View>
//               <Text style={styles.userName}>Hey, {student?.name?.split(" ")[0] || "Student"} 👋</Text>
//             </View>
//             <TouchableOpacity onPress={() => router.push("/student/studentProfilePage")} style={styles.profileContainer}>
//               <Image 
//                 source={{ uri: student?.photo || "https://ui-avatars.com/api/?name=" + student?.name }} 
//                 style={styles.avatar} 
//               />
//               <View style={styles.statusDot} />
//             </TouchableOpacity>
//           </View>
//           <View style={styles.idChip}><Text style={styles.idText}>{student?.prn || "STU-2026"}</Text></View>
//         </LinearGradient>

//         <Animated.View style={[styles.statsCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
//           <View style={styles.statItem}>
//             <Text style={styles.statValue}>{goalStats.done}</Text>
//             <Text style={styles.statLabel}>Done</Text>
//           </View>
//           <View style={styles.statDivider} />
//           <View style={styles.statItem}>
//             <Text style={[styles.statValue, { color: COLORS.primary }]}>{goalStats.total}</Text>
//             <Text style={styles.statLabel}>Goals</Text>
//           </View>
//           <View style={styles.statDivider} />
//           <View style={styles.statItem}>
//             <Text style={[styles.statValue, { color: COLORS.success }]}>{goalStats.percent}%</Text>
//             <Text style={styles.statLabel}>Success</Text>
//           </View>
//         </Animated.View>

//         {todayThought && (
//           <View style={styles.quoteCard}>
//             <LinearGradient colors={["#F8FAFF", "#FFFFFF"]} style={styles.quoteInner}>
//               <FontAwesome5 name="quote-left" size={14} color={COLORS.primaryLight} style={styles.quoteIcon} />
//               <Text style={styles.quoteText} numberOfLines={2}>"{todayThought.text}"</Text>
//               <Text style={styles.quoteAuthor}>— {todayThought.author}</Text>
//             </LinearGradient>
//           </View>
//         )}

//         <View style={styles.sectionHeader}>
//           <Text style={styles.sectionTitle}>Learning Tools</Text>
//           <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
//         </View>

//         <View style={styles.grid}>
//           {FEATURE_ITEMS.map((item, idx) => (
//             <PressableCard key={idx} style={styles.featureCard} onPress={() => router.push(item.route)}>
//               <View style={[styles.iconBox, { backgroundColor: item.bg }]}>
//                 <FeatureIcon item={item} />
//               </View>
//               <Text style={styles.featureTitle}>{item.title}</Text>
//               <Text style={styles.featureSubtitle}>{item.subtitle}</Text>
//             </PressableCard>
//           ))}
//         </View>

//         <View style={styles.sectionHeader}>
//           <Text style={styles.sectionTitle}>Campus Buzz</Text>
//           <View style={styles.liveIndicator}><View style={styles.liveDot} /><Text style={styles.liveText}>LIVE</Text></View>
//         </View>
        
//         <View style={styles.feedWrapper}>
//           {/* POSTS FEED COMPONENT */}
//           <UniversalPostsFeed collectionName="posts" />
//         </View>
//       </ScrollView>
//       <BottomNavbar active="home" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.bg },
//   loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
//   scrollContent: { paddingBottom: 120 },
//   header: { paddingTop: 60, paddingBottom: 50, paddingHorizontal: 25, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, overflow: "hidden" },
//   circleDeco: { position: "absolute", width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(255,255,255,0.1)", top: -50, right: -50 },
//   headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
//   greetingRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
//   greetingText: { color: "rgba(255,255,255,0.8)", fontSize: 13, marginLeft: 6, fontWeight: "600" },
//   userName: { color: COLORS.white, fontSize: 24, fontWeight: "800" },
//   profileContainer: { width: 60, height: 60, borderRadius: 30, padding: 3, backgroundColor: "rgba(255,255,255,0.3)" },
//   avatar: { width: "100%", height: "100%", borderRadius: 30, backgroundColor: "#E2E8F0" },
//   statusDot: { position: "absolute", bottom: 2, right: 2, width: 14, height: 14, borderRadius: 7, backgroundColor: COLORS.success, borderWidth: 2, borderColor: COLORS.primary },
//   idChip: { alignSelf: "flex-start", backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginTop: 15 },
//   idText: { color: COLORS.white, fontSize: 11, fontWeight: "700" },
//   statsCard: { flexDirection: "row", backgroundColor: COLORS.white, marginHorizontal: 25, marginTop: -30, borderRadius: 20, padding: 20, justifyContent: "space-around", shadowColor: COLORS.cardShadow, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 1, shadowRadius: 20, elevation: 8 },
//   statItem: { alignItems: "center" },
//   statValue: { fontSize: 20, fontWeight: "900", color: COLORS.textPrimary },
//   statLabel: { fontSize: 11, color: COLORS.textMuted, marginTop: 2, fontWeight: "600" },
//   statDivider: { width: 1, height: "80%", backgroundColor: "#F1F5F9" },
//   quoteCard: { marginHorizontal: 25, marginTop: 20 },
//   quoteInner: { padding: 16, borderRadius: 16, borderLeftWidth: 4, borderLeftColor: COLORS.primary },
//   quoteIcon: { marginBottom: 4 },
//   quoteText: { fontSize: 14, color: COLORS.textSecondary, fontStyle: "italic", lineHeight: 20 },
//   quoteAuthor: { fontSize: 12, color: COLORS.textPrimary, fontWeight: "700", textAlign: "right", marginTop: 8 },
//   sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 25, marginTop: 25, marginBottom: 15 },
//   sectionTitle: { fontSize: 18, fontWeight: "800", color: COLORS.textPrimary },
//   seeAll: { color: COLORS.primary, fontWeight: "700", fontSize: 14 },
//   grid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 20, justifyContent: "space-between" },
//   featureCard: { width: TILE_WIDTH, backgroundColor: COLORS.white, borderRadius: 20, padding: 15, marginBottom: 12, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
//   iconBox: { width: 45, height: 45, borderRadius: 14, justifyContent: "center", alignItems: "center", marginBottom: 10 },
//   featureTitle: { fontSize: 13, fontWeight: "700", color: COLORS.textPrimary, textAlign: "center" },
//   featureSubtitle: { fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
//   liveIndicator: { flexDirection: "row", alignItems: "center", backgroundColor: "#FEE2E2", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
//   liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.danger, marginRight: 5 },
//   liveText: { fontSize: 10, fontWeight: "900", color: COLORS.danger },
//   feedWrapper: { paddingHorizontal: 10 },
// });















import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import UniversalPostsFeed from "../../components/ui/UniversalPostsFeed";
import { db } from "../../firebase";
import BottomNavbar from "./components/BottomNavbar";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
// Updated for 4 columns: accounting for margins and horizontal padding
const TILE_WIDTH = (SCREEN_WIDTH - 70) / 4;

const COLORS = {
  primary: "#2D6EEF",
  primaryDark: "#1A50C8",
  primaryLight: "#EBF0FD",
  accent: "#F5A623",
  bg: "#F8FAFF",
  white: "#FFFFFF",
  textPrimary: "#0F172A",
  textSecondary: "#475569",
  textMuted: "#94A3B8",
  success: "#10B981",
  danger: "#EF4444",
  warning: "#F59E0B",
  cardShadow: "rgba(45, 110, 239, 0.12)",
};

// 12 Items to keep the 4-column grid perfectly balanced (3 rows of 4)
const FEATURE_ITEMS = [
  { icon: "menu-book", lib: "MaterialIcons", title: "Notes", subtitle: "Learn", route: "/student/notes", color: "#2D6EEF", bg: "#EBF0FD" },
  { icon: "notifications", lib: "Ionicons", title: "Notices", subtitle: "Updates", route: "/student/noticeBoard", color: "#8B5CF6", bg: "#F3EEFF" },
  { icon: "calendar", lib: "Ionicons", title: "Schedule", subtitle: "Classes", route: "/student/timetable", color: "#06B6D4", bg: "#E0F8FD" },
  { icon: "stats-chart", lib: "Ionicons", title: "Progress", subtitle: "Grades", route: "/student/AcademicDashboard", color: "#22C55E", bg: "#EDFAF3" },
  { icon: "trophy", lib: "FontAwesome5", title: "Rank", subtitle: "Badges", route: "/student/leaderBoard", color: "#F59E0B", bg: "#FFF8E6" },
  { icon: "work", lib: "MaterialIcons", title: "Projects", subtitle: "Build", route: "/student/projectManagement", color: "#EC4899", bg: "#FEF0F7" },
  { icon: "store", lib: "MaterialIcons", title: "Shop", subtitle: "Deals", route: "/student/marketplace", color: "#14B8A6", bg: "#E6FAF8" },
  { icon: "briefcase", lib: "Ionicons", title: "Jobs", subtitle: "Career", route: "/student/placementHub", color: "#6366F1", bg: "#EEEFFE" },
  { icon: "checkmark-done", lib: "Ionicons", title: "Goals", subtitle: "Tasks", route: "/student/weeklyGoals", color: "#F97316", bg: "#FEF3EC" },
  { icon: "gavel", lib: "MaterialIcons", title: "Grievance", subtitle: "Support", route: "/student/myGrievances", color: "#EF4444", bg: "#FEE2E2" },
 
];

function PressableCard({ children, style, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn = () => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start();

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </TouchableOpacity>
  );
}

function FeatureIcon({ item }) {
  const size = 18; // Reduced size for 4-column layout
  if (item.lib === "MaterialIcons") return <MaterialIcons name={item.icon} size={size} color={item.color} />;
  if (item.lib === "FontAwesome5") return <FontAwesome5 name={item.icon} size={size - 2} color={item.color} />;
  return <Ionicons name={item.icon} size={size} color={item.color} />;
}

export default function StudentHome() {
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [todayThought, setTodayThought] = useState(null);
  const [goalStats, setGoalStats] = useState({ done: 0, total: 0, percent: 0 });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          const saved = await AsyncStorage.getItem("student");
          if (!saved) { router.replace("/student/login"); return; }
          const parsed = JSON.parse(saved);
          setStudent(parsed);
          
          Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, tension: 20, useNativeDriver: true }),
          ]).start();
        } catch (err) { console.error(err); } finally { setLoading(false); setRefreshing(false); }
      };
      loadData();
    }, [router])
  );

  useEffect(() => {
    if (!student?.prn) return;
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const currentWeek = Math.ceil((((now - start) / 86400000) + start.getDay() + 1) / 7);

    const q = query(
      collection(db, "weeklyGoals"),
      where("studentId", "==", student.prn),
      where("weekNumber", "==", currentWeek)
    );

    const unsub = onSnapshot(q, (snap) => {
      const goals = snap.docs.map(d => d.data());
      const done = goals.filter(g => g.isCompleted).length;
      const total = goals.length;
      const percent = total > 0 ? Math.round((done / total) * 100) : 0;
      setGoalStats({ done, total, percent });
    });
    return () => unsub();
  }, [student]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "dailyThoughts"), (snap) => {
      const thoughts = snap.docs.map((d) => d.data());
      if (thoughts.length > 0) {
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        setTodayThought(thoughts[dayOfYear % thoughts.length]);
      }
    });
    return () => unsub();
  }, []);

  const onRefresh = useCallback(() => { setRefreshing(true); }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return { text: "Good Morning", icon: "sunny-outline" };
    if (h < 18) return { text: "Good Afternoon", icon: "partly-sunny-outline" };
    return { text: "Good Evening", icon: "moon-outline" };
  };

  if (loading) return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={COLORS.primary} /></View>;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
        <LinearGradient colors={[COLORS.primaryDark, COLORS.primary, "#60A5FA"]} style={styles.header}>
          <View style={styles.circleDeco} />
          <View style={styles.headerTop}>
            <View>
              <View style={styles.greetingRow}>
                <Ionicons name={greeting().icon} size={16} color="rgba(255,255,255,0.8)" />
                <Text style={styles.greetingText}>{greeting().text}</Text>
              </View>
              <Text style={styles.userName}>Hey, {student?.name?.split(" ")[0] || "Student"} 👋</Text>
            </View>
            <TouchableOpacity onPress={() => router.push("/student/studentProfilePage")} style={styles.profileContainer}>
              <Image 
                source={{ uri: student?.photo || "https://ui-avatars.com/api/?name=" + student?.name }} 
                style={styles.avatar} 
              />
              <View style={styles.statusDot} />
            </TouchableOpacity>
          </View>
          <View style={styles.idChip}><Text style={styles.idText}>{student?.prn || "STU-2026"}</Text></View>
        </LinearGradient>

        <Animated.View style={[styles.statsCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{goalStats.done}</Text>
            <Text style={styles.statLabel}>Done</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: COLORS.primary }]}>{goalStats.total}</Text>
            <Text style={styles.statLabel}>Goals</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: COLORS.success }]}>{goalStats.percent}%</Text>
            <Text style={styles.statLabel}>Success</Text>
          </View>
        </Animated.View>

        {todayThought && (
          <View style={styles.quoteCard}>
            <LinearGradient colors={["#F8FAFF", "#FFFFFF"]} style={styles.quoteInner}>
              <FontAwesome5 name="quote-left" size={14} color={COLORS.primaryLight} style={styles.quoteIcon} />
              <Text style={styles.quoteText} numberOfLines={2}>"{todayThought.text}"</Text>
              <Text style={styles.quoteAuthor}>— {todayThought.author}</Text>
            </LinearGradient>
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>University Tools</Text>
          <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {FEATURE_ITEMS.map((item, idx) => (
            <PressableCard key={idx} style={styles.featureCard} onPress={() => router.push(item.route)}>
              <View style={[styles.iconBox, { backgroundColor: item.bg }]}>
                <FeatureIcon item={item} />
              </View>
              <Text style={styles.featureTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.featureSubtitle}>{item.subtitle}</Text>
            </PressableCard>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Campus Buzz</Text>
          <View style={styles.liveIndicator}><View style={styles.liveDot} /><Text style={styles.liveText}>LIVE</Text></View>
        </View>
        
        <View style={styles.feedWrapper}>
          <UniversalPostsFeed collectionName="posts" />
        </View>
      </ScrollView>
      <BottomNavbar active="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: { paddingBottom: 120 },
  header: { paddingTop: 60, paddingBottom: 50, paddingHorizontal: 25, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, overflow: "hidden" },
  circleDeco: { position: "absolute", width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(255,255,255,0.1)", top: -50, right: -50 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  greetingRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  greetingText: { color: "rgba(255,255,255,0.8)", fontSize: 13, marginLeft: 6, fontWeight: "600" },
  userName: { color: COLORS.white, fontSize: 24, fontWeight: "800" },
  profileContainer: { width: 60, height: 60, borderRadius: 30, padding: 3, backgroundColor: "rgba(255,255,255,0.3)" },
  avatar: { width: "100%", height: "100%", borderRadius: 30, backgroundColor: "#E2E8F0" },
  statusDot: { position: "absolute", bottom: 2, right: 2, width: 14, height: 14, borderRadius: 7, backgroundColor: COLORS.success, borderWidth: 2, borderColor: COLORS.primary },
  idChip: { alignSelf: "flex-start", backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginTop: 15 },
  idText: { color: COLORS.white, fontSize: 11, fontWeight: "700" },
  statsCard: { flexDirection: "row", backgroundColor: COLORS.white, marginHorizontal: 25, marginTop: -30, borderRadius: 20, padding: 20, justifyContent: "space-around", shadowColor: COLORS.cardShadow, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 1, shadowRadius: 20, elevation: 8 },
  statItem: { alignItems: "center" },
  statValue: { fontSize: 20, fontWeight: "900", color: COLORS.textPrimary },
  statLabel: { fontSize: 11, color: COLORS.textMuted, marginTop: 2, fontWeight: "600" },
  statDivider: { width: 1, height: "80%", backgroundColor: "#F1F5F9" },
  quoteCard: { marginHorizontal: 25, marginTop: 20 },
  quoteInner: { padding: 16, borderRadius: 16, borderLeftWidth: 4, borderLeftColor: COLORS.primary },
  quoteIcon: { marginBottom: 4 },
  quoteText: { fontSize: 14, color: COLORS.textSecondary, fontStyle: "italic", lineHeight: 20 },
  quoteAuthor: { fontSize: 12, color: COLORS.textPrimary, fontWeight: "700", textAlign: "right", marginTop: 8 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 25, marginTop: 25, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: COLORS.textPrimary },
  seeAll: { color: COLORS.primary, fontWeight: "700", fontSize: 14 },
  
  // Grid updated for 4-column layout
  grid: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    paddingHorizontal: 15, 
    justifyContent: "flex-start" 
  },
  featureCard: { 
    width: TILE_WIDTH, 
    backgroundColor: COLORS.white, 
    borderRadius: 16, 
    paddingVertical: 12, 
    paddingHorizontal: 4, 
    marginBottom: 10, 
    marginHorizontal: 5, 
    alignItems: "center", 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 10, 
    elevation: 2 
  },
  iconBox: { 
    width: 38, 
    height: 38, 
    borderRadius: 12, 
    justifyContent: "center", 
    alignItems: "center", 
    marginBottom: 8 
  },
  featureTitle: { 
    fontSize: 10.5, 
    fontWeight: "700", 
    color: COLORS.textPrimary, 
    textAlign: "center" 
  },
  featureSubtitle: { 
    fontSize: 9, 
    color: COLORS.textMuted, 
    marginTop: 1 
  },

  liveIndicator: { flexDirection: "row", alignItems: "center", backgroundColor: "#FEE2E2", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.danger, marginRight: 5 },
  liveText: { fontSize: 10, fontWeight: "900", color: COLORS.danger },
  feedWrapper: { paddingHorizontal: 10 },
});