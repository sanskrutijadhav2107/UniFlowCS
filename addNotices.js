const admin = require("firebase-admin");

// Path to your service account JSON key downloaded from Firebase Console
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function addNotice() {
  const docRef = db.collection("notices").doc(); // generate random doc id
  await docRef.set({
    title: "Exam Timetable Released",
    description: "Please check updated exam dates.",
    postedBy: "Prof. Santosh Sabale",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    mediaUrl: "https://example.com/exam-timetable.jpg" // optional
  });
  console.log("Notice added with ID:", docRef.id);
}

addNotice().catch(console.error);
