import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  SafeAreaView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function NoticeBoard() {
  const [notice, setNotice] = useState("");
  const [notices, setNotices] = useState([]);
  const scrollViewRef = useRef();

  const addNotice = (mediaUri = null) => {
    if (notice.trim() !== "" || mediaUri) {
      setNotices([
        ...notices,
        { text: notice, date: new Date(), media: mediaUri }
      ]);
      setNotice("");
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      addNotice(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📢 Admin Notice Board</Text>
        </View>

        {/* Notices List */}
        <ScrollView
          style={styles.list}
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current.scrollToEnd({ animated: true })
          }
        >
          {notices.map((n, index) => (
            <View key={index} style={styles.noticeRow}>
              {/* Admin Avatar */}
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/219/219969.png"
                }}
                style={styles.avatar}
              />

              {/* Notice Card */}
              <View style={styles.noticeCard}>
                {n.media && (
                  <Image source={{ uri: n.media }} style={styles.noticeImage} />
                )}
                {n.text ? <Text style={styles.noticeText}>{n.text}</Text> : null}
                <Text style={styles.noticeDate}>
                  {n.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Input Bar */}
        <View style={styles.inputBar}>
          {/* Attachment Button */}
          <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
            <Ionicons name="attach" size={22} color="#146ED7" />
          </TouchableOpacity>

          {/* Text Input */}
          <TextInput
            style={styles.input}
            placeholder="Type a notice..."
            value={notice}
            onChangeText={setNotice}
            multiline
            placeholderTextColor="#777"
          />

          {/* Send Button */}
          <TouchableOpacity style={styles.sendButton} onPress={() => addNotice()}>
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#146ED7",
    padding: 15,
    alignItems: "center",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    elevation: 4,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },

  list: { flex: 1, padding: 12 },
  noticeRow: { flexDirection: "row", marginBottom: 12, alignItems: "flex-start" },
  avatar: { width: 42, height: 42, borderRadius: 21, marginRight: 10 },

  noticeCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    maxWidth: "75%",
    borderWidth: 1,
    borderColor: "#E3E8F0",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  noticeText: { fontSize: 15, color: "#333" },
  noticeDate: { fontSize: 11, color: "#666", textAlign: "right", marginTop: 5 },
  noticeImage: {
    width: 180,
    height: 140,
    borderRadius: 8,
    marginBottom: 6,
  },

  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    backgroundColor: "#E6F0FF",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 15,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: "#146ED7",
  },
  sendButton: {
    backgroundColor: "#146ED7",
    padding: 12,
    borderRadius: 50,
    marginLeft: 6,
  },
  iconButton: {
    padding: 6,
    marginRight: 5,
  },
});
