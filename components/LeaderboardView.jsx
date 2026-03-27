// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   FlatList,
// } from "react-native";
// import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
// import { db } from "../firebase";

// export default function LeaderboardView() {
//   const [students, setStudents] = useState([]);

//   useEffect(() => {
//     const q = query(
//       collection(db, "students"),
//       orderBy("points", "desc")
//     );

//     const unsub = onSnapshot(q, (snap) => {
//       const data = snap.docs.map((d, i) => ({
//         id: d.id,
//         rank: i + 1,
//         ...d.data(),
//       }));
//       setStudents(data);
//     });

//     return () => unsub();
//   }, []);

//   const topThree = students.slice(0, 3);
//   const rest = students.slice(3);

//   const Podium = () => {
//   const first = topThree[0];
//   const second = topThree[1];
//   const third = topThree[2];

//   return (
//     <View style={styles.podiumRow}>

//       {/* SECOND PLACE (LEFT) */}
//       {second && (
//         <View style={[styles.podiumCard, styles.secondPlace]}>
//           <Image
//             source={{
//               uri:
//                 second.photoURL ||
//                 "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
//             }}
//             style={styles.podiumAvatar}
//           />
//           <Text style={styles.crown}>🥈</Text>
//           <Text style={styles.podiumName}>{second.name || "Student"}</Text>
//           <Text style={styles.podiumPoints}>{second.points || 0} pts</Text>
//         </View>
//       )}

//       {/* FIRST PLACE (CENTER & BIG) */}
//       {first && (
//         <View style={[styles.podiumCard, styles.firstPlace]}>
//           <Image
//             source={{
//               uri:
//                 first.photoURL ||
//                 "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
//             }}
//             style={[styles.podiumAvatar, { width: 75, height: 75, borderRadius: 37.5 }]}
//           />
//           <Text style={styles.crown}>👑</Text>
//           <Text style={styles.podiumName}>{first.name || "Student"}</Text>
//           <Text style={styles.podiumPoints}>{first.points || 0} pts</Text>
//         </View>
//       )}

//       {/* THIRD PLACE (RIGHT) */}
//       {third && (
//         <View style={[styles.podiumCard, styles.thirdPlace]}>
//           <Image
//             source={{
//               uri:
//                 third.photoURL ||
//                 "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
//             }}
//             style={styles.podiumAvatar}
//           />
//           <Text style={styles.crown}>🥉</Text>
//           <Text style={styles.podiumName}>{third.name || "Student"}</Text>
//           <Text style={styles.podiumPoints}>{third.points || 0} pts</Text>
//         </View>
//       )}

//     </View>
//   );
// };


//   const renderItem = ({ item }) => (
//     <View style={styles.listItem}>
//       <View style={styles.rankBadge}>
//         <Text style={styles.rankText}>{item.rank}</Text>
//       </View>

//       <Image
//         source={{
//           uri:
//             item.photoURL ||
//             "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
//         }}
//         style={styles.listImage}
//       />

//       <View style={{ flex: 1 }}>
//         <Text style={styles.listName}>{item.name || "Student"}</Text>
//       </View>

//       <Text style={styles.listPoints}>
//         {item.points || 0} pts
//       </Text>
//     </View>
//   );

//   return (
//     <FlatList
//       ListHeaderComponent={<Podium />}
//       data={rest}
//       renderItem={renderItem}
//       keyExtractor={(item) => item.id}
//       contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 20 }}
//       showsVerticalScrollIndicator={false}
//     />
//   );
// }

// const styles = StyleSheet.create({
//   podiumRow: {
//   flexDirection: "row",
//   justifyContent: "center",
//   alignItems: "flex-end",
//   marginTop: 25,
//   marginBottom: 25,
// },

// podiumCard: {
//   alignItems: "center",
//   backgroundColor: "#fff",
//   padding: 10,
//   borderRadius: 15,
//   width: 110,
//   height: 150,        // 👈 fixed height for alignment
//   marginHorizontal: 8,
//   shadowColor: "#000",
//   shadowOpacity: 0.05,
//   shadowRadius: 5,
//   elevation: 3,
//   justifyContent: "flex-end",
// },

// firstPlace: {
//   height: 170,        // 👈 taller, not scaled
// },

//   podiumAvatar: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//   },
//   crown: {
//     fontSize: 18,
//     marginTop: 4,
//   },
//   podiumName: {
//     fontWeight: "600",
//     marginTop: 4,
//   },
//   podiumPoints: {
//     color: "#146ED7",
//     fontWeight: "600",
//     fontSize: 12,
//   },

//   listItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     marginVertical: 6,
//     borderRadius: 15,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowOffset: { width: 0, height: 3 },
//     shadowRadius: 5,
//     elevation: 2,
//   },
//   rankBadge: {
//     backgroundColor: "#146ED7",
//     borderRadius: 12,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     marginRight: 10,
//   },
//   rankText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 14,
//   },
//   listImage: {
//     width: 45,
//     height: 45,
//     borderRadius: 22.5,
//     marginRight: 10,
//   },
//   listName: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: "#333",
//   },
//   listPoints: {
//     fontSize: 14,
//     color: "#146ED7",
//     fontWeight: "600",
//   },
//   secondPlace: {
//   marginTop: 20,
// },

// thirdPlace: {
//   marginTop: 30,
// },

// });






