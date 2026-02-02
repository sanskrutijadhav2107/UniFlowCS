// components/UniversalComponents/UniversalPostsFeed.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
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
  getFirestore,
  increment,
  limit as qLimit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";

/**
 * UniversalPostsFeed
 * A drop-in, reusable Firestore posts feed with pagination and likes.
 *
 * Props:
 * - collectionName: Firestore collection (default "posts")
 * - filters: array of Firestore where() constraint tuples (e.g., [["year","==",3]])
 * - pageSize: number (default 10)
 * - showImage: boolean (default true)
 * - showAvatar: boolean (default true)
 * - enableLike: boolean (default true)
 * - renderItem: custom renderer (post, defaultRenderer) => ReactNode
 * - emptyText: string to show when no items
 *
 * Usage:
 * <UniversalPostsFeed collectionName="posts" />
 */
export default function UniversalPostsFeed({
  collectionName = "posts",
  filters = [],           // e.g. [["year","==",3]]
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

  const baseQuery = useMemo(() => {
    const col = collection(db, collectionName);
    let qy = query(col, orderBy("createdAt", "desc"), qLimit(pageSize));
    filters.forEach(([field, op, val]) => {
      qy = query(qy, where(field, op, val));
    });
    return qy;
  }, [collectionName, filters, pageSize]);

  // Initial live page (first page live, subsequent pages via fetchMore)
  useEffect(() => {
    if (unsubRef.current) unsubRef.current(); // cleanup previous
    setLoading(true);
    unsubRef.current = onSnapshot(baseQuery, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, _doc: d, ...d.data() }));
      setItems(data);
      lastDocRef.current = snap.docs[snap.docs.length - 1] || null;
      setLoading(false);
      setRefreshing(false);
    });
    return () => unsubRef.current && unsubRef.current();
  }, [baseQuery]);

  const fetchMore = async () => {
    if (paging || !lastDocRef.current) return;
    setPaging(true);
    try {
      const col = collection(db, collectionName);
      let moreQ = query(col, orderBy("createdAt", "desc"), startAfter(lastDocRef.current), qLimit(pageSize));
      filters.forEach(([f, op, val]) => { moreQ = query(moreQ, where(f, op, val)); });
      const snap = await (await import("firebase/firestore")).getDocs(moreQ);
      const more = snap.docs.map((d) => ({ id: d.id, _doc: d, ...d.data() }));
      if (more.length) {
        setItems((prev) => [...prev, ...more]);
        lastDocRef.current = snap.docs[snap.docs.length - 1];
      } else {
        lastDocRef.current = null; // no more
      }
    } catch (e) {
      // silent fail
    } finally {
      setPaging(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Re-run the base onSnapshot by re-setting filters (or just let it refresh)
    // Snapshot listener will update items; we just stop the spinner in effect
  };

  const like = async (post) => {
  if (!enableLike) return;

  try {
    // 1. increase like count
    await updateDoc(doc(db, collectionName, post.id), {
      likeCount: increment(1),
    });

    // 2. give points to the post owner (student doc id = post.uid)
    if (post.uid) {
      await updateDoc(doc(db, "students", post.uid), {
        points: increment(2),
      });
    }

  } catch (e) {
    console.log("Like error:", e);
  }
};



  const defaultRenderer = (post) => {
    const imgUri = post.imageUrl || post.previewUrl || null;
    return (
      <View style={s.card}>
        <View style={s.header}>
          {showAvatar ? (
            <Image
              source={{ uri: post.authorAvatar || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }}
              style={s.avatar}
            />
          ) : null}
          <View style={{ flex: 1 }}>
            <Text style={s.name} numberOfLines={1}>{post.authorName || "Student"}</Text>
            <Text style={s.sub}>shared an update</Text>
          </View>
        </View>

        {post.caption ? <Text style={s.caption}>{post.caption}</Text> : null}
        {showImage && imgUri ? <Image source={{ uri: imgUri }} style={s.image} /> : null}

        <View style={s.actions}>
          <TouchableOpacity onPress={() => like(post)} activeOpacity={0.8}>
            <Text>👍 Like ({post.likeCount || 0})</Text>
          </TouchableOpacity>
          <Text>💬 Comment</Text>
          <Text>📤 Share</Text>
        </View>
      </View>
    );
  };

  const render = ({ item }) => (renderItem ? renderItem(item, defaultRenderer) : defaultRenderer(item));

  if (loading && !items.length) {
    return (
      <View style={s.loading}>
        <ActivityIndicator color="#2d6eefff" />
        <Text style={{ marginTop: 8, color: "#555" }}>Loading posts…</Text>
      </View>
    );
  }

  if (!loading && items.length === 0) {
    return <Text style={s.empty}>{emptyText}</Text>;
  }

  return (
    <FlatList
      data={items}
      renderItem={render}
      keyExtractor={(it) => it.id}
      contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 10 }}
      onEndReachedThreshold={0.3}
      onEndReached={fetchMore}
      ListFooterComponent={() =>
        paging ? (
          <View style={{ paddingVertical: 12, alignItems: "center" }}>
            <ActivityIndicator color="#2d6eefff" />
          </View>
        ) : null
      }
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    />
  );
}

const s = StyleSheet.create({
  loading: { paddingHorizontal: 16, paddingVertical: 12, alignItems: "center" },
  empty: { textAlign: "center", color: "#666", marginTop: 12 },

  card: {
    backgroundColor: "#fff",
    padding: 12,
    marginTop: 10,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#eee",
  },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10, backgroundColor: "#eee" },
  name: { fontWeight: "800", color: "#0E1B2A" },
  sub: { fontSize: 12, color: "#6A7A90" },
  caption: { marginVertical: 6, color: "#0E1B2A" },
  image: { width: "100%", height: 180, borderRadius: 10, backgroundColor: "#f1f1f1" },
  actions: { flexDirection: "row", justifyContent: "space-around", marginTop: 10 },
});
