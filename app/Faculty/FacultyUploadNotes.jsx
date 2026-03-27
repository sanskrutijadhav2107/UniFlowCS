// // app/Faculty/FacultyUploadNotes.jsx
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as DocumentPicker from "expo-document-picker";
// import { useRouter } from "expo-router";
// import {
//   addDoc,
//   collection,
//   deleteDoc,
//   doc as firestoreDoc,
//   getDocs,
//   query,
//   serverTimestamp,
//   updateDoc,
//   where,
// } from "firebase/firestore";
// import {
//   deleteObject,
//   getDownloadURL,
//   ref as storageRef,
//   uploadBytes,
// } from "firebase/storage";
// import { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Linking,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import { db, storage } from "../../firebase";

// /**
//  * FacultyUploadNotes - robust uploader that handles different DocumentPicker shapes.
//  * - stores files in Firebase Storage under notes/<subjectId>/...
//  * - stores a Firestore doc in collection 'notes' with storagePath & fileUrl
//  * - deletes previous unit's file+doc before adding new (avoid duplicates)
//  * - implements lock/unlock toggle (updates notes doc.locked)
//  */

// export default function FacultyUploadNotes() {
//   const router = useRouter();
//   const [faculty, setFaculty] = useState(null);
//   const [assignedSubjects, setAssignedSubjects] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [selectedSubject, setSelectedSubject] = useState(null);
//   const [notesData, setNotesData] = useState({}); // subjectId -> array(6) of notes

//   useEffect(() => {
//     const fetchFacultyAndSubjects = async () => {
//       try {
//         const stored = await AsyncStorage.getItem("faculty");
//         if (!stored) {
//           Alert.alert("Not logged in", "Please login as faculty.");
//           router.push("/Faculty/FacultyLogin");
//           return;
//         }
//         const facultyData = JSON.parse(stored);
//         setFaculty(facultyData);

//         // fetch assignments
//         const faQuery = query(
//           collection(db, "facultyAssignments"),
//           where("facultyId", "==", facultyData.id)
//         );
//         const faSnap = await getDocs(faQuery);
//         const assignments = faSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
//         setAssignedSubjects(assignments);

//         // load notes for each assigned subject
//         const notesState = {};
//         for (const sub of assignments) {
//           const nq = query(collection(db, "notes"), where("subjectId", "==", sub.subjectId));
//           const nsnap = await getDocs(nq);
//           const unitNotes = Array(6).fill(null);
//           nsnap.docs.forEach((nDoc) => {
//             const n = nDoc.data();
//             if (n && typeof n.unit === "number") {
//               unitNotes[n.unit - 1] = { id: nDoc.id, ...n };
//             }
//           });
//           notesState[sub.subjectId] = unitNotes;
//         }
//         setNotesData(notesState);
//       } catch (err) {
//         console.error("fetchFacultyAndSubjects error:", err);
//         Alert.alert("Error", "Could not load subjects. Check network & rules.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFacultyAndSubjects();
//   }, [router]);

//   // helper: uri -> blob (works on Android/iOS)
//   const uriToBlob = async (uri) => {
//     const resp = await fetch(uri);
//     const blob = await resp.blob();
//     return blob;
//   };

//   // safe extractor for DocumentPicker result
//   const extractPickedFile = (res) => {
//     // shape 1: { type: "success", uri, name, size }
//     if (res?.type === "success" && res.uri) {
//       return { uri: res.uri, name: res.name || "file" };
//     }
//     // shape 2: { assets: [{ uri, name, size, mimeType }], canceled: false }
//     if (Array.isArray(res?.assets) && res.assets.length > 0) {
//       const a = res.assets[0];
//       return { uri: a.uri, name: a.name || "file" };
//     }
//     // shape 3: older shape
//     if (res?.uri) {
//       return { uri: res.uri, name: res.name || "file" };
//     }
//     return null;
//   };

//   // Upload file, replace existing unit note if any
//   const handleUpload = async (subject, unitIndex) => {
//     try {
//       const res = await DocumentPicker.getDocumentAsync({ type: "*/*" });
//       console.log("Picker result:", res);
//       const filePicked = extractPickedFile(res);
//       if (!filePicked) {
//         Alert.alert("Picker", "No file picked or picker cancelled.");
//         return;
//       }
//       const { uri, name } = filePicked;
//       if (!uri) throw new Error("No file URI returned by picker.");

//       // convert to blob
//       const blob = await uriToBlob(uri);

//       // build storage path
//       const safeName = (name || `unit-${unitIndex + 1}`).replace(/\s+/g, "_");
//       const path = `notes/${subject.subjectId}/unit-${unitIndex + 1}-${Date.now()}-${safeName}`;

