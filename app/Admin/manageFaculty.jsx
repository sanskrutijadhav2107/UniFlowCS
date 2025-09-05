
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../firebase";
import AdminNavbar from "./components/AdminNavbar";

export default function ManageFaculty() {
  const [search, setSearch] = useState("");
  const [facultyData, setFacultyData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch faculty from Firestore
  const fetchFaculty = async () => {
    try {
      setLoading(true);
      const snap = await getDocs(collection(db, "faculty"));
      const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFacultyData(list);
    } catch (error) {
      console.error("Error fetching faculty:", error);
      Alert.alert("Error", "Could not fetch faculty");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  // Delete Faculty
  const handleRemove = async (id) => {
    try {
      await deleteDoc(doc(db, "faculty", id));
      Alert.alert("Removed", "Faculty deleted successfully ❌");
      fetchFaculty(); // refresh list
    } catch (error) {
      console.error("Error deleting faculty:", error);
      Alert.alert("Error", "Could not delete faculty");
    }
  };

  // Filter based on search
  const filteredFaculty = facultyData.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
         {/* Page Title */}
                      <View style={styles.header}>
                        <Text style={styles.pageTitle}>Manage Faculty</Text>
                        <Text style={styles.subTitle}>Welcome</Text>
                      </View>

        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
  <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
  <TextInput
    style={styles.searchBar}
    placeholder="Search Faculty"
    value={search}
    onChangeText={setSearch}
    placeholderTextColor="#888"
  />
  </View>

        {/* Faculty List */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#2d6eefff"
            style={{ marginTop: 20 }}
          />
        ) : filteredFaculty.length === 0 ? (
          <Text style={styles.emptyText}>No faculty found 👩‍🏫</Text>
        ) : (
          filteredFaculty.map((faculty) => (
            <View key={faculty.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Image
                  source={{
                    uri:
                      faculty.image ||
                      "https://cdn-icons-png.flaticon.com/512/2922/2922510.png",
                  }}
                  style={styles.avatar}
                />
                <View>
                  <Text style={styles.name}>{faculty.name}</Text>
                  <Text style={styles.info}>📧 {faculty.email}</Text>
                </View>
              </View>
              <Text style={styles.info}>📞 {faculty.phone}</Text>
              <Text style={styles.info}>🎓 {faculty.education}</Text>

              {/* Buttons */}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() =>
                    router.push({
                      pathname: "/Admin/EditFaculty",
                      params: { id: faculty.id },
                    })
                  }
                >
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() =>
                    Alert.alert(
                      "Confirm",
                      "Are you sure you want to delete this faculty?",
                      [
                        { text: "Cancel" },
                        { text: "Delete", onPress: () => handleRemove(faculty.id) },
                      ]
                    )
                  }
                >
                  <Text style={styles.buttonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Floating + Button */}
<TouchableOpacity
  style={styles.fab}
  activeOpacity={0.7}
  onPress={() => router.push({ pathname: "/Admin/addFaculty" })}
>
  <Ionicons name="add" size={30} color="#fff" />
</TouchableOpacity>



      {/* Bottom Navbar */}
      <AdminNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
 
  // Header
  header: {
    paddingTop: 30,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#E3F0FF",
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
    
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#146ED7",
  },
  subTitle: {
    fontSize: 14,
    color: "#146ED7",
    marginTop: 4,
  },
  searchBarContainer: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#fff",
  marginHorizontal: 15,
  borderRadius: 25,
  borderWidth: 1,
  borderColor: "#ccc",
  paddingHorizontal: 12,
  marginBottom: 10,
  marginTop: 10,
},
searchIcon: {
  marginRight: 8,
},
searchBar: {
  flex: 1,
  paddingVertical: 8,
  fontSize: 14,
  color: "#333",
},

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  name: { fontWeight: "bold", fontSize: 16 },
  info: { fontSize: 14, color: "#333", marginBottom: 3 },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#B8D8FF",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  removeButton: {
    backgroundColor: "#ff6666",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: { fontWeight: "600", fontSize: 14, color: "#fff" },
  emptyText: {
    textAlign: "center",
    color: "#555",
    marginTop: 20,
    fontSize: 16,
  },
  fab: {
  position: "absolute",
  bottom: 110,
  right: 10,
  backgroundColor: "#2d6eefff",
  width: 55,
  height: 55,
  borderRadius: 30,
  justifyContent: "center",
  alignItems: "center",
  elevation: 5,
},

});
