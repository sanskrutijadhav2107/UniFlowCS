import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import BottomNavbar from "../student/components/BottomNavbar";

export default function AddOpportunity() {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [department, setDepartment] = useState("");
  const [deadline, setDeadline] = useState("");
  const [applyLink, setApplyLink] = useState("");
  const [description, setDescription] = useState("");
  const [eligibleSemesters, setEligibleSemesters] = useState([]);

  const toggleSemester = (sem) => {
    if (eligibleSemesters.includes(sem)) {
      setEligibleSemesters(eligibleSemesters.filter((s) => s !== sem));
    } else {
      setEligibleSemesters([...eligibleSemesters, sem]);
    }
  };
  

  const handlePost = async () => {
    if (!title || !company || !department || !deadline || !applyLink || eligibleSemesters.length === 0) {
      Alert.alert("Please fill all fields and select eligible semesters");
      return;
    }
    

    try {
          await addDoc(collection(db, "opportunities"), {
      title,
      company,
      department,
      deadline,
      applyLink,
      description,

      type: "Internship", // default (can improve later)

      eligibleSemesters,

      postedBy: "admin",

      createdAt: serverTimestamp(),
    });


      Alert.alert("Opportunity posted successfully!");

      setTitle("");
      setCompany("");
      setDepartment("");
      setDeadline("");
      setApplyLink("");
      setDescription("");

    } catch (err) {
      Alert.alert("Error posting opportunity");
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <Text style={styles.header}>Post Opportunity</Text>

        <TextInput
          style={styles.input}
          placeholder="Title (Software Engineer Intern)"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={styles.input}
          placeholder="Company (Infosys)"
          value={company}
          onChangeText={setCompany}
        />

        <TextInput
          style={styles.input}
          placeholder="Department (Computer Engineering)"
          value={department}
          onChangeText={setDepartment}
        />

        <TextInput
          style={styles.input}
          placeholder="Deadline (2026-03-10)"
          value={deadline}
          onChangeText={setDeadline}
        />

        <TextInput
          style={styles.input}
          placeholder="Apply Link"
          value={applyLink}
          onChangeText={setApplyLink}
        />

        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Description"
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <Text style={{ fontWeight: "600", marginBottom: 8 }}>
  Eligible Semesters
</Text>

<View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 12 }}>
  {[1,2,3,4,5,6].map((sem) => (
    <TouchableOpacity
      key={sem}
      onPress={() => toggleSemester(sem)}
      style={{
        padding: 10,
        margin: 5,
        borderRadius: 8,
        backgroundColor: eligibleSemesters.includes(sem)
          ? "#146ED7"
          : "#E6F0FF",
      }}
    >
      <Text
            style={{
              color: eligibleSemesters.includes(sem)
                ? "#fff"
                : "#146ED7",
              fontWeight: "bold",
            }}
          >
            Sem {sem}
          </Text>
        </TouchableOpacity>
      ))}
    </View>


        <TouchableOpacity style={styles.btn} onPress={handlePost}>
          <Text style={styles.btnText}>Post Opportunity</Text>
        </TouchableOpacity>

      </ScrollView>

      <BottomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F9FBFF",
  },

  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },

  btn: {
    backgroundColor: "#146ED7",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },

});
