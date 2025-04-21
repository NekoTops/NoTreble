// lib/firebase/connectEmulators.js
import { connectAuthEmulator } from "firebase/auth";
import { connectFirestoreEmulator } from "firebase/firestore";

/**
 * Connects Firebase services to local emulators (for testing/development only)
 * @param {object} auth - The Firebase auth instance
 * @param {object} db - The Firestore instance
 */
export function connectEmulators(auth, db) {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_USE_EMULATORS === "true") {
    console.log("🔥 [TEST] ENV:", process.env.NEXT_PUBLIC_USE_EMULATORS);
    console.log("🔌 Connecting to Firebase Emulator Suite...");
    connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
    connectFirestoreEmulator(db, "localhost", 8080);
  }
}
