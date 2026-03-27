// // app/Admin/AddFaculty.jsx
// import React, { useEffect, useState } from "react";
// import { Picker } from "@react-native-picker/picker";
// import { useRouter } from "expo-router";
// import {
//   setDoc,
//   doc,
//   collection,
//   getDocs,
//   serverTimestamp,
// } from "firebase/firestore";
// import {
//   Alert,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { db } from "../../firebase";

// export default function AddFaculty() {
//   const router = useRouter();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [education, setEducation] = useState("");
//   const [password, setPassword] = useState("");
//   const [subjects, setSubjects] = useState([]);
//   const [selectedSubject, setSelectedSubject] = useState("");
//   const [year, setYear] = useState(""); // 1 / 2 / 3
//   const [loadingSubjects, setLoadingSubjects] = useState(true);

//   useEffect(() => {
//     const fetchSubjects = async () => {
//       try {
//         setLoadingSubjects(true);
//         const snap = await getDocs(collection(db, "subjects"));
//         const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//         setSubjects(list);
//       } catch (err) {
//         console.error("Error fetching subjects:", err);
//         Alert.alert("Error", "Could not fetch subjects. Check Firestore rules & network.");
//       } finally {
//         setLoadingSubjects(false);
//       }
//     };

//     fetchSubjects();
//   }, []);

//   const normalizePhone = (raw) => {
//     const digits = raw.replace(/\D/g, "");
//     if (digits.length > 10) return digits.slice(-10);
//     return digits;
//   };

//   const handleAddFaculty = async () => {
//     try {
//       const phoneStr = normalizePhone(phone);
//       if (!name.trim() || !email.trim() || !phoneStr || !education.trim() || !password) {
//         Alert.alert("Validation", "Please fill all fields.");
//         return;
//       }
//       if (phoneStr.length !== 10) {
//         Alert.alert("Validation", "Phone must be 10 digits.");
//         return;
//       }
//       if (!selectedSubject) {
//         Alert.alert("Validation", "Please choose a subject.");
//         return;
//       }
//       if (!["1", "2", "3"].includes(String(year))) {
//         Alert.alert("Validation", "Year must be 1, 2 or 3.");
//         return;
//       }

//       const phoneDocId = phoneStr; // string doc id
//       const phoneNumber = Number(phoneStr); // numeric field

//       // Faculty doc
//       await setDoc(
//         doc(db, "faculty", phoneDocId),
//         {
//           name: name.trim(),
//           email: email.trim(),
//           phone: phoneNumber,
//           education: education.trim(),
//           password,
//           role: "faculty",
//           createdAt: serverTimestamp(),
//         },
//         { merge: true }
//       );

//       // Faculty assignment doc
//       const assignmentDocId = `${phoneDocId}_${selectedSubject}`;
//       await setDoc(
//         doc(db, "facultyAssignments", assignmentDocId),
//         {
//           facultyId: phoneDocId,
//           facultyName: name.trim(),
//           subjectId: selectedSubject,
//           subjectName: subjects.find((s) => s.id === selectedSubject)?.name || "",
//           year: Number(year),
//           createdAt: serverTimestamp(),
//         },
//         { merge: true }
//       );

//       Alert.alert("Success", "Faculty added and subject assigned ✅");
//       router.back();
//     } catch (err) {
//       console.error("AddFaculty error:", err);
//       Alert.alert("Error", err.message || "Could not add faculty");
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Add Faculty</Text>

//       <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
//       <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
//       <TextInput style={styles.input} placeholder="Phone Number (10 digits)" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
//       <TextInput style={styles.input} placeholder="Education" value={education} onChangeText={setEducation} />
//       <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
//       <TextInput style={styles.input} placeholder="Year (1 / 2 / 3)" value={year} onChangeText={setYear} keyboardType="numeric" />

//       <View style={styles.pickerWrapper}>
//         <Text style={styles.pickerLabel}>Assign Subject:</Text>
//         <View style={styles.picker}>
//           <Picker selectedValue={selectedSubject} onValueChange={(v) => setSelectedSubject(v)}>
//             <Picker.Item label={loadingSubjects ? "Loading subjects..." : "Select subject"} value="" />
//             {subjects.map((s) => (
//               <Picker.Item key={s.id} label={`${s.name} (${s.id})`} value={s.id} />
//             ))}
//           </Picker>
//         </View>
//       </View>

//       <TouchableOpacity style={styles.button} onPress={handleAddFaculty}>
//         <Text style={styles.buttonText}>Save Faculty & Assign Subject</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flexGrow: 1, padding: 20, backgroundColor: "#fff" },
//   title: { fontSize: 22, fontWeight: "700", color: "#2d6eefff", textAlign: "center", marginBottom: 24 },
//   input: {
//     backgroundColor: "#E6F0FF",
//     padding: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#2d6eefff",
//     marginBottom: 12,
//   },
//   pickerWrapper: { marginBottom: 16 },
//   pickerLabel: { fontSize: 14, fontWeight: "600", marginBottom: 6 },
//   picker: { backgroundColor: "#E6F0FF", borderRadius: 8 },
//   button: { backgroundColor: "#2d6eefff", paddingVertical: 14, borderRadius: 8, marginTop: 8 },
//   buttonText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "700" },
// });








import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
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

