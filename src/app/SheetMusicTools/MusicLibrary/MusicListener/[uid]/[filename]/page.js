"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { OpenSheetMusicDisplay, 
    MusicPartManager,
    Cursor,
    CursorType, 
    } from "opensheetmusicdisplay";
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
  const containerRef = useRef(null);
  const partRef = useRef(null);
  const [tempo, setTempo] = useState(null);
  //const audioPlayerRef = useRef(null);
  //const intervalRef = useRef(null);
  //const lastEndTimeRef = useRef(null);


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
        .then((text) => setXmlData(text))
        .catch(console.error);
    }
  }, [uid, filename, userId]);

    // — Instantiate OSMD once —
    useEffect(() => {
        if (containerRef.current) {
          osmdRef.current = new OpenSheetMusicDisplay(containerRef.current, {
            autoResize: true,
          });
        }
      }, []);
    
      // — Load, render, and build the Tone.Part —
      useEffect(() => {
        const osmd = osmdRef.current;
        if (!osmd || !xmlData) return;
      
        osmd
          .load(xmlData)
          .then(() => osmd.render())
          .then((async () => {
            /*// ── 1) Read or fall-back divisions & tempo ──
            let divisions = osmd.Sheet.Divisions;
            let tempo = osmd.Sheet.Tempo;
            if (divisions == null || tempo == null) {
              const xmlDoc  = new DOMParser().parseFromString(xmlData, "application/xml");
              divisions = +xmlDoc.querySelector("divisions")?.textContent || 1;
              const sound = xmlDoc.querySelector("sound[tempo]");
              tempo = sound
                ? +sound.getAttribute("tempo")
                : +xmlDoc.querySelector("per-minute")?.textContent || 40;
            }
            setTempo(tempo);
            const secPerQuarter = 60 / tempo;
*/
      
            /*// ── 2) Build the raw events array ──
            const events = [];
            osmd.Sheet.SourceMeasures.forEach((measure) => {
              const measureStartQ = measure.AbsoluteTimestamp.RealValue;
              measure.VerticalSourceStaffEntryContainers.forEach((ctr) => {
                const offsetQ = ctr.Timestamp.RealValue;
                ctr.StaffEntries.forEach((se) => {
                  se.VoiceEntries.forEach((ve) => {
                    ve.Notes.forEach((sn) => {
                      if (!sn.Pitch) return; // skip rests
                      const time     = (measureStartQ + offsetQ) * secPerQuarter;
                      const duration = sn.Length.RealValue * secPerQuarter;
                      const raw  = sn.Pitch.ToStringShortGet; // e.g. "Fn1", "F#4", "Eb3"
                      const note = raw.replace(/n(?=\d)/, ""); //replace n (natural) tone does not accept n, reads as natural if no sharp
                      events.push({ time, note, duration });
                    });
                  });
                });
              });
            });*/

    // ── 2’) Build the events array via the iterator (handles repeats & rests) ──
  /* const manager  = new MusicPartManager(osmd.Sheet);
  const iterator = manager.getIterator();
  iterator.SkipInvisibleNotes = true;

  const events = [];
  while (!iterator.EndReached) {
    iterator.moveToNext();
    const qn  = iterator.CurrentSourceTimestamp.RealValue;
    const t = (qn * 60) / tempo;

    iterator.CurrentVoiceEntries?.forEach(ve =>
      ve.Notes.forEach(sn => {
        if (!sn.Pitch) return;
        const raw  = sn.Pitch.ToStringShortGet;
        const note = raw.replace(/n(?=\d)/, "").replace("♮", "");
        const duration  = sn.Length.RealValue * (60/tempo);
        events.push({time: t, note, duration});
      })
    );
}
           // ── 3) LOG raw events ──
            console.log("Raw events:", events);
            console.table(events.map(ev => ({
              note:    ev.note,
              timeSec: ev.time.toFixed(3),
              durSec:  ev.duration.toFixed(3)
            })));
      
            // ── 4) Filter out any bad ones ──
            const cleanEvents = events.filter(ev => {
              if (typeof ev.note !== "string" || ev.note.includes("undefined")) {
                console.warn("Dropping bad note event:", ev);
                return false;
              }
              if (!Number.isFinite(ev.time) || !Number.isFinite(ev.duration) || ev.duration <= 0) {
                console.warn("Dropping bad timing event:", ev);
                return false;
              }
              return true;
            });
      
            console.log("Clean events:", cleanEvents);
      
            if (!cleanEvents.length) {
              console.error("No valid note events left after filtering!");
              return;
            }

            //const manager = new MusicPartManager(osmd.Sheet);
            
            //CURSOR
            const cursor  = new Cursor(containerRef.current, osmd, {
            type:   CursorType.ThinLeft,
            color:  "#FF8C00",
            alpha:  0.7,
            follow: true
            });

            cursor.init(manager, osmd.GraphicSheet);
            cursor.show();

            //osmd.cursor.init(manager, osmd.GraphicSheet);
           // osmd.cursor.show();
            //let lastTime = null;
            // ── 5) Schedule with Tone.js ──
            const synth = new Tone.PolySynth({ maxPolyphony: 64 }).toDestination();
            const part  = new Tone.Part((t, ev) => {
              synth.triggerAttackRelease(ev.note, ev.duration, t);
              //cursor.next();
              //osmd.cursor.next();
              //if (t !== lastTime) {
                // step to the next *pitched* entry (skipping rests)
                cursor.Iterator.moveToNextVisibleVoiceEntry(true);
                // re‐draw the cursor at that new position
                cursor.update();
                //lastTime = t;
              //}
            }, cleanEvents);
      
            partRef.current = part;
            Tone.getTransport().bpm.value = 120;
          })
          .catch(console.error);
      }, [xmlData]);*/
      // 1) Setup manager, iterator & cursor
const manager  = new MusicPartManager(osmd.Sheet);
const iterator = manager.getIterator();
// include _everything_ (rests, repeats, etc.)
iterator.SkipInvisibleNotes = false;

const cursor = new Cursor(containerRef.current, osmd, {
  type:   CursorType.ThinLeft,
  color:  "#FF8C00",
  alpha:  0.7,
  follow: true
});
cursor.init(manager, osmd.GraphicSheet);
cursor.show();
cursor.reset();

// 2) Create your synth & configure Transport
const synth     = new Tone.PolySynth({ maxPolyphony: 64 }).toDestination();
const transport = Tone.getTransport();
setTempo(60);
transport.bpm.value = tempo;

// 3) On every 16th-note, play any pitches at this slice and advance
    transport.scheduleRepeat((time) => {
  // play whatever notes are in the iterator right now
  const entries = iterator.CurrentVisibleVoiceEntries();
  for (const ve of entries) {
    for (const sn of ve.Notes) {
      if (!sn.Pitch) continue;
      const raw  = sn.Pitch.ToStringShortGet.replace(/n(?=\d)/, "").replace("♮", "");
      const dur  = sn.Length.RealValue * (60 / tempo);
      synth.triggerAttackRelease(raw, dur, time);
    }
  }

  // move the cursor *once* per tick
  //cursor.next();
  

  // now step the iterator, respecting repeats & silent bars
    iterator.moveToNext();
    cursor.update();
    }, "16n", 0);
    }))
    .catch(console.error);
    // 4) Hook up your Play/Pause/Stop as before:
   // partRef.current = null;  // we’re no longer using a Tone.Part})
return () => {getTransport.cancel(0);};
}, [xmlData]);
      
    
      // — Playback controls —
      const handlePlay = async () => {
        /*const part = partRef.current;
        if (!part) return console.warn("Player not ready yet");
        await Tone.start();    // unlock audio context
        const transport = Tone.getTransport();
        if (transport.state === "stopped") {
          part.start(0);
          transport.start();
        } else {
          transport.start();
        }*/
          await Tone.start();
          const transport = Tone.getTransport();

          transport.start();
      };
    
      //const handlePause = () => {
        /*const transport = Tone.getTransport();
        if (transport.state === "started") transport.pause();
     */
        const handlePause = () => {
            const transport = Tone.getTransport();
            transport.pause();
        };
    
      //const handleStop = () => {
      /*  partRef.current?.stop(0);
        Tone.getTransport().stop(0);
      */
        const handleStop  = () => {
            const transport = Tone.getTransport();
            transport.stop();
        };
     
  return (
    <div>
      <Link href="/SheetMusicTools/MusicLibrary" className="flex w-fit items-center bg-black text-white text-body ml-20 mt-10 px-4 py-2 rounded-lg hover:bg-white hover:text-black hover:border-2 hover:border-black">
        <TfiControlBackward className="w-1/4 h-1/4 mr-2 flex-shrink-0" /> 
        Back 
      </Link>

      <div className="text-body ml-6 inline-flex gap-4 text-center px-8 py-4 ">
      <h3 className="inline flex gap-4 text-center"> <GiMusicalNotes /> Listening to: {filename} <GiMusicalNotes /></h3>
      </div>
      <div
        ref={containerRef}
        id="osmdContainer"
        style={{
          position: "relative",
          width: "100%",
          height: "80vh",
          overflow: "auto",
          border: "1px solid #ccc",
          padding: "1rem",
          marginTop: "1rem",
        }}
      />

      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
          fontSize: "1.25rem",
        }}
      >
        <button style={{ padding: "0.5rem 1rem" }} onClick={handlePlay}>▶ Play</button>
        <button style={{ padding: "0.5rem 1rem" }} onClick={handlePause}>⏸ Pause</button>
        <button style={{ padding: "0.5rem 1rem" }} onClick={handleStop}>⏹ Stop/Reset</button>
        </div>
    </div>
  );
}
