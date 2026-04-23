import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, query, where, onSnapshot, serverTimestamp, doc, updateDoc, deleteDoc, getDocs } from "firebase/firestore";

const firebaseConfig = {
    projectId: "striking-lane-453714-p0",
    appId: "1:199889567973:web:67acb8630db49ffd21140c",
    apiKey: "AIzaSyCeFfo-FAt02qSQrN16FxJrgOEyBgCvM2w",
    authDomain: "striking-lane-453714-p0.firebaseapp.com",
    storageBucket: "striking-lane-453714-p0.firebasestorage.app",
    messagingSenderId: "199889567973",
    measurementId: "G-HLVZNYD0ZE"
};

let auth: any = null;
let db: any = null;

if(firebaseConfig.apiKey !== "YOUR_API_KEY") {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app, "ai-studio-7b7fcc67-fde9-4251-b4e0-1430f49d6495");
}

export { auth, db };
export { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged };
export { collection, addDoc, query, where, onSnapshot, serverTimestamp, doc, updateDoc, deleteDoc, getDocs };
