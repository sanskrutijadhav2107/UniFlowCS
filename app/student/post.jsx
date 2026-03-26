import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import UniversalPostComposer from "../../components/ui/UniversalPostComposer";
import { db } from "../../firebase";

export default function PostScreen() {
  const [userContext, setUserContext] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    prepareUserContext();
  }, []);

  const prepareUserContext = async () => {
    try {
      const raw = await AsyncStorage.getItem("student");
      if (!raw) return;
      const u = JSON.parse(raw);

      // 🔄 FORCE REFRESH: Pull the latest photo directly from Firebase 
      // This ensures if you just changed your photo, the post gets the NEW one.
      const userDoc = await getDoc(doc(db, "students", u.prn));
      const latestPhoto = userDoc.exists() ? userDoc.data().photo : u.photo;

      setUserContext({
        uid: u.prn,
        name: u.name,
        // ✅ We provide BOTH keys just in case your component uses either one
        avatar: latestPhoto || `https://ui-avatars.com/api/?name=${u.name}`,
        authorAvatar: latestPhoto || `https://ui-avatars.com/api/?name=${u.name}`,
      });
    } catch (e) {
      console.error("Context Error:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#2D6EEF", "#1A50C8"]} style={styles.header}>
        <Text style={styles.headerTitle}>Campus Buzz</Text>
        <Text style={styles.headerSub}>What's happening on campus?</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={styles.composerWrapper}>
          {userContext && (
            <UniversalPostComposer
              // Pass the pre-fetched context directly
              getUser={async () => userContext}
              collectionName="posts"
              storageFolder="posts"
              maxWidth={1280}
              quality={0.8}
              withPreview
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFF" },
  header: { paddingTop: 60, paddingBottom: 30, paddingHorizontal: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerTitle: { fontSize: 26, fontWeight: "bold", color: "white" },
  headerSub: { fontSize: 14, color: "rgba(255,255,255,0.8)", marginTop: 4 },
  composerWrapper: {
    backgroundColor: "white",
    borderRadius: 25,
    marginTop: -20, // Overlap effect
    padding: 10,
    elevation: 8,
    shadowColor: "#2D6EEF",
    shadowOpacity: 0.1,
    shadowRadius: 15
  }
});