// import { Picker } from "@react-native-picker/picker";
// import { router } from "expo-router";
// import { addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
// import { useEffect, useState } from "react";
// import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
// import { db } from "../../firebase";

// export default function AddFaculty() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [education, setEducation] = useState("");
//   const [password, setPassword] = useState("");
//   const [subjects, setSubjects] = useState([]);
//   const [selectedSubject, setSelectedSubject] = useState("");
//   const [year, setYear] = useState("");

//   // Fetch subjects from Firestore
//   useEffect(() => {
//     const fetchSubjects = async () => {
//       try {
//         const snap = await getDocs(collection(db, "subjects"));
//         const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//         setSubjects(list);
//       } catch (error) {
//         console.error("Error fetching subjects:", error);
//         Alert.alert("Error", "Could not fetch subjects");
//       }
//     };
//     fetchSubjects();
//   }, []);

//   // Add Faculty + Assign Subject
//   const handleAddFaculty = async () => {
//     if (!name || !email || !phone || !education || !password || !selectedSubject || !year) {
//       Alert.alert("Error", "Please fill all fields");
//       return;
//     }

//     try {
//       // Add Faculty
//       const facultyRef = await addDoc(collection(db, "faculty"), {
//         name,
//         email,
//         phone: Number(phone), // ✅ store as number
//         education,
//         password,
//         role: "faculty",
//         createdAt: serverTimestamp(),
//       });

//       // Assign Subject with Year
//       await addDoc(collection(db, "facultyAssignments"), {
//         facultyId: facultyRef.id,
//         facultyName: name,
//         subjectId: selectedSubject,
//         subjectName: subjects.find((s) => s.id === selectedSubject)?.name || "",
//         year: Number(year), // ✅ store as 1, 2, or 3
//         createdAt: serverTimestamp(),
//       });

//       Alert.alert("Success", "Faculty added and subject assigned ✅");
//       router.back(); // go back to ManageFaculty
//     } catch (error) {
//       console.error("Error adding faculty:", error);
//       Alert.alert("Error", error.message);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Add Faculty</Text>

//       <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
//       <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
//       <TextInput
//         style={styles.input}
//         placeholder="Phone Number"
//         value={phone}
//         onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ""))}
//         keyboardType="phone-pad"
//       />
//       <TextInput style={styles.input} placeholder="Education (e.g. PHD, MTech)" value={education} onChangeText={setEducation} />
//       <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

//       {/* Year Picker */}
//       <View style={styles.pickerWrapper}>
//         <Text style={styles.pickerLabel}>Select Year:</Text>
//         <Picker selectedValue={year} onValueChange={setYear} style={styles.picker}>
//           <Picker.Item label="Select Year" value="" />
//           <Picker.Item label="1st Year" value="1" />
//           <Picker.Item label="2nd Year" value="2" />
//           <Picker.Item label="3rd Year" value="3" />
//         </Picker>
//       </View>

//       {/* Subject Picker */}
//       <View style={styles.pickerWrapper}>
//         <Text style={styles.pickerLabel}>Assign Subject:</Text>
//         <Picker selectedValue={selectedSubject} onValueChange={setSelectedSubject} style={styles.picker}>
//           <Picker.Item label="Select Subject" value="" />
//           {subjects.map((subj) => (
//             <Picker.Item key={subj.id} label={subj.name} value={subj.id} />
//           ))}
//         </Picker>
//       </View>

//       <TouchableOpacity style={styles.button} onPress={handleAddFaculty}>
//         <Text style={styles.buttonText}>Save Faculty</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flexGrow: 1, padding: 20, backgroundColor: "#fff", justifyContent: "center" },
//   title: { fontSize: 22, fontWeight: "bold", color: "#2d6eefff", textAlign: "center", marginBottom: 20 },
//   input: {
//     backgroundColor: "#E6F0FF",
//     padding: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#2d6eefff",
//     marginBottom: 15,
//   },
//   pickerWrapper: { marginBottom: 20 },
//   pickerLabel: { fontSize: 14, fontWeight: "500", marginBottom: 5 },
//   picker: { backgroundColor: "#E6F0FF", borderRadius: 8 },
//   button: { backgroundColor: "#2d6eefff", paddingVertical: 14, borderRadius: 8, marginTop: 10 },
//   buttonText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "bold" },
// });




import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { setDoc, doc, collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { db } from "../../firebase";

export default function AddFaculty() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [education, setEducation] = useState("");
  const [password, setPassword] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [year, setYear] = useState(""); // Year (1/2/3)

  // fetch subjects from Firestore
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const snap = await getDocs(collection(db, "subjects"));
        const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setSubjects(list);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        Alert.alert("Error", "Could not fetch subjects");
      }
    };
    fetchSubjects();
  }, []);

  const handleAddFaculty = async () => {
    if (!name || !email || !phone || !education || !password || !selectedSubject || !year) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      const phoneNumber = phone.toString();

      // ✅ Save Faculty with phone number as Document ID
      await setDoc(doc(db, "faculty", phoneNumber), {
        name,
        email,
        phone: Number(phone),
        education,
        password,
        role: "faculty",
        createdAt: serverTimestamp(),
      });

      // ✅ Assign Subject (facultyAssignments collection)
      await addDoc(collection(db, "facultyAssignments"), {
        facultyId: phoneNumber, // 📌 stable key
        facultyName: name, // 📌 store name for easy UI display
        subjectId: selectedSubject,
        subjectName: subjects.find((s) => s.id === selectedSubject)?.name || "",
        year: Number(year),
        createdAt: serverTimestamp(),
      });

      Alert.alert("Success", "Faculty added and subject assigned ✅");
      router.back();
    } catch (error) {
      console.error("Error adding faculty:", error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Faculty</Text>

      <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Education (e.g. PHD, MTech)" value={education} onChangeText={setEducation} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

      {/* Year Input */}
      <TextInput style={styles.input} placeholder="Year (1/2/3)" value={year} onChangeText={setYear} keyboardType="numeric" />

      {/* Subject Picker */}
      <View style={styles.pickerWrapper}>
        <Text style={styles.pickerLabel}>Assign Subject:</Text>
        <Picker selectedValue={selectedSubject} onValueChange={setSelectedSubject} style={styles.picker}>
          <Picker.Item label="Select Subject" value="" />
          {subjects.map((subj) => (
            <Picker.Item key={subj.id} label={subj.name} value={subj.id} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleAddFaculty}>
        <Text style={styles.buttonText}>Save Faculty</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#fff", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "bold", color: "#2d6eefff", textAlign: "center", marginBottom: 50 ,},
  input: {
    backgroundColor: "#E6F0FF",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2d6eefff",
    marginBottom: 15,
  },
  pickerWrapper: { marginBottom: 20 },
  pickerLabel: { fontSize: 14, fontWeight: "500", marginBottom: 5 },
  picker: { backgroundColor: "#E6F0FF", borderRadius: 8 },
  button: { backgroundColor: "#2d6eefff", paddingVertical: 14, borderRadius: 8, marginTop: 10 , marginBottom:100},
  buttonText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "bold",marginBottom:5 },
});
