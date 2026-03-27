import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { FlatList, Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import AdminNavbar from "./components/AdminNavbar";

const COLORS = {
  primaryDark: "#1A50C8",
  primary: "#2D6EEF",
  primaryLight: "#60A5FA",
  bg: "#F8FAFF",
  white: "#FFFFFF",
  textMain: "#0F172A",
  textSub: "#64748B",
  accent: "#E0E7FF",
  success: "#10B981"
};

const subjects = [
  { id: "1", subject: "Python", teacher: "Prof. Sharma", completedUnits: 5, icon: "language-python" },
  { id: "2", subject: "DCN", teacher: "Dr. Patel", completedUnits: 3, icon: "lan" },
  { id: "3", subject: "DT", teacher: "Prof. Mehta", completedUnits: 4, icon: "pencil-ruler" },
  { id: "4", subject: "OOP", teacher: "Dr. Singh", completedUnits: 6, icon: "cube-outline" },
];

export default function AdminSubjectMonitor() {
  const TOTAL_UNITS = 6;

  const renderSubjectCard = ({ item }) => {
    const progress = (item.completedUnits / TOTAL_UNITS) * 100;
    const isCompleted = item.completedUnits === TOTAL_UNITS;

    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name={item.icon} size={24} color={COLORS.primary} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.subjectName}>{item.subject}</Text>
            <Text style={styles.teacherName}>
              <MaterialCommunityIcons name="account-tie-outline" size={14} /> {item.teacher}
            </Text>
          </View>
          {isCompleted && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Done</Text>
            </View>
          )}
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Syllabus Progress</Text>
            <Text style={[styles.progressPercent, { color: isCompleted ? COLORS.success : COLORS.primary }]}>
              {Math.round(progress)}%
            </Text>
          </View>
          
          <View style={styles.progressBarBackground}>
            <LinearGradient
              colors={isCompleted ? [COLORS.success, "#34D399"] : [COLORS.primary, COLORS.primaryLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBarFill, { width: `${progress}%` }]}
            />
          </View>
          
          <View style={styles.unitsRow}>
            <Text style={styles.unitText}>{item.completedUnits} units covered</Text>
            <Text style={styles.unitTextTarget}>Target: {TOTAL_UNITS}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* BRANDED HEADER */}
      <LinearGradient 
        colors={[COLORS.primaryDark, COLORS.primary, COLORS.primaryLight]} 
        style={styles.header}
      >
        <SafeAreaView>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>Subject Progress</Text>
              <Text style={styles.headerSub}>Monitoring Academic Coverage</Text>
            </View>
            <View style={styles.headerIconCircle}>
              <MaterialCommunityIcons name="finance" size={24} color="white" />
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={renderSubjectCard}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No subjects being tracked.</Text>
        }
      />

      <AdminNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  
  // Header
  header: {
    height: 150,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    justifyContent: 'center',
    elevation: 10,
    shadowColor: COLORS.primaryDark,
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  headerContent: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginTop: Platform.OS === 'android' ? 10 : 0 
  },
  headerTitle: { color: 'white', fontSize: 24, fontWeight: '900' },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600' },
  headerIconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },

  // List
  listContent: { paddingHorizontal: 20, paddingTop: 25, paddingBottom: 120 },
  
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  textContainer: { flex: 1 },
  subjectName: { fontSize: 18, fontWeight: '800', color: COLORS.textMain },
  teacherName: { fontSize: 13, color: COLORS.textSub, marginTop: 2, fontWeight: '600' },
  
  badge: { backgroundColor: '#D1FAE5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { color: COLORS.success, fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },

  // Progress UI
  progressSection: { marginTop: 5 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  progressLabel: { fontSize: 12, fontWeight: '700', color: COLORS.textSub },
  progressPercent: { fontSize: 14, fontWeight: '900' },
  
  progressBarBackground: {
    height: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 10,
  },
  unitsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  unitText: { fontSize: 11, fontWeight: '700', color: COLORS.textMain },
  unitTextTarget: { fontSize: 11, fontWeight: '600', color: COLORS.textSub },

  emptyText: { textAlign: 'center', marginTop: 40, color: COLORS.textSub, fontWeight: '600' }
});