import { MaterialCommunityIcons } from "@expo/vector-icons";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Dimensions, FlatList, Image, StyleSheet, Text, View } from "react-native";
import { db } from "../firebase";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const COLORS = {
  primary: "#2D6EEF",
  accent: "#F43F5E",
  gold: "#FFD700",
  silver: "#B4B4B4",
  bronze: "#CD7F32",
  white: "#FFFFFF",
  cardBg: "#FFFFFF",
  textMain: "#0F172A",
  textSub: "#64748B",
};

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

export default function LeaderboardView() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "students"), orderBy("points", "desc"), limit(20));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d, i) => ({
        id: d.id,
        rank: i + 1,
        ...d.data(),
      }));
      setStudents(data);
    });
    return () => unsub();
  }, []);

  const topThree = students.slice(0, 3);
  const rest = students.slice(3);

  const PodiumItem = ({ student, rank }) => {
    if (!student) return <View style={styles.podiumSpace} />;
    const isFirst = rank === 1;
    const color = rank === 1 ? COLORS.gold : rank === 2 ? COLORS.silver : COLORS.bronze;

    return (
      <View style={[styles.podiumCard, isFirst ? styles.firstPlace : styles.sidePlace]}>
        <View style={styles.avatarWrapper}>
          <Image
            source={{ uri: student.photo || DEFAULT_AVATAR }}
            style={[styles.podiumAvatar, { borderColor: color }, isFirst && styles.goldBorder]}
          />
          <View style={[styles.rankBadge, { backgroundColor: color }]}>
            <Text style={styles.rankBadgeText}>{rank}</Text>
          </View>
        </View>
        <Text style={styles.podiumName} numberOfLines={1}>{student.name || "Student"}</Text>
        <View style={styles.podiumPointsWrapper}>
          <Text style={[styles.podiumPoints, isFirst && { color: COLORS.primary }]}>
            {student.points || 0}
          </Text>
          <Text style={styles.ptsLabel}> pts</Text>
        </View>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <View style={styles.listRankWrapper}>
        <Text style={styles.listRankText}>{item.rank}</Text>
      </View>
      
      <Image source={{ uri: item.photo || DEFAULT_AVATAR }} style={styles.listImage} />
      
      <View style={{ flex: 1 }}>
        <Text style={styles.listName} numberOfLines={1}>{item.name || "Student"}</Text>
        <Text style={styles.listPrn}>PRN: {item.prn || "N/A"}</Text>
      </View>

      <View style={styles.pointsChip}>
        <MaterialCommunityIcons name="lightning-bolt" size={14} color={COLORS.gold} />
        <Text style={styles.pointsChipText}>{item.points || 0}</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      ListHeaderComponent={() => (
        <View style={styles.podiumRow}>
          <PodiumItem student={topThree[1]} rank={2} />
          <PodiumItem student={topThree[0]} rank={1} />
          <PodiumItem student={topThree[2]} rank={3} />
        </View>
      )}
      data={rest}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContent: { paddingHorizontal: 20, paddingBottom: 120 },
  podiumRow: { 
    flexDirection: "row", 
    justifyContent: "center", 
    alignItems: "flex-end", 
    paddingVertical: 50,
    marginBottom: 10 
  },
  podiumCard: { alignItems: "center", width: (SCREEN_WIDTH - 80) / 3 },
  firstPlace: { transform: [{ scale: 1.1 }], zIndex: 10 },
  sidePlace: { opacity: 0.9 },
  podiumSpace: { width: (SCREEN_WIDTH - 80) / 3 },
  avatarWrapper: { position: 'relative', marginBottom: 12 },
  podiumAvatar: { 
    width: 65, height: 65, borderRadius: 25, 
    backgroundColor: '#E2E8F0', borderWidth: 3 
  },
  goldBorder: { width: 85, height: 85, borderRadius: 32, borderWidth: 4 },
  rankBadge: { 
    position: 'absolute', bottom: -8, alignSelf: 'center', 
    paddingHorizontal: 10, paddingVertical: 2, borderRadius: 12, 
    borderWidth: 3, borderColor: COLORS.white 
  },
  rankBadgeText: { color: COLORS.white, fontSize: 11, fontWeight: '900' },
  podiumName: { fontWeight: "700", color: COLORS.textMain, fontSize: 13, marginTop: 5 },
  podiumPointsWrapper: { flexDirection: 'row', alignItems: 'baseline' },
  podiumPoints: { fontWeight: "900", fontSize: 15, color: COLORS.textSub },
  ptsLabel: { fontSize: 10, color: COLORS.textSub, fontWeight: '600' },
  
  listItem: { 
    flexDirection: "row", alignItems: "center", 
    backgroundColor: COLORS.cardBg, marginBottom: 12, 
    borderRadius: 24, padding: 14, 
    elevation: 4, shadowColor: "#000", 
    shadowOpacity: 0.06, shadowOffset: { width: 0, height: 4 } 
  },
  listRankWrapper: { width: 30 },
  listRankText: { fontSize: 15, fontWeight: "800", color: "#CBD5E1" },
  listImage: { width: 48, height: 48, borderRadius: 16, marginHorizontal: 10 },
  listName: { fontSize: 16, fontWeight: "700", color: COLORS.textMain },
  listPrn: { fontSize: 11, color: COLORS.textSub, marginTop: 1 },
  pointsChip: { 
    flexDirection: 'row', alignItems: 'center', 
    backgroundColor: '#F1F5F9', paddingHorizontal: 12, 
    paddingVertical: 6, borderRadius: 12 
  },
  pointsChipText: { fontSize: 14, color: COLORS.textMain, fontWeight: "800", marginLeft: 4 },
});