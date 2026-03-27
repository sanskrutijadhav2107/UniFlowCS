
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { db, storage } from "../../firebase";

const { width } = Dimensions.get("window");

const COLORS = {
  primary: "#2D6EEF", 
  secondary: "#1A50C8",
  accent: "#10B981", 
  bg: "#F0F4F8", 
  card: "#FFFFFF",
  textTitle: "#0F172A",
  textSub: "#64748B",
};

export default function StudentProfile() {
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editField, setEditField] = useState({ key: "", label: "", value: "" });

  // Predefined Lists for Selections
  const SEMESTERS = ["1", "2", "3", "4", "5", "6"];
  const YEARS = ["1st", "2nd", "3rd"];

  useEffect(() => { loadStudent(); }, []);

  const loadStudent = async () => {
    try {
      const saved = await AsyncStorage.getItem("student");
      if (saved) {
        const u = JSON.parse(saved);
        const docSnap = await getDoc(doc(db, "students", u.prn));
        const freshData = docSnap.exists() ? { ...u, ...docSnap.data() } : u;
        setStudent(freshData);
        await AsyncStorage.setItem("student", JSON.stringify(freshData));
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleUpdate = async () => {
    try {
      const studentRef = doc(db, "students", student.prn);
      await updateDoc(studentRef, { [editField.key]: editField.value });
      const updated = { ...student, [editField.key]: editField.value };
      setStudent(updated);
      await AsyncStorage.setItem("student", JSON.stringify(updated));
      setModalVisible(false);
    } catch (e) { Alert.alert("Error", "Update failed."); }
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
        const sRef = ref(storage, `profiles/${student.prn}.jpg`);
        await uploadBytes(sRef, blob);
        const url = await getDownloadURL(sRef);
        await updateDoc(doc(db, "students", student.prn), { photo: url });
        setStudent({ ...student, photo: url });
      } catch (err) { Alert.alert("Upload Error", err.message); }
      finally { setUploading(false); }
    }
  };

  const renderModalContent = () => {
    // List Selection for Semester and Year
    if (editField.key === "semester" || editField.key === "year") {
      const dataList = editField.key === "semester" ? SEMESTERS : YEARS;
      return (
        <View style={styles.listContainer}>
          {dataList.map((item) => (
            <TouchableOpacity 
              key={item} 
              style={[styles.listItem, editField.value === item && styles.listItemSelected]}
              onPress={() => setEditField({ ...editField, value: item })}
            >
              <Text style={[styles.listItemText, editField.value === item && styles.listItemTextSelected]}>
                {item}
              </Text>
              {editField.value === item && <Feather name="check-circle" size={18} color="white" />}
            </TouchableOpacity>
          ))}
        </View>
      );
    }
    // TextInput for Email and LinkedIn
    return (
      <TextInput 
        style={styles.input}
        value={editField.value}
        onChangeText={(t) => setEditField({...editField, value: t})}
        placeholder="Enter new details..."
        placeholderTextColor="#94A3B8"
        autoFocus
      />
    );
  };

  if (loading) return <View style={styles.center}><ActivityIndicator color={COLORS.primary} /></View>;

  return (
    <View style={styles.mainContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={[COLORS.primary, COLORS.secondary]} style={styles.header}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarBorder}>
              <Image 
                source={{ uri: student?.photo || `https://ui-avatars.com/api/?name=${student?.name}&background=random` }} 
                style={styles.avatar} 
              />
            </View>
            <TouchableOpacity style={styles.editBtn} onPress={pickImage}>
              {uploading ? <ActivityIndicator size="small" color="white" /> : <Feather name="camera" size={16} color="white" />}
            </TouchableOpacity>
          </View>
          <Text style={styles.nameText}>{student?.name}</Text>
          <Text style={styles.deptText}>{student?.branch || "Department of Computer Engineering"}</Text>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.glassStats}>
            <StatItem 
              label="Sem" 
              value={student?.semester || "N/A"} 
              icon="layers" 
              onPress={() => {
                setEditField({ key: "semester", label: "Semester", value: student?.semester?.toString() || "" });
                setModalVisible(true);
              }}
            />
            <View style={styles.divider} />
            <StatItem 
              label="Year" 
              value={student?.year || "N/A"} 
              icon="calendar" 
              onPress={() => {
                setEditField({ key: "year", label: "Academic Year", value: student?.year || "" });
                setModalVisible(true);
              }}
            />
            <View style={styles.divider} />
            <StatItem label="PRN" value={student?.prn?.toString().slice(-3) || "000"} icon="hash" />
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Digital Credentials</Text>
            <ModernRow 
              icon="mail" 
              label="Campus Email" 
              value={student?.email || "Link your email"} 
              onPress={() => {
                setEditField({ key: "email", label: "Email Address", value: student?.email || "" });
                setModalVisible(true);
              }}
            />
            <ModernRow 
              icon="linkedin" 
              label="Professional Profile" 
              value={student?.linkedin ? "Connected" : "Connect LinkedIn"} 
              onPress={() => {
                setEditField({ key: "linkedin", label: "LinkedIn URL", value: student?.linkedin || "" });
                setModalVisible(true);
              }}
            />
          </View>

          <TouchableOpacity style={styles.logoutWrapper} onPress={() => { AsyncStorage.clear(); router.replace("/"); }}>
            <Text style={styles.logoutText}>Log out</Text>
            <Feather name="log-out" size={16} color={COLORS.textSub} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit {editField.label}</Text>
            {renderModalContent()}
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.btnTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleUpdate} style={styles.btnSave}>
                <Text style={styles.btnTextSave}>Confirm Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const StatItem = ({ label, value, icon, onPress }) => (
  <TouchableOpacity style={styles.statItem} onPress={onPress} disabled={!onPress} activeOpacity={0.6}>
    <Feather name={icon} size={18} color={COLORS.primary} />
    <Text style={styles.statVal}>{value}</Text>
    <Text style={styles.statLab}>{label}</Text>
    {onPress && <View style={styles.miniEdit}><Feather name="edit-2" size={8} color={COLORS.textSub} /></View>}
  </TouchableOpacity>
);

