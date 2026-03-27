// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Keyboard,
//   TouchableWithoutFeedback,
//   SafeAreaView,
//   FlatList,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import BottomNavbar from "./components/BottomNavbar";



// export default function InnovationPage() {
//   const [leader, setLeader] = useState("");
//   const [members, setMembers] = useState("");
//   const [title, setTitle] = useState("");
//   const [idea, setIdea] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   // Trending topics (static fallback + backend fetch hook below)
//   const [trending, setTrending] = useState([
//     "AI-powered Attendance System",
//     "Real-time Bus Tracking App",
//     "Hospital Queue Optimizer",
//     "Smart Waste Segregation (IoT + CV)",
//     "E-Commerce Price Tracker",
//     "College Event Aggregator",
//     "Doc Summarizer (LLM + RAG)",
//     "Secure Notes with End-to-End Encryption",
//   ]);
//   const [loadingTrending, setLoadingTrending] = useState(false);



//   const isDisabled =
//     !leader.trim() || !members.trim() || !title.trim() || !idea.trim();

//   const onSubmit = async () => {
//     if (isDisabled) return;
//     setSubmitting(true);
//     try {
      

//       setLeader("");
//       setMembers("");
//       setTitle("");
//       setIdea("");
//       Alert.alert("Submitted", "Your project idea was submitted successfully.");
//     } catch (e) {
//       Alert.alert("Error", e?.message || "Could not submit right now.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const renderChip = ({ item }) => (
//     <View style={styles.chip}>
//       <Text style={styles.chipText}>{item}</Text>
//     </View>
//   );

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F8FF" }}>
//       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//         <View style={styles.container}>
//           <ScrollView
//             contentContainerStyle={{ paddingBottom: 90 }}
//             showsVerticalScrollIndicator={false}
//           >
//             {/* Heading */}
//             <Text style={styles.title}>Final Year Projects</Text>
//             <Text style={styles.subtitle}>Submit your team & project idea</Text>

//             {/* Form Card */}
//             <View style={styles.card}>
//               <LabeledInput
//                 label="Leader Name"
//                 value={leader}
//                 onChangeText={setLeader}
//                 placeholder="e.g., A. Sharma"
//               />
//               <LabeledInput
//                 label="Team Members"
//                 value={members}
//                 onChangeText={setMembers}
//                 placeholder="Comma-separated (e.g., K. Rao, M. Patel)"
//                 multiline
//               />
//               <LabeledInput
//                 label="Project Title"
//                 value={title}
//                 onChangeText={setTitle}
//                 placeholder="e.g., Smart Campus Navigator"
//               />
//               <LabeledInput
//                 label="Idea Description"
//                 value={idea}
//                 onChangeText={setIdea}
//                 placeholder="Describe your idea in 3–5 lines"
//                 multiline
//                 minHeight={90}
//               />

//               <TouchableOpacity
//                 activeOpacity={0.9}
//                 onPress={onSubmit}
//                 disabled={isDisabled || submitting}
//                 style={[
//                   styles.primaryBtn,
//                   (isDisabled || submitting) && { opacity: 0.6 },
//                 ]}
//               >
//                 {submitting ? (
//                   <ActivityIndicator color="#fff" />
//                 ) : (
//                   <Text style={styles.primaryBtnText}>Submit</Text>
//                 )}
//               </TouchableOpacity>
//             </View>

//             {/* Trending Topics */}
//             <Text style={styles.sectionTitle}>Trending Topics</Text>
//             <View style={styles.trendingWrap}>
//               {loadingTrending ? (
//                 <ActivityIndicator />
//               ) : (
//                 <FlatList
//                   data={trending}
//                   keyExtractor={(x, i) => x + i}
//                   renderItem={renderChip}
//                   numColumns={2}
//                   columnWrapperStyle={{ gap: 10 }}
//                   ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
//                 />
//               )}
//             </View>
//           </ScrollView>

