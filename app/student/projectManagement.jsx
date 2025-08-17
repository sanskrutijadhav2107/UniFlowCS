import React from 'react';
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import BottomNavbar from "./components/BottomNavbar"; 


import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function InnovationPage() {
  const cards = [
    {
      title: 'Software Developer',
      description: 'Designs, codes, and maintains software solutions.',
      image: require('../../assets/images/user.png')
    },
    {
      title: 'Data Analyst',
      description: 'Analyzes and interprets complex data for insights.',
      image: require('../../assets/images/user.png')
    },
    {
      title: 'Backend Developer',
      description: 'Builds and maintains server-side logic.',
     image: require('../../assets/images/user.png')
    }
  ];

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>UniFlow CS</Text>

      {/* Form */}
      <Text style={styles.label}>Leader Name :</Text>
      <TextInput style={styles.input} placeholder="Enter leader name" />

      <Text style={styles.label}>Member Names :</Text>
      <TextInput
        style={[styles.input, { height: 50 }]}
        placeholder="Enter member names"
        multiline
      />

      <Text style={styles.label}>Enter Idea :</Text>
      <TextInput
        style={[styles.input, { height: 60 }]}
        placeholder="Describe your idea"
        multiline
      />

      {/* Submit button */}
      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>

      {/* Innovation Hub Button */}
      <TouchableOpacity style={styles.hubButton}>
        <Text style={styles.hubText}>Innovation Hub</Text>
      </TouchableOpacity>

      {/* Horizontal Scroll Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardScroll}>
        {cards.map((card, index) => (
          <View key={index} style={styles.card}>
            <Image source={card.image} style={styles.cardImage} />
            <Text style={styles.cardTitle}>{card.title}</Text>
            <Text style={styles.cardDesc}>{card.description}</Text>
            <TouchableOpacity>
              <Text style={styles.cardButton}>Read More..</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

     {/* Bottom Navbar */}
               <BottomNavbar active="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#bde0fe', padding: 16 },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003366',
    textAlign: 'center',
    marginBottom: 20
  },
  label: { fontSize: 14, fontWeight: 'bold', marginTop: 10 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 5
  },
  submitButton: {
    backgroundColor: '#1e64d4',
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 15,
    alignItems: 'center'
  },
  submitText: { color: '#fff', fontWeight: 'bold' },
  hubButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 15,
    marginTop: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  hubText: { color: '#000', fontWeight: 'bold' },
  cardScroll: { marginTop: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginRight: 15,
    width: 250,
    height: 220,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  cardImage: { width: '100%', height: 80, borderRadius: 8 },
  cardTitle: { fontWeight: 'bold', fontSize: 14, marginTop: 5 },
  cardDesc: { fontSize: 12, color: '#555', marginVertical: 5 },
  cardButton: { color: '#1e64d4', fontWeight: 'bold', fontSize: 12 },


});
