



// components/ui/UniversalPostComposer.jsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import { addDoc, collection, serverTimestamp, doc, updateDoc, increment } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../../firebase"; // ✅ from components/ui → root


/**
 * Universal Post Composer (Expo + Firebase)
 * - On-device compression
 * - Camera / Gallery
 * - Upload progress (resumable)
 * - Firestore + Storage write
 */
export default function UniversalPostComposer({
  getUser,
  collectionName = "posts",
  storageFolder = "posts",
  maxWidth = 1280,    // resize upper bound
  quality = 0.72,     // JPEG quality (0..1)
  withPreview = true, // upload a tiny preview
  onPosted,
  onCancel,
  buttonLabel = "Post",
}) {
  const [caption, setCaption] = useState("");
  const [localImage, setLocalImage] = useState(null);   // { uri, w, h, size }
  const [previewImage, setPreviewImage] = useState(null); // { uri, size }
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [user, setUser] = useState(null);
  const [hasPerms, setHasPerms] = useState(false);

  const MAX_BYTES = 1.5 * 1024 * 1024; // ~1.5 MB cap to protect free tier

  useEffect(() => {
    (async () => {
      const lib = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const cam = await ImagePicker.requestCameraPermissionsAsync();
      setHasPerms(lib.status === "granted" || cam.status === "granted");

      try {
        const u = await (typeof getUser === "function" ? getUser() : null);
        if (u) setUser(u);
      } catch (e) {
        console.warn("getUser error:", e);
      }
    })();
  }, [getUser]);

  // ---------- helpers ----------
  const fileSize = async (uri) => {
    try { const info = await FileSystem.getInfoAsync(uri, { size: true }); return info.size || 0; }
    catch { return 0; }
  };

  const compressToLimit = async (uri, targetWidth, q) => {
    // Iteratively compress until under MAX_BYTES or quality floor
    let currentUri = uri;
    let currentQ = q;
    let last = null;

    for (let i = 0; i < 4; i++) {
      const out = await ImageManipulator.manipulateAsync(
        currentUri,
        [{ resize: { width: targetWidth } }],
        { compress: currentQ, format: ImageManipulator.SaveFormat.JPEG }
      );
      const size = await fileSize(out.uri);
      last = { uri: out.uri, width: out.width, height: out.height, size };
      if (size <= MAX_BYTES || currentQ <= 0.4) break;
      currentUri = out.uri;
      currentQ -= 0.1;
    }
    return last;
  };

  const pick = async (source /* 'camera'|'gallery' */) => {
    if (!hasPerms) {
      Alert.alert("Permission required", "Enable camera/photos access in Settings.");
      return;
    }
    const opts = { mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 1 };
    const res = source === "camera"
      ? await ImagePicker.launchCameraAsync(opts)
      : await ImagePicker.launchImageLibraryAsync(opts);
    if (res.canceled) return;

    const asset = res.assets[0];
    const targetW = Math.min(asset.width || maxWidth, maxWidth);

    const main = await compressToLimit(asset.uri, targetW, quality);       // main image
    let prev = null;
    if (withPreview) {
      const p = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: 240 } }],
        { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
      );
      prev = { uri: p.uri, size: await fileSize(p.uri) };
    }

    setLocalImage({ uri: main.uri, w: main.width, h: main.height, size: main.size });
    setPreviewImage(prev);
  };

  const uploadWithProgress = (uri, path) =>
    new Promise(async (resolve, reject) => {
      try {
        const resp = await fetch(uri);
        const blob = await resp.blob();
        const storageRef = ref(storage, path);
        const task = uploadBytesResumable(storageRef, blob, { contentType: "image/jpeg" });
        task.on(
          "state_changed",
          (snap) => {
            if (snap.totalBytes) setProgress(snap.bytesTransferred / snap.totalBytes);
          },
          (err) => reject(err),
          async () => resolve(await getDownloadURL(task.snapshot.ref))
        );
      } catch (err) {
        reject(err);
      }
    });

  // ---------- submit ----------
  const handleSubmit = async () => {
    if (!caption.trim() && !localImage) {
      Alert.alert("Validation", "Write a caption or add an image.");
      return;
    }
    setSubmitting(true);
    setProgress(0);
    try {
      const safeUser = {
        uid: user?.uid || user?.prn || user?.id || "anon",
        name: user?.name || "Student",
        avatar: user?.avatar || user?.photoURL || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      };

      const ts = Date.now();
      const basePath = `${storageFolder}/${safeUser.uid}/${ts}`;

      let imageUrl = null;
      let previewUrl = null;

      if (localImage) {
        // extra guard if somehow still large
        if (localImage.size > MAX_BYTES) {
          const safer = await compressToLimit(localImage.uri, Math.min(maxWidth, 1024), Math.max(0.5, quality - 0.1));
          setLocalImage(safer);
        }
        imageUrl = await uploadWithProgress(localImage.uri, `${basePath}-main.jpg`);
      }
      if (previewImage) {
        previewUrl = await uploadWithProgress(previewImage.uri, `${basePath}-preview.jpg`);
      }

      const data = {
        uid: safeUser.uid,
        authorName: safeUser.name,
        authorAvatar: safeUser.avatar,
        caption: caption.trim(),
        imageUrl: imageUrl || null,
        previewUrl: previewUrl || null,
        imageW: localImage?.w || null,
        imageH: localImage?.h || null,
        likeCount: 0,
        commentCount: 0,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, collectionName), data);
      

      if (safeUser.uid) {
  await updateDoc(doc(db, "students", safeUser.uid), {
    points: increment(10),
  });
}

      // reset
      setCaption("");
      setLocalImage(null);
      setPreviewImage(null);
      setProgress(0);

      if (onPosted) onPosted(docRef, data);
      Alert.alert("Posted", "Your post is live!");
    } catch (e) {
      console.error("post submit error:", e);
      Alert.alert("Error", e?.message || "Could not publish post.");
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- UI ----------
  return (
    <View style={s.card}>
      <Text style={s.title}>Create Post</Text>
      <Text style={s.subtitle}>Share something useful with everyone</Text>

      <TextInput
        style={s.input}
        placeholder="Write a short caption…"
        placeholderTextColor="#93A4B5"
        value={caption}
        onChangeText={setCaption}
        multiline
      />

      {localImage ? (
        <View style={s.previewWrap}>
          <Image source={{ uri: localImage.uri }} style={s.preview} />
          <View style={s.previewMeta}>
            <Text style={s.meta}>
              {(localImage.size / 1024).toFixed(0)} KB · {localImage.w}×{localImage.h}
            </Text>
            <TouchableOpacity
              onPress={() => { setLocalImage(null); setPreviewImage(null); }}
              style={s.removeBtn}
              activeOpacity={0.9}
            >
              <Text style={s.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={s.pickRow}>
          <TouchableOpacity style={[s.pickBtn, { flex: 1 }]} onPress={() => pick("camera")} activeOpacity={0.9}>
            <Text style={s.pickText}>📷 Camera</Text>
          </TouchableOpacity>
          <View style={{ width: 10 }} />
          <TouchableOpacity style={[s.pickBtn, { flex: 1 }]} onPress={() => pick("gallery")} activeOpacity={0.9}>
            <Text style={s.pickText}>🖼️ Gallery</Text>
          </TouchableOpacity>
        </View>
      )}

      {submitting && (
        <View style={s.progressTrack}>
          <View style={[s.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
          <Text style={s.progressText}>{Math.round(progress * 100)}%</Text>
        </View>
      )}

      <View style={s.actions}>
        {onCancel ? (
          <TouchableOpacity
            onPress={onCancel}
            style={[s.btn, s.secondaryBtn]}
            activeOpacity={0.9}
            disabled={submitting}
          >
            <Text style={[s.btnText, { color: "#0E1B2A" }]}>Cancel</Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          onPress={handleSubmit}
          style={[s.btn, s.primaryBtn, submitting && { opacity: 0.6 }]}
          activeOpacity={0.9}
          disabled={submitting}
        >
          {submitting ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>{buttonLabel}</Text>}
        </TouchableOpacity>
      </View>

      <Text style={s.foot}>
        Optimized upload: ≤{maxWidth}px · ~{Math.round(quality * 100)}% JPEG · Max ~{(MAX_BYTES / (1024 * 1024)).toFixed(1)}MB
      </Text>
    </View>
  );
}

const BG = "#F6FAFF";
const CARD = "#FFFFFF";
const LINE = "#E6ECF5";
const TEXT = "#0F172A";
const MUTED = "#6A7A90";
const ACCENT = "#2d6eefff";

const s = StyleSheet.create({
  card: {
    backgroundColor: CARD,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: LINE,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  title: { fontSize: 18, fontWeight: "800", color: TEXT },
  subtitle: { fontSize: 12, color: MUTED, marginTop: 2, marginBottom: 10 },

  input: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: LINE,
    minHeight: 96,
    textAlignVertical: "top",
    marginBottom: 12,
  },

  pickRow: { flexDirection: "row", marginBottom: 12 },
  pickBtn: {
    backgroundColor: BG,
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  pickText: { fontWeight: "800", color: TEXT },

  previewWrap: { marginBottom: 10 },
  preview: { width: "100%", height: 220, borderRadius: 12, backgroundColor: "#EDF2F7" },
  previewMeta: { marginTop: 6, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  meta: { fontSize: 12, color: MUTED },
  removeBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: LINE, backgroundColor: "#fff" },
  removeText: { color: "#BF1B31", fontWeight: "800" },

  progressTrack: {
    marginTop: 4,
    marginBottom: 12,
    height: 14,
    borderRadius: 999,
    backgroundColor: "#EEF4FF",
    borderWidth: 1,
    borderColor: LINE,
    justifyContent: "center",
    overflow: "hidden",
  },
  progressFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 999,
    backgroundColor: ACCENT,
  },
  progressText: { fontSize: 10, color: "#fff", alignSelf: "flex-end", marginRight: 8 },

  actions: { flexDirection: "row", justifyContent: "flex-end", marginTop: 6 },
  btn: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, marginLeft: 8 },
  primaryBtn: { backgroundColor: ACCENT },
  secondaryBtn: { backgroundColor: "#fff", borderWidth: 1, borderColor: LINE },
  btnText: { color: "#fff", fontWeight: "900" },

  foot: { color: MUTED, fontSize: 11, marginTop: 8, lineHeight: 16 },
});
