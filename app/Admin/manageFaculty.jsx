
// // import { Ionicons } from "@expo/vector-icons";
// // import { router } from "expo-router";
// // import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
// // import { useEffect, useState } from "react";
// // import {
// //   ActivityIndicator,
// //   Alert,
// //   Image,
// //   ScrollView,
// //   StyleSheet,
// //   Text,
// //   TextInput,
// //   TouchableOpacity,
// //   View,
// // } from "react-native";
// // import { db } from "../../firebase";
// // import AdminNavbar from "./components/AdminNavbar";

// // export default function ManageFaculty() {
// //   const [search, setSearch] = useState("");
// //   const [facultyData, setFacultyData] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   // Fetch faculty from Firestore
// //   const fetchFaculty = async () => {
// //     try {
// //       setLoading(true);
// //       const snap = await getDocs(collection(db, "faculty"));
// //       const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// //       setFacultyData(list);
// //     } catch (error) {
// //       console.error("Error fetching faculty:", error);
// //       Alert.alert("Error", "Could not fetch faculty");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchFaculty();
// //   }, []);

// //   // Delete Faculty
// //   const handleRemove = async (id) => {
// //     try {
// //       await deleteDoc(doc(db, "faculty", id));
// //       Alert.alert("Removed", "Faculty deleted successfully ❌");
// //       fetchFaculty(); // refresh list
// //     } catch (error) {
// //       console.error("Error deleting faculty:", error);
// //       Alert.alert("Error", "Could not delete faculty");
// //     }
// //   };

// //   // Filter based on search
// //   const filteredFaculty = facultyData.filter((f) =>
// //     f.name.toLowerCase().includes(search.toLowerCase())
// //   );

// //   return (
// //     <View style={styles.container}>
// //       <ScrollView showsVerticalScrollIndicator={false}>
// //          {/* Page Title */}
// //                       <View style={styles.header}>
// //                         <Text style={styles.pageTitle}>Manage Faculty</Text>
// //                         <Text style={styles.subTitle}>Welcome</Text>
// //                       </View>

// //         {/* Search Bar */}
// //         <View style={styles.searchBarContainer}>
// //   <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
// //   <TextInput
// //     style={styles.searchBar}
// //     placeholder="Search Faculty"
// //     value={search}
// //     onChangeText={setSearch}
// //     placeholderTextColor="#888"
// //   />
// //   </View>

// //         {/* Faculty List */}
// //         {loading ? (
// //           <ActivityIndicator
// //             size="large"
// //             color="#2d6eefff"
// //             style={{ marginTop: 20 }}
// //           />
// //         ) : filteredFaculty.length === 0 ? (
// //           <Text style={styles.emptyText}>No faculty found 👩‍🏫</Text>
// //         ) : (
// //           filteredFaculty.map((faculty) => (
// //             <View key={faculty.id} style={styles.card}>
// //               <View style={styles.cardHeader}>
// //                 <Image
// //                   source={{
// //                     uri:
// //                       faculty.image ||
// //                       "https://cdn-icons-png.flaticon.com/512/2922/2922510.png",
// //                   }}
// //                   style={styles.avatar}
// //                 />
// //                 <View>
// //                   <Text style={styles.name}>{faculty.name}</Text>
// //                   <Text style={styles.info}>📧 {faculty.email}</Text>
// //                 </View>
// //               </View>
// //               <Text style={styles.info}>📞 {faculty.phone}</Text>
// //               <Text style={styles.info}>🎓 {faculty.education}</Text>

// //               {/* Buttons */}
// //               <View style={styles.buttonRow}>
// //                 <TouchableOpacity
// //                   style={styles.editButton}
// //                   onPress={() =>
// //                     router.push({
// //                       pathname: "/Admin/EditFaculty",
// //                       params: { id: faculty.id },
// //                     })
// //                   }
// //                 >
// //                   <Text style={styles.buttonText}>Edit</Text>
// //                 </TouchableOpacity>

// //                 <TouchableOpacity
// //                   style={styles.removeButton}
// //                   onPress={() =>
// //                     Alert.alert(
// //                       "Confirm",
// //                       "Are you sure you want to delete this faculty?",
// //                       [
// //                         { text: "Cancel" },
// //                         { text: "Delete", onPress: () => handleRemove(faculty.id) },
// //                       ]
// //                     )
// //                   }
// //                 >
// //                   <Text style={styles.buttonText}>Remove</Text>
// //                 </TouchableOpacity>
// //               </View>
// //             </View>
// //           ))
// //         )}
// //       </ScrollView>

// //       {/* Floating + Button */}
// // <TouchableOpacity
// //   style={styles.fab}
// //   activeOpacity={0.7}
// //   onPress={() => router.push({ pathname: "/Admin/addFaculty" })}
// // >
// //   <Ionicons name="add" size={30} color="#fff" />
// // </TouchableOpacity>



