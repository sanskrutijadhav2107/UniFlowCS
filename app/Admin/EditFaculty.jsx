import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { db } from "../../firebase";

export default function EditFaculty() {
  const { id } = useLocalSearchParams(); // faculty id from ManageFaculty
  const router = useRouter();

  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch faculty details
  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const docRef = doc(db, "faculty", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFaculty(docSnap.data());
        } else {
          Alert.alert("Error", "Faculty not found");
          router.back();
        }
      } catch (error) {
        console.error("Error fetching faculty:", error);
        Alert.alert("Error", "Could not fetch faculty details");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchFaculty();
  }, [id, router]);

  // Save updates
  const handleSave = async () => {
    if (!faculty.name || !faculty.email || !faculty.phone || !faculty.education) {
      Alert.alert("Error", "Please fill all fields");
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
        password: faculty.password || "", // ⚠️ plain text for now
      });
      Alert.alert("Success", "Faculty updated ✅");
      router.back(); // go back to ManageFaculty
    } catch (error) {
      console.error("Error updating faculty:", error);
      Alert.alert("Error", "Could not update faculty");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2d6eefff" />
        <Text>Loading faculty details...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Faculty</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={faculty?.name || ""}
        onChangeText={(text) => setFaculty({ ...faculty, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={faculty?.email || ""}
        onChangeText={(text) => setFaculty({ ...faculty, email: text })}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={faculty?.phone?.toString() || ""}
        onChangeText={(text) => setFaculty({ ...faculty, phone: text })}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Education"
        value={faculty?.education || ""}
        onChangeText={(text) => setFaculty({ ...faculty, education: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={faculty?.password || ""}
        onChangeText={(text) => setFaculty({ ...faculty, password: text })}
      />

      <TouchableOpacity
        style={[styles.button, saving && { backgroundColor: "#aaa" }]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.buttonText}>{saving ? "Saving..." : "Save Changes"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#fff", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "bold", color: "#2d6eefff", textAlign: "center", marginBottom: 20 },
  input: {
    backgroundColor: "#E6F0FF",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2d6eefff",
    marginBottom: 15,
  },
  button: { backgroundColor: "#2d6eefff", paddingVertical: 14, borderRadius: 8, marginTop: 10 , marginBottom:300,},
  buttonText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "bold" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});
