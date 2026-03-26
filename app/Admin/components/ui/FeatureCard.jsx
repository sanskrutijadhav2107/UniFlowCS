import { Feather } from '@expo/vector-icons';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');
// Responsive width: 2 columns with spacing
const CARD_WIDTH = (width - 50) / 2; 

const FeatureCard = ({ icon, title, subtitle, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        {icon}
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.subtitle} numberOfLines={2}>{subtitle}</Text>
      </View>

      <View style={styles.arrowContainer}>
        <Feather name="chevron-right" size={14} color="#CBD5E1" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    // Soft shadow for depth
    shadowColor: '#2D6EEF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#F0F7FF', // Subtle blue tint
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 4,
    lineHeight: 14,
  },
  arrowContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
  }
});

export default FeatureCard;