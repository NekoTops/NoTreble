"use client";
import { useEffect, useState } from "react";
import { auth } from "@/firebaseConfig";
import { getUserProfile } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { signOut, onAuthStateChanged, updateEmail } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import NavLink from "../component/NavLink";

const Profile = () => {
  const [user, setUser] = useState(null); // State to hold the user data
  const [loading, setLoading] = useState(true); // State for loading status
  const [image, setImage] = useState(null); // State for profile image
  const [uploading, setUploading] = useState(false); // State for upload progress
  const [newUsername, setNewUsername] = useState(""); // State for updating username
  const [newEmail, setNewEmail] = useState(""); // State for updating email
  const router = useRouter(); // Router hook for navigation
  const db = getFirestore(); // Firestore instance for database operations
  
  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        // Redirect to login if no user is authenticated
        router.push("/Login");
        return;
      }
      try {
        // Fetch user profile data from Firestore
        const profileData = await getUserProfile(currentUser.uid);
        setUser({
          ...profileData,
          profilePic: profileData.profilePic || "/defaultprofile.png", // Default profile picture if none exists
        });
        // Set initial values for username and email
        setNewUsername(profileData.username || "");
        setNewEmail(profileData.email || "");
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    });
    
    return () => unsubscribe(); // Cleanup the subscription on unmount
  }, [router]);

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      router.push("/Login"); // Redirect to login page
    } catch (error) {
      console.error("Error signing out:", error); // Log any errors
    }
  };

  // Function to handle profile image selection
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file); // Convert image to Data URL
      reader.onload = () => {
        setImage(reader.result); // Set the selected image as state
      };
    }
  };

  // Function to handle profile image upload to Firestore
  const handleUpload = async () => {
    if (!image) {
      console.log("No image selected"); // Log if no image is selected
      return;
    }
    setUploading(true); // Set uploading state to true
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;
      const userRef = doc(db, "users", currentUser.uid);
      // Update the profile picture in Firestore
      await setDoc(userRef, { profilePic: image }, { merge: true });
      setUser((prevUser) => ({ ...prevUser, profilePic: image })); // Update local state with the new profile picture
    } catch (error) {
      console.error("Error uploading profile picture:", error); // Log any errors
    } finally {
      setUploading(false); // Set uploading state to false
    }
  };

  // Function to handle saving changes to username and email
  const handleSaveChanges = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      // Update username and email in Firestore
      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(userRef, { username: newUsername, email: newEmail }, { merge: true });

      // If email is changed, update it in Firebase Auth as well
      if (newEmail !== user.email) {
        await updateEmail(currentUser, newEmail); // Update email in Firebase Auth
      }

      setUser((prevUser) => ({ ...prevUser, username: newUsername, email: newEmail })); // Update local user state
      alert("Changes saved successfully!"); // Success message
    } catch (error) {
      console.error("Error saving changes:", error); // Log any errors
      alert("Error saving changes."); // Error message
    }
  };

  // Show loading message while fetching user data
  if (loading) return <p>Loading...</p>;

  return (
    <span>
      {user ? (
        <div className="w-3/4 min-h-screen bg-gray-100 flex flex-wrap items-center justify-center mx-auto my-20 rounded-xl border-2 border-black-100 drop-shadow-md">
          {/* Profile Image Section */}
          <div className="w-3/4 md:w-1/2 flex flex-col items-center my-auto">
            <img
              src={user.profilePic}
              alt="Profile"
              className="w-[200px] h-[200px] sm:w-[200px] sm:h-[200px] md:w-[300px] md:h-[300px] lg:w-[400px] lg:h-[400px] max-w-[500px] max-h-[500px] rounded-full border-4 border-black object-cover"
              onError={(e) => (e.target.src = "/defaultprofile.png")} // Fallback image if error loading
            />
            <div className="flex flex-wrap items-center mt-10 gap-2">
              <label className="cursor-pointer text-custom bg-white text-black px-4 py-2 rounded-md hover:bg-gray-500 border-2 border-dashed border-black">
                Choose Image
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
              <button
                onClick={handleUpload}
                disabled={uploading || !image}
                className="ml-auto text-custom px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>

          {/* Profile Details and Edit Section */}
          <div className="w-full md:w-1/2 flex flex-col items-start my-auto px-10">
            <p className="text-h3 text-black mb-3"><strong>Username:</strong></p>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)} // Handle username change
              className="text-body w-full px-6 py-2 border-2 border-gray-400 rounded-md mb-6"
            />
            <p className="text-h3 text-black mb-3"><strong>Email:</strong></p>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)} // Handle email change
              className="text-body w-full px-6 py-2 border-2 border-gray-400 rounded-md mb-6"
            />
            
            <div className="flex flex-col md:flex-row justify-between mt-8 w-full">
              <button
                onClick={handleSaveChanges} // Save changes on click
                className="bg-[#455090] text-white font-semibold text-body rounded-xl px-5 py-2 mb-6 md:mb-0 w-full md:w-auto hover:bg-blue-600" // Ensure full width on small screens, auto width on larger ones
              >
                Save Changes
              </button>
              
              <button
                onClick={handleLogout} // Handle logout
                className="text-body px-5 py-2 bg-red-500 text-white rounded-xl font-semibold shadow-md hover:bg-red-600 w-full md:w-auto text-center" // Ensure full width on small screens, auto width on larger ones
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p>No user data found.</p> // If no user data exists
      )}
    </span>
  );
};

export default Profile;
