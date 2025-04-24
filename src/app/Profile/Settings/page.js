"use client";

import { useEffect, useState } from "react";
import { auth } from "@/firebaseConfig";
import { getUserProfile, updateUserProfile } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, updateEmail, updatePassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { TfiControlBackward } from "react-icons/tfi";
import NavLink from "../../component/NavLink";
import { useTTS } from "../../context/TTSContext"; // Import TTS functions

const Settings = () => {
  const router = useRouter();
  const db = getFirestore();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newUsername, setUsername] = useState("");
  const [newEmail, setEmail] = useState("");
  const [newPassword, setPassword] = useState("");
  const [newTextSize, setTextSize] = useState("medium");
  const [newTTS, setTTS] = useState(false);
  const { clickTTS, setClickTTS } = useTTS(); // Use the TTS context



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
        setTTS(profileData.clickTTS || true); //set initial TTS 

        // Fetch the text size setting to work with global CSS
        const storedTextSize = profileData.textSize || "medium";
        setTextSize(storedTextSize);
        document.body.classList.toggle("large-text-size", storedTextSize === "large");
        document.body.classList.toggle("medium-text-size", storedTextSize === "medium");
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
      // Update username, email, TTS and textsize in Firebase
      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(userRef, { username: newUsername, email: newEmail, textSize: newTextSize, clickTTS: newTTS }, { merge: true });

      // Update email if it's changed
      if (newEmail !== user.email) {
        await updateEmail(currentUser, newEmail);
      }
  
      // Update password if it's changed (Need to redo this part to match Sarah's implementation)
      if (newPassword) {
        await updatePassword(currentUser, password);
      }
  
      // Reflect changes in the UI
      setUser((prevUser) => ({ ...prevUser, username: newUsername, email: newEmail, textSize: newTextSize, TTS: newTTS }));
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

  const handleToggle = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser || clickTTS === null) return;  // Ensure user is loaded and newTTS is not null
  
    const toggledTTS = !clickTTS;  // Toggle the current value
  
    try {
      // Update TTS setting in Firestore
      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(userRef, { clickTTS: toggledTTS }, { merge: true });
  
      console.log(`TTS set to ${toggledTTS ? "ON" : "OFF"}`);
      setClickTTS(toggledTTS);  // Update local state for TTS
    } catch (error) {
      console.error("Error updating TTS setting:", error);
    }
  };
  
    // Handle changing text size (medium or large)
    const handleTextSizeChange = (newTextSize) => {
      // Toggle the text size classes on the body
      document.body.classList.toggle("large-text-size", newTextSize === "large");
      document.body.classList.toggle("medium-text-size", newTextSize === "medium");
    
      // Update the local state
      setTextSize(newTextSize);
    };
    

  return ( 
    <div className="w-3/4 h-fit bg-gray-100 flex flex-col mx-auto mt-20 mb-20 rounded-xl border-2 border-black-100 drop-shadow-md">
      <NavLink href="/Profile" className="flex w-fit items-center bg-black text-white text-body ml-20 mt-10 px-4 py-2 rounded-lg hover:bg-white hover:text-black hover:border-2 hover:border-black">
        <TfiControlBackward className="w-1/4 h-1/4 mr-2 flex-shrink-0"/>
        Back
      </NavLink>      
      <h1 className="text-h2 font-bold mx-auto mt-5 mb-6"> Account Settings</h1>
      
      <div className="mx-20">
        <label className="mt-5 mb-10 block text-body font-bold">
          Username:
          <input 
              type="text"
              name="username"
              value={newUsername}
              onChange={(e) => setUsername(e.target.value)}
              className="w-3/4 mt-2 ml-5 px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:border-blue-600 shadow-md shadow-[#455090]/20"
          />
        </label>

        <label className="mt-5 mb-10 block text-body font-bold">
          Email:
          <input 
              type="text"
              name="email"
              value={newEmail}
              onChange={(e) => setEmail(e.target.value)}
              className="w-3/4 mt-2 ml-5 px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:border-blue-600 shadow-md shadow-[#455090]/20"
          />
        </label>

        <label className="mt-5 mb-10 block text-body font-bold">
          Password:
            <button className="ml-4 italic text-blue-900 underline underline-offset-4">Reset your password</button>
        </label>

        <div className="flex items-center space-x-4 mb-8">
          <p className="text-body font-bold">Activate Text-To-Speech Using Click:</p>
          {user && (
            <button
              onClick={handleToggle}
              className={`p-2 m-2 flex items-center justify-${clickTTS ? "end" : "start"} rounded-lg px-2 transition-colors ${
                clickTTS ? "bg-green-500" : "bg-red-500"
              }`}
            >
              <span className="text-white font-bold text-body flex-1 text-center uppercase">
                {clickTTS ? "on" : "off"} 
              </span>
            </button>
          )}
        </div>
        
        { /* User will get to choose 2 different font sizes? */ }
        <div className="flex items-center space-x-4 mb-10">
          <p className="text-body font-bold">Text Sizes: </p>
          <button 
            onClick={() => handleTextSizeChange("medium")}
            className={`uppercase p-2 m-2 font-bold text-body border rounded-lg hover:bg-gray-500 ${newTextSize === "medium" ? "bg-green-500 text-white" : "bg-white text-black"}`}
          >
            medium
          </button>
          <button 
            onClick={() => handleTextSizeChange("large")}
            className={`uppercase p-2 m-2 font-bold text-body border rounded-lg hover:bg-gray-500 ${newTextSize === "large" ? "bg-green-500 text-white" : "bg-white text-black"}`}
          >
            large
          </button>
        </div>

      </div>


      {/* <button
        onClick={handleSaveChanges} // Save all changes when clicked
        className="m-auto bg-[#455090] text-white text-body rounded-xl px-5 py-3 hover:bg-blue-600 mb-6"
      >
        Save Changes
      </button> */}


      <button
        onClick={handleDeleteAccount}
        className="m-auto mb-5 bg-red-200 text-black text-body rounded-xl px-4 py-2 hover:bg-red-500 border-2 border-black/50 border-dashed"
      >
        Delete Account
      </button>
    </div>
  );
};

export default Settings;