//       console.log("Uploading to storage path:", path);

//       const sRef = storageRef(storage, path);
//       await uploadBytes(sRef, blob);

//       const downloadUrl = await getDownloadURL(sRef);
//       console.log("Upload succeeded. downloadUrl:", downloadUrl);

//       // delete old note (storage + doc) if present
//       const oldNote = notesData[subject.subjectId]?.[unitIndex];
//       if (oldNote) {
//         try {
//           if (oldNote.storagePath) {
//             const oldRef = storageRef(storage, oldNote.storagePath);
//             await deleteObject(oldRef).catch((e) => console.warn("deleteObject old:", e.message));
//           }
//           await deleteDoc(firestoreDoc(db, "notes", oldNote.id)).catch((e) =>
//             console.warn("deleteDoc old:", e.message)
//           );
//         } catch (cleanupErr) {
//           console.warn("Cleanup error:", cleanupErr);
//         }
//       }

//       // add new doc
//       const docRef = await addDoc(collection(db, "notes"), {
//         subjectId: subject.subjectId,
//         subjectName: subject.subjectName || "",
//         unit: unitIndex + 1,
//         fileUrl: downloadUrl,
//         storagePath: path,
//         uploadedBy: faculty?.name || "",
//         uploadedById: faculty?.id || "",
//         uploadedAt: serverTimestamp(),
//         locked: false,
//       });

//       // update local state
//       setNotesData((prev) => {
//         const updated = { ...prev };
//         if (!updated[subject.subjectId]) updated[subject.subjectId] = Array(6).fill(null);
//         updated[subject.subjectId][unitIndex] = {
//           id: docRef.id,
//           subjectId: subject.subjectId,
//           unit: unitIndex + 1,
//           fileUrl: downloadUrl,
//           storagePath: path,
//           locked: false,
//         };
//         return updated;
//       });

//       Alert.alert("Uploaded", `Unit ${unitIndex + 1} uploaded successfully.`);
//     } catch (err) {
//       console.error("Upload error:", err);

//       // common Android expo-document-picker limitation
//       if (err?.message?.includes("ActivityNotFoundException") || err?.message?.includes("OPEN_DOCUMENT")) {
//         Alert.alert(
//           "Picker not available",
//           "Expo Go on Android may not support full file picking. To fully test file picking on Android create an Expo dev build or test on a real device outside Expo Go."
//         );
//         return;
//       }

//       Alert.alert("Upload failed", err.message || "Try again");
//     }
//   };

//   // Delete note (storage + firestore)
//   const handleDelete = async (subject, unitIndex) => {
//     try {
//       const note = notesData[subject.subjectId]?.[unitIndex];
//       if (!note) return Alert.alert("No note", "Nothing to delete");

//       if (note.storagePath) {
//         const sRef = storageRef(storage, note.storagePath);
//         await deleteObject(sRef).catch((e) => console.warn("deleteObject:", e.message));
//       }
//       await deleteDoc(firestoreDoc(db, "notes", note.id));
//       setNotesData((prev) => {
//         const updated = { ...prev };
//         updated[subject.subjectId][unitIndex] = null;
//         return updated;
//       });
//       Alert.alert("Deleted", `Unit ${unitIndex + 1} deleted`);
//     } catch (err) {
//       console.error("Delete error:", err);
//       Alert.alert("Delete failed", err.message || "Could not delete");
//     }
//   };

//   // Toggle lock/unlock
//   const toggleLock = async (subject, unitIndex) => {
//     try {
//       const note = notesData[subject.subjectId]?.[unitIndex];
//       if (!note) return Alert.alert("No note", "Upload note first");

//       const noteRef = firestoreDoc(db, "notes", note.id);
//       const newLocked = !note.locked;
//       await updateDoc(noteRef, { locked: newLocked });

//       setNotesData((prev) => {
//         const updated = { ...prev };
//         updated[subject.subjectId][unitIndex] = { ...note, locked: newLocked };
//         return updated;
//       });

//       Alert.alert("Status updated", `Unit ${unitIndex + 1} is now ${newLocked ? "Locked" : "Unlocked"}`);
//     } catch (err) {
//       console.error("toggleLock error:", err);
//       Alert.alert("Could not change lock", err.message || "Try again");
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#007BFF" />
//         <Text>Loading your subjects...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* header */}
//       {/* <View style={styles.header}>
//         <TouchableOpacity onPress={() => (selectedSubject ? setSelectedSubject(null) : router.back())}>
//           <Ionicons name="arrow-back-outline" size={24} color="#fff" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Upload Notes</Text>
//         <View style={{ width: 24 }} />
//       </View> */}

