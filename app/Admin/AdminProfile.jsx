import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { db, storage } from "../../firebase";

// 🎨 UNIFIED COLOR PALETTE
const COLORS = {
  primaryDark: "#1A50C8",
  primary: "#2D6EEF",
  primaryLight: "#60A5FA",
  bg: "#F8FAFF",
  white: "#FFFFFF",
  textMain: "#0F172A",
  textSub: "#64748B",
  accent: "#E0E7FF",
  danger: "#EF4444",
  success: "#10B981",
};

export default function AdminProfile() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editField, setEditField] = useState({ key: "", label: "", value: "" });

  const ADMIN_DOC_ID = "hhB1QTfOA2VVH6zxSMvR";

  useEffect(() => { loadAdmin(); }, []);

  const loadAdmin = async () => {
    try {
      const saved = await AsyncStorage.getItem("admin");
      let currentData = saved ? JSON.parse(saved) : {};
      const docSnap = await getDoc(doc(db, "admin", ADMIN_DOC_ID));
      if (docSnap.exists()) {
        currentData = { ...currentData, ...docSnap.data(), id: ADMIN_DOC_ID };
        await AsyncStorage.setItem("admin", JSON.stringify(currentData));
      }
      setAdmin(currentData);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [1, 1], quality: 0.5,
    });

    if (!result.canceled) {
      setUploading(true);
      try {
        const res = await fetch(result.assets[0].uri);
        const blob = await res.blob();
        const sRef = ref(storage, `admin_profiles/${ADMIN_DOC_ID}.jpg`);
        await uploadBytes(sRef, blob);
        const url = await getDownloadURL(sRef);
        await setDoc(doc(db, "admin", ADMIN_DOC_ID), { photo: url }, { merge: true });
        const updated = { ...admin, photo: url };
        setAdmin(updated);
        await AsyncStorage.setItem("admin", JSON.stringify(updated));
      } catch (e) { Alert.alert("Upload Failed", e.message); }
      finally { setUploading(false); }
    }
  };

  const handleUpdate = async () => {
    try {
      await setDoc(doc(db, "admin", ADMIN_DOC_ID), { [editField.key]: editField.value }, { merge: true });
      const updated = { ...admin, [editField.key]: editField.value };
      setAdmin(updated);
      await AsyncStorage.setItem("admin", JSON.stringify(updated));
      setModalVisible(false);
    } catch (e) { Alert.alert("Error", "Update failed"); }
  };

  // 🚪 WORKING LOGOUT WITH NAVIGATION RESET
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Logout", 
        style: "destructive", 
        onPress: async () => {
          await AsyncStorage.clear();
          if (router.canDismiss()) router.dismissAll(); // Clear history stack
          router.replace("/"); // Go to login
        } 
      }
    ]);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator color={COLORS.primary} /></View>;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* BRANDED HEADER (Matches Timetable) */}
      <LinearGradient colors={[COLORS.primaryDark, COLORS.primary, COLORS.primaryLight]} style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <View style={styles.avatarContainer}>
               <Image source={{ uri: admin?.photo || `https://ui-avatars.com/api/?name=${admin?.name}` }} style={styles.avatar} />
               <TouchableOpacity style={styles.camBtn} onPress={pickImage}>
                 {uploading ? <ActivityIndicator size="small" color="white" /> : <Ionicons name="camera" size={16} color="white" />}
               </TouchableOpacity>
            </View>
            <View style={styles.headerTextWrap}>
              <Text style={styles.headerTitle}>{admin?.name || "Admin"}</Text>
              <Text style={styles.headerSub}>System Administrator</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>Account Settings</Text>

        <ProfileRow icon="account-outline" label="Full Name" value={admin?.name} onPress={() => { setEditField({key:"name", label:"Name", value:admin?.name}); setModalVisible(true); }} />
        <ProfileRow icon="email-outline" label="Email Address" value={admin?.email} onPress={() => { setEditField({key:"email", label:"Email", value:admin?.email}); setModalVisible(true); }} />
        <ProfileRow icon="phone-outline" label="Phone" value={admin?.phone} onPress={() => { setEditField({key:"phone", label:"Phone", value:admin?.phone}); setModalVisible(true); }} />
        <ProfileRow icon="school-outline" label="Education" value={admin?.education} onPress={() => { setEditField({key:"education", label:"Education", value:admin?.education}); setModalVisible(true); }} />

        {/* LOGOUT SECTION */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <View style={styles.logoutIcon}>
            <MaterialCommunityIcons name="logout" size={22} color={COLORS.danger} />
          </View>
          <Text style={styles.logoutText}>Logout from Session</Text>
          <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
        </TouchableOpacity>

        <Text style={styles.footerVersion}>UniFlow Admin • Version 1.0.4</Text>
      </ScrollView>

      {/* EDIT MODAL */}
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Update {editField.label}</Text>
            <TextInput style={styles.input} value={editField.value} onChangeText={t => setEditField({...editField, value:t})} />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCancel}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity onPress={handleUpdate} style={styles.modalSave}><Text style={styles.saveText}>Save</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const ProfileRow = ({ icon, label, value, onPress }) => (
  <TouchableOpacity style={styles.row} onPress={onPress}>
    <View style={styles.rowIcon}>
      <MaterialCommunityIcons name={icon} size={22} color={COLORS.primary} />
    </View>
    <View style={{ flex: 1, marginLeft: 15 }}>
      <Text style={styles.rowLabelText}>{label}</Text>
      <Text style={styles.rowValueText}>{value || "Set Info"}</Text>
    </View>
    <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  
  header: { 
    paddingTop: Platform.OS === 'ios' ? 10 : 40, paddingBottom: 35, paddingHorizontal: 25, 
    borderBottomLeftRadius: 35, borderBottomRightRadius: 35, elevation: 10 
  },
  headerContent: { flexDirection: 'row', alignItems: 'center' },
  avatarContainer: { position: 'relative' },
  avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: 'white' },
  camBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: COLORS.success, padding: 6, borderRadius: 15, borderWidth: 2, borderColor: COLORS.primaryDark },
  headerTextWrap: { marginLeft: 20 },
  headerTitle: { fontSize: 22, fontWeight: '900', color: 'white' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },

  scrollContent: { padding: 20, paddingBottom: 50 },
  sectionLabel: { fontSize: 12, fontWeight: '800', color: COLORS.textSub, marginBottom: 15, textTransform: 'uppercase', letterSpacing: 1 },
  
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 16, borderRadius: 20, marginBottom: 12, elevation: 2 },
  rowIcon: { width: 45, height: 45, borderRadius: 14, backgroundColor: '#F1F5FF', justifyContent: 'center', alignItems: 'center' },
  rowLabelText: { fontSize: 10, fontWeight: '800', color: COLORS.textSub, textTransform: 'uppercase' },
  rowValueText: { fontSize: 16, fontWeight: '700', color: COLORS.textMain },

  logoutBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 16, borderRadius: 20, marginTop: 20, borderWidth: 1, borderColor: '#FEE2E2', elevation: 2 },
  logoutIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFF1F2', justifyContent: 'center', alignItems: 'center' },
  logoutText: { flex: 1, marginLeft: 15, fontSize: 16, fontWeight: '800', color: COLORS.danger },
  footerVersion: { textAlign: 'center', marginTop: 30, color: '#CBD5E1', fontSize: 12, fontWeight: '600' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(15,23,42,0.6)', justifyContent: 'center', padding: 25 },
  modalCard: { backgroundColor: 'white', borderRadius: 25, padding: 25 },
  modalTitle: { fontSize: 18, fontWeight: '900', color: COLORS.textMain, marginBottom: 20 },
  input: { backgroundColor: '#F8FAFF', borderRadius: 15, padding: 15, borderWidth: 1, borderColor: '#E2E8F0', fontWeight: '600' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 25, alignItems: 'center' },
  modalCancel: { marginRight: 20 },
  cancelText: { fontWeight: '700', color: COLORS.textSub },
  modalSave: { backgroundColor: COLORS.primary, paddingVertical: 10, paddingHorizontal: 25, borderRadius: 12 },
  saveText: { color: 'white', fontWeight: '900' }
});

