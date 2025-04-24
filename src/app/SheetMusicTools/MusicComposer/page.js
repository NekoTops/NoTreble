"use client";

import Soundfont from "soundfont-player";
import React, { useEffect, useRef, useState } from "react";
import {
  Renderer,
  Stave,
  StaveNote,
  Voice,
  Formatter,
  Accidental,
  Annotation
} from "vexflow";

export default function ComposerPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const noteBoxRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const playbackRef = useRef({ stop: () => {}, pause: () => {} });
  const containerRef = useRef(null);
  const [selectedInstrument, setSelectedInstrument] = useState("acoustic_grand_piano");
  const [notes, setNotes] = useState([]);
  const [selectedPitch, setSelectedPitch] = useState("C4");
  const [duration, setDuration] = useState("q");
  const [accidental, setAccidental] = useState("");
  const [isRest, setIsRest] = useState(false);
  const [title, setTitle] = useState("Untitled");
  const [composer, setComposer] = useState("Anonymous");
  const [keySignature, setKeySignature] = useState("C");
  const [timeSignature, setTimeSignature] = useState("4/4");
  const [bpm, setBpm] = useState(120);
  const [chordMode, setChordMode] = useState(false);
  const [chordType, setChordType] = useState("major");
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(null);
  const [selectedKeyIndex, setSelectedKeyIndex] = useState(0);
  const undoStack = useRef([]);
  const redoStack = useRef([]);
  const isPausedRef = useRef(false);
  const currentNoteIndex = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Undo/Redo
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        undo();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "y") {
        redo();
        return;
      }

      const keyUpper = e.key.toUpperCase();
      // Letter keys for each nore, set pitch & edit selected note
      if (["A", "B", "C", "D", "E", "F", "G"].includes(keyUpper)) {
        if (selectedNoteIndex !== null) {
          // change pitch of selected note
          const letter = keyUpper;
          const currentNotes = [...notes];
          const noteObj = { ...currentNotes[selectedNoteIndex] };
          if (!noteObj.keys) {
            noteObj.keys = noteObj.pitch ? [noteObj.pitch] : [];
          }
          const editIdx = (noteObj.keys.length > 1) ? (selectedKeyIndex ?? 0) : 0;
          const targetKey = noteObj.keys[editIdx] || "";
          let octave = "4";
          if (targetKey.includes("/")) {
            octave = targetKey.split("/")[1];
          } else if (selectedPitch.length > 1) {
            octave = selectedPitch.slice(1);
          }
          noteObj.keys[editIdx] = letter + "/" + octave;
          // Update single note fields
          if (noteObj.keys.length === 1) {
            noteObj.pitch = noteObj.keys[0];
            noteObj.accidental = noteObj.keys[0].includes("#") ? "#" : noteObj.keys[0].includes("b") ? "b" : "";
          }
          // Clear chord name if any (chord modified)
          if (noteObj.chordName) {
            noteObj.chordName = undefined;
          }
          currentNotes[selectedNoteIndex] = noteObj;
          saveHistory([...notes]);
          setNotes(currentNotes);
        } else {
          // if no note selected it set base pitch for new note input
          setSelectedPitch(keyUpper + selectedPitch.slice(1));
        }
      } else if (["3", "4", "5"].includes(e.key)) {
        // Octave # keys
        if (selectedNoteIndex !== null) {
          // Change octave
          const newOctave = e.key;
          const currentNotes = [...notes];
          const noteObj = { ...currentNotes[selectedNoteIndex] };
          if (!noteObj.keys) {
            noteObj.keys = noteObj.pitch ? [noteObj.pitch] : [];
          }
          const editIdx = (noteObj.keys.length > 1) ? (selectedKeyIndex ?? 0) : 0;
          const targetKey = noteObj.keys[editIdx] || "";
          let baseNote = "C";
          if (targetKey.includes("/")) {
            baseNote = targetKey.split("/")[0];
          } else if (selectedPitch.length > 0) {
            baseNote = selectedPitch[0] + (accidental || "");
          }
          noteObj.keys[editIdx] = baseNote + "/" + newOctave;
          if (noteObj.keys.length === 1) {
            noteObj.pitch = noteObj.keys[0];
            noteObj.accidental = noteObj.keys[0].includes("#") ? "#" : noteObj.keys[0].includes("b") ? "b" : "";
          }
          if (noteObj.chordName) noteObj.chordName = undefined;
          currentNotes[selectedNoteIndex] = noteObj;
          saveHistory([...notes]);
          setNotes(currentNotes);
        } else {
          // Set octave 4 new note
          setSelectedPitch(selectedPitch[0] + e.key);
        }
      } else if (e.key === "r") {
        // Toggle rest
        if (selectedNoteIndex !== null) {
          const currentNotes = [...notes];
          const noteObj = { ...currentNotes[selectedNoteIndex] };
          noteObj.isRest = !noteObj.isRest;
          if (noteObj.isRest) {
            // Turn note into rest
          } else {
            // Turnrest into note
            if (!noteObj.keys || noteObj.keys.length === 0) {
              const oct = selectedPitch.slice(1) || "4";
              const base = selectedPitch[0] + (accidental || "");
              noteObj.keys = [base + "/" + oct];
            }
          }
          if (noteObj.chordName) noteObj.chordName = undefined;
          currentNotes[selectedNoteIndex] = noteObj;
          saveHistory([...notes]);
          setNotes(currentNotes);
        } else {
          setIsRest((prev) => !prev);
        }
      } else if (e.key === "+") {
        // Sharp accidental
        if (selectedNoteIndex !== null) {
          const currentNotes = [...notes];
          const noteObj = { ...currentNotes[selectedNoteIndex] };
          if (!noteObj.keys) noteObj.keys = noteObj.pitch ? [noteObj.pitch] : [];
          const editIdx = (noteObj.keys.length > 1) ? (selectedKeyIndex ?? 0) : 0;
          const targetKey = noteObj.keys[editIdx] || "";
          let [base, oct] = targetKey.includes("/") ? targetKey.split("/") : [targetKey, selectedPitch.slice(1) || "4"];
          if (base.endsWith("b") || base.endsWith("#")) {
            base = base[0];
          }
          noteObj.keys[editIdx] = base + "#" + "/" + oct;
          if (noteObj.keys.length === 1) {
            noteObj.pitch = noteObj.keys[0];
            noteObj.accidental = "#";
          }
          if (noteObj.chordName) noteObj.chordName = undefined;
          currentNotes[selectedNoteIndex] = noteObj;
          saveHistory([...notes]);
          setNotes(currentNotes);
        } else {
          setAccidental("#");
        }
      } else if (e.key === "-") {
        // Flat accidental
        if (selectedNoteIndex !== null) {
          const currentNotes = [...notes];
          const noteObj = { ...currentNotes[selectedNoteIndex] };
          if (!noteObj.keys) noteObj.keys = noteObj.pitch ? [noteObj.pitch] : [];
          const editIdx = (noteObj.keys.length > 1) ? (selectedKeyIndex ?? 0) : 0;
          const targetKey = noteObj.keys[editIdx] || "";
          let [base, oct] = targetKey.includes("/") ? targetKey.split("/") : [targetKey, selectedPitch.slice(1) || "4"];
          if (base.endsWith("#") || base.endsWith("b")) {
            base = base[0];
          }
          noteObj.keys[editIdx] = base + "b" + "/" + oct;
          if (noteObj.keys.length === 1) {
            noteObj.pitch = noteObj.keys[0];
            noteObj.accidental = "b";
          }
          if (noteObj.chordName) noteObj.chordName = undefined;
          currentNotes[selectedNoteIndex] = noteObj;
          saveHistory([...notes]);
          setNotes(currentNotes);
        } else {
          setAccidental("b");
        }
      } else if (e.key === "n") {
        // Natural notes (yeets the accidental)
        if (selectedNoteIndex !== null) {
          const currentNotes = [...notes];
          const noteObj = { ...currentNotes[selectedNoteIndex] };
          if (!noteObj.keys) noteObj.keys = noteObj.pitch ? [noteObj.pitch] : [];
          const editIdx = (noteObj.keys.length > 1) ? (selectedKeyIndex ?? 0) : 0;
          const targetKey = noteObj.keys[editIdx] || "";
          let [base, oct] = targetKey.includes("/") ? targetKey.split("/") : [targetKey, selectedPitch.slice(1) || "4"];
          if (base.endsWith("#") || base.endsWith("b")) {
            base = base[0];
          }
          noteObj.keys[editIdx] = base + "/" + oct;
          if (noteObj.keys.length === 1) {
            noteObj.pitch = noteObj.keys[0];
            noteObj.accidental = "";
          }
          if (noteObj.chordName) noteObj.chordName = undefined;
          currentNotes[selectedNoteIndex] = noteObj;
          saveHistory([...notes]);
          setNotes(currentNotes);
        } else {
          setAccidental("");
        }
      } else if (["1", "2", "3", "4"].includes(e.key)) {
        // length of note (1=whole, 2=half, 3=quarter, 4=eighth)
        const durMap = { "1": "w", "2": "h", "3": "q", "4": "8" };
        const dur = durMap[e.key];
        if (selectedNoteIndex !== null) {
          const currentNotes = [...notes];
          const noteObj = { ...currentNotes[selectedNoteIndex] };
          noteObj.duration = dur;
          currentNotes[selectedNoteIndex] = noteObj;
          saveHistory([...notes]);
          setNotes(currentNotes);
        } else {
          setDuration(dur);
        }
      } else if (e.key === "Enter") {
        addNote();
      } else if (e.key === "Backspace" || e.key === "Delete") {
        deleteSelectedNote();
      } else if (e.key === "ArrowLeft") {
        // Navigate to previous note or chord tone
        if (notes.length > 0) {
          if (selectedNoteIndex === null) {
            // Select last note/chord
            const lastIndex = notes.length - 1;
            setSelectedNoteIndex(lastIndex);
            if (notes[lastIndex].keys && notes[lastIndex].keys.length > 1) {
              setSelectedKeyIndex(0);
            } else {
              setSelectedKeyIndex(0);
            }
          } else {
            let flatPos = 0;
            let totalCount = 0;
            notes.forEach(n => { totalCount += n.keys ? n.keys.length : 1; });
            for (let i = 0; i < notes.length; i++) {
              const count = notes[i].keys ? notes[i].keys.length : 1;
              if (i < selectedNoteIndex) {
                flatPos += count;
              } else if (i === selectedNoteIndex) {
                flatPos += Math.min(selectedKeyIndex, (count - 1));
                break;
              }
            }
            const newFlat = Math.max(0, flatPos - 1);
            let cum = 0;
            let newNoteIndex = 0;
            let newKeyIdx = 0;
            for (let j = 0; j < notes.length; j++) {
              const count = notes[j].keys ? notes[j].keys.length : 1;
              if (newFlat < cum + count) {
                newNoteIndex = j;
                newKeyIdx = newFlat - cum;
                break;
              }
              cum += count;
            }
            setSelectedNoteIndex(newNoteIndex);
            setSelectedKeyIndex(newKeyIdx);
          }
        }
      } else if (e.key === "ArrowRight") {
        // move to next note/chord
        if (notes.length > 0) {
          if (selectedNoteIndex === null) {
            setSelectedNoteIndex(0);
            setSelectedKeyIndex(0);
          } else {
            let flatPos = 0;
            let totalCount = 0;
            notes.forEach(n => { totalCount += n.keys ? n.keys.length : 1; });
            for (let i = 0; i < notes.length; i++) {
              const count = notes[i].keys ? notes[i].keys.length : 1;
              if (i < selectedNoteIndex) {
                flatPos += count;
              } else if (i === selectedNoteIndex) {
                flatPos += Math.min(selectedKeyIndex, (count - 1));
                break;
              }
            }
            const newFlat = Math.min(totalCount - 1, flatPos + 1);
            let cum = 0;
            let newNoteIndex = 0;
            let newKeyIdx = 0;
            for (let j = 0; j < notes.length; j++) {
              const count = notes[j].keys ? notes[j].keys.length : 1;
              if (newFlat < cum + count) {
                newNoteIndex = j;
                newKeyIdx = newFlat - cum;
                break;
              }
              cum += count;
            }
            setSelectedNoteIndex(newNoteIndex);
            setSelectedKeyIndex(newKeyIdx);
          }
        }
      } else if (e.key === "ArrowUp") {
        // move within chord (up)
        if (selectedNoteIndex !== null && notes[selectedNoteIndex].keys && notes[selectedNoteIndex].keys.length > 1) {
          setSelectedKeyIndex((prevIdx) => {
            if (prevIdx === null) return notes[selectedNoteIndex].keys.length - 1;
            return Math.min(notes[selectedNoteIndex].keys.length - 1, prevIdx + 1);
          });
        }
      } else if (e.key === "ArrowDown") {
        // move within chord (down)
        if (selectedNoteIndex !== null && notes[selectedNoteIndex].keys && notes[selectedNoteIndex].keys.length > 1) {
          setSelectedKeyIndex((prevIdx) => {
            if (prevIdx === null) return 0;
            return Math.max(0, prevIdx - 1);
          });
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [notes, selectedNoteIndex, selectedKeyIndex, selectedPitch, duration, accidental, isRest]);

  const saveHistory = (current) => {
    undoStack.current.push(current);
    redoStack.current = [];
  };

  const undo = () => {
    if (undoStack.current.length === 0) return;
    redoStack.current.push([...notes]);
    setNotes(undoStack.current.pop());
  };

  const redo = () => {
    if (redoStack.current.length === 0) return;
    undoStack.current.push([...notes]);
    setNotes(redoStack.current.pop());
  };

  const renderVexFlow = () => {
    const div = containerRef.current;
    if (!div) return;
    
    const noteBox = noteBoxRef.current;
    div.innerHTML = "";
    
    if (noteBox) {
      div.appendChild(noteBox);
    }
    

    const renderer = new Renderer(div, Renderer.Backends.SVG);
    const context = renderer.getContext();

    const [beats, beatValue] = timeSignature.split("/").map(Number);
    const totalTicksPerMeasure = (4 / beatValue) * beats * 4096;

    const getNoteTicks = (dur) => {
      const map = { w: 4096 * 4, h: 4096 * 2, q: 4096, "8": 2048 };
      return map[dur];
    };

    // Group notes in measures
    const groupedNotes = [];
    let group = [];
    let tickCount = 0;
    notes.forEach((note) => {
      const tick = getNoteTicks(note.duration);
      if (tickCount + tick > totalTicksPerMeasure) {
        groupedNotes.push(group);
        group = [];
        tickCount = 0;
      }
      group.push(note);
      tickCount += tick;
    });
    if (group.length) groupedNotes.push(group);

const divWidth = containerRef.current?.clientWidth || 900;
const measureWidth = 180;
const staveHeight = 120;
const measuresPerLine = Math.floor((divWidth - 40) / measureWidth);
const staveWidth = measuresPerLine * measureWidth;
const totalStaves = Math.ceil(groupedNotes.length / measuresPerLine);
const height = totalStaves * staveHeight + 60;
renderer.resize(staveWidth + 50, height);

    let y = 40;
    for (let line = 0; line < totalStaves; line++) {
      const lineStart = line * measuresPerLine;
      const lineEnd = Math.min(lineStart + measuresPerLine, groupedNotes.length);
      for (let i = lineStart; i < lineEnd; i++) {
        const isFirstMeasureOnLine = (i % measuresPerLine === 0);
        const x = 10 + (i - lineStart) * measureWidth;
        const measureStave = new Stave(x, y, measureWidth);
        if (isFirstMeasureOnLine) {
          measureStave.addClef("treble").addTimeSignature(timeSignature).addKeySignature(keySignature);
        }
        measureStave.setContext(context).draw();

        const measureNotes = groupedNotes[i].map((n, idx) => {
          const globalNoteIndex = groupedNotes.slice(0, i).reduce((acc, grp) => acc + grp.length, 0) + idx;
          const keys = n.isRest ? ["b/4"] : (n.keys ? n.keys : [n.pitch]);
          const vexNote = new StaveNote({
            clef: "treble",
            keys: keys,
            duration: n.duration + (n.isRest ? "r" : "")
          });
          if (!n.isRest) {
            // Add accidentals for each note in chord
            keys.forEach((key, kIdx) => {
              if (key.includes("#")) vexNote.addModifier(new Accidental("#"), kIdx);
              if (key.includes("b")) vexNote.addModifier(new Accidental("b"), kIdx);
            });
          }
          // Highlight selected note
          if (globalNoteIndex === selectedNoteIndex) {
            vexNote.setStyle({ fillStyle: "#2563eb", strokeStyle: "#2563eb" });
          }
          // Add chord name annotation
          if (n.chordName) {
            vexNote.addModifier(new Annotation(n.chordName).setVerticalJustification(Annotation.VerticalJustify.TOP), 0);
          }
          vexNote.setAttribute("data-note-index", globalNoteIndex);
          return vexNote;
        });

        //draw notes
        const voice = new Voice({ num_beats: beats, beat_value: beatValue });
        voice.setStrict(false);
        voice.addTickables(measureNotes);
        new Formatter().joinVoices([voice]).formatToStave([voice], measureStave);
        voice.draw(context, measureStave);
        

const svgNotes = containerRef.current.querySelectorAll(".vf-note");
let globalOffset = groupedNotes.slice(0, i).reduce((acc, grp) => acc + grp.length, 0);

measureNotes.forEach((_, noteIdx) => {
  const svgNote = svgNotes[globalOffset + noteIdx];
  if (svgNote) {
    svgNote.setAttribute("data-note-index", globalOffset + noteIdx);
  }
});

        measureNotes.forEach((_, localIdx) => {
          const globalNoteIndex = groupedNotes
            .slice(0, i)
            .reduce((acc, grp) => acc + grp.length, 0) + localIdx;
        
          const allVfNotes = context.svg.querySelectorAll(".vf-note");
          const noteEl = allVfNotes[globalNoteIndex];
          if (noteEl) {
            noteEl.setAttribute("data-note-index", globalNoteIndex);
          }
        });
      }
      y += staveHeight;
    }

    // Autoscroll to bottom
    div.scrollTop = div.scrollHeight;

    groupedNotes.forEach((group, mIndex) => {
      group.forEach((_, idx) => {
        const globalNoteIndex = groupedNotes.slice(0, mIndex).reduce((acc, grp) => acc + grp.length, 0) + idx;
        const svgNote = div.querySelector(`[data-note-index='${globalNoteIndex}']`);
        if (svgNote) {
          svgNote.addEventListener("click", (evt) => {
            const noteIndex = globalNoteIndex;
            let keyIdx = 0;
            if (notes[noteIndex].keys && notes[noteIndex].keys.length > 1) {
              const rect = svgNote.getBoundingClientRect();
              const relY = evt.clientY - rect.top;
              const totalKeys = notes[noteIndex].keys.length;
              const segHeight = rect.height / totalKeys;
              let idxFromBottom = Math.floor(relY / segHeight);
              if (idxFromBottom < 0) idxFromBottom = 0;
              if (idxFromBottom >= totalKeys) idxFromBottom = totalKeys - 1;
              keyIdx = (totalKeys - 1) - idxFromBottom;
            }
            setSelectedNoteIndex(noteIndex);
            setSelectedKeyIndex(keyIdx);
            renderVexFlow();
          });
        }
      });
    });
  };

  const addNote = () => {
    if (isRest) {
      saveHistory([...notes]);
      setNotes((prev) => [
        ...prev,
        {
          keys: [],
          duration,
          isRest: true
        }
      ]);
      return;
    }
    if (chordMode) {
      // make chord notes and name
      const baseLetter = selectedPitch[0];
      const octave = parseInt(selectedPitch.slice(1)) || 4;
      const rootAcc = accidental;
      let useSharps = false;
      if (rootAcc === "#") useSharps = true;
      else if (rootAcc === "b") useSharps = false;
      else {
        if (["B", "E"].includes(baseLetter)) useSharps = true;
      }
      if (chordType === "aug" && rootAcc === "") {
        useSharps = true;
      }
      const semitoneMap = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
      let rootSemitone = semitoneMap[baseLetter];
      if (rootAcc === "#") rootSemitone += 1;
      if (rootAcc === "b") rootSemitone -= 1;
      const rootMidi = (octave + 1) * 12 + rootSemitone;
      const chordIntervals = {
        major: [0, 4, 7],
        minor: [0, 3, 7],
        aug: [0, 4, 8],
        dim: [0, 3, 6],
        "7th": [0, 4, 7, 10],
        m7: [0, 3, 7, 10],
        "6th": [0, 4, 7, 9],
        "9th": [0, 4, 7, 10, 14],
        sus4: [0, 5, 7],
        sus2: [0, 2, 7]
      };
      const intervals = chordIntervals[chordType] || [0, 4, 7];
      const sharpMap = { 0: "C", 1: "C#", 2: "D", 3: "D#", 4: "E", 5: "F", 6: "F#", 7: "G", 8: "G#", 9: "A", 10: "A#", 11: "B" };
      const flatMap = { 0: "C", 1: "C#", 2: "D", 3: "Eb", 4: "E", 5: "F", 6: "F#", 7: "G", 8: "Ab", 9: "A", 10: "Bb", 11: "B" };
      const pitchMap = useSharps ? sharpMap : flatMap;
      const chordKeys = intervals.map((intv) => {
        const sem = rootMidi + intv;
        const noteNum = sem % 12;
        const noteOct = Math.floor(sem / 12) - 1;
        return pitchMap[noteNum] + "/" + noteOct;
      });
      // Sort keys by pitch ^^^
      chordKeys.sort((a, b) => {
        const [nameA, octA] = a.split("/");
        const [nameB, octB] = b.split("/");
        const octNumA = parseInt(octA), octNumB = parseInt(octB);
        if (octNumA !== octNumB) return octNumA - octNumB;
        const semOrder = { C: 0, "C#": 1, Db: 1, D: 2, "D#": 3, Eb: 3, E: 4, F: 5, "F#": 6, Gb: 6, G: 7, "G#": 8, Ab: 8, A: 9, "A#": 10, Bb: 10, B: 11 };
        const baseA = nameA;
        const baseB = nameB;
        const semA = semOrder[baseA] ?? 0;
        const semB = semOrder[baseB] ?? 0;
        return semA - semB;
      });
      let chordNameText = baseLetter + (rootAcc || "");
      if (chordType === "major") {
      } else if (chordType === "minor") {
        chordNameText += "m";
      } else if (chordType === "aug") {
        chordNameText += "aug";
      } else if (chordType === "dim") {
        chordNameText += "dim";
      } else if (chordType === "7th") {
        chordNameText += "7";
      } else if (chordType === "m7") {
        chordNameText += "m7";
      } else if (chordType === "6th") {
        chordNameText += "6";
      } else if (chordType === "9th") {
        chordNameText += "9";
      } else if (chordType.startsWith("sus")) {
        chordNameText += chordType;
      } else {
        chordNameText += chordType;
      }
      saveHistory([...notes]);
      setNotes((prev) => [
        ...prev,
        {
          keys: chordKeys,
          duration,
          isRest: false,
          chordName: chordNameText
        }
      ]);
    } else {
      // Add single note
      saveHistory([...notes]);
      setNotes((prev) => [
        ...prev,
        {
          pitch: formatPitch(selectedPitch),
          duration,
          accidental,
          isRest,
          keys: [formatPitch(selectedPitch)]
        }
      ]);
    }
  };

let piano = null;

const instrumentCache = {};
const audioCtx = typeof window !== "undefined" ? new (window.AudioContext || window.webkitAudioContext)() : null;

const playback = async (noteList) => {
  if (!audioCtx) return;
  if (!instrumentCache[selectedInstrument]) {
    instrumentCache[selectedInstrument] = await Soundfont.instrument(audioCtx, selectedInstrument);
  }

  const instrument = instrumentCache[selectedInstrument];
  const noteDurationMap = { w: 4, h: 2, q: 1, "8": 0.5 };

  let isStopped = false;
  isPausedRef.current = false;
  currentNoteIndex.current = 0;

  const playNext = async () => {
    if (isStopped || isPausedRef.current || currentNoteIndex.current >= noteList.length) {
      if (currentNoteIndex.current >= noteList.length) {
        setIsPlaying(false);
        if (noteBoxRef.current) {
          noteBoxRef.current.style.display = "none";
        }        
      }
      return;
    }

    const note = noteList[currentNoteIndex.current];
    const duration = (60 / bpm) * (noteDurationMap[note.duration] || 1);

    if (!note.isRest) {
      const keys = note.keys?.length ? note.keys : [note.pitch];
      keys.forEach((key) => {
        instrument.play(key.replace("/", ""), audioCtx.currentTime, { duration });
      });

      // highlight current playing note
      const el = document.querySelector(`[data-note-index='${currentNoteIndex.current}']`);
// Remove old highlight from all notes
document.querySelectorAll(".vf-note").forEach((n) => {
  n.classList.remove("note-playing");
});

// Highlight current note
if (el) {
  el.classList.add("note-playing");

  // Float box highlight
  const box = noteBoxRef.current;
  const rect = el.getBoundingClientRect();
  if (box) {
    box.style.top = rect.top + window.scrollY + "px";
    box.style.left = rect.left + window.scrollX + "px";
    box.style.width = rect.width + "px";
    box.style.height = rect.height + "px";
    box.style.display = "block";
  }

  // scroll
  el.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
}

      if (el) {
        const box = noteBoxRef.current;
        if (box) {
          const rect = el.getBoundingClientRect();
          box.style.top = rect.top + "px";
          box.style.left = rect.left + "px";
          box.style.width = rect.width + "px";
          box.style.height = rect.height + "px";
          box.style.display = "block";
        }
      }
    }

    currentNoteIndex.current += 1;

    setTimeout(() => {
      if (!isPausedRef.current && !isStopped) playNext();
    }, duration * 1000);
  };

  setIsPlaying(true);
  playNext();

  playbackRef.current = {
    pause: () => {
      isPausedRef.current = true;
      setIsPaused(true);
    },
    resume: () => {
      isPausedRef.current = false;
      setIsPaused(false);
      playNext();
    },
    stop: () => {
      isStopped = true;
      isPausedRef.current = false;
      currentNoteIndex.current = 0;
      setIsPlaying(false);
      setIsPaused(false);
      if (noteBoxRef.current) {
        noteBoxRef.current.style.display = "none";
      }      
    }
  };
};



  const deleteSelectedNote = () => {
    if (selectedNoteIndex === null) return;
    saveHistory([...notes]);
    setNotes((prev) => prev.filter((_, idx) => idx !== selectedNoteIndex));
    setSelectedNoteIndex(null);
    setSelectedKeyIndex(0);
  };

  const formatPitch = (pitch) => {
    const letter = pitch[0];
    const octave = pitch.slice(1);
    return accidental ? `${letter}${accidental}/${octave}` : `${letter}/${octave}`;
  };

  const exportMusicXML = () => {
    const [beats, beatValue] = timeSignature.split("/");
    const fifthsMap = {
      C: 0, G: 1, D: 2, A: 3, E: 4, B: 5, "F#": 6, "C#": 7,
      F: -1, Bb: -2, Eb: -3, Ab: -4, Db: -5, Gb: -6, Cb: -7
    };
    const durationXMLMap = { w: 16, h: 8, q: 4, "8": 2 };
    const typeXMLMap = { w: "whole", h: "half", q: "quarter", "8": "eighth" };
    let xmlContent = "";
    notes.forEach((note) => {
      if (note.isRest) {
        xmlContent += `
        <note><rest/><duration>${durationXMLMap[note.duration] || 4}</duration><type>${typeXMLMap[note.duration] || note.duration}</type></note>`;
      } else if (note.keys && note.keys.length > 1) {
        note.keys.forEach((key, idx) => {
          const [name, oct] = key.split("/");
          const step = name[0];
          let alter = 0;
          if (name.length > 1) {
            alter = name[1] === "#" ? 1 : name[1] === "b" ? -1 : 0;
          }
          xmlContent += `
        <note>` + (idx > 0 ? "<chord/>" : "") + `
          <pitch>
            <step>${step}</step>` + (alter ? `<alter>${alter}</alter>` : "") + `
            <octave>${oct}</octave>
          </pitch>
          <duration>${durationXMLMap[note.duration] || 4}</duration>
          <type>${typeXMLMap[note.duration] || note.duration}</type>
        </note>`;
        });
      } else {
        const pitchStr = note.pitch || (note.keys ? note.keys[0] : "");
        if (!pitchStr) return;
        const [name, oct] = pitchStr.split("/");
        const step = name[0];
        let alter = 0;
        if (name.length > 1) {
          alter = name[1] === "#" ? 1 : name[1] === "b" ? -1 : 0;
        }
        xmlContent += `
        <note>
          <pitch>
            <step>${step}</step>` + (alter ? `<alter>${alter}</alter>` : "") + `
            <octave>${oct}</octave>
          </pitch>
          <duration>${durationXMLMap[note.duration] || 4}</duration>
          <type>${typeXMLMap[note.duration] || note.duration}</type>
        </note>`;
      }
    });
    const musicxml = `<?xml version="1.0" encoding="UTF-8"?>
<score-partwise version="3.1">
  <work><work-title>${title}</work-title></work>
  <identification><creator type="composer">${composer}</creator></identification>
  <part-list><score-part id="P1"><part-name>Music</part-name></score-part></part-list>
  <part id="P1">
    <measure number="1">
      <attributes>
        <divisions>4</divisions>
        <key><fifths>${fifthsMap[keySignature] || 0}</fifths></key>
        <time><beats>${beats}</beats><beat-type>${beatValue}</beat-type></time>
        <clef><sign>G</sign><line>2</line></clef>
      </attributes>${xmlContent}
    </measure>
  </part>
</score-partwise>`;
    const blob = new Blob([musicxml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const safeTitle = title.trim().replace(/\s+/g, "_");
    const safeComposer = composer.trim().replace(/\s+/g, "_");
    a.download = `${safeTitle}_${safeComposer || "Unknown"}.musicxml`;
        a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    renderVexFlow();
  }, [notes, selectedNoteIndex, selectedKeyIndex, timeSignature, keySignature]);
  

  return (
    <div className="p-6">
      <div className="mb-6">
        <details className="border rounded p-4 bg-gray-100">
          <summary className="text-xl font-semibold cursor-pointer"> 🎹 Keyboard Shortcuts 🎹</summary>
          <ul className="text-body list-disc pl-6 mt-2 space-y-1">
            <li><b>Note Letters (A-G):</b> Set pitch (or change selected note pitch)</li>
            <li><b>3 / 4 / 5:</b> Set octave (or change selected note octave)</li>
            <li><b>1:</b> Whole note</li>
            <li><b>2:</b> Half note</li>
            <li><b>3:</b> Quarter note</li>
            <li><b>4:</b> Eighth note</li>
            <li><b>+ / - / n:</b> Sharp / Flat / Natural (toggle accidentals)</li>
            <li><b>r:</b> Toggle rest</li>
            <li><b>Enter:</b> Add note</li>
            <li><b>Backspace/Delete:</b> Delete selected note</li>
            <li><b>Ctrl/Cmd + Z:</b> Undo</li>
            <li><b>Ctrl/Cmd + Y:</b> Redo</li>
            <li><b>← / →:</b> Navigate notes (move cursor left/right)</li>
            <li><b>↑ / ↓:</b> Select chord tone (if chord selected)</li>
          </ul>
        </details>
      </div>
      <h1 className="text-body font-bold mb-4">🎼 Composer Tool</h1>
      <div className="text-2xl grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="border p-2 rounded" />
        <input value={composer} onChange={(e) => setComposer(e.target.value)} placeholder="Composer" className="border p-2 rounded" />
        <select value={keySignature} onChange={(e) => setKeySignature(e.target.value)} className="border p-2 rounded">
          {["C", "G", "D", "A", "E", "B", "F#", "C#", "F", "Bb", "Eb", "Ab", "Db", "Gb", "Cb"].map((key) => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
        <select value={timeSignature} onChange={(e) => setTimeSignature(e.target.value)} className="border p-2 rounded">
          {["2/4", "3/4", "4/4", "6/8", "9/8", "12/8", "2/2", "3/8"].map((ts) => (
            <option key={ts} value={ts}>{ts}</option>
          ))}
        </select>
        <input value={bpm} type="number" onChange={(e) => setBpm(parseInt(e.target.value) || 0)} placeholder="BPM" className="border p-2 rounded" />
      </div>
      <div className="text-xl mb-4">
        <label className="mr-2 font-semibold">Note:</label>
        {["C", "D", "E", "F", "G", "A", "B"].map((n) => (
          <button
            key={n}
            className={`px-2 py-1 mx-1 border rounded ${selectedPitch[0] === n ? "bg-blue-300" : ""}`}
            onClick={() => setSelectedPitch(n + selectedPitch.slice(1))}
          >
            {n}
          </button>
        ))}
        <select className="ml-2 px-2 py-1" value={selectedPitch[1]} onChange={(e) => setSelectedPitch(selectedPitch[0] + e.target.value)}>
          {["3", "4", "5"].map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <select className="ml-2 px-2 py-1" value={duration} onChange={(e) => setDuration(e.target.value)}>
          <option value="w">Whole</option>
          <option value="h">Half</option>
          <option value="q">Quarter</option>
          <option value="8">Eighth</option>
        </select>
        <select className="ml-2 px-2 py-1" value={accidental} onChange={(e) => setAccidental(e.target.value)}>
          <option value="">Natural</option>
          <option value="#">Sharp ♯</option>
          <option value="b">Flat ♭</option>
        </select>
        <label className="ml-2">
          <input type="checkbox" checked={isRest} onChange={(e) => setIsRest(e.target.checked)} className="mr-1" />
          Rest
        </label>
        <label className="ml-2">
          <input type="checkbox" checked={chordMode} onChange={(e) => setChordMode(e.target.checked)} className="mr-1" />
          Chord Mode
        </label>
        {chordMode && (
          <select className="ml-2 px-2 py-1" value={chordType} onChange={(e) => setChordType(e.target.value)}>
            <option value="major">Major</option>
            <option value="minor">Minor</option>
            <option value="aug">aug</option>
            <option value="dim">dim</option>
            <option value="7th">7th</option>
            <option value="m7">m7</option>
            <option value="6th">6th</option>
            <option value="9th">9th</option>
            <option value="sus4">sus4</option>
            <option value="sus2">sus2</option>
          </select>
        )}
        <button onClick={addNote} className="ml-4 px-4 py-1 bg-green-600 text-white rounded">Add Note</button>
        <button onClick={deleteSelectedNote} className="ml-2 px-4 py-1 bg-red-600 text-white rounded">Delete Selected</button>
{/* ▶️ PLAY */}
<button
  onClick={() => {
    if (isPaused) {
      playbackRef.current.resume();
    } else {
      playback(notes);
    }
  }}
  disabled={isPlaying && !isPaused}
  className={`ml-2 px-4 py-1 rounded transition ${
    isPlaying && !isPaused
      ? "bg-blue-300 text-white cursor-not-allowed"
      : "bg-blue-600 hover:bg-blue-700 text-white"
  }`}
>
  ▶️ Play
</button>

{/* ⏸️ PAUSE */}
<button
  onClick={() => playbackRef.current.pause()}
  disabled={!isPlaying || isPaused}
  className={`ml-2 px-4 py-1 rounded transition ${
    isPaused
      ? "bg-yellow-300 text-white cursor-not-allowed"
      : "bg-yellow-500 hover:bg-yellow-600 text-white"
  }`}
>
  ⏸️ Pause
</button>

{/* ⏹️ STOP */}
<button
  onClick={() => {
    playbackRef.current.stop();
  }}
  disabled={!isPlaying}
  className={`ml-2 px-4 py-1 rounded transition ${
    !isPlaying
      ? "bg-red-300 text-white cursor-not-allowed"
      : "bg-red-600 hover:bg-red-700 text-white"
  }`}
>
  ⏹️ Stop
</button>

<div className="mt-4">
  <label className="mr-2 font-semibold">Tempo: {bpm} BPM</label>
  <input
    type="range"
    min="40"
    max="240"
    value={bpm}
    onChange={(e) => setBpm(parseInt(e.target.value))}
    className="w-full"
  />
</div>


        <button onClick={exportMusicXML} className="ml-2 px-4 py-1 bg-purple-600 text-white rounded">📄 Export MusicXML</button>
        <select
  value={selectedInstrument}
  onChange={(e) => setSelectedInstrument(e.target.value)}
  className="border px-2 py-1 rounded ml-2"
>
  <option value="acoustic_grand_piano">🎹 Piano</option>
  <option value="acoustic_guitar_nylon">🎸 Guitar (Nylon)</option>
  <option value="overdriven_guitar">🎸 Overdrive Guitar</option>
  <option value="trumpet">🎺 Trumpet</option>
  <option value="brass_section">🎷 Brass Section</option>
  <option value="choir_aahs">🗣️ Choir Aahs</option>
  <option value="voice_oohs">🎤 Synth Voice Oohs</option>
  </select>
  <div
  ref={containerRef}
  className="border rounded p-4 bg-white"
  style={{
    minHeight: "400px",
    maxHeight: "700px",
    overflowY: "auto",
    position: "relative"
  }}
>
  <div
    ref={noteBoxRef}
    id="note-box"
    style={{
      position: "absolute",
      border: "2px solid #3b82f6",
      borderRadius: "4px",
      pointerEvents: "none",
      display: "none",
      zIndex: 9999,
      transition: "top 0.1s, left 0.1s, width 0.1s, height 0.1s"
    }}
  ></div>
</div>

      </div>
    </div>
  );
}
