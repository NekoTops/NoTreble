"use client"
import Image from "next/image";
import NavLink from "./component/NavLink";
import { useEffect, useState } from "react";
import {onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";//import { useUser, loading, logout } from '../../lib/firebase/auth.js'

export default function Home() {
  const [target, setTarget] = useState("/Login");
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (!currentUser) {
          setTarget("/Login");
          return;
        }
        try {
          setTarget("/Profile");
        } catch (error) {
          console.error("Error fetching user profile:", error);
        } finally {
          setLoading(false);
        }
      });
      return () => unsubscribe();
    }, []);
  return (
    <>
    <div className=" grid grid-rows-[20px_1fr_20px] items-center justify-items-center  p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="welcome-div flex-col gap-4 items-center justify-items-center  sm:flex-row">
          <h2>Learn Music <span>with No Treble</span></h2>
          <p className="wd-50">
            No Treble provides an accessible learning environment for blind/visually impaired people to learn music theory and access sheet music reading and writing tools.
          </p>
        </div>
        {target === "/Login" ? <NavLink href="/Signup" className="btn-primary welcome-signup" activeClassName="" nonActiveClassName="">Sign up</NavLink> : ""}
      </main>
    </div>
    <div className="features-div flex-cols items-center justify-items-center">
            <h2>Features</h2>
          <ul className="features flex gap-4">
            <li className="features-list">
            <div>
              <h3>Lessons</h3>
              <p>
                Learn music theory concepts in an easy way. From tempo and time signature to dynamics, we’ll teach you all the skills and vocabulary you need to read sheet music. Use the log-in feature to save your progress.
              </p>
            </div>
            </li>
            <li className="features-list">
            <div>
              <h3>Sheet Music Reader</h3>
              <p>
              Scan and upload a picture of your sheet music, and we’ll format it to be read aloud. We’ll tell you the key, time signature, and any other sheet music notation in the piece. Save your scanned music with the log-in feature.
              </p>
            </div>
            </li>
            <li className="features-list">
              <div>
                <h3><span>Sheet Music Composer</span></h3>
                <p>
                Write and edit your own compositions with this feature. You’ll be able to edit your sheet music markings in an easy and accessible way and play it back to perfect your piece.
                </p>
              </div>
            </li>
          </ul>
    </div>
    <footer className="home-footer flex gap-16 items-center justify-center">
        <h2 className=" self-center p2">Brought to you by Bryte </h2>
      </footer>
  </>
  );
}
