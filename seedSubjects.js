// import { initializeApp } from "firebase/app";
// import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// // ✅ Your firebaseConfig from firebase.js

// const firebaseConfig = {
//   apiKey: "AIzaSyDmBjo98Q-eDyIWlJKIlSSEr_6jNL1TNtg",
//   authDomain: "uniflowcs.firebaseapp.com",
//   projectId: "uniflowcs",
//   storageBucket: "uniflowcs.firebasestorage.app",
//   messagingSenderId: "47924461186",
//   appId: "1:47924461186:web:10178f50291f013dafbe9b",
//   measurementId: "G-SCEVP1XQKE",
// };
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// const subjects = [
//   // Semester I
//   { name: "Basic Mathematics", code: "23DMA1101", year: 1, semester: 1 },
//   { name: "Applied Physics", code: "23DPH1101", year: 1, semester: 1 },
//   { name: "Communication Skills", code: "23DEN1101", year: 1, semester: 1 },
//   { name: "Elements of Electronics (Electrical/ETC)", code: "23DET1101", year: 1, semester: 1 },
//   { name: "Programming in C (Computer/IT)", code: "23DCE1101", year: 1, semester: 1 },

//   // Semester II
//   { name: "Applied Mathematics", code: "23DMA1201", year: 1, semester: 2 },
//   { name: "Applied Chemistry", code: "23DCH1201", year: 1, semester: 2 },
//   { name: "Engineering Drawing", code: "23MED1201", year: 1, semester: 2 },
//   { name: "Basic Electrical Engineering (ETC)", code: "23DEE1201", year: 1, semester: 2 },
//   { name: "Fundamentals of Electrical Engineering (Electrical)", code: "23DEE1202", year: 1, semester: 2 },
//   { name: "Electrical and Electronics Engineering (Computer/IT)", code: "23DET1201", year: 1, semester: 2 },

//   // Semester II (Computer Specific)
//   { name: "Programming in Python", code: "23DCE2101", year: 1, semester: 2 },
//   { name: "Digital Techniques", code: "23DCE2102", year: 1, semester: 2 },
//   { name: "Object Oriented Programming using C++", code: "23DCE2103", year: 1, semester: 2 },
//   { name: "Data Communications and Networks", code: "23DCE2104", year: 1, semester: 2 },
//   { name: "Essence of Constitution", code: "23DCE2105", year: 1, semester: 2 },

//   // Semester IV
//   { name: "Programming in Java", code: "23DCE2201", year: 2, semester: 4 },
//   { name: "User Interface Design", code: "23DCE2202", year: 2, semester: 4 },
//   { name: "Data Structures", code: "23DCE2203", year: 2, semester: 4 },
//   { name: "Database Management System", code: "23DCE2204", year: 2, semester: 4 },
//   { name: "Microprocessor", code: "23DCE2205", year: 2, semester: 4 },

//   // Semester V
//   { name: "Operating System", code: "23DCE3101", year: 3, semester: 5 },
//   { name: "Software Engineering and Testing", code: "23DCE3102", year: 3, semester: 5 },
//   { name: "Advanced Java Programming", code: "23DCE3103", year: 3, semester: 5 },
//   { name: "Elective-I (Comp. Engg/Info. Tech.)", code: "23DCE3104(A/B/C) / 23DIT3101(A/B/C)", year: 3, semester: 5 },
//   { name: "Entrepreneurship Development and Start-ups", code: "23DCE3105", year: 3, semester: 5 },

//   // Semester VI
//   { name: "Emerging Trends in Comp. Engg & Info Tech.", code: "23DCE3201", year: 3, semester: 6 },
//   { name: "Management", code: "23DCE3202", year: 3, semester: 6 },
//   { name: "Mobile Application Development", code: "23DCE3203", year: 3, semester: 6 },
//   { name: "Elective-II (Comp. Engg/Info. Tech.)", code: "23DCE3204(A/B/C) / 23DIT3201(A/B/C)", year: 3, semester: 6 },
// ];

// async function seedSubjects() {
//   for (const subj of subjects) {
//     await addDoc(collection(db, "subjects"), {
//       ...subj,
//       createdAt: serverTimestamp(),
//     });
//     console.log(`✅ Added: ${subj.name}`);
//   }
//   console.log("🎉 All subjects added successfully!");
// }

// seedSubjects();






