"use client";
import React, { useState, useEffect } from "react";
import { db } from "@/firebaseConfig"; 
import { auth } from "@/firebaseConfig";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth"; // checks if user is logged in (to determine if they can post or nahhh :P)
import { doc, getDoc } from "firebase/firestore";
import Popup from "../component/Popup";



export default function Community() {
    const [postContent, setPostContent] = useState("");
    const [posts, setPosts] = useState([]); // Store post
    const [user, setUser] = useState(null); // log user that posted
    const [username, setUsername] = useState("Anonymous");
    const [ButtonPopup, setButtonPopup] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const userRef = doc(db, "users", currentUser.uid); // Reference Firestore users collection
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    setUsername(userSnap.data().username); // FOrgot to change from name to username
                } else {
                    setUsername("Anonymous"); // if somehow one of these fools bypasses login, prints anonymous
                }
            }
        });
        return () => unsubscribe();
    }, []);
    

    const handleChange = (event) => {
        setPostContent(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (!user) {
            console.error("User is not logged in");
            return; // this stops ppl from posting if they arent logged into NoTreble
        }
    
        if (postContent.trim() === "") return; // Prevents empty forum listings
    
        try {
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);
            let username = "Anonymous";
            let profilePic = "/defaultprofile.png"; // Default profile pic

            if (userSnap.exists()) {
                username = userSnap.data().username;
                profilePic = userSnap.data().profilePic || "/defaultprofile.png"; // gets the profile pic
            }

            if (userSnap.exists()) {
                username = userSnap.data().username;
            }

            else if (username == null){ 
                console.error("hm");
            }
    
            await addDoc(collection(db, "forumPosts"), {
                content: postContent,
                userID: user.uid,
                username: username,
                profilePic: profilePic,
                timestamp: serverTimestamp(),
            });            
    
            setPostContent("");
            fetchPosts(); // Refresh
        } catch (error) {
            console.error("Error adding post:", error);
        }
    };
    
    const fetchPosts = async () => {
        const querySnapshot = await getDocs(collection(db, "forumPosts"));
        const postsArray = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setPosts(postsArray);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <main>
            <h1 className="text-center font-bold text-5xl mt-40 mb-10">Community Posts</h1>
            <div className="container mx-auto bg-gray-200 -z-10 rounded-2xl text-2xl p-8">
                {/* Post Input */}
                <div className="w-auto mx-auto bg-[#455090] -z-10 rounded-2xl text-2xl p-8">
                    <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <input
                                type="text"
                                name="post"
                                value={postContent}
                                onChange={handleChange}
                                placeholder="Let's share what's going on..."
                                className="flex-1 px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:border-blue-600"
                                />
                            <button
                                onClick={handleSubmit}
                                className="ml-10 w-auto bg-gray-800 text-white rounded-lg px-4 py-2"
                            >
                                Create Post
                            </button>
                        </>
                    ) : (
                        <p className="text-center text-lg text-gray-600">You must be logged in to post.</p>
                    )}
                    </div>
                </div>

                {/* Display Posts */}
                <p className="mt-10 mb-10">See more</p>
                <div className="mx-auto bg-[#455090] -z-10 rounded-2xl text-2xl p-8">
                    {posts.map((post) => (
                        <div key={post.id} className="bg-white p-4 my-4 rounded-lg shadow-md">
                                <img
                                     src={post.profilePic || "/defaultprofile.png"}
                                        alt="Profile"
                                        className="w-10 h-10 rounded-full mr-4"
                                />
                            <p className="font-bold text-[20px] mb-4">{ "@"+ post.username || "Anonymous"}</p>
                            <p>{post.content}</p>
                            <p className="text-sm text-gray-600">
                                {post.timestamp?.seconds
                                    ? new Date(post.timestamp.seconds * 1000).toLocaleString()
                                    : "No timestamp"}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
