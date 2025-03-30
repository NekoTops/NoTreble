"use client";

import { useEffect, useState } from "react";
import { auth } from "../../../firebaseConfig";
import { getUserProfile, updateUserProfile } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { signOut, onAuthStateChanged, updateEmail, updatePassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { TfiControlBackward } from "react-icons/tfi";
import NavLink from "../../component/NavLink";


const Settings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [instrument, setInstrument] = useState("");
  const router = useRouter();
  const db = getFirestore();
  const [textSize, setTextSize] = useState("medium");
  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/Login");
        return;
      }
      try {
        const profileData = await getUserProfile(currentUser.uid);
        setUser({
          ...profileData,
        });
        setUsername(profileData.username || "");  // Set initial username
        setEmail(profileData.email || "");  // Set initial email
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSaveChanges = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      // Update username in Firestore
      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(userRef, { username: newUsername }, { merge: true });

      // Update email if it's changed
      if (newEmail !== user.email) {
        await updateEmail(currentUser, newEmail);
      }

      // Update password if it's changed
      if (newPassword) {
        await updatePassword(currentUser, newPassword);
      }

      // Reflect changes in the UI
      setUser((prevUser) => ({ ...prevUser, username: newUsername, email: newEmail }));
      alert("Changes saved successfully!");
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This cannot be undone.")){
        if(window.confirm("Are you really sure?")){

            const auth = getAuth();
            const user = auth.currentUser;
            deleteUser(user).then(() => {
              console.alert('Successfully deleted user');
            })
            .catch((error) => {
              console.log('Error deleting user:', error);
            });
        }
      }
  };

  // Need to link this with the TTS option when sign in
  const handleToggle = () => {
    setIsOn(!isON);
  }

  return ( 
    <div className="w-3/4 h-fit bg-gray-100 flex flex-col mx-auto mt-20 mb-20 rounded-xl border-2 border-black-100 drop-shadow-md">
      <NavLink href="/Profile" className="flex items-center w-[8rem] bg-black text-white text-2xl ml-20 mt-10 px-4 py-2 rounded-lg hover:bg-white hover:text-black hover:border-2 hover:border-black">
        <TfiControlBackward className="w-1/2 h-1/2 mr-2"/>
        Back
      </NavLink>      
      <h1 className="text-3xl font-bold mx-auto mt-5 mb-6"> Account Settings</h1>
      
      <div className="mx-20">
        <label className="mt-5 mb-10 block text-2xl font-bold">
          Username:
          <input 
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-3/4 mt-2 ml-5 px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:border-blue-600 shadow-md shadow-[#455090]/20"
          />
        </label>

        <label className="mt-5 mb-10 block text-2xl font-bold">
          Email:
          <input 
              type="text"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-3/4 mt-2 ml-5 px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:border-blue-600 shadow-md shadow-[#455090]/20"
          />
        </label>

        <label className="mt-5 mb-10 block text-2xl font-bold">
          Password:
          <input 
              type="text"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-3/4 mt-2 ml-5 px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:border-blue-600 shadow-md shadow-[#455090]/20"
          />
        </label>

        <label className="mt-5 mb-10 block text-2xl font-bold">
          Grade Level:
          <input 
              type="text"
              name="gradelevel"
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="w-3/4 mt-2 ml-5 px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:border-blue-600 shadow-md shadow-[#455090]/20"
          />
        </label>

        <label className="mt-5 mb-10 block text-2xl font-bold">
          Instrument of Interest:
          <input 
              type="text"
              name="instrument"
              value={instrument}
              onChange={(e) => setInstrument(e.target.value)}
              className="w-3/4 mt-2 ml-5 px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:border-blue-600 shadow-md shadow-[#455090]/20"
          />
        </label>

        {/* Toggle button for TTS option */}
        <div className="flex items-center space-x-4 mb-8">
          <p className="text-2xl font-bold">Text-To-Speech (TTS) option:</p>
          <button
            onClick={() => setIsOn(!isOn)}
            className={`w-20 h-10 flex items-center justify-${isOn ? "end" : "start"} rounded-lg px-2 transition-colors ${
              isOn ? "bg-green-500" : "bg-red-500"
            }`}
          >
            <span className="text-white font-bold text-2xl flex-1 text-center">
              {isOn ? "ON" : "OFF"}
            </span>
          </button>
        
        </div >
        
        { /* User will get to choose 2 different font sizes? */ }
        <div className="flex items-center space-x-4 mb-10">
          <p className="text-2xl font-bold">Text Sizes: </p>
          <button 
            onClick={() => setTextSize("medium")}
            className={`p-2 m-2 font-bold text-2xl border rounded-lg hover:bg-gray-500 ${ 
              textSize === "medium" ? "bg-green-500 text-white" : "bg-white text-black"
              }`}
          >
            MEDIUM
          </button>
          <button 
            onClick={() => setTextSize("large")}
            className={`p-2 m-2 font-bold text-2xl border rounded-lg hover:bg-gray-500 ${ 
              textSize === "large" ? "bg-green-500 text-white" : "bg-white text-black"
              }`}
          >
            LARGE
          </button>
        </div>

      </div>


      <button
        onClick={handleSaveChanges} // Save all changes when clicked
        className="m-auto bg-[#455090] text-white text-2xl rounded-xl px-5 py-3 hover:bg-blue-600 mb-6"
      >
        Save Changes
      </button>


      <button
        onClick={handleDeleteAccount}
        className="m-auto mb-5 bg-red-200 text-black text-2xl rounded-xl px-4 py-2 hover:bg-red-500 border-2 border-black/50 border-dashed"
      >
        Delete Account
      </button>
    </div>
  );
};

export default Settings;
