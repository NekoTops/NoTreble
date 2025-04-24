"use client"
import React from "react";
import NavLink from "./NavLink";
import Image from "next/image";
import "../cs/NavBar.css"
import { useEffect, useState, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getUserProfile } from "@/lib/firebase/auth";
import { auth } from "@/firebaseConfig";
import { usePathname } from "next/navigation";

function NavBar() {
  const [target, setTarget] = useState("/Login");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState("/");
  const navRef = useRef(null);
  const [selectorStyle, setSelectorStyle] = useState({ left: 0, width: 0 });
  const pathname = usePathname();
  const handleHover = (e) => {
  const rect = e.target.getBoundingClientRect();
  const containerRect = navRef.current.getBoundingClientRect();
  setSelectorStyle({
    left: rect.left - containerRect.left,
    width: rect.width,
  });
  };

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
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      const currentItem = document.querySelector(`a[href="${pathname}"]`);
      if (currentItem && navRef.current) {
        const rect = currentItem.getBoundingClientRect();
        const containerRect = navRef.current.getBoundingClientRect();
        setSelectorStyle({
          left: rect.left - containerRect.left,
          width: rect.width,
        });
      }
    }, 50);
  
    return () => clearTimeout(timeout);
  }, [pathname]);
  

  return (<nav className="nav-bar">
    <div className="overdiv flex flex-row items-center justify-between w-full px-4">
      <Image aria-hidden src="/logo.png" alt="No Treble icon" width={80} height={80}  className="self-center navLogo"/>
      <ul className="nav-list flex flex-row relative flex-shrink space-x-6" ref={navRef}>
    {/* Animated hover thingy */}
    <div
    className="nav-selector"
    style={{
      left: `${selectorStyle.left}px`,
      width: `${selectorStyle.width}px`,
    }}
    />

{[
  { href: "/", label: "Home" },
  { href: "/Lessons", label: "Lessons" },
  { href: "/QuickReference", label: "Quick Reference" },
  { href: "/SheetMusicTools", label: "Sheet Music Tools" },
  { href: "/Community", label: "Community" },
].map((item) => (
  <li key={item.href} onMouseEnter={(e) => handleHover(e)}>
    <NavLink href={item.href} activeClassName="bubble" nonActiveClassName="">
      {item.label}
    </NavLink>
  </li>
))}
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