// /**
//  * wipe_and_seed_subjects.js
//  *
//  * SAFETY: Script will delete all docs in subjects collection if you run with:
//  *   FORCE=true node wipe_and_seed_subjects.js
//  *
//  * DRY RUN:
//  *   DRY=true node wipe_and_seed_subjects.js
//  *
//  * ENV:
//  *   SA_PATH - optional path to service account JSON (default: ./serviceAccountKey.json)
//  *   FORCE   - must be "true" to actually delete old docs
//  *   DRY     - if "true" will not perform writes/deletes (reports only)
//  *
//  * Usage:
//  *   # Dry run (report what would happen)
//  *   DRY=true node wipe_and_seed_subjects.js
//  *
//  *   # Actually delete existing subjects and seed new ones
//  *   FORCE=true node wipe_and_seed_subjects.js
//  */

// import fs from "fs";
// import path from "path";
// import admin from "firebase-admin";

// const SA_PATH = process.env.SA_PATH || path.resolve(process.cwd(), "serviceAccountKey.json");
// const FORCE = String(process.env.FORCE || "").toLowerCase() === "true";
// const DRY = String(process.env.DRY || "").toLowerCase() === "true";

// if (!fs.existsSync(SA_PATH)) {
//   console.error(`Service account file not found at ${SA_PATH}.
// Please create/download the Firebase service account JSON and set SA_PATH (or place file at ./serviceAccountKey.json).`);
//   process.exit(1);
// }

// const serviceAccount = JSON.parse(fs.readFileSync(SA_PATH, "utf8"));

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });
// const db = admin.firestore();

// const subjects = [
//   // Semester I
//   { name: "Basic Mathematics", code: "23DMA1101", year: 1, semester: 1 },
//   { name: "Applied Physics", code: "23DPH1101", year: 1, semester: 1 },
//   { name: "Communication Skills", code: "23DEN1101", year: 1, semester: 1 },
//   { name: "Elements of Electronics (Electrical/ETC)", code: "23DET1101", year: 1, semester: 1 },
//   { name: "Programming in C (Computer/IT)", code: "23DCE1101", year: 1, semester: 1 },

//   // Semester II
//   { name: "Applied Mathematics", code: "23DMA1201", year: 1, semester: 2 },
//   { name: "Applied Chemistry", code: "23DCH1201", year: 1, semester: 2 },
//   { name: "Engineering Drawing", code: "23MED1201", year: 1, semester: 2 },
//   { name: "Basic Electrical Engineering (ETC)", code: "23DEE1201", year: 1, semester: 2 },
//   { name: "Fundamentals of Electrical Engineering (Electrical)", code: "23DEE1202", year: 1, semester: 2 },
//   { name: "Electrical and Electronics Engineering (Computer/IT)", code: "23DET1201", year: 1, semester: 2 },

//   // Semester II (Computer Specific)
//   { name: "Programming in Python", code: "23DCE2101", year: 1, semester: 2 },
//   { name: "Digital Techniques", code: "23DCE2102", year: 1, semester: 2 },
//   { name: "Object Oriented Programming using C++", code: "23DCE2103", year: 1, semester: 2 },
//   { name: "Data Communications and Networks", code: "23DCE2104", year: 1, semester: 2 },
//   { name: "Essence of Constitution", code: "23DCE2105", year: 1, semester: 2 },

//   // Semester IV
//   { name: "Programming in Java", code: "23DCE2201", year: 2, semester: 4 },
//   { name: "User Interface Design", code: "23DCE2202", year: 2, semester: 4 },
//   { name: "Data Structures", code: "23DCE2203", year: 2, semester: 4 },
//   { name: "Database Management System", code: "23DCE2204", year: 2, semester: 4 },
//   { name: "Microprocessor", code: "23DCE2205", year: 2, semester: 4 },

//   // Semester V
//   { name: "Operating System", code: "23DCE3101", year: 3, semester: 5 },
//   { name: "Software Engineering and Testing", code: "23DCE3102", year: 3, semester: 5 },
//   { name: "Advanced Java Programming", code: "23DCE3103", year: 3, semester: 5 },
//   { name: "Elective-I (Comp. Engg/Info. Tech.)", code: "23DCE3104", year: 3, semester: 5 },
//   { name: "Entrepreneurship Development and Start-ups", code: "23DCE3105", year: 3, semester: 5 },

//   // Semester VI
//   { name: "Emerging Trends in Comp. Engg & Info Tech.", code: "23DCE3201", year: 3, semester: 6 },
//   { name: "Management", code: "23DCE3202", year: 3, semester: 6 },
//   { name: "Mobile Application Development", code: "23DCE3203", year: 3, semester: 6 },
//   { name: "Elective-II (Comp. Engg/Info. Tech.)", code: "23DCE3204", year: 3, semester: 6 },
// ];

