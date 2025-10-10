// import React from 'react';
// import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
// import BottomNavbar from "./components/BottomNavbar"; 


// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Image
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';

// export default function InnovationPage() {
//   const cards = [
//     {
//       title: 'Software Developer',
//       description: 'Designs, codes, and maintains software solutions.',
//       image: require('../../assets/images/user.png')
//     },
//     {
//       title: 'Data Analyst',
//       description: 'Analyzes and interprets complex data for insights.',
//       image: require('../../assets/images/user.png')
//     },
//     {
//       title: 'Backend Developer',
//       description: 'Builds and maintains server-side logic.',
//      image: require('../../assets/images/user.png')
//     }
//   ];

//   return (
//     <View style={styles.container}>
//       {/* Title */}
//       <Text style={styles.title}>UniFlow CS</Text>

//       {/* Form */}
//       <Text style={styles.label}>Leader Name :</Text>
//       <TextInput style={styles.input} placeholder="Enter leader name" />

//       <Text style={styles.label}>Member Names :</Text>
//       <TextInput
//         style={[styles.input, { height: 50 }]}
//         placeholder="Enter member names"
//         multiline
//       />

//       <Text style={styles.label}>Enter Idea :</Text>
//       <TextInput
//         style={[styles.input, { height: 60 }]}
//         placeholder="Describe your idea"
//         multiline
//       />

//       {/* Submit button */}
//       <TouchableOpacity style={styles.submitButton}>
//         <Text style={styles.submitText}>Submit</Text>
//       </TouchableOpacity>

//       {/* Innovation Hub Button */}
//       <TouchableOpacity style={styles.hubButton}>
//         <Text style={styles.hubText}>Innovation Hub</Text>
//       </TouchableOpacity>

//       {/* Horizontal Scroll Cards */}
//       <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardScroll}>
//         {cards.map((card, index) => (
//           <View key={index} style={styles.card}>
//             <Image source={card.image} style={styles.cardImage} />
//             <Text style={styles.cardTitle}>{card.title}</Text>
//             <Text style={styles.cardDesc}>{card.description}</Text>
//             <TouchableOpacity>
//               <Text style={styles.cardButton}>Read More..</Text>
//             </TouchableOpacity>
//           </View>
//         ))}
//       </ScrollView>

//      {/* Bottom Navbar */}
//                <BottomNavbar active="home" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#bde0fe', padding: 16 },
//   title: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#003366',
//     textAlign: 'center',
//     marginBottom: 20
//   },
//   label: { fontSize: 14, fontWeight: 'bold', marginTop: 10 },
//   input: {
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     marginTop: 5
//   },
//   submitButton: {
//     backgroundColor: '#1e64d4',
//     paddingVertical: 10,
//     borderRadius: 6,
//     marginTop: 15,
//     alignItems: 'center'
//   },
//   submitText: { color: '#fff', fontWeight: 'bold' },
//   hubButton: {
//     backgroundColor: '#fff',
//     paddingVertical: 10,
//     borderRadius: 15,
//     marginTop: 15,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3
//   },
//   hubText: { color: '#000', fontWeight: 'bold' },
//   cardScroll: { marginTop: 20 },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 10,
//     marginRight: 15,
//     width: 250,
//     height: 220,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3
//   },
//   cardImage: { width: '100%', height: 80, borderRadius: 8 },
//   cardTitle: { fontWeight: 'bold', fontSize: 14, marginTop: 5 },
//   cardDesc: { fontSize: 12, color: '#555', marginVertical: 5 },
//   cardButton: { color: '#1e64d4', fontWeight: 'bold', fontSize: 12 },


// });









import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import BottomNavbar from "./components/BottomNavbar";



export default function InnovationPage() {
  const [leader, setLeader] = useState("");
  const [members, setMembers] = useState("");
  const [title, setTitle] = useState("");
  const [idea, setIdea] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Trending topics (static fallback + backend fetch hook below)
  const [trending, setTrending] = useState([
    "AI-powered Attendance System",
    "Real-time Bus Tracking App",
    "Hospital Queue Optimizer",
    "Smart Waste Segregation (IoT + CV)",
    "E-Commerce Price Tracker",
    "College Event Aggregator",
    "Doc Summarizer (LLM + RAG)",
    "Secure Notes with End-to-End Encryption",
  ]);
  const [loadingTrending, setLoadingTrending] = useState(false);



  const isDisabled =
    !leader.trim() || !members.trim() || !title.trim() || !idea.trim();

  const onSubmit = async () => {
    if (isDisabled) return;
    setSubmitting(true);
    try {
      

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
      <Text style={styles.chipText}>{item}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F8FF" }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 90 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Heading */}
            <Text style={styles.title}>Final Year Projects</Text>
            <Text style={styles.subtitle}>Submit your team & project idea</Text>

            {/* Form Card */}
            <View style={styles.card}>
              <LabeledInput
                label="Leader Name"
                value={leader}
                onChangeText={setLeader}
                placeholder="e.g., A. Sharma"
              />
              <LabeledInput
                label="Team Members"
                value={members}
                onChangeText={setMembers}
                placeholder="Comma-separated (e.g., K. Rao, M. Patel)"
                multiline
              />
              <LabeledInput
                label="Project Title"
                value={title}
                onChangeText={setTitle}
                placeholder="e.g., Smart Campus Navigator"
              />
              <LabeledInput
                label="Idea Description"
                value={idea}
                onChangeText={setIdea}
                placeholder="Describe your idea in 3–5 lines"
                multiline
                minHeight={90}
              />

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={onSubmit}
                disabled={isDisabled || submitting}
                style={[
                  styles.primaryBtn,
                  (isDisabled || submitting) && { opacity: 0.6 },
                ]}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryBtnText}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Trending Topics */}
            <Text style={styles.sectionTitle}>Trending Topics</Text>
            <View style={styles.trendingWrap}>
              {loadingTrending ? (
                <ActivityIndicator />
              ) : (
                <FlatList
                  data={trending}
                  keyExtractor={(x, i) => x + i}
                  renderItem={renderChip}
                  numColumns={2}
                  columnWrapperStyle={{ gap: 10 }}
                  ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                />
              )}
            </View>
          </ScrollView>

          <BottomNavbar active="home" />
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

function LabeledInput({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
  minHeight,
}) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={[
          styles.input,
          multiline && { minHeight: minHeight || 64, textAlignVertical: "top" },
        ]}
        multiline={!!multiline}
      />
    </View>
  );
}

const ACCENT = "#1A73E8";
const TEXT = "#0C2D57";
const MUTED = "#64748B";
const BORDER = "#E1E8FF";
const CARD = "#FFFFFF";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F8FF", padding: 16 },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: TEXT,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: MUTED,
    marginTop: 4,
    marginBottom: 14,
    fontSize: 12,
  },

  card: {
    backgroundColor: CARD,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: BORDER,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  label: {
    fontSize: 12,
    fontWeight: "800",
    color: TEXT,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: BORDER,
  },

  primaryBtn: {
    backgroundColor: ACCENT,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 6,
  },
  primaryBtnText: { color: "#fff", fontWeight: "800", fontSize: 14 },

  sectionTitle: {
    marginTop: 18,
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "800",
    color: TEXT,
  },

  trendingWrap: {
    backgroundColor: CARD,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: BORDER,
  },
  chip: {
    flex: 1,
    backgroundColor: "#F7FAFF",
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  chipText: { color: TEXT, fontWeight: "700", fontSize: 12 },
});

