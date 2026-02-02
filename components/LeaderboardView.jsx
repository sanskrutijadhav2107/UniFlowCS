import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
} from "react-native";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";

export default function LeaderboardView() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "students"),
      orderBy("points", "desc")
    );

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

  const Podium = () => {
  const first = topThree[0];
  const second = topThree[1];
  const third = topThree[2];

  return (
    <View style={styles.podiumRow}>

      {/* SECOND PLACE (LEFT) */}
      {second && (
        <View style={[styles.podiumCard, styles.secondPlace]}>
          <Image
            source={{
              uri:
                second.photoURL ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
            }}
            style={styles.podiumAvatar}
          />
          <Text style={styles.crown}>🥈</Text>
          <Text style={styles.podiumName}>{second.name || "Student"}</Text>
          <Text style={styles.podiumPoints}>{second.points || 0} pts</Text>
        </View>
      )}

      {/* FIRST PLACE (CENTER & BIG) */}
      {first && (
        <View style={[styles.podiumCard, styles.firstPlace]}>
          <Image
            source={{
              uri:
                first.photoURL ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
            }}
            style={[styles.podiumAvatar, { width: 75, height: 75, borderRadius: 37.5 }]}
          />
          <Text style={styles.crown}>👑</Text>
          <Text style={styles.podiumName}>{first.name || "Student"}</Text>
          <Text style={styles.podiumPoints}>{first.points || 0} pts</Text>
        </View>
      )}

      {/* THIRD PLACE (RIGHT) */}
      {third && (
        <View style={[styles.podiumCard, styles.thirdPlace]}>
          <Image
            source={{
              uri:
                third.photoURL ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
            }}
            style={styles.podiumAvatar}
          />
          <Text style={styles.crown}>🥉</Text>
          <Text style={styles.podiumName}>{third.name || "Student"}</Text>
          <Text style={styles.podiumPoints}>{third.points || 0} pts</Text>
        </View>
      )}

    </View>
  );
};


  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <View style={styles.rankBadge}>
        <Text style={styles.rankText}>{item.rank}</Text>
      </View>

      <Image
        source={{
          uri:
            item.photoURL ||
            "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
        }}
        style={styles.listImage}
      />

      <View style={{ flex: 1 }}>
        <Text style={styles.listName}>{item.name || "Student"}</Text>
      </View>

      <Text style={styles.listPoints}>
        {item.points || 0} pts
      </Text>
    </View>
  );

  return (
    <FlatList
      ListHeaderComponent={<Podium />}
      data={rest}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  podiumRow: {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "flex-end",
  marginTop: 25,
  marginBottom: 25,
},

podiumCard: {
  alignItems: "center",
  backgroundColor: "#fff",
  padding: 10,
  borderRadius: 15,
  width: 110,
  height: 150,        // 👈 fixed height for alignment
  marginHorizontal: 8,
  shadowColor: "#000",
  shadowOpacity: 0.05,
  shadowRadius: 5,
  elevation: 3,
  justifyContent: "flex-end",
},

firstPlace: {
  height: 170,        // 👈 taller, not scaled
},

  podiumAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  crown: {
    fontSize: 18,
    marginTop: 4,
  },
  podiumName: {
    fontWeight: "600",
    marginTop: 4,
  },
  podiumPoints: {
    color: "#146ED7",
    fontWeight: "600",
    fontSize: 12,
  },

  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginVertical: 6,
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 2,
  },
  rankBadge: {
    backgroundColor: "#146ED7",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 10,
  },
  rankText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  listImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 10,
  },
  listName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  listPoints: {
    fontSize: 14,
    color: "#146ED7",
    fontWeight: "600",
  },
  secondPlace: {
  marginTop: 20,
},

thirdPlace: {
  marginTop: 30,
},

});