// //       {/* Bottom Navbar */}
// //       <AdminNavbar />
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: "#F5F5F5" },
 
// //   // Header
// //   header: {
// //     paddingTop: 30,
// //     paddingBottom: 20,
// //     paddingHorizontal: 20,
// //     backgroundColor: "#E3F0FF",
// //     borderBottomLeftRadius: 18,
// //     borderBottomRightRadius: 18,
// //     shadowColor: "#000",
// //     shadowOpacity: 0.15,
// //     shadowRadius: 6,
// //     shadowOffset: { width: 0, height: 3 },
// //     elevation: 6,
    
// //   },
// //   pageTitle: {
// //     fontSize: 24,
// //     fontWeight: "800",
// //     color: "#146ED7",
// //   },
// //   subTitle: {
// //     fontSize: 14,
// //     color: "#146ED7",
// //     marginTop: 4,
// //   },
// //   searchBarContainer: {
// //   flexDirection: "row",
// //   alignItems: "center",
// //   backgroundColor: "#fff",
// //   marginHorizontal: 15,
// //   borderRadius: 25,
// //   borderWidth: 1,
// //   borderColor: "#ccc",
// //   paddingHorizontal: 12,
// //   marginBottom: 10,
// //   marginTop: 10,
// // },
// // searchIcon: {
// //   marginRight: 8,
// // },
// // searchBar: {
// //   flex: 1,
// //   paddingVertical: 8,
// //   fontSize: 14,
// //   color: "#333",
// // },

// //   card: {
// //     backgroundColor: "#fff",
// //     padding: 15,
// //     borderRadius: 15,
// //     marginHorizontal: 15,
// //     marginBottom: 15,
// //     borderWidth: 1,
// //     borderColor: "#ddd",
// //   },
// //   cardHeader: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     marginBottom: 8,
// //   },
// //   avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
// //   name: { fontWeight: "bold", fontSize: 16 },
// //   info: { fontSize: 14, color: "#333", marginBottom: 3 },
// //   buttonRow: {
// //     flexDirection: "row",
// //     justifyContent: "space-around",
// //     marginTop: 10,
// //   },
// //   editButton: {
// //     backgroundColor: "#B8D8FF",
// //     paddingHorizontal: 20,
// //     paddingVertical: 8,
// //     borderRadius: 8,
// //   },
// //   removeButton: {
// //     backgroundColor: "#ff6666",
// //     paddingHorizontal: 20,
// //     paddingVertical: 8,
// //     borderRadius: 8,
// //   },
// //   buttonText: { fontWeight: "600", fontSize: 14, color: "#fff" },
// //   emptyText: {
// //     textAlign: "center",
// //     color: "#555",
// //     marginTop: 20,
// //     fontSize: 16,
// //   },
// //   fab: {
// //   position: "absolute",
// //   bottom: 110,
// //   right: 10,
// //   backgroundColor: "#2d6eefff",
// //   width: 55,
// //   height: 55,
// //   borderRadius: 30,
// //   justifyContent: "center",
// //   alignItems: "center",
// //   elevation: 5,
// // },

// // });















// import { Ionicons } from "@expo/vector-icons";
// import { router } from "expo-router";
// import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
// import { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { db } from "../../firebase";
// import AdminNavbar from "./components/AdminNavbar";

// export default function ManageFaculty() {
//   const [search, setSearch] = useState("");
//   const [facultyData, setFacultyData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch faculty from Firestore
//   const fetchFaculty = async () => {
//     try {
//       setLoading(true);
//       const snap = await getDocs(collection(db, "faculty"));
//       const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//       setFacultyData(list);
//     } catch (error) {
//       console.error("Error fetching faculty:", error);
//       Alert.alert("Error", "Could not fetch faculty");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchFaculty();
//   }, []);

//   // Delete Faculty
//   const handleRemove = async (id) => {
//     try {
//       await deleteDoc(doc(db, "faculty", id));
//       Alert.alert("Removed", "Faculty deleted successfully ❌");
//       fetchFaculty(); // refresh list
//     } catch (error) {
//       console.error("Error deleting faculty:", error);
//       Alert.alert("Error", "Could not delete faculty");
//     }
//   };

//   // Filter based on search
//   const filteredFaculty = facultyData.filter((f) =>
//     f.name.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <View style={styles.container}>
//       <ScrollView showsVerticalScrollIndicator={false}>
//          {/* Page Title */}
//                       <View style={styles.header}>
//                         <Text style={styles.pageTitle}>Manage Faculty</Text>
//                         <Text style={styles.subTitle}>Welcome</Text>
//                       </View>

