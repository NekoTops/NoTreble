"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login, sendResetEmail } from "../../lib/firebase/auth"; // Assuming sendResetEmail is already in your auth file

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const user = await login(email, password);
      console.log("User logged in:", user);
      router.push("/");
      
      setEmail("");
      setPassword("");
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  //Reset password via email
  const handleForgotPassword = async () => {
    try {
      const result = await sendResetEmail(resetEmail);
      alert(result.message);
      if (result.success) setMessage("Password reset email sent! Check your inbox.");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6'>
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-lg shadow-lg w-full max-w-2xl text-2xl">
        <div className="mb-6">
          <h1 className="text-5xl font-bold text-center mb-6">Login</h1>
          <label className="block text-gray-800 font-semibold mb-2">Email: </label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-1 border border-gray-500 rounded"
          />
        </div>
        <div>
          <label className="block text-gray-800 font-semibold mb-2">Password:</label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-1 border border-gray-500 rounded"
          />
        </div>
        <button
          type="submit"
          className="mt-6 w-full bg-[#455090] text-white py-4 rounded-lg hover:bg-[#102437] text-2xl font-bold"
        >
          Login
        </button>
      </form>
      <p className="text-center mb-6 text-xl">
        Don't have an account?{" "}
        <Link href="/Signup" className="text-blue-600 font-semibold hover:underline">
          Create an account
        </Link>
      </p>

      {/* Forgot Password Button */}
      <button
        onClick={() => document.getElementById("forgot-password-dialogue").showModal()}
        className="text-blue-600 mt-4 font-semibold hover:underline"
      >
        Forgot Password?
      </button>

      {/* Forgot Password Dialog */}
      <dialog id="forgot-password-dialogue" className="p-6 rounded-2xl">
        <h2 className="text-xl mb-4 font-bold">Reset Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={resetEmail}
          onChange={(e) => setResetEmail(e.target.value)}
          className="border p-2 rounded-xl w-full mb-3"
        />
        <button
          onClick={handleForgotPassword}
          className="bg-blue-500 text-white rounded-xl px-4 py-2 hover:bg-blue-600 w-full"
        >
          Send Reset Email
        </button>
        {message && <p className="text-gray-600 mt-2">{message}</p>}
        <button
          onClick={() => document.getElementById("forgot-password-dialogue").close()}
          className="text-blue-500 mt-3 w-full"
        >
          Close
        </button>
      </dialog>
    </div>
  );
};

export default Login;
