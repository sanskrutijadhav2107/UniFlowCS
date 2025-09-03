import { initializeApp } from "firebase/app";
import { addDoc, collection, getDocs, getFirestore, query, serverTimestamp, where } from "firebase/firestore";

// ✅ your firebaseConfig (replace with your actual firebase.js config)
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

// 🔹 Dynamic academic year generator
const getAcademicYear = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  return month >= 6 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
};

// 🔹 Faculty with subjects (from your data)
const facultyList = [
  {
    name: "Prof. Santosh Salle",
    phone: "1111111111",
    email: "salle@college.edu",
    education: "Python",
    password: "123456",
    subject: "Programming in Python",
  },
  {
    name: "Dr. Geetanjali Mahamunkar",
    phone: "2222222222",
    email: "geetanjali@college.edu",
    education: "Digital Techniques",
    password: "123456",
    subject: "Digital Techniques",
  },
  {
    name: "Prof. Siddhesh Jadhav",
    phone: "3333333333",
    email: "siddhesh@college.edu",
    education: "Data Communication & Networks",
    password: "123456",
    subject: "Data Communications and Networks",
  },
  {
    name: "Prof. Satish Nanaware",
    phone: "4444444444",
    email: "nanaware@college.edu",
    education: "Object-Oriented Programming",
    password: "123456",
    subject: "Object Oriented Programming using C++",
  },
  {
    name: "Prof. Satish Nanaware",
    phone: "5555555555",
    email: "nanaware.const@college.edu",
    education: "Essence of Constitution",
    password: "123456",
    subject: "Essence of Constitution",
  },
  {
    name: "Dr. Geetanjali Mahamunkar",
    phone: "6666666666",
    email: "geetanjali.da@college.edu",
    education: "Data Analytics",
    password: "123456",
    subject: "Data Analytics",
  },
  {
    name: "Prof. Sushmita Kadam",
    phone: "7777777777",
    email: "sushmita@college.edu",
    education: "Advanced Java Programming",
    password: "123456",
    subject: "Advanced Java Programming",
  },
  {
    name: "Prof. Siddhesh Jadhav",
    phone: "8888888888",
    email: "siddhesh.os@college.edu",
    education: "Operating System",
    password: "123456",
    subject: "Operating System",
  },
  {
    name: "Prof. Prachi Wakudkar",
    phone: "9999999999",
    email: "prachi@college.edu",
    education: "Software Engineering & Testing",
    password: "123456",
    subject: "Software Engineering and Testing",
  },
  {
    name: "Prof. Siddhesh Jadhav",
    phone: "1010101010",
    email: "siddhesh.ed@college.edu",
    education: "Entrepreneurship Development",
    password: "123456",
    subject: "Entrepreneurship Development and Start-ups",
  },
];

async function seedFacultyAndAssignments() {
  for (const f of facultyList) {
    try {
      // 1️⃣ Add Faculty
      const facultyRef = await addDoc(collection(db, "faculty"), {
        name: f.name,
        phone: f.phone,
        email: f.email,
        education: f.education,
        password: f.password,
        role: "faculty",
        createdAt: serverTimestamp(),
      });

      console.log(`✅ Added Faculty: ${f.name}`);

      // 2️⃣ Find Subject ID by Name
      const q = query(collection(db, "subjects"), where("name", "==", f.subject));
      const snap = await getDocs(q);
      if (snap.empty) {
        console.warn(`⚠️ Subject not found in DB: ${f.subject}`);
        continue;
      }
      const subjectDoc = snap.docs[0];

      // 3️⃣ Add Assignment
      await addDoc(collection(db, "facultyAssignments"), {
        facultyId: facultyRef.id,
        facultyName: f.name,
        subjectId: subjectDoc.id,
        subjectName: f.subject,
        academicYear: getAcademicYear(),
        createdAt: serverTimestamp(),
      });

      console.log(`📘 Assigned ${f.subject} → ${f.name}`);
    } catch (err) {
      console.error("❌ Error adding faculty/assignment:", err);
    }
  }
  console.log("🎉 Seeding Complete!");
}

seedFacultyAndAssignments();
