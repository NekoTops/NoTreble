"use client"
import React from "react";
import NavLink from "./NavLink";
import Image from "next/image";
import "../cs/NavBar.css"
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getUserProfile } from "@/lib/firebase/auth";
import { auth } from "../../firebaseConfig";

function NavBar() {
  const [target, setTarget] = useState("/Login");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setTarget("/Login");
        return;
      }
      try {
        const profileData = await getUserProfile(currentUser.uid);
        setUser({
          ...profileData,
          profilePic: profileData.profilePic || "/defaultprofile.png",
        });
        setTarget("/Profile");
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);
  
  return (<nav className="nav-bar">
    <div className=" overdiv flex flex-row  items-center ">
      <Image aria-hidden src="/logo.png" alt="No Treble icon" width={80} height={80}  className="self-center navLogo"/>
      <ul className="nav-list flex flex-end">
        <li>
          <NavLink href="/" activeClassName="bubble" nonActiveClassName="">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink href="/Lessons" activeClassName="bubble" nonActiveClassName="">
          Lessons
          </NavLink>
        </li>
        <li>
          <NavLink href="/SheetMusicTools" activeClassName="bubble" nonActiveClassName="">
          Sheet Music Tools
          </NavLink>
        </li>
        <li>
          <NavLink href="/Community" activeClassName="bubble" nonActiveClassName="">
          Community
          </NavLink>
        </li>
      </ul>
      
      <div className="profile-div self-center">
      <NavLink href={target} className={target === "/Login" ? "btn-primary self-center": ""} activeClassName={""} nonActiveClassName={""}>
          {target === "/Login" ?  "Log in":  <img
            src={user.profilePic}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto mb-4"
            onError={(e) => (e.target.src = "/defaultprofile.png")}
          />}
      </NavLink>
        
      </div>
    </div>
  </nav>);
}


export default NavBar;