// async function listExistingSubjects() {
//   const snap = await db.collection("subjects").get();
//   const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//   return docs;
// }

// async function deleteAllSubjects() {
//   // Note: Firestore batch deletes limited to 500 ops per batch. We'll delete in chunks.
//   const collectionRef = db.collection("subjects");
//   const snapshot = await collectionRef.get();
//   if (snapshot.empty) {
//     console.log("No documents found in subjects to delete.");
//     return;
//   }

//   const docs = snapshot.docs;
//   console.log(`Found ${docs.length} subjects to delete.`);

//   // Delete in batches
//   const BATCH_SIZE = 400;
//   for (let i = 0; i < docs.length; i += BATCH_SIZE) {
//     const chunk = docs.slice(i, i + BATCH_SIZE);
//     const batch = db.batch();
//     chunk.forEach((d) => batch.delete(d.ref));
//     await batch.commit();
//     console.log(`Deleted batch ${i / BATCH_SIZE + 1} (${chunk.length} docs)`);
//   }
// }

// async function seedSubjects() {
//   for (const subj of subjects) {
//     const docRef = db.collection("subjects").doc(subj.code); // use code as doc id
//     const payload = {
//       name: subj.name,
//       code: subj.code,
//       year: subj.year,
//       semester: subj.semester,
//       createdAt: admin.firestore.FieldValue.serverTimestamp(),
//     };
//     if (DRY) {
//       console.log(`[DRY] Would set subjects/${subj.code}`, payload);
//     } else {
//       await docRef.set(payload, { merge: true });
//       console.log(`Seeded subjects/${subj.code}`);
//     }
//   }
// }

// (async function main() {
//   try {
//     console.log("=== wipe_and_seed_subjects.js ===");
//     console.log(`DRY: ${DRY}, FORCE: ${FORCE}`);

//     const existing = await listExistingSubjects();
//     console.log(`Existing subjects count: ${existing.length}`);
//     if (existing.length > 0) {
//       console.log("Examples of existing subject docs: ", existing.slice(0, 10).map((d) => d.id));
//     }

//     if (existing.length > 0) {
//       if (!FORCE) {
//         console.log("");
//         console.log("To delete existing 'subjects' documents run with: FORCE=true");
//         console.log("Or run DRY=true to just list what would be changed.");
//         process.exit(0);
//       }

//       if (DRY) {
//         console.log("[DRY] Would delete all existing subjects.");
//       } else {
//         console.log("Deleting all existing subjects...");
//         await deleteAllSubjects();
//         console.log("Deleted all existing subject documents.");
//       }
//     } else {
//       console.log("No existing subject docs detected — skipping deletion.");
//     }

//     console.log("Seeding subject documents (doc id = code)...");
//     await seedSubjects();

//     console.log("Done. Verify subjects collection in Firestore console.");
//     process.exit(0);
//   } catch (err) {
//     console.error("Error:", err);
//     process.exit(1);
//   }
// })();


// seedSubjects.js
import { initializeApp } from "firebase/app";
import { doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";

/*
  NOTE:
  - Keep this file local (don't commit with firebaseConfig to public repo).
  - Run with Node (v18+ supports fetch & ES modules) OR run from a small bundler script.
*/

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
  { name: "Elective-I (Comp. Engg/Info. Tech.)", code: "23DCE3104", year: 3, semester: 5 },
  { name: "Entrepreneurship Development and Start-ups", code: "23DCE3105", year: 3, semester: 5 },

  // Semester VI
  { name: "Emerging Trends in Comp. Engg & Info Tech.", code: "23DCE3201", year: 3, semester: 6 },
  { name: "Management", code: "23DCE3202", year: 3, semester: 6 },
  { name: "Mobile Application Development", code: "23DCE3203", year: 3, semester: 6 },
  { name: "Elective-II (Comp. Engg/Info. Tech.)", code: "23DCE3204", year: 3, semester: 6 },
];

async function seedSubjects() {
  try {
    for (const subj of subjects) {
      const docRef = doc(db, "subjects", subj.code); // <-- use subj.code as doc ID
      await setDoc(docRef, {
        name: subj.name,
        code: subj.code,
        year: subj.year,
        semester: subj.semester,
        createdAt: serverTimestamp(),
      });
      console.log(`✅ Added/updated: ${subj.code} - ${subj.name}`);
    }
    console.log("🎉 All subjects added/updated successfully!");
  } catch (err) {
    console.error("Seeding error:", err);
  }
}

seedSubjects();