//           <BottomNavbar active="home" />
//         </View>
//       </TouchableWithoutFeedback>
//     </SafeAreaView>
//   );
// }

// function LabeledInput({
//   label,
//   value,
//   onChangeText,
//   placeholder,
//   multiline,
//   minHeight,
// }) {
//   return (
//     <View style={{ marginBottom: 10 }}>
//       <Text style={styles.label}>{label}</Text>
//       <TextInput
//         value={value}
//         onChangeText={onChangeText}
//         placeholder={placeholder}
//         style={[
//           styles.input,
//           multiline && { minHeight: minHeight || 64, textAlignVertical: "top" },
//         ]}
//         multiline={!!multiline}
//       />
//     </View>
//   );
// }

// const ACCENT = "#1A73E8";
// const TEXT = "#0C2D57";
// const MUTED = "#64748B";
// const BORDER = "#E1E8FF";
// const CARD = "#FFFFFF";

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#F6F8FF", padding: 16 },

//   title: {
//     fontSize: 22,
//     fontWeight: "800",
//     color: TEXT,
//     textAlign: "center",
//   },
//   subtitle: {
//     textAlign: "center",
//     color: MUTED,
//     marginTop: 4,
//     marginBottom: 14,
//     fontSize: 12,
//   },

//   card: {
//     backgroundColor: CARD,
//     borderRadius: 14,
//     padding: 14,
//     borderWidth: 1,
//     borderColor: BORDER,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 3 },
//   },

//   label: {
//     fontSize: 12,
//     fontWeight: "800",
//     color: TEXT,
//     marginBottom: 6,
//   },
//   input: {
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderWidth: 1,
//     borderColor: BORDER,
//   },

//   primaryBtn: {
//     backgroundColor: ACCENT,
//     paddingVertical: 12,
//     borderRadius: 12,
//     alignItems: "center",
//     marginTop: 6,
//   },
//   primaryBtnText: { color: "#fff", fontWeight: "800", fontSize: 14 },

//   sectionTitle: {
//     marginTop: 18,
//     marginBottom: 10,
//     fontSize: 14,
//     fontWeight: "800",
//     color: TEXT,
//   },

//   trendingWrap: {
//     backgroundColor: CARD,
//     borderRadius: 14,
//     padding: 12,
//     borderWidth: 1,
//     borderColor: BORDER,
//   },
//   chip: {
//     flex: 1,
//     backgroundColor: "#F7FAFF",
//     borderWidth: 1,
//     borderColor: BORDER,
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     borderRadius: 12,
//   },
//   chipText: { color: TEXT, fontWeight: "700", fontSize: 12 },
// });














import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import BottomNavbar from "./components/BottomNavbar";

const COLORS = {
  primaryDark: "#1A50C8",
  primary: "#2D6EEF",
  primaryLight: "#60A5FA",
  bg: "#F8FAFF",
  white: "#FFFFFF",
  textMain: "#0F172A",
  textSub: "#64748B",
  cardBorder: "#E2E8F0",
};

