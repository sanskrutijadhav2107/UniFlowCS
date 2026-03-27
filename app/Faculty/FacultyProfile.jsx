import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator, Alert,
  Image,
  Platform, SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { db } from "../../firebase";

// 🎨 BRAND UNIFIED COLORS
const COLORS = {
  primaryDark: "#1A50C8",
  primary: "#2D6EEF",
  bg: "#F8FAFF",
  white: "#FFFFFF",
  textMain: "#0F172A",
  textSub: "#64748B",
  danger: "#EF4444",
  success: "#10B981",
};

export default function FacultyProfile() {
  const router = useRouter();
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFaculty();
  }, []);

  const loadFaculty = async () => {
    try {
      // 1. Check multiple keys for the session
      const localFaculty = await AsyncStorage.getItem("faculty");
      const localUser = await AsyncStorage.getItem("currentUser");
      
      let sessionData = null;
      if (localFaculty) sessionData = JSON.parse(localFaculty);
      else if (localUser) sessionData = JSON.parse(localUser);

      if (!sessionData || !sessionData.email) {
        router.replace("/"); 
        return;
      }

      setFaculty(sessionData);

      // 2. Fetch fresh details using the email as the Document ID
      const docRef = doc(db, "faculty", sessionData.email.trim()); 
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const cloudData = snap.data();
        const mergedData = { ...sessionData, ...cloudData };
        setFaculty(mergedData);
        await AsyncStorage.setItem("faculty", JSON.stringify(mergedData));
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Sign out from Faculty Portal?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Logout", 
        style: "destructive", 
        onPress: async () => {
          await AsyncStorage.clear();
          if (router.canDismiss()) router.dismissAll();
          router.replace("/");
        } 
      }
    ]);
  };

  if (loading && !faculty) return (
    <View style={styles.center}><ActivityIndicator color={COLORS.primary} /></View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <LinearGradient colors={[COLORS.primaryDark, COLORS.primary]} style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <Image 
              source={{ uri: faculty?.photo || `https://ui-avatars.com/api/?name=${faculty?.name || 'User'}&background=2D6EEF&color=fff` }} 
              style={styles.avatar} 
            />
            <View style={styles.headerTextWrap}>
              <Text style={styles.nameText}>{faculty?.name || "Faculty Member"}</Text>
              <Text style={styles.deptText}>{faculty?.education || "Senior Faculty"}</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>Academic Profile</Text>

        <ProfileRow icon="email-outline" label="Institutional Email" value={faculty?.email} />
        <ProfileRow icon="shield-check-outline" label="Designation" value={faculty?.role || "Faculty"} />
        <ProfileRow icon="phone-outline" label="Contact" value={faculty?.phone} />
        <ProfileRow icon="book-open-outline" label="Specialization" value={faculty?.education} />

        {/* LOGOUT BUTTON */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <View style={styles.logoutIconBg}>
            <MaterialCommunityIcons name="logout" size={22} color={COLORS.danger} />
          </View>
          <Text style={styles.logoutBtnText}>Logout from UniFlow</Text>
          <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
        </TouchableOpacity>

        <Text style={styles.footerText}>UniFlow Faculty • v1.0.4</Text>
      </ScrollView>
    </View>
  );
}

const ProfileRow = ({ icon, label, value }) => (
  <View style={styles.row}>
    <View style={styles.rowIcon}>
      <MaterialCommunityIcons name={icon} size={22} color={COLORS.primary} />
    </View>
    <View style={{ flex: 1, marginLeft: 15 }}>
      <Text style={styles.rowLabelText}>{label}</Text>
      <Text style={styles.rowValueText}>{value || "Not Set"}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { 
    paddingTop: Platform.OS === 'ios' ? 10 : 40, paddingBottom: 40, paddingHorizontal: 25, 
    borderBottomLeftRadius: 40, borderBottomRightRadius: 40, elevation: 5 
  },
  headerContent: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  avatar: { width: 85, height: 85, borderRadius: 42.5, borderWidth: 3, borderColor: 'white' },
  headerTextWrap: { marginLeft: 20 },
  nameText: { color: "white", fontSize: 22, fontWeight: "900" },
  deptText: { color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: "600" },

  scrollContent: { padding: 20, paddingBottom: 50 },
  sectionLabel: { fontSize: 11, fontWeight: '800', color: COLORS.textSub, marginBottom: 15, textTransform: 'uppercase', letterSpacing: 1 },
  
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 16, borderRadius: 24, marginBottom: 12, elevation: 1 },
  rowIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#F0F7FF', justifyContent: 'center', alignItems: 'center' },
  rowLabelText: { fontSize: 10, fontWeight: '800', color: COLORS.textSub, textTransform: 'uppercase' },
  rowValueText: { fontSize: 16, fontWeight: '700', color: COLORS.textMain },

  logoutBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 16, borderRadius: 24, marginTop: 30, borderWidth: 1, borderColor: '#FEE2E2', elevation: 2 },
  logoutIconBg: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFF1F2', justifyContent: 'center', alignItems: 'center' },
  logoutBtnText: { flex: 1, marginLeft: 15, fontSize: 16, fontWeight: '800', color: COLORS.danger },
  footerText: { textAlign: 'center', marginTop: 30, color: '#CBD5E1', fontSize: 12, fontWeight: '600' }
});