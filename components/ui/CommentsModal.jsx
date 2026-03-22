import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "../../firebase";

export default function CommentsModal({
  visible,
  onClose,
  post,
  userId,
  userName,
}) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!post?.id || !visible) return;

    const q = query(
      collection(db, "posts", post.id, "comments"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setComments(data);
    });

    return () => unsub();
  }, [post, visible]);

  const sendComment = async () => {
  if (!text.trim()) return;

  if (!userId || !userName) {
    console.log("Missing user data:", userId, userName);
    return;
  }

  try {
    await addDoc(collection(db, "posts", post.id, "comments"), {
      text: text.trim(),
      userId,
      userName,
      createdAt: new Date(), // ✅ FIXED
    });

    await updateDoc(doc(db, "posts", post.id), {
      commentCount: increment(1),
    });

    if (post.uid) {
      await updateDoc(doc(db, "students", post.uid), {
        points: increment(2),
      });
    }

    console.log("Comment added successfully"); // ✅ DEBUG

    setText("");
  } catch (e) {
    console.log("Comment error:", e);
  }
};

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={s.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={s.container}
        >
          <View style={s.header}>
            <Text style={s.title}>Comments</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={s.close}>✕</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={s.comment}>
                <Text style={s.name}>{item.userName}</Text>
                <Text>{item.text}</Text>
              </View>
            )}
            ListEmptyComponent={
              <Text style={s.empty}>No comments yet</Text>
            }
          />

          <View style={s.inputRow}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Write a comment..."
              style={s.input}
            />
            <TouchableOpacity onPress={sendComment}>
              <Text style={s.send}>Send</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#fff",
    height: "70%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  close: {
    fontSize: 18,
  },
  comment: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  name: {
    fontWeight: "700",
  },
  empty: {
    textAlign: "center",
    marginTop: 20,
    color: "#777",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingTop: 8,
  },
  input: {
    flex: 1,
    padding: 8,
  },
  send: {
    color: "#1877F2",
    fontWeight: "700",
    paddingHorizontal: 10,
  },
});