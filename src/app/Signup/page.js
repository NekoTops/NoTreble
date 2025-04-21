"use client";
import React, { useState } from "react";
import Link from "next/link";
import { signUp } from "../../lib/firebase/auth";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { db } from "../../firebaseConfig"; 
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [TTS, setTTS] = useState(false);
    const router = useRouter();
  
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      const trimmedEmail = email.trim();
      const trimmedName = name.trim();
      const defaultProfilePath = "/defaultprofile.png"; // Default image
  
      if (!trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
        setError("Invalid email format.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
  
      try {
        await signUp(trimmedEmail, password, trimmedName, defaultProfilePath, TTS);
        console.log("User signed up and profile saved!");
        router.push("/");
      } catch (error) {
        setError(error.message);
        console.error("Sign Up Error:", error.message);
      }
    
      };
    

return (
    <div className=' flex flex-col items-center justify center min-h-screen bg-gray-100 p-6'>
         <form onSubmit={handleSubmit} className="bg-white p-20 rounded-lg shadow-lg w-full max-w-2xl text-2xl "> 
            <div className="mb-6"> 
            <h1 className = "text-5xl font-bold text-center mb-6">Sign Up</h1>
                <label className="block text-gray-800 font-semibold mb-2">Name: </label> 
                <input 
                type='name' 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full p-1 border border-gray-500 rounded "
                required
                />
                </div>
                <div>
                <label className="block text-gray-800 font-semibold mb-2">Email: </label> 
                <input 
                type='email' 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-1 border border-gray-500 rounded "
                required
                />
                 </div>
                  <div> 
                    <label className="block text-gray-800 font-semibold mb-2">Password:</label> 
                    <input 
                    type='password' 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="w-full p-1 border border-gray-500 rounded"
                    required/> 
                    </div> 
                    <div>
                    <label className="block text-gray-800 font-semibold mb-2">Confirm Password: </label> 
                <input 
                type='password' 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-1 border border-gray-500 rounded "/>
                    </div>
                    <div>
                        <label>
                        <input 
                        type="checkbox"
                        style={{ width: "20px", height: "20px"}}
                        checked={TTS}
                        onChange={(e) => setTTS(e.target.checked)}
                        />
                        {"    "} Automatically turn on TTS
                        </label>
                    </div>

                    {error && <p className="text-red-500 text-lg font-semibold mb-4">{error}</p>}

                    <button 
                    type="submit" className="mt-6 w-full bg-[#455090] text-white py-4 rounded-lg hover:bg-[#102437] mt-6 text-2xl font-bold"
                    >Sign Up
                    </button> 
                    </form> 
                    <p className="text-center mb-6 text-xl" >
                        Already have an account? 
                        <Link href="/Login" className="test-blue-600 font-semibold hover:underline">
                        {" "} Login
                        </Link>
                        </p> 
                    </div>
        ); 
    }; 

    export default SignUp; 
