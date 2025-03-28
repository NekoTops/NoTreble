import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAds3-SpXxNlcGB7wKZXi9jnzwhmUe57iw",
  authDomain: "notreble-d1c57.firebaseapp.com",
  projectId: "notreble-d1c57",
  storageBucket: "notreble-d1c57.appspot.com", 
  messagingSenderId: "997398023135",
  appId: "1:997398023135:web:21e93c51c157812601126a",
  measurementId: "G-P5W4E6S61T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const realtimeDB = getDatabase(app);

let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, db, auth, analytics, realtimeDB }; 
