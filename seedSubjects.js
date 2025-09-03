import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// ✅ Your firebaseConfig from firebase.js

const firebaseConfig = {
  apiKey: "AIzaSyDmBjo98Q-eDyIWlJKIlSSEr_6jNL1TNtg",
  authDomain: "uniflowcs.firebaseapp.com",
  projectId: "uniflowcs",
  storageBucket: "uniflowcs.firebasestorage.app",
  messagingSenderId: "47924461186",
  appId: "1:47924461186:web:10178f50291f013dafbe9b",
  measurementId: "G-SCEVP1XQKE",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const subjects = [
  // Semester I
  { name: "Basic Mathematics", code: "23DMA1101", year: 1, semester: 1 },
  { name: "Applied Physics", code: "23DPH1101", year: 1, semester: 1 },
  { name: "Communication Skills", code: "23DEN1101", year: 1, semester: 1 },
  { name: "Elements of Electronics (Electrical/ETC)", code: "23DET1101", year: 1, semester: 1 },
  { name: "Programming in C (Computer/IT)", code: "23DCE1101", year: 1, semester: 1 },

  // Semester II
  { name: "Applied Mathematics", code: "23DMA1201", year: 1, semester: 2 },
  { name: "Applied Chemistry", code: "23DCH1201", year: 1, semester: 2 },
  { name: "Engineering Drawing", code: "23MED1201", year: 1, semester: 2 },
  { name: "Basic Electrical Engineering (ETC)", code: "23DEE1201", year: 1, semester: 2 },
  { name: "Fundamentals of Electrical Engineering (Electrical)", code: "23DEE1202", year: 1, semester: 2 },
  { name: "Electrical and Electronics Engineering (Computer/IT)", code: "23DET1201", year: 1, semester: 2 },

  // Semester II (Computer Specific)
  { name: "Programming in Python", code: "23DCE2101", year: 1, semester: 2 },
  { name: "Digital Techniques", code: "23DCE2102", year: 1, semester: 2 },
  { name: "Object Oriented Programming using C++", code: "23DCE2103", year: 1, semester: 2 },
  { name: "Data Communications and Networks", code: "23DCE2104", year: 1, semester: 2 },
  { name: "Essence of Constitution", code: "23DCE2105", year: 1, semester: 2 },

  // Semester IV
  { name: "Programming in Java", code: "23DCE2201", year: 2, semester: 4 },
  { name: "User Interface Design", code: "23DCE2202", year: 2, semester: 4 },
  { name: "Data Structures", code: "23DCE2203", year: 2, semester: 4 },
  { name: "Database Management System", code: "23DCE2204", year: 2, semester: 4 },
  { name: "Microprocessor", code: "23DCE2205", year: 2, semester: 4 },

  // Semester V
  { name: "Operating System", code: "23DCE3101", year: 3, semester: 5 },
  { name: "Software Engineering and Testing", code: "23DCE3102", year: 3, semester: 5 },
  { name: "Advanced Java Programming", code: "23DCE3103", year: 3, semester: 5 },
  { name: "Elective-I (Comp. Engg/Info. Tech.)", code: "23DCE3104(A/B/C) / 23DIT3101(A/B/C)", year: 3, semester: 5 },
  { name: "Entrepreneurship Development and Start-ups", code: "23DCE3105", year: 3, semester: 5 },

  // Semester VI
  { name: "Emerging Trends in Comp. Engg & Info Tech.", code: "23DCE3201", year: 3, semester: 6 },
  { name: "Management", code: "23DCE3202", year: 3, semester: 6 },
  { name: "Mobile Application Development", code: "23DCE3203", year: 3, semester: 6 },
  { name: "Elective-II (Comp. Engg/Info. Tech.)", code: "23DCE3204(A/B/C) / 23DIT3201(A/B/C)", year: 3, semester: 6 },
];

async function seedSubjects() {
  for (const subj of subjects) {
    await addDoc(collection(db, "subjects"), {
      ...subj,
      createdAt: serverTimestamp(),
    });
    console.log(`✅ Added: ${subj.name}`);
  }
  console.log("🎉 All subjects added successfully!");
}

seedSubjects();
