"use client";

import React, { useState } from "react";
import {
  getAuth,
  deleteUser,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
} from "firebase/auth";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";

const Settings = () => {
  const [newDisplayName, setNewDisplayName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleChangeDisplayName = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert("No user is currently logged in.");
      return;
    }
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { username: newDisplayName });
      alert("Display name updated successfully!");
    } catch (error) {
      alert(`Error updating display name: ${error.message}`);
    }
  };

  const handleChangePassword = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert("No user logged in");
      return;
    }
    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      alert("Password updated successfully!");
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  
  const handleSendPasswordResetEmail = async () => {
    try {
      await sendPasswordResetEmail(getAuth(), resetEmail);
      setMessage("Password reset email sent! Check your inbox.");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This cannot be undone."
      )
    ) {
      const auth = getAuth();
      const user = auth.currentUser;
      deleteUser(user)
        .then(() => {
          alert("Successfully deleted user");
        })
        .catch((error) => {
          console.log("Error deleting user:", error);
        });
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="bg-white rounded-2xl shadow p-6 space-y-6">
        <button
          onClick={() => document.getElementById("name-dialogue").showModal()}
          className="bg-blue-500 text-white rounded-xl px-4 py-2 hover:bg-blue-600 w-full"
        >
          Change Display Name
        </button>
        <dialog id="name-dialogue" className="p-6 rounded-2xl">
          <h2 className="text-xl mb-4 font-bold">Change Display Name</h2>
          <input
            type="text"
            placeholder="New display name"
            value={newDisplayName}
            onChange={(e) => setNewDisplayName(e.target.value)}
            className="border p-2 rounded-xl w-full mb-3"
          />
          <button
            onClick={handleChangeDisplayName}
            className="bg-blue-500 text-white rounded-xl px-4 py-2 hover:bg-blue-600 w-full"
          >
            Update Display Name
          </button>
          <button
            onClick={() => document.getElementById("name-dialogue").close()}
            className="text-blue-500 mt-3 w-full"
          >
            Close
          </button>
        </dialog>

        <button
          onClick={() =>
            document.getElementById("password-dialogue").showModal()
          }
          className="bg-blue-500 text-white rounded-xl px-4 py-2 hover:bg-blue-600 w-full"
        >
          Change Password
        </button>
        <dialog id="password-dialogue" className="p-6 rounded-2xl">
          <h2 className="text-xl mb-4 font-bold">Change Password</h2>
          <input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="border p-2 rounded-xl w-full mb-3"
          />
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border p-2 rounded-xl w-full mb-3"
          />
          <button
            onClick={handleChangePassword}
            className="bg-blue-500 text-white rounded-xl px-4 py-2 hover:bg-blue-600 w-full"
          >
            Confirm Password Change
          </button>
          <button
            onClick={() =>
              document.getElementById("password-dialogue").close()
            }
            className="text-blue-500 mt-3 w-full"
          >
            Close
          </button>
        </dialog>

        <button
          onClick={() => document.getElementById("reset-dialogue").showModal()}
          className="bg-blue-500 text-white rounded-xl px-4 py-2 hover:bg-blue-600 w-full"
        >
          Send Password Reset Email
        </button>
        <dialog id="reset-dialogue" className="p-6 rounded-2xl">
          <h2 className="text-xl mb-4 font-bold">Reset Password via Email</h2>
          <input
            type="email"
            placeholder="Enter your email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            className="border p-2 rounded-xl w-full mb-3"
          />
          <button
            onClick={handleSendPasswordResetEmail}
            className="bg-blue-500 text-white rounded-xl px-4 py-2 hover:bg-blue-600 w-full"
          >
            Send Reset Email
          </button>
          {message && <p className="text-gray-600 mt-2">{message}</p>}
          <button
            onClick={() => document.getElementById("reset-dialogue").close()}
            className="text-blue-500 mt-3 w-full"
          >
            Close
          </button>
        </dialog>

        <button
          onClick={handleDeleteAccount}
          className="bg-red-500 text-white rounded-xl px-4 py-2 hover:bg-red-600 w-full"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Settings;