//       {/* subject list */}
//       {!selectedSubject ? (
//         <ScrollView contentContainerStyle={styles.subjectList}>
//           {assignedSubjects.length === 0 ? (
//             <Text style={{ textAlign: "center", marginTop: 20 }}>No subjects assigned 📚</Text>
//           ) : (
//             assignedSubjects.map((s) => (
//               <TouchableOpacity key={s.subjectId} style={styles.subjectCard} onPress={() => setSelectedSubject(s)}>
//                 <Text style={styles.subjectCardText}>{s.subjectName}</Text>
//               </TouchableOpacity>
//             ))
//           )}
//         </ScrollView>
//       ) : (
//         <View style={styles.unitsContainer}>
//           {(notesData[selectedSubject.subjectId] || Array(6).fill(null)).map((note, idx) => (
//             <View key={idx} style={styles.unitRow}>
//               <Text style={styles.unitText}>Unit {idx + 1}</Text>

//               {note ? (
//                 <View style={{ flexDirection: "row", alignItems: "center" }}>
//                   <TouchableOpacity onPress={() => Linking.openURL(note.fileUrl)} style={styles.actionBtn}>
//                     <Text style={styles.openText}>Open</Text>
//                   </TouchableOpacity>

//                   <TouchableOpacity onPress={() => toggleLock(selectedSubject, idx)} style={styles.actionBtn}>
//                     <Text style={{ color: note.locked ? "#DC3545" : "#28A745" }}>{note.locked ? "Unlock" : "Lock"}</Text>
//                   </TouchableOpacity>

//                   <TouchableOpacity onPress={() => handleDelete(selectedSubject, idx)} style={styles.actionBtn}>
//                     <Text style={styles.deleteText}>Delete</Text>
//                   </TouchableOpacity>
//                 </View>
//               ) : (
//                 <TouchableOpacity onPress={() => handleUpload(selectedSubject, idx)} style={styles.actionBtn}>
//                   <Text style={styles.uploadText}>Upload</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           ))}
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#F5F5F5" },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     backgroundColor: "#007BFF",
//     paddingVertical: 12,
//     paddingHorizontal: 15,
//   },
//   headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
//   centered: { flex: 1, justifyContent: "center", alignItems: "center" },
//   subjectList: { padding: 15, paddingBottom: 80 },
//   subjectCard: {
//     backgroundColor: "#0056b3",
//     borderRadius: 12,
//     paddingVertical: 30,
//     alignItems: "center",
//     marginBottom: 15,
//     elevation: 4,
//   },
//   subjectCardText: { fontSize: 20, fontWeight: "bold", color: "#fff" },
//   unitsContainer: { flex: 1, padding: 15 },
//   unitRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 8,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     elevation: 3,
//   },
//   unitText: { fontSize: 16, fontWeight: "bold", color: "#333" },
//   actionBtn: { paddingHorizontal: 10, paddingVertical: 5 },
//   uploadText: { color: "#007BFF", fontWeight: "bold" },
//   openText: { color: "#28A745", fontWeight: "bold" },
//   deleteText: { color: "#DC3545", fontWeight: "bold" },
// });









import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  addDoc,
  collection,
  deleteDoc,
  doc as firestoreDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db, storage } from "../../firebase";

const COLORS = {
  primary: "#2D6EEF",
  secondary: "#1A50C8",
  bg: "#F8FAFF",
  white: "#FFFFFF",
  textMain: "#1E293B",
  textSub: "#64748B",
  danger: "#EF4444",
  success: "#10B981",
  warning: "#F59E0B",
};

