// import React from "react";
// import { ScrollView } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// // ⬇️ import from your universal components folder
// import UniversalPostComposer from "../../components/ui/UniversalPostComposer";

// async function getUserFromStorage() {
//   const raw = await AsyncStorage.getItem("student");
//   if (!raw) return { uid: "anon", name: "Student", avatar: null };
//   const u = JSON.parse(raw);
//   return {
//     uid: u.prn || u.id || "anon",
//     name: u.name || "Student",
//     avatar: u.photoURL || null,
//   };
// }

// export default function PostScreen() {
//   return (
//     <ScrollView
//       style={{ flex: 1, backgroundColor: "#F9FBFF" }}
//       contentContainerStyle={{ padding: 16 }}
//     >
//       <UniversalPostComposer
//         getUser={getUserFromStorage}
//         collectionName="posts"
//         storageFolder="posts"
//         maxWidth={1280}
//         quality={0.7}
//         withPreview
//       />
//     </ScrollView>
//   );
// }



// app/student/post.jsx
import React from "react";
import { ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UniversalPostComposer from "../../components/ui/UniversalPostComposer";

async function getUserFromStorage() {
  const raw = await AsyncStorage.getItem("student");
  if (!raw) return { uid: "anon", name: "Student", avatar: null };
  const u = JSON.parse(raw);
  return {
    uid: u.prn || u.id || "anon",
    name: u.name || "Student",
    avatar: u.photoURL || null,
  };
}

export default function PostScreen() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#F6FAFF" }}
      contentContainerStyle={{ padding: 16 }}
    >
      <UniversalPostComposer
        getUser={getUserFromStorage}
        collectionName="posts"
        storageFolder="posts"
        maxWidth={1280}
        quality={0.72}
        withPreview
      />
    </ScrollView>
  );
}
