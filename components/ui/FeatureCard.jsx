import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function FeatureCard({ icon, title, subtitle, onPress }) {
  return (
    <TouchableOpacity style={styles.featureCard} onPress={onPress}>
      {icon}
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  featureCard: {
    width: "40%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  featureTitle: { fontWeight: "bold", marginTop: 5 },
  featureSubtitle: { fontSize: 12, color: "#555", textAlign: "center" },
});
