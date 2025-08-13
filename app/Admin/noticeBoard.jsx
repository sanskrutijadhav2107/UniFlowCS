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
        keyboardVerticalOffset={90} // Adjust for navbar height
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

              {/* Chat Bubble */}
              <View style={styles.noticeBubble}>
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
            <Ionicons name="attach" size={22} color="#0A4D8C" />
          </TouchableOpacity>

          {/* Text Input */}
          <TextInput
            style={styles.input}
            placeholder="Type a notice..."
            value={notice}
            onChangeText={setNotice}
            multiline
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
    backgroundColor: "#B8E6F2",
    padding: 15,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  list: { flex: 1, padding: 10 },
  noticeRow: { flexDirection: "row", marginBottom: 10, alignItems: "flex-end" },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 8 },
  noticeBubble: {
    backgroundColor: "#DCF8C6",
    padding: 10,
    borderRadius: 10,
    maxWidth: "75%",
  },
  noticeText: { fontSize: 15 },
  noticeDate: { fontSize: 11, color: "gray", textAlign: "right", marginTop: 5 },
  noticeImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 5,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#0A4D8C",
    padding: 10,
    borderRadius: 50,
    marginLeft: 5,
  },
  iconButton: {
    padding: 6,
    marginRight: 5,
  },
});
