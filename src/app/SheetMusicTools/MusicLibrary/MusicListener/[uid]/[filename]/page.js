"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import AudioPlayer from "osmd-audio-player";
import * as Tone from "tone";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { TfiControlBackward } from "react-icons/tfi";
import { GiMusicalNotes } from "react-icons/gi";

export default function MusicPlayer({ params }) {
  const router = useRouter();
  const { uid, filename } = use(params);
  const [xmlData, setXmlData] = useState("");
  const [userId, setUserId] = useState("");
  const osmdRef = useRef(null);
  const osmdContainerRef = useRef(null);
  const audioPlayerRef = useRef(null);
  const intervalRef = useRef(null);
  const lastEndTimeRef = useRef(null);


  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/Login");
      else setUserId(user.uid);
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    if (uid && filename && userId) {
      fetch(`/api/getxml/${uid}/${filename}`)
        .then((res) => res.text())
        .then(setXmlData)
        .catch(console.error);
    }
  }, [uid, filename, userId]);

  useEffect(() => {
    if (xmlData && osmdContainerRef.current) {
      const osmd = new OpenSheetMusicDisplay(osmdContainerRef.current, {
        autoResize: true,
        drawTitle: true,
        pageFormat: "A4_P",
        drawPartNames: true,
      });

      osmd.load(xmlData).then(() => {
        osmd.render();
        requestAnimationFrame(() => {
            const svg = osmdContainerRef.current?.querySelector("svg");
            if (!svg) return;
          
            const textGroups = svg.querySelectorAll("g.vf-text > text");
            //const cleanTitle = "New Title";
          
            textGroups.forEach((textNode) => {
                const text = textNode.textContent?.trim();
                if (/untitled score/i.test(text)) {
                  const cleanTitle = filename.replace(/_/g, " ").replace(/\.(mxl|xml)$/i, "");
                  textNode.textContent = cleanTitle;
                }
              });
              
          });          

        osmdRef.current = osmd;

        const audioPlayer = new AudioPlayer();
        audioPlayer.loadScore(osmd).then(() => {
          audioPlayerRef.current = audioPlayer;
          audioPlayer.synth?.playbackControl?.setTempo(multiplier);
          lastEndTimeRef.current = audioPlayer.synth?.playbackControl?.duration ?? 0;
          console.log("AudioPlayer ready");
        });
      });
    }
  }, [xmlData]);

  const playScore = async () => {
    const player = audioPlayerRef.current;
    if (!player) return;
    if (player.isPlaying) return;

    if (Tone.Transport.seconds >= lastEndTimeRef.current) {
        player.synth?.playbackControl?.seekToTime(0)
    }

    await Tone.start();
    await player.play();

    intervalRef.current = setInterval(() => {
      const current = Tone.Transport.seconds;
      const total = lastEndTimeRef.current;
      if (total > 0) {
        setProgress(Math.min((current / total) * 100, 100));
      }
    }, 100);
  };

  const pausePlayback = () => {
    const player = audioPlayerRef.current;
    if (!player) return;
    player.pause();
    clearInterval(intervalRef.current);
  };

  const stopPlayback = () => {
    const player = audioPlayerRef.current;
    if (!player) return;
    player.stop();
    clearInterval(intervalRef.current);
  };
     

  return (
    <div
    className="text-center"
    >
      <Link href="/SheetMusicTools/MusicLibrary" className="flex w-fit items-center bg-black text-white text-body ml-20 mt-10 px-4 py-2 rounded-lg hover:bg-white hover:text-black hover:border-2 hover:border-black">
        <TfiControlBackward className="w-1/4 h-1/4 mr-2 flex-shrink-0" /> 
        Back 
      </Link>

      <div className="text-body ml-6 inline-flex gap-4 text-center  px-8 py-4 ">
      <h3 className="inline flex gap-4 text-center "> <GiMusicalNotes /> Listening to: {filename} <GiMusicalNotes /></h3>
      </div>
      <div
        ref={osmdContainerRef}
        id="osmdContainer"
        style={{
          position: "relative",
          aspectRatio: "10.5/12",
          width: "auto",
          height: "1024px",
          justifySelf: "center",
          overflowX: "clip",
          overflowY: "scroll",
          border: "1px solid #ccc",
          padding: "10px",
          // paddingRight:"1rem",
          marginTop: "1rem",
          scrollbarWidth:"none",
          
        }}
      />

      <div
        style={{
          position:"fixed",
          bottom:"50%",
          left:"35%",
          marginTop: "1rem",
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
          fontSize: "var(--body-text-size)",
          width:"30%",
          minWidth:"fit-content",
          height:"7%",
          textWrap:"nowrap",
          bottom:"0px",
          borderRadius: "40px 40px",
          backgroundColor: "#455090",
          paddingInline: "30px",
          paddingBlock: "10px",
          fontWeight: "var(--font-weight-semibold)",
          boxShadow: "#102437",
          color: "#ededed",
        }}
      >
        <button style={{ padding: "0.5rem 1rem" }} onClick={playScore}>▶ Play</button>
        <button style={{ padding: "0.5rem 1rem" }} onClick={pausePlayback}>⏸ Pause</button>
        <button style={{ padding: "0.5rem 1rem" }} onClick={stopPlayback}>⏹ Stop/Reset</button>
        </div>
    </div>
  );
}
