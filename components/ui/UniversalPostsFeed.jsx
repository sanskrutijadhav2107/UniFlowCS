// components/UniversalComponents/UniversalPostsFeed.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import {
  collection,
  doc,
  increment,
  limit as qLimit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";

export default function UniversalPostsFeed({
  ListHeaderComponent,
  collectionName = "posts",
  filters = [],
  pageSize = 10,
  showImage = true,
  showAvatar = true,
  enableLike = true,
  renderItem,
  emptyText = "No posts yet. Tap the ➕ to create one.",
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paging, setPaging] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const lastDocRef = useRef(null);
  const unsubRef = useRef(null);

  // 🔥 Correct Firestore listener (NO dependency trap)
  useEffect(() => {
    if (unsubRef.current) unsubRef.current();

    setLoading(true);

    const col = collection(db, collectionName);
    let qy = query(col, orderBy("createdAt", "desc"), qLimit(pageSize));

    filters.forEach(([field, op, val]) => {
      qy = query(qy, where(field, op, val));
    });

    unsubRef.current = onSnapshot(qy, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, _doc: d, ...d.data() }));
      setItems(data);
      lastDocRef.current = snap.docs[snap.docs.length - 1] || null;
      setLoading(false);
      setRefreshing(false);
    });

    return () => unsubRef.current && unsubRef.current();
  }, [collectionName, pageSize]);

  const fetchMore = async () => {
    if (paging || !lastDocRef.current) return;
    setPaging(true);

    try {
      const col = collection(db, collectionName);
      let moreQ = query(
        col,
        orderBy("createdAt", "desc"),
        startAfter(lastDocRef.current),
        qLimit(pageSize)
      );

      filters.forEach(([f, op, val]) => {
        moreQ = query(moreQ, where(f, op, val));
      });

      const snap = await getDocs(moreQ);
      const more = snap.docs.map((d) => ({ id: d.id, _doc: d, ...d.data() }));

      if (more.length) {
        setItems((prev) => [...prev, ...more]);
        lastDocRef.current = snap.docs[snap.docs.length - 1];
      } else {
        lastDocRef.current = null;
      }
    } finally {
      setPaging(false);
    }
  };

  const onRefresh = () => setRefreshing(true);

  const like = async (post) => {
    if (!enableLike) return;

    await updateDoc(doc(db, collectionName, post.id), {
      likeCount: increment(1),
    });

    if (post.uid) {
      await updateDoc(doc(db, "students", post.uid), {
        points: increment(2),
      });
    }
  };

  const defaultRenderer = (post) => {
    const imgUri = post.imageUrl || post.previewUrl || null;

    return (
      <View style={s.card}>
        <View style={s.header}>
          {showAvatar && (
            <Image
              source={{
                uri:
                  post.authorAvatar ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
              }}
              style={s.avatar}
            />
          )}
          <View style={{ flex: 1 }}>
            <Text style={s.name} numberOfLines={1}>
              {post.authorName || "Student"}
            </Text>
            <Text style={s.sub}>shared an update</Text>
          </View>
        </View>

        {post.caption && <Text style={s.caption}>{post.caption}</Text>}
        {showImage && imgUri && (
          <Image source={{ uri: imgUri }} style={s.image} />
        )}

        <View style={s.actions}>
          <TouchableOpacity onPress={() => like(post)}>
            <Text>👍 Like ({post.likeCount || 0})</Text>
          </TouchableOpacity>
          <Text>💬 Comment</Text>
          <Text>📤 Share</Text>
        </View>
      </View>
    );
  };

  const render = ({ item }) =>
    renderItem ? renderItem(item, defaultRenderer) : defaultRenderer(item);

  if (loading && !items.length) {
    return (
      <View style={s.loading}>
        <ActivityIndicator color="#2d6eefff" />
        <Text style={{ marginTop: 8 }}>Loading posts…</Text>
      </View>
    );
  }

  if (!loading && items.length === 0) {
    return <Text style={s.empty}>{emptyText}</Text>;
  }

  return (
  <FlatList
    ListHeaderComponent={ListHeaderComponent}
    data={items}
    renderItem={render}
    keyExtractor={(it) => it.id}
    contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 120 }}
    onEndReachedThreshold={0.3}
    onEndReached={fetchMore}
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }
  />
);

}

const s = StyleSheet.create({
  loading: { padding: 16, alignItems: "center" },
  empty: { textAlign: "center", color: "#666", marginTop: 12 },

  card: {
    backgroundColor: "#fff",
    padding: 12,
    marginTop: 10,
    borderRadius: 15,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#eee",
  },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    backgroundColor: "#eee",
  },
  name: { fontWeight: "800" },
  sub: { fontSize: 12, color: "#6A7A90" },
  caption: { marginVertical: 6 },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    backgroundColor: "#f1f1f1",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
});
