// Firebase Client Configuration - TecnoVentas y Servicios S.A.S.
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  setDoc
} from "firebase/firestore";

// Configuración real del proyecto Firebase - Tecno Ventas
const firebaseConfig = {
  apiKey: "AIzaSyA4XoVZSMNdHIQELN9IALJxhNHpLeXiCas",
  authDomain: "tecno-ventas-e2d35.firebaseapp.com",
  projectId: "tecno-ventas-e2d35",
  storageBucket: "tecno-ventas-e2d35.firebasestorage.app",
  messagingSenderId: "306061198123",
  appId: "1:306061198123:web:0a77e0457a9769b1787b6e",
  measurementId: "G-2GTG3DLSME"
};

// Inicializar Firebase (evitar doble inicialización)
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Servicios
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// ─────────────────────────────────────────────────
// HELPERS CRUD para Firestore
// ─────────────────────────────────────────────────

/** Obtener todos los documentos de una colección */
export async function fetchCollection(collectionName, orderByField = null) {
  try {
    const col = collection(db, collectionName);
    const q = orderByField ? query(col, orderBy(orderByField, "desc")) : col;
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ firestoreId: d.id, ...d.data() }));
  } catch (err) {
    console.error(`Error al obtener colección '${collectionName}':`, err);
    return [];
  }
}

/** Agregar un documento a una colección */
export async function addDocument(collectionName, data) {
  try {
    const col = collection(db, collectionName);
    const ref = await addDoc(col, { ...data, createdAt: serverTimestamp() });
    return ref.id;
  } catch (err) {
    console.error(`Error al agregar documento en '${collectionName}':`, err);
    return null;
  }
}

/** Actualizar un documento existente (por firestoreId) */
export async function updateDocument(collectionName, firestoreId, data) {
  try {
    const ref = doc(db, collectionName, firestoreId);
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
    return true;
  } catch (err) {
    console.error(`Error al actualizar documento en '${collectionName}':`, err);
    return false;
  }
}

/** Eliminar un documento por firestoreId */
export async function deleteDocument(collectionName, firestoreId) {
  try {
    const ref = doc(db, collectionName, firestoreId);
    await deleteDoc(ref);
    return true;
  } catch (err) {
    console.error(`Error al eliminar documento en '${collectionName}':`, err);
    return false;
  }
}

/** Guardar con ID personalizado (upsert) */
export async function setDocument(collectionName, id, data) {
  try {
    const ref = doc(db, collectionName, id);
    await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
    return true;
  } catch (err) {
    console.error(`Error al guardar documento en '${collectionName}':`, err);
    return false;
  }
}

// ─────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────
export {
  app,
  auth,
  db,
  googleProvider,
  facebookProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber
};