export default function InnovationPage() {
  const [leader, setLeader] = useState("");
  const [members, setMembers] = useState("");
  const [title, setTitle] = useState("");
  const [idea, setIdea] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [trending, setTrending] = useState([
    "AI Attendance System",
    "Bus Tracking App",
    "Hospital Optimizer",
    "Smart Waste (IoT)",
    "Price Tracker",
    "Event Aggregator",
    "LLM Summarizer",
    "Secure Notes",
  ]);
  const [loadingTrending, setLoadingTrending] = useState(false);

  const isDisabled = !leader.trim() || !members.trim() || !title.trim() || !idea.trim();

  const onSubmit = async () => {
    if (isDisabled) return;
    setSubmitting(true);
    try {
      // Logic placeholder as per original code
      setLeader("");
      setMembers("");
      setTitle("");
      setIdea("");
      Alert.alert("Submitted", "Your project idea was submitted successfully.");
    } catch (e) {
      Alert.alert("Error", e?.message || "Could not submit right now.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderChip = ({ item }) => (
    <View style={styles.chip}>
      <MaterialCommunityIcons name="trending-up" size={14} color={COLORS.primary} style={{marginRight: 6}} />
      <Text style={styles.chipText} numberOfLines={1}>{item}</Text>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
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
              <Text style={styles.headerTitle}>Innovation Hub</Text>
              <Text style={styles.headerSub}>Submit your Final Year Project Idea</Text>
            </View>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="lightbulb-on-outline" size={26} color="white" />
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          style={styles.scroll}
        >
          {/* Form Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
               <MaterialCommunityIcons name="form-select" size={20} color={COLORS.primary} />
               <Text style={styles.cardHeaderText}>Project Details</Text>
            </View>

            <LabeledInput
              label="Team Leader"
              value={leader}
              onChangeText={setLeader}
              placeholder="Full Name"
              icon="account-star-outline"
            />
            <LabeledInput
              label="Team Members"
              value={members}
              onChangeText={setMembers}
              placeholder="Member 1, Member 2..."
              multiline
              icon="account-group-outline"
            />
            <LabeledInput
              label="Project Title"
              value={title}
              onChangeText={setTitle}
              placeholder="Name of your innovation"
              icon="format-title"
            />
            <LabeledInput
              label="Abstract / Idea"
              value={idea}
              onChangeText={setIdea}
              placeholder="What problem are you solving?"
              multiline
              minHeight={100}
              icon="text-search"
            />

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onSubmit}
              disabled={isDisabled || submitting}
              style={[
                styles.primaryBtn,
                (isDisabled || submitting) && { backgroundColor: '#CBD5E1' },
              ]}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.primaryBtnText}>Submit Proposal</Text>
                  <MaterialCommunityIcons name="chevron-right" size={20} color="white" />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Trending Section */}
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Trending Ideas</Text>
            <Text style={styles.sectionBadge}>2026 Batch</Text>
          </View>

          <View style={styles.trendingWrap}>
            {loadingTrending ? (
              <ActivityIndicator color={COLORS.primary} />
            ) : (
              <FlatList
                data={trending}
                keyExtractor={(x, i) => x + i}
                renderItem={renderChip}
                numColumns={2}
                scrollEnabled={false}
                columnWrapperStyle={{ gap: 10 }}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              />
            )}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>

      <BottomNavbar active="home" />
    </View>
  );
}

function LabeledInput({ label, value, onChangeText, placeholder, multiline, minHeight, icon }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <View style={styles.labelRow}>
        <MaterialCommunityIcons name={icon} size={14} color={COLORS.textSub} style={{marginRight: 5}} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        style={[
          styles.input,
          multiline && { minHeight: minHeight || 70, textAlignVertical: "top" },
        ]}
        multiline={!!multiline}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: COLORS.bg },
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
  headerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600' },
  iconCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },

  scroll: { flex: 1, marginTop: -30 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 110 },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 28,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 10 },
  cardHeaderText: { fontSize: 16, fontWeight: '800', color: COLORS.textMain, marginLeft: 8 },

  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  label: { fontSize: 13, fontWeight: '700', color: COLORS.textMain },
  input: {
    backgroundColor: "#F8FAFF",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    color: COLORS.textMain,
    fontSize: 14,
  },

  primaryBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 4,
  },
  primaryBtnText: { color: "#fff", fontWeight: '800', fontSize: 16, marginRight: 8 },

  sectionTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 25, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: COLORS.textMain },
  sectionBadge: { fontSize: 11, color: COLORS.primary, fontWeight: '800', backgroundColor: '#E0E7FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },

  trendingWrap: { paddingBottom: 10 },
  chip: {
    flex: 1,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.02,
  },
  chipText: { color: COLORS.textMain, fontWeight: "700", fontSize: 12 },
});










