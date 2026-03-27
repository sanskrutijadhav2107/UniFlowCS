// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   ScrollView,
// } from "react-native";
// import { addDoc, collection, serverTimestamp } from "firebase/firestore";
// import { db } from "../../firebase";
// import BottomNavbar from "../student/components/BottomNavbar";

// export default function AddOpportunity() {
//   const [title, setTitle] = useState("");
//   const [company, setCompany] = useState("");
//   const [department, setDepartment] = useState("");
//   const [deadline, setDeadline] = useState("");
//   const [applyLink, setApplyLink] = useState("");
//   const [description, setDescription] = useState("");
//   const [eligibleSemesters, setEligibleSemesters] = useState([]);

//   const toggleSemester = (sem) => {
//     if (eligibleSemesters.includes(sem)) {
//       setEligibleSemesters(eligibleSemesters.filter((s) => s !== sem));
//     } else {
//       setEligibleSemesters([...eligibleSemesters, sem]);
//     }
//   };
  

//   const handlePost = async () => {
//     if (!title || !company || !department || !deadline || !applyLink || eligibleSemesters.length === 0) {
//       Alert.alert("Please fill all fields and select eligible semesters");
//       return;
//     }
    

//     try {
//           await addDoc(collection(db, "opportunities"), {
//       title,
//       company,
//       department,
//       deadline,
//       applyLink,
//       description,

//       type: "Internship", // default (can improve later)

//       eligibleSemesters,

//       postedBy: "admin",

//       createdAt: serverTimestamp(),
//     });


//       Alert.alert("Opportunity posted successfully!");

//       setTitle("");
//       setCompany("");
//       setDepartment("");
//       setDeadline("");
//       setApplyLink("");
//       setDescription("");

//     } catch (err) {
//       Alert.alert("Error posting opportunity");
//       console.error(err);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
//         <Text style={styles.header}>Post Opportunity</Text>

//         <TextInput
//           style={styles.input}
//           placeholder="Title (Software Engineer Intern)"
//           value={title}
//           onChangeText={setTitle}
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="Company (Infosys)"
//           value={company}
//           onChangeText={setCompany}
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="Department (Computer Engineering)"
//           value={department}
//           onChangeText={setDepartment}
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="Deadline (2026-03-10)"
//           value={deadline}
//           onChangeText={setDeadline}
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="Apply Link"
//           value={applyLink}
//           onChangeText={setApplyLink}
//         />

//         <TextInput
//           style={[styles.input, { height: 100 }]}
//           placeholder="Description"
//           multiline
//           value={description}
//           onChangeText={setDescription}
//         />

//         <Text style={{ fontWeight: "600", marginBottom: 8 }}>
//   Eligible Semesters
// </Text>

// <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 12 }}>
//   {[1,2,3,4,5,6].map((sem) => (
//     <TouchableOpacity
//       key={sem}
//       onPress={() => toggleSemester(sem)}
//       style={{
//         padding: 10,
//         margin: 5,
//         borderRadius: 8,
//         backgroundColor: eligibleSemesters.includes(sem)
//           ? "#146ED7"
//           : "#E6F0FF",
//       }}
//     >
//       <Text
//             style={{
//               color: eligibleSemesters.includes(sem)
//                 ? "#fff"
//                 : "#146ED7",
//               fontWeight: "bold",
//             }}
//           >
//             Sem {sem}
//           </Text>
//         </TouchableOpacity>
//       ))}
//     </View>


//         <TouchableOpacity style={styles.btn} onPress={handlePost}>
//           <Text style={styles.btnText}>Post Opportunity</Text>
//         </TouchableOpacity>

//       </ScrollView>

//       <BottomNavbar />
//     </View>
//   );
// }

// const styles = StyleSheet.create({

//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: "#F9FBFF",
//   },

//   header: {
//     fontSize: 22,
//     fontWeight: "bold",
//     marginBottom: 20,
//     textAlign: "center",
//   },

//   input: {
//     backgroundColor: "#fff",
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 12,
//   },

//   btn: {
//     backgroundColor: "#146ED7",
//     padding: 14,
//     borderRadius: 10,
//     alignItems: "center",
//     marginTop: 10,
//   },

//   btnText: {
//     color: "#fff",
//     fontWeight: "bold",
//   },

// });













import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
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
import BottomNavbar from "../student/components/BottomNavbar";

const COLORS = {
  primaryDark: "#1A50C8",
  primary: "#2D6EEF",
  primaryLight: "#60A5FA",
  bg: "#F8FAFF",
  white: "#FFFFFF",
  textMain: "#0F172A",
  textSub: "#64748B",
  accent: "#E0E7FF",
};

