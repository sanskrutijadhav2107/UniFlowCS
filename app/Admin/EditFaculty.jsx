// import { useLocalSearchParams, useRouter } from "expo-router";
// import { doc, getDoc, updateDoc } from "firebase/firestore";
// import { useEffect, useState } from "react";
// import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
// import { db } from "../../firebase";

// export default function EditFaculty() {
//   const { id } = useLocalSearchParams(); // faculty id from ManageFaculty
//   const router = useRouter();

//   const [faculty, setFaculty] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   // Fetch faculty details
//   useEffect(() => {
//     const fetchFaculty = async () => {
//       try {
//         const docRef = doc(db, "faculty", id);
//         const docSnap = await getDoc(docRef);
//         if (docSnap.exists()) {
//           setFaculty(docSnap.data());
//         } else {
//           Alert.alert("Error", "Faculty not found");
//           router.back();
//         }
//       } catch (error) {
//         console.error("Error fetching faculty:", error);
//         Alert.alert("Error", "Could not fetch faculty details");
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (id) fetchFaculty();
//   }, [id, router]);

//   // Save updates
//   const handleSave = async () => {
//     if (!faculty.name || !faculty.email || !faculty.phone || !faculty.education) {
//       Alert.alert("Error", "Please fill all fields");
//       return;
//     }
//     try {
//       setSaving(true);
//       const docRef = doc(db, "faculty", id);
//       await updateDoc(docRef, {
//         name: faculty.name,
//         email: faculty.email,
//         phone: faculty.phone,
//         education: faculty.education,
//         password: faculty.password || "", // ⚠️ plain text for now
//       });
//       Alert.alert("Success", "Faculty updated ✅");
//       router.back(); // go back to ManageFaculty
//     } catch (error) {
//       console.error("Error updating faculty:", error);
//       Alert.alert("Error", "Could not update faculty");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#2d6eefff" />
//         <Text>Loading faculty details...</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Edit Faculty</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Full Name"
//         value={faculty?.name || ""}
//         onChangeText={(text) => setFaculty({ ...faculty, name: text })}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={faculty?.email || ""}
//         onChangeText={(text) => setFaculty({ ...faculty, email: text })}
//         keyboardType="email-address"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Phone"
//         value={faculty?.phone?.toString() || ""}
//         onChangeText={(text) => setFaculty({ ...faculty, phone: text })}
//         keyboardType="phone-pad"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Education"
//         value={faculty?.education || ""}
//         onChangeText={(text) => setFaculty({ ...faculty, education: text })}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         secureTextEntry
//         value={faculty?.password || ""}
//         onChangeText={(text) => setFaculty({ ...faculty, password: text })}
//       />

//       <TouchableOpacity
//         style={[styles.button, saving && { backgroundColor: "#aaa" }]}
//         onPress={handleSave}
//         disabled={saving}
//       >
//         <Text style={styles.buttonText}>{saving ? "Saving..." : "Save Changes"}</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flexGrow: 1, padding: 20, backgroundColor: "#fff", justifyContent: "center" },
//   title: { fontSize: 22, fontWeight: "bold", color: "#2d6eefff", textAlign: "center", marginBottom: 20 },
//   input: {
//     backgroundColor: "#E6F0FF",
//     padding: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#2d6eefff",
//     marginBottom: 15,
//   },
//   button: { backgroundColor: "#2d6eefff", paddingVertical: 14, borderRadius: 8, marginTop: 10 , marginBottom:300,},
//   buttonText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "bold" },
//   centered: { flex: 1, justifyContent: "center", alignItems: "center" },
// });




import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { db } from "../../firebase";

const COLORS = {
  primaryDark: "#1A50C8",
  primary: "#2D6EEF",
  primaryLight: "#60A5FA",
  bg: "#F8FAFF",
  white: "#FFFFFF",
  textMain: "#0F172A",
  textSub: "#64748B",
  accent: "#E0E7FF"
};

