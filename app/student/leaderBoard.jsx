import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import BottomNavbar from "./components/BottomNavbar"; 

export default function Leaderboard() {
  const topPlayers = [
    { rank: 2, name: "Meghan", points: 40, image: require("../../assets/images/user.png") },
    { rank: 1, name: "Bryan", points: 43, image: require("../../assets/images/user.png") },
    { rank: 3, name: "Alex", points: 38, image: require("../../assets/images/user.png") },
  ];

  const listPlayers = [
    { rank: 4, name: "Sanskruti", points: 37, image: require("../../assets/images/user.png") },
    { rank: 5, name: "Riya", points: 35, image: require("../../assets/images/user.png") },
    { rank: 6, name: "You", points: 33, image: require("../../assets/images/user.png") },
    
  ];

  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient colors={["#4A90E2", "#146ED7"]} style={styles.header}>
        <Text style={styles.headerTitle}>🏆 UniFlow Leaderboard</Text>
        <View style={styles.topRow}>
          {topPlayers.map((player, idx) => (
            <View
              key={idx}
              style={[styles.topPlayer, player.rank === 1 && styles.firstPlace]}
            >
              <View
                style={[
                  styles.topImageWrapper,
                  player.rank === 1 && { borderColor: "#FFD700", shadowColor: "#FFD700" },
                  player.rank === 2 && { borderColor: "#C0C0C0", shadowColor: "#C0C0C0" },
                  player.rank === 3 && { borderColor: "#CD7F32", shadowColor: "#CD7F32" }
                ]}
              >
                <Image source={player.image} style={styles.topImage} />
              </View>
              <Text style={styles.crown}>
                {player.rank === 1 ? "👑" : player.rank === 2 ? "🥈" : "🥉"}
              </Text>
              <Text style={styles.playerName}>{player.name}</Text>
              <Text style={styles.points}>{player.points} pts</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      {/* Player List */}
      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        {listPlayers.map((p, i) => (
          <View
            key={i}
            style={[styles.listItem, p.name === "You" && styles.youHighlight]}
          >
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>{p.rank}</Text>
            </View>
            <Image source={p.image} style={styles.listImage} />
            <View style={{ flex: 1 }}>
              <Text style={styles.listName}>{p.name}</Text>
            </View>
            <Text style={styles.listPoints}>{p.points} pts</Text>
          </View>
        ))}
      </ScrollView>

       {/* Bottom Navbar */}
                 <BottomNavbar active="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8faff" },

  header: {
    paddingTop: 60, // Moved heading higher
    paddingBottom: 40,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginTop: 10,
  },
  topPlayer: { alignItems: "center", marginHorizontal: 14 },
  firstPlace: { transform: [{ scale: 1.2 }] },
  topImageWrapper: {
    borderWidth: 3,
    borderColor: "#fff",
    borderRadius: 50,
    padding: 3,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5
  },
  topImage: { width: 80, height: 80, borderRadius: 40 },
  crown: { fontSize: 20, marginTop: 4 },
  playerName: { fontSize: 15, fontWeight: "600", color: "#fff", marginTop: 4 },
  points: { fontSize: 12, color: "#d0ecff" },

  listContainer: { flex: 1, paddingHorizontal: 12, marginTop: 12 },
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
  youHighlight: { backgroundColor: "#B3D1FF" },
  rankBadge: {
    backgroundColor: "#146ED7",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 10
  },
  rankText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  listImage: { width: 45, height: 45, borderRadius: 22.5, marginRight: 10 },
  listName: { fontSize: 15, fontWeight: "600", color: "#333" },
  listPoints: { fontSize: 14, color: "#146ED7", fontWeight: "600" },


});
