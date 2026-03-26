import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { storage } from "../../firebase";

const { width } = Dimensions.get("window");
const COLORS = {
  primary: "#6366F1", // Indigo theme for Faculty
  secondary: "#4338CA",
  accent: "#F59E0B",
  bg: "#F8FAFF",
  textTitle: "#1E293B",
  textSub: "#64748B",
};

export default function FacultyProfile() {
  const router = useRouter();
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { loadFaculty(); }, []);

  const loadFaculty = async () => {
    try {
      const saved = await AsyncStorage.getItem("faculty") || await AsyncStorage.getItem("currentUser");
      if (saved) setFaculty(JSON.parse(saved));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setUploading(true);
      try {
        const res = await fetch(result.assets[0].uri);
        const blob = await res.blob();
        const sRef = ref(storage, `faculty_profiles/${faculty.email}.jpg`);
        await uploadBytes(sRef, blob);
        const url = await getDownloadURL(sRef);
        setFaculty({ ...faculty, photo: url });
        await AsyncStorage.setItem("faculty", JSON.stringify({ ...faculty, photo: url }));
      } catch (e) {
        Alert.alert("Error", "Could not update photo.");
      } finally {
        setUploading(false);
      }
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator color={COLORS.primary} /></View>;

  return (
    <View style={styles.mainContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={[COLORS.primary, COLORS.secondary]} style={styles.header}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarBorder}>
              <Image 
                source={{ uri: faculty?.photo || `https://ui-avatars.com/api/?name=${faculty?.name}&background=random` }} 
                style={styles.avatar} 
              />
            </View>
            <TouchableOpacity style={styles.editBtn} onPress={pickImage}>
              {uploading ? <ActivityIndicator size="small" color="white" /> : <Feather name="camera" size={16} color="white" />}
            </TouchableOpacity>
          </View>
          <Text style={styles.nameText}>{faculty?.name}</Text>
          <Text style={styles.deptText}>{faculty?.education || "Senior Faculty Member"}</Text>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Academic Profile</Text>
            
            <ModernRow icon="mail" label="Institutional Email" value={faculty?.email || "N/A"} />
            <ModernRow icon="award" label="Designation" value={faculty?.role || "Faculty"} />
            <ModernRow icon="phone" label="Contact Number" value={faculty?.phone || "Not provided"} />
            
            {faculty?.linkedin && (
              <ModernRow 
                icon="linkedin" 
                label="LinkedIn" 
                value="Connect with Faculty" 
                onPress={() => Linking.openURL(faculty.linkedin)}
              />
            )}
          </View>

          <TouchableOpacity style={styles.logoutWrapper} onPress={() => { AsyncStorage.clear(); router.replace("/"); }}>
            <Text style={styles.logoutText}>Logout from UniFlow</Text>
            <Feather name="log-out" size={16} color={COLORS.textSub} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}



const ModernRow = ({ icon, label, value, onPress }) => (
  <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
    <View style={styles.iconContainer}>
      <Feather name={icon} size={20} color={COLORS.primary} />
    </View>
    <View style={{ flex: 1, marginLeft: 16 }}>
      <Text style={styles.rowLab}>{label}</Text>
      <Text style={styles.rowVal}>{value}</Text>
    </View>
    {onPress && <Feather name="chevron-right" size={18} color="#CBD5E1" />}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#F8FAFF" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { paddingVertical: 60, alignItems: "center", borderBottomLeftRadius: 50, borderBottomRightRadius: 50 },
  avatarWrapper: { position: "relative" },
  avatarBorder: { padding: 4, borderRadius: 60, backgroundColor: "rgba(255,255,255,0.2)" },
  avatar: { width: 110, height: 110, borderRadius: 55, borderWidth: 4, borderColor: "white" },
  editBtn: { position: "absolute", bottom: 0, right: 0, backgroundColor: COLORS.accent || "#10B981", width: 36, height: 36, borderRadius: 18, justifyContent: "center", alignItems: "center", borderWidth: 4, borderColor: COLORS.primary },
  nameText: { color: "white", fontSize: 24, fontWeight: "800", marginTop: 15 },
  deptText: { color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 4 },
  badge: { backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginTop: 10 },
  badgeText: { color: "white", fontSize: 10, fontWeight: "800" },
  content: { paddingHorizontal: 20, marginTop: 20 },
  infoSection: { marginTop: 10 },
  sectionTitle: { fontSize: 12, fontWeight: "800", color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 15, marginLeft: 5 },
  row: { flexDirection: "row", alignItems: "center", backgroundColor: "white", padding: 18, borderRadius: 24, marginBottom: 12, elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10 },
  iconContainer: { width: 48, height: 48, borderRadius: 16, backgroundColor: "#F0F7FF", justifyContent: "center", alignItems: "center" },
  rowLab: { fontSize: 11, color: "#64748B", fontWeight: "700" },
  rowVal: { fontSize: 15, fontWeight: "700", color: "#1E293B", marginTop: 2 },
  logoutWrapper: { flexDirection: "row", justifyContent: "center", alignItems: "center", padding: 30 },
  logoutText: { fontSize: 14, fontWeight: "700", color: "#64748B", marginRight: 8 }
});