export default function AddFaculty() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [education, setEducation] = useState("");
  const [password, setPassword] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [year, setYear] = useState(""); 
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoadingSubjects(true);
        const snap = await getDocs(collection(db, "subjects"));
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setSubjects(list);
      } catch (err) {
        console.error("Error fetching subjects:", err);
        Alert.alert("Error", "Could not fetch subjects.");
      } finally {
        setLoadingSubjects(false);
      }
    };
    fetchSubjects();
  }, []);

  const normalizePhone = (raw) => {
    const digits = raw.replace(/\D/g, "");
    if (digits.length > 10) return digits.slice(-10);
    return digits;
  };

  const handleAddFaculty = async () => {
    try {
      const phoneStr = normalizePhone(phone);
      if (!name.trim() || !email.trim() || !phoneStr || !education.trim() || !password) {
        Alert.alert("Validation", "Please fill all fields.");
        return;
      }
      if (phoneStr.length !== 10) {
        Alert.alert("Validation", "Phone must be 10 digits.");
        return;
      }
      if (!selectedSubject) {
        Alert.alert("Validation", "Please choose a subject.");
        return;
      }
      if (!["1", "2", "3"].includes(String(year))) {
        Alert.alert("Validation", "Year must be 1, 2 or 3.");
        return;
      }

      setIsSubmitting(true);
      const phoneDocId = phoneStr;
      const phoneNumber = Number(phoneStr);

      await setDoc(
        doc(db, "faculty", phoneDocId),
        {
          name: name.trim(),
          email: email.trim(),
          phone: phoneNumber,
          education: education.trim(),
          password,
          role: "faculty",
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      const assignmentDocId = `${phoneDocId}_${selectedSubject}`;
      await setDoc(
        doc(db, "facultyAssignments", assignmentDocId),
        {
          facultyId: phoneDocId,
          facultyName: name.trim(),
          subjectId: selectedSubject,
          subjectName: subjects.find((s) => s.id === selectedSubject)?.name || "",
          year: Number(year),
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      Alert.alert("Success", "Faculty added and subject assigned ✅");
      router.back();
    } catch (err) {
      Alert.alert("Error", err.message || "Could not add faculty");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <Text style={styles.headerTitle}>Register Faculty</Text>
              <Text style={styles.headerSub}>Create new system access</Text>
            </View>
            <MaterialCommunityIcons name="account-plus" size={28} color="white" />
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
             <MaterialCommunityIcons name="form-select" size={20} color={COLORS.primary} />
             <Text style={styles.cardHeaderText}>Onboarding Details</Text>
          </View>

          <LabeledInput label="Full Name" icon="account-outline" value={name} onChangeText={setName} placeholder="Dr. John Doe" />
          <LabeledInput label="Email Address" icon="email-outline" value={email} onChangeText={setEmail} placeholder="john@college.edu" keyboardType="email-address" />
          <LabeledInput label="Phone Number" icon="phone-outline" value={phone} onChangeText={setPhone} placeholder="10 Digits" keyboardType="phone-pad" />
          <LabeledInput label="Education" icon="school-outline" value={education} onChangeText={setEducation} placeholder="e.g. PhD Computer Science" />
          <LabeledInput label="Password" icon="lock-outline" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry />
          <LabeledInput label="Teaching Year" icon="calendar-outline" value={year} onChangeText={setYear} placeholder="1, 2, or 3" keyboardType="numeric" />

          {/* PICKER SECTION */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <MaterialCommunityIcons name="book-open-variant" size={16} color={COLORS.textSub} />
              <Text style={styles.label}>Assign Primary Subject</Text>
            </View>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedSubject}
                onValueChange={(v) => setSelectedSubject(v)}
                dropdownIconColor={COLORS.primary}
                style={styles.picker}
              >
                <Picker.Item label={loadingSubjects ? "Fetching List..." : "Select Subject"} value="" color={COLORS.textSub} />
                {subjects.map((s) => (
                  <Picker.Item key={s.id} label={`${s.name} (${s.id})`} value={s.id} />
                ))}
              </Picker>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.saveBtn, isSubmitting && { opacity: 0.7 }]}
            onPress={handleAddFaculty}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.saveBtnText}>Save & Assign Subject</Text>
                <MaterialCommunityIcons name="arrow-right" size={20} color="white" style={{marginLeft: 8}} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// Reusable Sub-component for inputs
function LabeledInput({ label, icon, ...props }) {
  return (
    <View style={styles.inputGroup}>
      <View style={styles.labelRow}>
        <MaterialCommunityIcons name={icon} size={16} color={COLORS.textSub} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <TextInput style={styles.input} placeholderTextColor="#94A3B8" {...props} />
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
    elevation: 8,
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
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 10 },
  cardHeaderText: { fontSize: 16, fontWeight: '800', color: COLORS.textMain, marginLeft: 8 },

  inputGroup: { marginBottom: 15 },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  label: { fontSize: 13, fontWeight: '700', color: COLORS.textMain, marginLeft: 6 },
  input: {
    backgroundColor: "#F8FAFF",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    color: COLORS.textMain,
    fontSize: 14,
    fontWeight: '600'
  },

  pickerContainer: {
    backgroundColor: "#F8FAFF",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  picker: { height: 50, width: '100%' },

  saveBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
  },
  saveBtnText: { color: "#fff", fontWeight: '900', fontSize: 16 },
});