//         {/* Search Bar */}
//         <View style={styles.searchBarContainer}>
//   <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
//   <TextInput
//     style={styles.searchBar}
//     placeholder="Search Faculty"
//     value={search}
//     onChangeText={setSearch}
//     placeholderTextColor="#888"
//   />
//   </View>

//         {/* Faculty List */}
//         {loading ? (
//           <ActivityIndicator
//             size="large"
//             color="#2d6eefff"
//             style={{ marginTop: 20 }}
//           />
//         ) : filteredFaculty.length === 0 ? (
//           <Text style={styles.emptyText}>No faculty found 👩‍🏫</Text>
//         ) : (
//           filteredFaculty.map((faculty) => (
//             <View key={faculty.id} style={styles.card}>
//               <View style={styles.cardHeader}>
//                 <Image
//                   source={{
//                     uri:
//                       faculty.image ||
//                       "https://cdn-icons-png.flaticon.com/512/2922/2922510.png",
//                   }}
//                   style={styles.avatar}
//                 />
//                 <View>
//                   <Text style={styles.name}>{faculty.name}</Text>
//                   <Text style={styles.info}>📧 {faculty.email}</Text>
//                 </View>
//               </View>
//               <Text style={styles.info}>📞 {faculty.phone}</Text>
//               <Text style={styles.info}>🎓 {faculty.education}</Text>

//               {/* Buttons */}
//               <View style={styles.buttonRow}>
//                 <TouchableOpacity
//                   style={styles.editButton}
//                   onPress={() =>
//                     router.push({
//                       pathname: "/Admin/EditFaculty",
//                       params: { id: faculty.id },
//                     })
//                   }
//                 >
//                   <Text style={styles.buttonText}>Edit</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={styles.removeButton}
//                   onPress={() =>
//                     Alert.alert(
//                       "Confirm",
//                       "Are you sure you want to delete this faculty?",
//                       [
//                         { text: "Cancel" },
//                         { text: "Delete", onPress: () => handleRemove(faculty.id) },
//                       ]
//                     )
//                   }
//                 >
//                   <Text style={styles.buttonText}>Remove</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           ))
//         )}
//       </ScrollView>

//       {/* Floating + Button */}
// <TouchableOpacity
//   style={styles.fab}
//   activeOpacity={0.7}
//   onPress={() => router.push({ pathname: "/Admin/addFaculty" })}
// >
//   <Ionicons name="add" size={30} color="#fff" />
// </TouchableOpacity>



//       {/* Bottom Navbar */}
//       <AdminNavbar />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#F5F5F5" },
 
//   // Header
//   header: {
//     paddingTop: 30,
//     paddingBottom: 20,
//     paddingHorizontal: 20,
//     backgroundColor: "#E3F0FF",
//     borderBottomLeftRadius: 18,
//     borderBottomRightRadius: 18,
//     shadowColor: "#000",
//     shadowOpacity: 0.15,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 3 },
//     elevation: 6,
    
//   },
//   pageTitle: {
//     fontSize: 24,
//     fontWeight: "800",
//     color: "#146ED7",
//   },
//   subTitle: {
//     fontSize: 14,
//     color: "#146ED7",
//     marginTop: 4,
//   },
//   searchBarContainer: {
//   flexDirection: "row",
//   alignItems: "center",
//   backgroundColor: "#fff",
//   marginHorizontal: 15,
//   borderRadius: 25,
//   borderWidth: 1,
//   borderColor: "#ccc",
//   paddingHorizontal: 12,
//   marginBottom: 10,
//   marginTop: 10,
// },
// searchIcon: {
//   marginRight: 8,
// },
// searchBar: {
//   flex: 1,
//   paddingVertical: 8,
//   fontSize: 14,
//   color: "#333",
// },

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
//     backgroundColor: "#ff6666",
//     paddingHorizontal: 20,
//     paddingVertical: 8,
//     borderRadius: 8,
//   },
//   buttonText: { fontWeight: "600", fontSize: 14, color: "#fff" },
//   emptyText: {
//     textAlign: "center",
//     color: "#555",
//     marginTop: 20,
//     fontSize: 16,
//   },
//   fab: {
//   position: "absolute",
//   bottom: 110,
//   right: 10,
//   backgroundColor: "#2d6eefff",
//   width: 55,
//   height: 55,
//   borderRadius: 30,
//   justifyContent: "center",
//   alignItems: "center",
//   elevation: 5,
// },

// });






import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../firebase";
import AdminNavbar from "./components/AdminNavbar";

const COLORS = {
  primaryDark: "#1A50C8",
  primary: "#2D6EEF",
  primaryLight: "#60A5FA",
  bg: "#F8FAFF",
  white: "#FFFFFF",
  textMain: "#0F172A",
  textSub: "#64748B",
  danger: "#EF4444",
};

