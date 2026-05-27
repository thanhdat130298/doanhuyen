import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { app } from "./firebase.js";

export async function submitWish(name, message) {
  const db = getFirestore(app);
  await addDoc(collection(db, "wishes"), {
    name: name.trim() || "Ẩn danh",
    message: message.trim(),
    createdAt: serverTimestamp(),
  });
}
