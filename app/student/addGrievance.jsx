// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useEffect, useState } from "react";
// import {
//   View,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   Text,
//   Alert,
//   Switch,
// } from "react-native";
// import { addDoc, collection, serverTimestamp } from "firebase/firestore";
// import { db } from "../../firebase";
// import { useRouter } from "expo-router";

// export default function AddGrievance() {
//   const router = useRouter();

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [category, setCategory] = useState("");
//   const [isAnonymous, setIsAnonymous] = useState(false);

//   const handleSubmit = async () => {
//     if (!title.trim() || !description.trim() || !category.trim()) {
//       Alert.alert("All fields are required");
//       return;
//     }

//     const saved = await AsyncStorage.getItem("student");
//     const student = saved ? JSON.parse(saved) : null;

//     await addDoc(collection(db, "grievances"), {
//       title,
//       description,
//       category,
//       isAnonymous,
//       studentName: isAnonymous ? "Anonymous" : student?.name,
//       studentId: student?.prn,   // 🔥 always store
//       status: "Pending",
//       createdAt: serverTimestamp(),
//     });

//     Alert.alert("Grievance Submitted!");
//     router.back();
//   };

//   return (
//     <View style={styles.container}>
//       <TextInput
//         placeholder="Title"
//         style={styles.input}
//         value={title}
//         onChangeText={setTitle}
//       />

//       <TextInput
//         placeholder="Description"
//         style={[styles.input, { height: 100 }]}
//         multiline
//         value={description}
//         onChangeText={setDescription}
//       />

//       <TextInput
//         placeholder="Category (e.g. Infrastructure, Faculty, Exam)"
//         style={styles.input}
//         value={category}
//         onChangeText={setCategory}
//       />

//       <View style={styles.row}>
//         <Text>Submit Anonymously</Text>
//         <Switch value={isAnonymous} onValueChange={setIsAnonymous} />
//       </View>

//       <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
//         <Text style={{ color: "#fff", fontWeight: "700" }}>
//           Submit Grievance
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: "#F9FBFF" },
//   input: {
//     backgroundColor: "#fff",
//     padding: 12,
//     borderRadius: 12,
//     marginBottom: 12,
//   },
//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   btn: {
//     backgroundColor: "#146ED7",
//     padding: 14,
//     borderRadius: 12,
//     alignItems: "center",
//   },
// });








import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../firebase";

const COLORS = {
  primary: "#2D6EEF",
  secondary: "#1A50C8",
  danger: "#EF4444",
  bg: "#F8FAFF",
  white: "#FFFFFF",
  border: "#E2E8F0",
  textMain: "#0F172A",
  textSub: "#64748B",
};

export default function AddGrievance() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  // --- LOGIC (UNTOUCHED) ---
  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !category.trim()) {
      Alert.alert("Required", "All fields are required");
      return;
    }

    const saved = await AsyncStorage.getItem("student");
    const student = saved ? JSON.parse(saved) : null;

    await addDoc(collection(db, "grievances"), {
      title,
      description,
      category,
      isAnonymous,
      studentName: isAnonymous ? "Anonymous" : student?.name,
      studentId: student?.prn,
      status: "Pending",
      createdAt: serverTimestamp(),
    });

    Alert.alert("Success", "Grievance Submitted!");
    router.back();
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      
      {/* 🏛 HEADER */}
      <LinearGradient colors={[COLORS.secondary, COLORS.primary]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Grievance</Text>
        </View>
        <Text style={styles.headerSub}>Please provide details about your concern</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.formCard}>
          
          {/* CATEGORY INPUT */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="category" size={20} color={COLORS.primary} style={styles.inputIcon} />
              <TextInput
                placeholder="Infrastructure, Faculty, Exam..."
                style={styles.input}
                value={category}
                onChangeText={setCategory}
              />
            </View>
          </View>

          {/* TITLE INPUT */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Issue Title</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="title" size={20} color={COLORS.primary} style={styles.inputIcon} />
              <TextInput
                placeholder="Brief summary of the issue"
                style={styles.input}
                value={title}
                onChangeText={setTitle}
              />
            </View>
          </View>

          {/* DESCRIPTION INPUT */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Detailed Description</Text>
            <TextInput
              placeholder="Explain the problem in detail..."
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          {/* ANONYMOUS SWITCH */}
          <View style={styles.anonymousCard}>
            <View style={styles.anonymousInfo}>
              <Ionicons name="eye-off" size={22} color={COLORS.textSub} />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.anonTitle}>Submit Anonymously</Text>
                <Text style={styles.anonSub}>Your identity will be hidden</Text>
              </View>
            </View>
            <Switch 
              value={isAnonymous} 
              onValueChange={setIsAnonymous}
              trackColor={{ false: "#CBD5E1", true: COLORS.primary }}
              thumbColor={Platform.OS === 'ios' ? '#fff' : isAnonymous ? COLORS.white : '#f4f3f4'}
            />
          </View>

          {/* SUBMIT BUTTON */}
          <TouchableOpacity 
            style={styles.submitBtn} 
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.secondary]}
              style={styles.btnGradient}
            >
              <Text style={styles.btnText}>Submit Grievance</Text>
              <MaterialIcons name="send" size={18} color="white" style={{ marginLeft: 8 }} />
            </LinearGradient>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 45,
    paddingBottom: 30,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 12, marginRight: 15 },
  headerTitle: { fontSize: 22, fontWeight: "900", color: "white" },
  headerSub: { fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: "600", marginTop: 8, marginLeft: 50 },

  scrollContent: { padding: 20 },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 25,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    marginTop: -10,
  },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 12, fontWeight: '800', color: COLORS.textSub, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 15,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textMain,
  },
  textArea: {
    backgroundColor: COLORS.bg,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 15,
    height: 120,
  },
  anonymousCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    padding: 15,
    borderRadius: 18,
    marginBottom: 25,
  },
  anonymousInfo: { flexDirection: 'row', alignItems: 'center' },
  anonTitle: { fontSize: 14, fontWeight: '800', color: COLORS.textMain },
  anonSub: { fontSize: 11, color: COLORS.textSub, fontWeight: '600' },

  submitBtn: {
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  btnGradient: {
    flexDirection: 'row',
    paddingVertical: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: { color: 'white', fontSize: 16, fontWeight: '900' },
});