export default function AddOpportunity() {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [department, setDepartment] = useState("");
  const [deadline, setDeadline] = useState("");
  const [applyLink, setApplyLink] = useState("");
  const [description, setDescription] = useState("");
  const [eligibleSemesters, setEligibleSemesters] = useState([]);
  const [isPosting, setIsPosting] = useState(false);

  const toggleSemester = (sem) => {
    if (eligibleSemesters.includes(sem)) {
      setEligibleSemesters(eligibleSemesters.filter((s) => s !== sem));
    } else {
      setEligibleSemesters([...eligibleSemesters, sem]);
    }
  };

  const handlePost = async () => {
    if (!title || !company || !department || !deadline || !applyLink || eligibleSemesters.length === 0) {
      Alert.alert("Validation", "Please fill all fields and select eligible semesters");
      return;
    }

    try {
      setIsPosting(true);
      await addDoc(collection(db, "opportunities"), {
        title: title.trim(),
        company: company.trim(),
        department: department.trim(),
        deadline: deadline.trim(),
        applyLink: applyLink.trim(),
        description: description.trim(),
        type: "Internship", 
        eligibleSemesters,
        postedBy: "admin",
        createdAt: serverTimestamp(),
      });

      Alert.alert("Success", "Opportunity posted successfully! 🚀");
      setTitle("");
      setCompany("");
      setDepartment("");
      setDeadline("");
      setApplyLink("");
      setDescription("");
      setEligibleSemesters([]);
    } catch (err) {
      Alert.alert("Error", "Could not post opportunity");
      console.error(err);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* BRANDED HEADER */}
      <LinearGradient 
        colors={[COLORS.primaryDark, COLORS.primary, COLORS.primaryLight]} 
        style={styles.header}
      >
        <SafeAreaView>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>Post Opportunity</Text>
              <Text style={styles.headerSub}>Help students find their future</Text>
            </View>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="briefcase-plus-outline" size={26} color="white" />
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formCard}>
          
          <LabeledInput label="Opportunity Title" icon="format-title" value={title} onChangeText={setTitle} placeholder="Software Engineer Intern" />
          <LabeledInput label="Company Name" icon="office-building" value={company} onChangeText={setCompany} placeholder="e.g. Google, Infosys" />
          <LabeledInput label="Target Department" icon="domain" value={department} onChangeText={setDepartment} placeholder="Computer Engineering" />
          <LabeledInput label="Application Deadline" icon="calendar-clock" value={deadline} onChangeText={setDeadline} placeholder="YYYY-MM-DD" />
          <LabeledInput label="Application Link" icon="link-variant" value={applyLink} onChangeText={setApplyLink} placeholder="https://careers.company.com" />

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <MaterialCommunityIcons name="text-subject" size={16} color={COLORS.textSub} />
              <Text style={styles.label}>Job Description</Text>
            </View>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tell students about the role..."
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <MaterialCommunityIcons name="account-group" size={16} color={COLORS.textSub} />
              <Text style={styles.label}>Eligible Semesters</Text>
            </View>
            <View style={styles.semesterRow}>
              {[1, 2, 3, 4, 5, 6].map((sem) => {
                const isSelected = eligibleSemesters.includes(sem);
                return (
                  <TouchableOpacity
                    key={sem}
                    activeOpacity={0.7}
                    onPress={() => toggleSemester(sem)}
                    style={[styles.semChip, isSelected && styles.semChipSelected]}
                  >
                    <Text style={[styles.semText, isSelected && styles.semTextSelected]}>
                      Sem {sem}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.postBtn, isPosting && { opacity: 0.7 }]} 
            onPress={handlePost}
            disabled={isPosting}
          >
            {isPosting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Text style={styles.postBtnText}>Post Opportunity</Text>
                <Ionicons name="rocket-outline" size={20} color="white" style={{marginLeft: 8}} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNavbar />
    </View>
  );
}

// Sub-component for clean inputs
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
    paddingHorizontal: 25,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    justifyContent: 'center',
    elevation: 8,
  },
  headerContent: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginTop: Platform.OS === 'android' ? 10 : 0 
  },
  headerTitle: { color: 'white', fontSize: 24, fontWeight: '900' },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600' },
  iconCircle: { width: 46, height: 46, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },

  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 130 },

  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 30,
    padding: 22,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
  },

  inputGroup: { marginBottom: 18 },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
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
  textArea: { height: 100, textAlignVertical: 'top' },

  semesterRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 4 },
  semChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0"
  },
  semChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  semText: { color: COLORS.textSub, fontWeight: "700", fontSize: 12 },
  semTextSelected: { color: "#fff" },

  postBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 4,
  },
  postBtnText: { color: "#fff", fontWeight: '900', fontSize: 16 },
});