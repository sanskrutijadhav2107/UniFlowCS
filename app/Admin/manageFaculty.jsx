// import React, { useState } from "react";
// import { router } from "expo-router";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   TextInput,
//   Image,
// } from "react-native";
// import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
// import AdminNavbar from "./components/AdminNavbar";

// export default function ManageFaculty() {
//   const [search, setSearch] = useState("");
//   const facultyData = [
//     {
//       id: 1,
//       name: "Prachi Wadwal",
//       phone: "879xxxxxxxx",
//       education: "Btech",
//       password: "1234",
//       image: "https://cdn-icons-png.flaticon.com/512/2922/2922510.png",
//     },
//     {
//       id: 2,
//       name: "Prachi Wadwal",
//       phone: "879xxxxxxxx",
//       education: "Btech",
//       password: "1234",
//       image: "https://cdn-icons-png.flaticon.com/512/2922/2922510.png",
//     },
//   ];

//   return (
//     <View style={styles.container}>
//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* Header */}
//         <View style={styles.header}>
//           <Text style={styles.headerTitle}>UniflowCS</Text>
//         </View>

//         {/* Manage Faculty Button */}
//         <TouchableOpacity style={styles.manageButton}
//            onPress={() => router.push("/Admin/EditFaculty")}>
//           <Text style={styles.manageButtonText}>Manage Faculty</Text>
//         </TouchableOpacity>

//         {/* Search Bar */}
//         <TextInput
//           style={styles.searchBar}
//           placeholder="Search"
//           value={search}
//           onChangeText={setSearch}
//         />

//         {/* Faculty Cards */}
//         {facultyData.map((faculty) => (
//           <View key={faculty.id} style={styles.card}>
//             <View style={styles.cardHeader}>
//               <Image source={{ uri: faculty.image }} style={styles.avatar} />
//               <Text style={styles.name}>{faculty.name}</Text>
//             </View>
//             <Text style={styles.info}>
//               Phone no.: {faculty.phone}
//             </Text>
//             <Text style={styles.info}>
//               Education: {faculty.education}
//             </Text>
//             <Text style={styles.info}>
//               Password: {faculty.password}
//             </Text>

//             {/* Buttons */}
//             <View style={styles.buttonRow}>
//               <TouchableOpacity style={styles.editButton}
//                 onPress={() => router.push("/Admin/EditFaculty")} >
//                 <Text style={styles.buttonText}>Edit</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.removeButton}>
//                 <Text style={styles.buttonText}>Remove</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         ))}
//       </ScrollView>

     

//       {/* Bottom Navbar */}
//             <AdminNavbar />

//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#F5F5F5" },
//   header: {
//     backgroundColor: "#B8D8FF",
//     padding: 15,
//     alignItems: "center",
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//   },
//   headerTitle: { fontSize: 20, fontWeight: "bold", color: "#004AAD" },
//   manageButton: {
//     backgroundColor: "#F0E1B8",
//     margin: 15,
//     padding: 12,
//     borderRadius: 12,
//     alignItems: "center",
//   },
//   manageButtonText: { fontSize: 16, fontWeight: "500" },
//   searchBar: {
//     backgroundColor: "#fff",
//     marginHorizontal: 15,
//     padding: 10,
//     borderRadius: 25,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     marginBottom: 10,
//   },
//   card: {
//     backgroundColor: "#fff",
//     padding: 15,
//     borderRadius: 15,
//     marginHorizontal: 15,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: "#ddd",
//   },
//   cardHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 8,
//   },
//   avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
//   name: { fontWeight: "bold", fontSize: 16 },
//   info: { fontSize: 14, color: "#333", marginBottom: 3 },
//   buttonRow: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginTop: 10,
//   },
//   editButton: {
//     backgroundColor: "#B8D8FF",
//     paddingHorizontal: 20,
//     paddingVertical: 8,
//     borderRadius: 8,
//   },
//   removeButton: {
//     backgroundColor: "#ccc",
//     paddingHorizontal: 20,
//     paddingVertical: 8,
//     borderRadius: 8,
//   },
//   buttonText: { fontWeight: "600", fontSize: 14 },
//   bottomNav: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     alignItems: "center",
//     backgroundColor: "#E6F0FA",
//     marginHorizontal: 15,
//     marginBottom: 10,
//     paddingVertical: 10,
//     borderRadius: 30,
//   },
//   addButton: {
//     backgroundColor: "#0A4D8C",
//     padding: 10,
//     borderRadius: 50,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });



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