const ModernRow = ({ icon, label, value, onPress }) => (
  <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.iconContainer}><Feather name={icon} size={20} color={COLORS.primary} /></View>
    <View style={{ flex: 1, marginLeft: 16 }}>
      <Text style={styles.rowLab}>{label}</Text>
      <Text style={styles.rowVal} numberOfLines={1}>{value}</Text>
    </View>
    <View style={styles.addBadge}><Feather name="plus" size={14} color="white" /></View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { paddingVertical: 70, alignItems: "center", borderBottomLeftRadius: 60, borderBottomRightRadius: 60 },
  avatarWrapper: { position: "relative" },
  avatarBorder: { padding: 4, borderRadius: 60, backgroundColor: "rgba(255,255,255,0.2)" },
  avatar: { width: 110, height: 110, borderRadius: 55, borderWidth: 4, borderColor: "white" },
  editBtn: { position: "absolute", bottom: 0, right: 0, backgroundColor: COLORS.accent, width: 36, height: 36, borderRadius: 18, justifyContent: "center", alignItems: "center", borderWidth: 4, borderColor: COLORS.primary },
  nameText: { color: "white", fontSize: 26, fontWeight: "900", marginTop: 15 },
  deptText: { color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: "600", marginTop: 4 },
  content: { paddingHorizontal: 20, marginTop: -40 },
  glassStats: { backgroundColor: "white", borderRadius: 32, padding: 25, flexDirection: "row", elevation: 15 },
  statItem: { flex: 1, alignItems: "center", position: 'relative' },
  statVal: { fontSize: 18, fontWeight: "800", color: COLORS.textTitle, marginTop: 4 },
  statLab: { fontSize: 10, color: COLORS.textSub, fontWeight: "700", textTransform: "uppercase" },
  miniEdit: { position: 'absolute', top: -5, right: 5 },
  divider: { width: 1, height: "80%", backgroundColor: "#F1F5F9", alignSelf: "center" },
  infoSection: { marginTop: 35 },
  sectionTitle: { fontSize: 13, fontWeight: "800", color: COLORS.textSub, textTransform: "uppercase", marginBottom: 15, marginLeft: 5 },
  row: { flexDirection: "row", alignItems: "center", backgroundColor: "white", padding: 18, borderRadius: 24, marginBottom: 12, elevation: 2 },
  iconContainer: { width: 48, height: 48, borderRadius: 16, backgroundColor: "#EEF4FF", justifyContent: "center", alignItems: "center" },
  rowLab: { fontSize: 11, color: COLORS.textSub, fontWeight: "700" },
  rowVal: { fontSize: 16, fontWeight: "700", color: COLORS.textTitle, marginTop: 2 },
  addBadge: { width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.primary, justifyContent: "center", alignItems: "center" },
  logoutWrapper: { flexDirection: "row", justifyContent: "center", alignItems: "center", padding: 20 },
  logoutText: { fontSize: 14, fontWeight: "700", color: COLORS.textSub, marginRight: 8 },
  // List Selection Styles
  listContainer: { marginVertical: 10 },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderRadius: 16, backgroundColor: '#F8FAFF', marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  listItemSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  listItemText: { fontSize: 16, fontWeight: '700', color: COLORS.textTitle },
  listItemTextSelected: { color: 'white' },
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: "rgba(15, 23, 42, 0.4)", justifyContent: "center", padding: 25 },
  modalContent: { backgroundColor: "white", borderRadius: 32, padding: 30 },
  modalTitle: { fontSize: 20, fontWeight: "800", color: COLORS.textTitle, marginBottom: 20 },
  input: { backgroundColor: "#F8FAFF", padding: 18, borderRadius: 16, fontSize: 16, color: COLORS.textTitle, marginBottom: 25, borderWidth: 1, borderColor: "#E2E8F0" },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", alignItems: 'center', gap: 15 },
  btnSave: { backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  btnTextSave: { color: "white", fontWeight: "800" },
  btnTextCancel: { color: COLORS.textSub, fontWeight: "700" }
});