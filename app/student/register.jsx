// import { useRouter } from "expo-router";
// import { doc, setDoc } from "firebase/firestore";
// import { useState } from "react";
// import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
// import { db } from "../../firebase";

// export default function Register() {
//   const router = useRouter();
//   const [name, setName] = useState("");
//   const [prn, setPrn] = useState("");
//   const [year, setYear] = useState("");
//   const [semester, setSemester] = useState("");
//   const [linkedin, setLinkedin] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const handleRegister = async () => {
//     if (!name || !prn || !year || !semester || !password || !confirmPassword) {
//       Alert.alert("Error", "Please fill all fields");
//       return;
//     }

//     if (password !== confirmPassword) {
//       Alert.alert("Error", "Passwords do not match");
//       return;
//     }

//     try {
//       // Save all student details in Firestore including password
//       await setDoc(doc(db, "students", prn), {   // using PRN as document ID
//         role: "student",
//         prn,
//         name,
//         year,
//         semester,
//         linkedin,
//         password,
//         confirmPassword,
//         createdAt: new Date().toISOString(),
//       });

//       Alert.alert("Success", "Account created successfully 🎉");
//       router.push("/student/login"); // go to login page
//     } catch (error) {
//       console.error("Registration Error: ", error);
//       Alert.alert("Registration Error", error.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Create Account</Text>
//       <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
//       <TextInput style={styles.input} placeholder="PRN" value={prn} onChangeText={setPrn} />
//       <TextInput style={styles.input} placeholder="Year" value={year} onChangeText={setYear} />
//       <TextInput style={styles.input} placeholder="Semester" value={semester} onChangeText={setSemester} />
//       <TextInput style={styles.input} placeholder="LinkedIn ID" value={linkedin} onChangeText={setLinkedin} />
//       <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
//       <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

//       <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
//         <Text style={styles.registerText}>Register</Text>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => router.push("/student/login")}>
//         <Text style={styles.haveAccount}>Already have account?</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#fff" },
//   title: { fontSize: 24, fontWeight: "bold", color: "#146ED7", textAlign: "center", marginBottom: 20 },
//   input: { backgroundColor: "#E6F0FF", padding: 12, borderRadius: 8, borderWidth: 1, borderColor: "#146ED7", marginBottom: 15 },
//   registerButton: { backgroundColor: "#146ED7", paddingVertical: 12, borderRadius: 8, marginTop: 10 },
//   registerText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "bold" },
//   haveAccount: { textAlign: "center", color: "#146ED7", fontSize: 14, marginTop: 15 },
// });











// import { useRouter } from "expo-router";
// import { doc, setDoc } from "firebase/firestore";
// import { useState } from "react";
// import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
// import { Picker } from "@react-native-picker/picker"; // ✅ keep Picker
// import { db } from "../../firebase";

// export default function Register() {
//   const router = useRouter();
//   const [name, setName] = useState("");
//   const [prn, setPrn] = useState("");
//   const [year, setYear] = useState("");
//   const [semester, setSemester] = useState("");
//   const [linkedin, setLinkedin] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const handleRegister = async () => {
//     const prnRegex = /^\d{14}$/;
//     if (!prnRegex.test(prn)) {
//       Alert.alert("Error", "PRN must be exactly 14 digits");
//       return;
//     }

//     if (!name || !prn || !year || !semester || !password || !confirmPassword) {
//       Alert.alert("Error", "Please fill all fields");
//       return;
//     }

//     if (password !== confirmPassword) {
//       Alert.alert("Error", "Passwords do not match");
//       return;
//     }

//     try {
//       await setDoc(doc(db, "students", prn), {
//         role: "student",
//         prn,
//         name,
//         year,
//         semester,
//         linkedin,
//         password,
//         confirmPassword,
//         createdAt: new Date().toISOString(),
//       });

//       Alert.alert("Success", "Account created successfully 🎉");
//       router.push("/student/login");
//     } catch (error) {
//       console.error("Registration Error: ", error);
//       Alert.alert("Registration Error", error.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Create Account</Text>
//       <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
//       <TextInput
//         style={styles.input}
//         placeholder="PRN (14 digits)"
//         value={prn}
//         onChangeText={setPrn}
//         keyboardType="numeric"
//       />

//       {/* Year Picker */}
//       <View style={styles.pickerContainer}>
//         <Picker
//           selectedValue={year}
//           onValueChange={(itemValue) => setYear(itemValue)}
//           style={styles.picker}
//         >
//           <Picker.Item label="Select Year" value="" color="#999" />
//           <Picker.Item label="1st Year" value="1" />
//           <Picker.Item label="2nd Year" value="2" />
//           <Picker.Item label="3rd Year" value="3" />
//         </Picker>
//       </View>

//       {/* Semester Picker */}
//       <View style={styles.pickerContainer}>
//         <Picker
//           selectedValue={semester}
//           onValueChange={(itemValue) => setSemester(itemValue)}
//           style={styles.picker}
//         >
//           <Picker.Item label="Select Semester" value="" color="#999" />
//           <Picker.Item label="1" value="1" />
//           <Picker.Item label="2" value="2" />
//           <Picker.Item label="3" value="3" />
//           <Picker.Item label="4" value="4" />
//           <Picker.Item label="5" value="5" />
//           <Picker.Item label="6" value="6" />
//         </Picker>
//       </View>

//       <TextInput style={styles.input} placeholder="LinkedIn ID" value={linkedin} onChangeText={setLinkedin} />
//       <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
//       <TextInput
//         style={styles.input}
//         placeholder="Confirm Password"
//         secureTextEntry
//         value={confirmPassword}
//         onChangeText={setConfirmPassword}
//       />