export default function EditFaculty() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const docRef = doc(db, "faculty", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFaculty(docSnap.data());
        } else {
          Alert.alert("Error", "Faculty record not found");
          router.back();
        }
      } catch (error) {
        console.error("Error fetching faculty:", error);
        Alert.alert("Error", "Could not fetch details");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchFaculty();
  }, [id, router]);

  const handleSave = async () => {
    // Basic Validation
    if (!faculty?.name || !faculty?.email || !faculty?.phone || !faculty?.education) {
      Alert.alert("Missing Fields", "Please ensure all required fields are filled.");
      return;
    }
    
    try {
      setSaving(true);
      const docRef = doc(db, "faculty", id);
      await updateDoc(docRef, {
        name: faculty.name,
        email: faculty.email,
        phone: faculty.phone,
        education: faculty.education,
        password: faculty.password || "",
      });
      Alert.alert("Success", "Faculty profile updated successfully ✅");
      router.back();
    } catch (error) {
      Alert.alert("Update Failed", "Could not save changes to the database.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Retrieving record...</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* HEADER */}
      <LinearGradient 
        colors={[COLORS.primaryDark, COLORS.primary, COLORS.primaryLight]} 
        style={styles.header}
      >
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>Edit Profile</Text>
              <Text style={styles.headerSub}>Updating ID: {id?.substring(0, 8)}...</Text>
            </View>
            <MaterialCommunityIcons name="account-edit-outline" size={28} color="white" />
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
      >
        <View style={styles.formCard}>
          <View style={styles.cardHeader}>
             <MaterialCommunityIcons name="card-account-details-outline" size={20} color={COLORS.primary} />
             <Text style={styles.cardHeaderText}>Faculty Information</Text>
          </View>

          <LabeledInput
            label="Full Name"
            icon="account"
            value={faculty?.name || ""}
            onChangeText={(text) => setFaculty({ ...faculty, name: text })}
            placeholder="e.g. Dr. Jane Smith"
          />

          <LabeledInput
            label="Official Email"
            icon="email"
            value={faculty?.email || ""}
            onChangeText={(text) => setFaculty({ ...faculty, email: text })}
            placeholder="email@college.edu"
            keyboardType="email-address"
          />

          <LabeledInput
            label="Contact Number"
            icon="phone"
            value={faculty?.phone?.toString() || ""}
            onChangeText={(text) => setFaculty({ ...faculty, phone: text })}
            placeholder="+91 XXXXX XXXXX"
            keyboardType="phone-pad"
          />

          <LabeledInput
            label="Education / Specialization"
            icon="school"
            value={faculty?.education || ""}
            onChangeText={(text) => setFaculty({ ...faculty, education: text })}
            placeholder="e.g. PhD in Computer Science"
          />

          <LabeledInput
            label="System Password"
            icon="lock"
            value={faculty?.password || ""}
            onChangeText={(text) => setFaculty({ ...faculty, password: text })}
            placeholder="••••••••"
            secureTextEntry
          />

          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.saveBtn, saving && { opacity: 0.6 }]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.saveBtnText}>Save Changes</Text>
                <MaterialCommunityIcons name="check-all" size={20} color="white" style={{marginLeft: 8}} />
              </>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.cancelBtn} 
            onPress={() => router.back()}
          >
            <Text style={styles.cancelBtnText}>Discard Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function LabeledInput({ label, icon, ...props }) {
  return (
    <View style={styles.inputGroup}>
      <View style={styles.labelRow}>
        <MaterialCommunityIcons name={icon} size={16} color={COLORS.textSub} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholderTextColor="#94A3B8"
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    height: 160,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    justifyContent: 'center',
  },
  headerContent: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    marginTop: Platform.OS === 'android' ? 10 : 0 
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: 'white', fontSize: 22, fontWeight: '900' },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '600' },

  scroll: { flex: 1, marginTop: -30 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 60 },

  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 30,
    padding: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 25, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 10 },
  cardHeaderText: { fontSize: 16, fontWeight: '800', color: COLORS.textMain, marginLeft: 8 },

  inputGroup: { marginBottom: 18 },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  label: { fontSize: 13, fontWeight: '700', color: COLORS.textMain, marginLeft: 6 },
  input: {
    backgroundColor: "#F8FAFF",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    color: COLORS.textMain,
    fontSize: 14,
    fontWeight: '600'
  },

  saveBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 4,
  },
  saveBtnText: { color: "#fff", fontWeight: '900', fontSize: 16 },
  
  cancelBtn: { marginTop: 15, alignItems: 'center', padding: 10 },
  cancelBtnText: { color: COLORS.textSub, fontWeight: '700', fontSize: 14 },

  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.bg },
  loadingText: { marginTop: 10, color: COLORS.textSub, fontWeight: '600' }
});