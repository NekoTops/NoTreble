import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import { app } from "../../firebaseConfig";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const db = getFirestore(app);
const auth = getAuth(app);

const DEFAULT_PROFILE_PIC = "/defaultprofile.png";

// Sign up
const signUp = async (email, password, username, profilePic, TTS) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      username: username,
      profilePic: profilePic, 
      TTS: TTS,
      createdAt: new Date(),
    });

    return user;
  } catch (error) {
    console.error("Sign Up Error:", error.message);
    throw error;
  }
};


// Update profile photo
const updateProfilePicture = async (uid, newPhotoURL) => {
  try {
    const userDocRef = doc(db, "users", uid);
    await setDoc(userDocRef, { profilePic: newPhotoURL }, { merge: true });
    console.log("Profile picture updated:", newPhotoURL);
  } catch (error) {
    console.error("Error updating profile picture:", error.message);
    throw error;
  }
};

// Login
const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const profile = await getUserProfile(user.uid);

    return { user, profile };
  } catch (error) {
    console.error("Login Error:", error.message);
    throw error;
  }
};

// Logout
const logout = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error("Logout Error:", error.message);
  }
};

const getUserProfile = async (uid) => {
  try {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        ...data,
        profilePic: data.profilePic || DEFAULT_PROFILE_PIC, 
      };
    } else {
      const newUserProfile = {
        uid: uid,
        email: "unknown",
        username: "New User",
        profilePic: DEFAULT_PROFILE_PIC, // sets default profile picture
        createdAt: new Date(),
      };

      await setDoc(userDocRef, newUserProfile);
      return newUserProfile;
    }
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    throw error;
  }
};

//Send Password Reset Email
export const sendResetEmail = async (email) => {
  try {
    await sendPasswordResetEmail(getAuth(), email);
    return { success: true, message: "Password reset email sent! Check your inbox." };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export { signUp, login, logout, getUserProfile, updateProfilePicture };