//       <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
//         <Text style={styles.registerText}>Register</Text>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => router.push("/student/login")}>
//         <Text style={styles.haveAccount}>Already have account?</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#fff" },
//   title: { fontSize: 24, fontWeight: "bold", color: "#146ED7", textAlign: "center", marginBottom: 20 },
//   input: {
//     backgroundColor: "#E6F0FF",
//     padding: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#146ED7",
//     marginBottom: 15,
//   },

//   // Picker Styles
//   pickerContainer: {
//     backgroundColor: "#E6F0FF",
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#146ED7",
//     marginBottom: 15,
//     overflow: "hidden",
//   },
//   picker: {
//     height: 50,
//     color: "#000",
//   },

//   registerButton: { backgroundColor: "#146ED7", paddingVertical: 12, borderRadius: 8, marginTop: 10 },
//   registerText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "bold" },
//   haveAccount: { textAlign: "center", color: "#146ED7", fontSize: 14, marginTop: 15 },
// });







import { useRouter } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View , Image} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons"; // ✅ Icons
import { db } from "../../firebase";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [prn, setPrn] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    const prnRegex = /^\d{14}$/;
    if (!prnRegex.test(prn)) {
      Alert.alert("Error", "PRN must be exactly 14 digits");
      return;
    }

    if (!name || !prn || !year || !semester || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      await setDoc(doc(db, "students", prn), {
        role: "student",
        prn,
        name,
        year,
        semester,
        linkedin,
        password,
        confirmPassword,
        createdAt: new Date().toISOString(),
      });

      Alert.alert("Success", "Account created successfully 🎉");
      router.push("/student/login");
    } catch (error) {
      console.error("Registration Error: ", error);
      Alert.alert("Registration Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
       <Image 
            source={require("../../assets/images/uniflowcs.png")} 
            style={styles.logo} 
            resizeMode="contain"
          />
      <Text style={styles.title}>Create Account</Text>

      {/* Name */}
      <View style={styles.inputWrapper}>
        <Ionicons name="person-outline" size={20} color="#146ED7" style={styles.icon} />
        <TextInput style={styles.input} placeholder="Enter Name" value={name} onChangeText={(text) => setName(text.replace(/[0-9]/g, ""))} />
      </View>

      {/* PRN */}
      <View style={styles.inputWrapper}>
        <Ionicons name="id-card-outline" size={20} color="#146ED7" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Enter PRN "
          value={prn}
          onChangeText={setPrn}
          keyboardType="numeric"
        />
      </View>

      {/* Year Picker */}
      <View style={styles.inputWrapper}>
        <Ionicons name="school-outline" size={20} color="#146ED7" style={styles.icon} />
        <View style={styles.pickerContainer}>
          <Picker selectedValue={year} onValueChange={(itemValue) => setYear(itemValue)} style={styles.picker}>
            <Picker.Item label="Select Year" value="" color="#999" />
            <Picker.Item label="1st Year" value="1" />
            <Picker.Item label="2nd Year" value="2" />
            <Picker.Item label="3rd Year" value="3" />
          </Picker>
        </View>
      </View>

      {/* Semester Picker */}
      <View style={styles.inputWrapper}>
        <Ionicons name="book-outline" size={20} color="#146ED7" style={styles.icon} />
        <View style={styles.pickerContainer}>
          <Picker selectedValue={semester} onValueChange={(itemValue) => setSemester(itemValue)} style={styles.picker}>
            <Picker.Item label="Select Semester" value="" color="#999" />
            <Picker.Item label="1" value="1" />
            <Picker.Item label="2" value="2" />
            <Picker.Item label="3" value="3" />
            <Picker.Item label="4" value="4" />
            <Picker.Item label="5" value="5" />
            <Picker.Item label="6" value="6" />
          </Picker>
        </View>
      </View>

      {/* LinkedIn */}
      <View style={styles.inputWrapper}>
        <Ionicons name="logo-linkedin" size={20} color="#146ED7" style={styles.icon} />
        <TextInput style={styles.input} placeholder="Enter LinkedIn ID" value={linkedin} onChangeText={setLinkedin} />
      </View>

      {/* Password */}
      <View style={styles.inputWrapper}>
        <Ionicons name="lock-closed-outline" size={20} color="#146ED7" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Create Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Confirm Password */}
      <View style={styles.inputWrapper}>
        <Ionicons name="lock-open-outline" size={20} color="#146ED7" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      {/* Register Button */}
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/student/login")}>
        <Text style={styles.haveAccount}>Already have account?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "flex-start", backgroundColor: "#fff" },
    logo: {
  width: 120,   // adjust as per your logo size
  height: 120,
  alignSelf: "center",
 marginBottom: 10, // increase this number to push "Login here" further down
  marginTop: 5,
},
  title: { fontSize: 24, fontWeight: "bold", color: "#146ED7", textAlign: "center", marginBottom: 20 },

  // Input Wrapper with Icon
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6F0FF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#146ED7",
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  icon: { marginRight: 8 },
  input: { flex: 1, padding: 12, fontSize: 16 },

  // Picker Styles
  pickerContainer: { flex: 1 },
  picker: { height: 50, color: "#000" },

  registerButton: { backgroundColor: "#146ED7", paddingVertical: 12, borderRadius: 8, marginTop: 10 },
  registerText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "bold" },
  haveAccount: { textAlign: "center", color: "#146ED7", fontSize: 14, marginTop: 15 },
});