export default function ManageFaculty() {
  const [search, setSearch] = useState("");
  const [facultyData, setFacultyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFaculty = async () => {
    try {
      setLoading(true);
      const snap = await getDocs(collection(db, "faculty"));
      const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFacultyData(list);
    } catch (error) {
      console.error("Error fetching faculty:", error);
      Alert.alert("Error", "Could not fetch faculty records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const handleRemove = async (id) => {
    try {
      await deleteDoc(doc(db, "faculty", id));
      Alert.alert("Removed", "Faculty deleted successfully ❌");
      fetchFaculty();
    } catch (error) {
      Alert.alert("Error", "Could not delete faculty");
    }
  };

  // ✅ BULLETPROOF FILTER: Prevents the "toLowerCase" crash
  const filteredFaculty = (facultyData || []).filter((f) => {
    if (!f) return false;
    const name = f.name ? String(f.name) : ""; 
    return name.toLowerCase().includes((search || "").toLowerCase());
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* BRANDED HEADER */}
      <LinearGradient 
        colors={[COLORS.primaryDark, COLORS.primary, COLORS.primaryLight]} 
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} 
        style={styles.header}
      >
        <SafeAreaView>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>Faculty Management</Text>
              <Text style={styles.headerSub}>Admin Control Center</Text>
            </View>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="account-group" size={26} color="white" />
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* SEARCH BAR */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={COLORS.textSub} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#94A3B8"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={18} color={COLORS.textSub} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
        ) : filteredFaculty.length === 0 ? (
          <View style={styles.emptyWrap}>
             <MaterialCommunityIcons name="account-off-outline" size={60} color={COLORS.textSub} />
             <Text style={styles.emptyText}>No faculty members found</Text>
          </View>
        ) : (
          filteredFaculty.map((faculty) => (
            <View key={faculty.id} style={styles.card}>
              <View style={styles.cardMain}>
                <Image
                  source={{ uri: faculty.image || "https://cdn-icons-png.flaticon.com/512/2922/2922510.png" }}
                  style={styles.avatar}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{faculty.name || "Unnamed Faculty"}</Text>
                  <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="email-outline" size={14} color={COLORS.primary} />
                    <Text style={styles.infoText}>{faculty.email}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="school-outline" size={14} color={COLORS.primary} />
                    <Text style={styles.infoText}>{faculty.education}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.editBtn]}
                  onPress={() => router.push({ pathname: "/Admin/EditFaculty", params: { id: faculty.id } })}
                >
                  <Ionicons name="create-outline" size={16} color={COLORS.primary} />
                  <Text style={styles.editBtnText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionBtn, styles.removeBtn]}
                  onPress={() => Alert.alert("Confirm", "Delete this faculty member?", [
                    { text: "Cancel" },
                    { text: "Delete", style: 'destructive', onPress: () => handleRemove(faculty.id) },
                  ])}
                >
                  <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
                  <Text style={styles.removeBtnText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => router.push({ pathname: "/Admin/addFaculty" })}
      >
        <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.fabGradient}>
          <Ionicons name="add" size={32} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      <AdminNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    height: 160,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    justifyContent: 'center',
    elevation: 8,
  },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Platform.OS === 'android' ? 10 : 0 },
  headerTitle: { color: 'white', fontSize: 24, fontWeight: '900' },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600' },
  iconCircle: { width: 45, height: 45, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },

  searchWrapper: { marginTop: -25, paddingHorizontal: 20 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 18,
    paddingHorizontal: 15,
    height: 54,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 5 },
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14, color: COLORS.textMain, fontWeight: '600' },

  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 130 },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
  },
  cardMain: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 60, height: 60, borderRadius: 18, marginRight: 15, backgroundColor: '#F1F5F9' },
  name: { fontSize: 16, fontWeight: '800', color: COLORS.textMain, marginBottom: 5 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  infoText: { fontSize: 12, color: COLORS.textSub, marginLeft: 6, fontWeight: '600' },

  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 14 },

  buttonRow: { flexDirection: 'row', gap: 12 },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
  },
  editBtn: { backgroundColor: '#EFF6FF' },
  removeBtn: { backgroundColor: '#FEF2F2' },
  editBtnText: { color: COLORS.primary, fontWeight: '800', fontSize: 13, marginLeft: 6 },
  removeBtnText: { color: COLORS.danger, fontWeight: '800', fontSize: 13, marginLeft: 6 },

  fab: { position: 'absolute', bottom: 100, right: 20, elevation: 10 },
  fabGradient: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' , marginBottom:10},

  emptyWrap: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: COLORS.textSub, fontWeight: '700', marginTop: 10 }
});