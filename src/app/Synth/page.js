"use client";
import React, { useState } from "react";
import { Midi } from "@tonejs/midi";
import * as Tone from "tone";

export default function SynthPage() {
  const [midiFile, setMidiFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [instrument, setInstrument] = useState("synth");

  let synth = null;

  //trrying to map out the midi correctly this wrong rn but its a work in progress, but hey the synth works great
  const sampleMapping = {
    21: "Player_dyn1_rr1_000.wav",
    23: "Player_dyn1_rr1_002.wav",
    25: "Player_dyn1_rr1_004.wav",
    27: "Player_dyn1_rr1_006.wav",
    29: "Player_dyn1_rr1_008.wav",
    31: "Player_dyn1_rr1_010.wav",
    33: "Player_dyn1_rr1_012.wav",
    35: "Player_dyn1_rr1_014.wav",
    37: "Player_dyn1_rr1_016.wav",
    39: "Player_dyn1_rr1_018.wav",
    41: "Player_dyn1_rr1_020.wav",
    43: "Player_dyn1_rr1_022.wav",
    45: "Player_dyn1_rr1_024.wav",
    47: "Player_dyn1_rr1_026.wav",
    49: "Player_dyn1_rr1_028.wav",
    51: "Player_dyn1_rr1_030.wav",
    53: "Player_dyn1_rr1_032.wav",
    55: "Player_dyn1_rr1_034.wav",
    57: "Player_dyn1_rr1_036.wav",
    59: "Player_dyn1_rr1_038.wav",
    61: "Player_dyn1_rr1_040.wav",
    63: "Player_dyn1_rr1_042.wav",
    65: "Player_dyn1_rr1_044.wav",
    67: "Player_dyn2_rr1_000.wav",
    69: "Player_dyn2_rr1_002.wav",
    71: "Player_dyn2_rr1_004.wav",
    73: "Player_dyn2_rr1_006.wav",
    75: "Player_dyn2_rr1_008.wav",
    77: "Player_dyn2_rr1_010.wav",
    79: "Player_dyn2_rr1_012.wav",
    81: "Player_dyn2_rr1_014.wav",
    83: "Player_dyn2_rr1_016.wav",
    85: "Player_dyn2_rr1_018.wav",
    87: "Player_dyn2_rr1_020.wav",
    89: "Player_dyn2_rr1_022.wav",
    91: "Player_dyn2_rr1_024.wav",
    93: "Player_dyn2_rr1_026.wav",
    95: "Player_dyn2_rr1_028.wav",
    97: "Player_dyn2_rr1_030.wav",
    99: "Player_dyn2_rr1_032.wav",
    101: "Player_dyn2_rr1_034.wav",
    103: "Player_dyn2_rr1_036.wav",
    105: "Player_dyn2_rr1_038.wav",
    107: "Player_dyn2_rr1_040.wav",
    108: "Player_dyn2_rr1_042.wav",
  };

  async function playMIDI(file) {
    if (!file) {
      alert("upload a MIDI file");
      return;
    }

    await Tone.start();

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async () => {
      const midi = new Midi(reader.result);

      Tone.Transport.cancel();
      Tone.Transport.stop();

      if (instrument === "synth") {
        synth = new Tone.PolySynth(Tone.Synth).toDestination();
        scheduleNotes(midi, synth);
      } else if (instrument === "piano") {
        synth = new Tone.Sampler(
          {
            urls: generatePianoUrls(),
            release: 1,
            onload: () => scheduleNotes(midi, synth),
          }).toDestination();
      } else if (instrument === "guitar") {
        synth = new Tone.Sampler(
          {
            urls: generateGuitarUrls(),
            release: 1,
            onload: () => scheduleNotes(midi, synth),
          }).toDestination();
      }
    };
  }

  function generatePianoUrls() {
    let urls = {};
    for (let note in sampleMapping) {
      urls[note] = `https://wayneh08.github.io/NoTreble_Samples/Upright_Piano/${sampleMapping[note]}`; //repo with the piano samples
    }
    return urls;
  }

  function generateGuitarUrls() {
    let urls = {};
    for (let note in sampleMapping) {
      urls[note] = `https://wayneh08.github.io/NoTreble_Samples/samples/guitar-${sampleMapping[note]}`; // This dont exist yet, guitar wont work
    }
    return urls;
  }

  function scheduleNotes(midi, synth) {
    midi.tracks.forEach((track) => {
      track.notes.forEach((note) => {
        Tone.Transport.schedule((time) => {
          synth.triggerAttackRelease(note.name, note.duration, time);
        }, note.time);
      });
    });

    Tone.Transport.start();
    setIsPlaying(true);
  }

  function pauseMIDI() {
    if (Tone.Transport.state === "started") {
      Tone.Transport.pause();
      setIsPlaying(false);
    }
  }

  function restartMIDI() {
    Tone.Transport.stop();
    Tone.Transport.start();
    setIsPlaying(true);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h2 className="text-3xl font-bold mb-6">Upload and Play Your Sheet Music!</h2>

      <input
        type="file"
        accept=".mid"
        className="mb-4 p-3 text-lg border border-gray-500 rounded-lg bg-gray-800"
        onChange={(e) => setMidiFile(e.target.files[0])}
      />

      {/* Instrument Selection */}
      <div className="mb-4">
        <label className="text-lg">Instrument: </label>
        <select
          value={instrument}
          onChange={(e) => setInstrument(e.target.value)}
          className="p-2 text-lg bg-gray-800 border border-gray-500 rounded-lg"
        >
          <option value="synth">🎵 Synth</option>
          <option value="piano">🎹 Piano</option>
          <option value="guitar">🎸 Guitar</option>
        </select>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => playMIDI(midiFile)}
          className="px-6 py-3 text-xl font-semibold bg-green-500 rounded-lg shadow-lg hover:bg-green-600 transition-all"
        >
            Play
        </button>
        <button
          onClick={pauseMIDI}
          className="px-6 py-3 text-xl font-semibold bg-yellow-500 rounded-lg shadow-lg hover:bg-yellow-600 transition-all"
        >
            Pause
        </button>
        <button
          onClick={restartMIDI}
          className="px-6 py-3 text-xl font-semibold bg-red-500 rounded-lg shadow-lg hover:bg-red-600 transition-all"
        >
            Restart
        </button>
      </div>
    </div>
  );
}