export default function FacultyUploadNotes() {
  const router = useRouter();
  const [faculty, setFaculty] = useState(null);
  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [notesData, setNotesData] = useState({});

  useEffect(() => {
    const fetchFacultyAndSubjects = async () => {
      try {
        const stored = await AsyncStorage.getItem("faculty");
        if (!stored) {
          Alert.alert("Not logged in", "Please login as faculty.");
          router.push("/Faculty/FacultyLogin");
          return;
        }
        const facultyData = JSON.parse(stored);
        setFaculty(facultyData);

        const faQuery = query(
          collection(db, "facultyAssignments"),
          where("facultyId", "==", facultyData.id)
        );
        const faSnap = await getDocs(faQuery);
        const assignments = faSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setAssignedSubjects(assignments);

        const notesState = {};
        for (const sub of assignments) {
          const nq = query(collection(db, "notes"), where("subjectId", "==", sub.subjectId));
          const nsnap = await getDocs(nq);
          const unitNotes = Array(6).fill(null);
          nsnap.docs.forEach((nDoc) => {
            const n = nDoc.data();
            if (n && typeof n.unit === "number") {
              unitNotes[n.unit - 1] = { id: nDoc.id, ...n };
            }
          });
          notesState[sub.subjectId] = unitNotes;
        }
        setNotesData(notesState);
      } catch (err) {
        console.error("fetchFacultyAndSubjects error:", err);
        Alert.alert("Error", "Could not load subjects.");
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyAndSubjects();
  }, [router]);

  const uriToBlob = async (uri) => {
    const resp = await fetch(uri);
    const blob = await resp.blob();
    return blob;
  };

  const extractPickedFile = (res) => {
    if (res?.type === "success" && res.uri) return { uri: res.uri, name: res.name || "file" };
    if (Array.isArray(res?.assets) && res.assets.length > 0) {
      const a = res.assets[0];
      return { uri: a.uri, name: a.name || "file" };
    }
    if (res?.uri) return { uri: res.uri, name: res.name || "file" };
    return null;
  };

  const handleUpload = async (subject, unitIndex) => {
    try {
      const res = await DocumentPicker.getDocumentAsync({ type: "*/*" });
      const filePicked = extractPickedFile(res);
      if (!filePicked) return;

      const { uri, name } = filePicked;
      const blob = await uriToBlob(uri);
      const safeName = (name || `unit-${unitIndex + 1}`).replace(/\s+/g, "_");
      const path = `notes/${subject.subjectId}/unit-${unitIndex + 1}-${Date.now()}-${safeName}`;

      const sRef = storageRef(storage, path);
      await uploadBytes(sRef, blob);
      const downloadUrl = await getDownloadURL(sRef);

      const oldNote = notesData[subject.subjectId]?.[unitIndex];
      if (oldNote) {
        if (oldNote.storagePath) {
          const oldRef = storageRef(storage, oldNote.storagePath);
          await deleteObject(oldRef).catch((e) => console.warn(e.message));
        }
        await deleteDoc(firestoreDoc(db, "notes", oldNote.id)).catch((e) => console.warn(e.message));
      }

      const docRef = await addDoc(collection(db, "notes"), {
        subjectId: subject.subjectId,
        subjectName: subject.subjectName || "",
        unit: unitIndex + 1,
        fileUrl: downloadUrl,
        storagePath: path,
        uploadedBy: faculty?.name || "",
        uploadedById: faculty?.id || "",
        uploadedAt: serverTimestamp(),
        locked: false,
      });

      setNotesData((prev) => {
        const updated = { ...prev };
        if (!updated[subject.subjectId]) updated[subject.subjectId] = Array(6).fill(null);
        updated[subject.subjectId][unitIndex] = {
          id: docRef.id,
          subjectId: subject.subjectId,
          unit: unitIndex + 1,
          fileUrl: downloadUrl,
          storagePath: path,
          locked: false,
        };
        return updated;
      });

      Alert.alert("Success", `Unit ${unitIndex + 1} notes uploaded.`);
    } catch (err) {
      Alert.alert("Upload failed", err.message || "Try again");
    }
  };

  const handleDelete = async (subject, unitIndex) => {
    Alert.alert("Delete Notes", "Are you sure you want to remove this unit?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
          try {
            const note = notesData[subject.subjectId]?.[unitIndex];
            if (note?.storagePath) {
              await deleteObject(storageRef(storage, note.storagePath)).catch(() => {});
            }
            await deleteDoc(firestoreDoc(db, "notes", note.id));
            setNotesData((prev) => {
              const updated = { ...prev };
              updated[subject.subjectId][unitIndex] = null;
              return updated;
            });
          } catch (err) { Alert.alert("Error", "Could not delete file."); }
      }}
    ]);
  };

  const toggleLock = async (subject, unitIndex) => {
    try {
      const note = notesData[subject.subjectId]?.[unitIndex];
      const noteRef = firestoreDoc(db, "notes", note.id);
      const newLocked = !note.locked;
      await updateDoc(noteRef, { locked: newLocked });

      setNotesData((prev) => {
        const updated = { ...prev };
        updated[subject.subjectId][unitIndex] = { ...note, locked: newLocked };
        return updated;
      });
    } catch (err) { Alert.alert("Error", "Could not update status."); }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Syncing Subjects...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <LinearGradient colors={[COLORS.secondary, COLORS.primary]} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => (selectedSubject ? setSelectedSubject(null) : router.back())}>
            <Ionicons name="chevron-back" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{selectedSubject ? "Unit Notes" : "Upload Notes"}</Text>
          <View style={{ width: 28 }} />
        </View>
        <Text style={styles.headerSubtitle}>
          {selectedSubject ? selectedSubject.subjectName : "Select a subject to manage notes"}
        </Text>
      </LinearGradient>

      {!selectedSubject ? (
        <ScrollView contentContainerStyle={styles.subjectList} showsVerticalScrollIndicator={false}>
          {assignedSubjects.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="book-off-outline" size={60} color={COLORS.textSub} />
              <Text style={styles.emptyText}>No subjects assigned yet.</Text>
            </View>
          ) : (
            assignedSubjects.map((s) => (
              <TouchableOpacity key={s.subjectId} style={styles.subjectCard} onPress={() => setSelectedSubject(s)} activeOpacity={0.9}>
                <View style={styles.cardIcon}>
                  <MaterialCommunityIcons name="book-open-variant" size={24} color={COLORS.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.subjectCardText}>{s.subjectName}</Text>
                  <Text style={styles.subjectCardSub}>Click to manage units</Text>
                </View>
                <Feather name="chevron-right" size={20} color={COLORS.textSub} />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      ) : (
        <ScrollView style={styles.unitsContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Syllabus Units (1-6)</Text>
          {(notesData[selectedSubject.subjectId] || Array(6).fill(null)).map((note, idx) => (
            <View key={idx} style={styles.unitRow}>
              <View style={styles.unitInfo}>
                <View style={[styles.unitBadge, { backgroundColor: note ? COLORS.success : COLORS.accent }]}>
                  <Text style={styles.unitBadgeText}>{idx + 1}</Text>
                </View>
                <Text style={styles.unitText}>Unit {idx + 1}</Text>
              </View>

              <View style={styles.actionGroup}>
                {note ? (
                  <>
                    <TouchableOpacity onPress={() => Linking.openURL(note.fileUrl)} style={styles.miniBtn}>
                      <Feather name="eye" size={20} color={COLORS.success} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => toggleLock(selectedSubject, idx)} style={styles.miniBtn}>
                      <MaterialCommunityIcons 
                        name={note.locked ? "lock" : "lock-open-variant"} 
                        size={20} 
                        color={note.locked ? COLORS.danger : COLORS.primary} 
                      />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleDelete(selectedSubject, idx)} style={styles.miniBtn}>
                      <Feather name="trash-2" size={20} color={COLORS.danger} />
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity onPress={() => handleUpload(selectedSubject, idx)} style={styles.uploadBtn}>
                    <Feather name="upload-cloud" size={16} color="white" />
                    <Text style={styles.uploadBtnText}>Upload</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.bg },
  loadingText: { marginTop: 15, color: COLORS.textSub, fontWeight: "600" },
  
  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    elevation: 10,
  },
  headerTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerTitle: { color: "white", fontSize: 22, fontWeight: "800" },
  headerSubtitle: { color: "rgba(255,255,255,0.7)", fontSize: 14, marginTop: 5, textAlign: "center", fontWeight: "600" },

  subjectList: { padding: 20 },
  subjectCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 24,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
  },
  cardIcon: { width: 50, height: 50, borderRadius: 15, backgroundColor: "#F0F7FF", justifyContent: "center", alignItems: "center", marginRight: 15 },
  subjectCardText: { fontSize: 18, fontWeight: "800", color: COLORS.textMain },
  subjectCardSub: { fontSize: 12, color: COLORS.textSub, marginTop: 2, fontWeight: "600" },

  unitsContainer: { flex: 1, padding: 20 },
  sectionTitle: { fontSize: 13, fontWeight: "800", color: COLORS.textSub, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 15 },
  unitRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
    elevation: 2,
  },
  unitInfo: { flexDirection: "row", alignItems: "center" },
  unitBadge: { width: 30, height: 30, borderRadius: 10, justifyContent: "center", alignItems: "center", marginRight: 12 },
  unitBadgeText: { color: "white", fontWeight: "800", fontSize: 14 },
  unitText: { fontSize: 16, fontWeight: "700", color: COLORS.textMain },
  
  actionGroup: { flexDirection: "row", alignItems: "center" },
  miniBtn: { padding: 10, marginLeft: 5 },
  uploadBtn: { 
    flexDirection: "row", alignItems: "center", backgroundColor: COLORS.primary, 
    paddingVertical: 8, paddingHorizontal: 15, borderRadius: 12, elevation: 2 
  },
  uploadBtnText: { color: "white", fontWeight: "800", fontSize: 12, marginLeft: 6 },

  emptyContainer: { alignItems: "center", marginTop: 100 },
  emptyText: { marginTop: 15, color: COLORS.textSub, fontSize: 16, fontWeight: "600" },
});