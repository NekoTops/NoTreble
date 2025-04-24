"use client";
import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import Link from "next/link";
import {
  Renderer,
  Stave,
  StaveNote,
  Voice,
  Formatter,
  Dot,
  Accidental,
  Beam,
  StaveConnector,
  Barline,
} from "vexflow";
import { XMLParser, XMLBuilder } from "fast-xml-parser";

export default function MusicEditor({ params }) {
  const router = useRouter();
  const { uid, filename } = use(params);
  const [userId, setUserId] = useState("");
  const [xmlData, setXmlData] = useState("");
  const [scoreJson, setScoreJson] = useState(null);
  const containerRef = useRef(null);
  const dragData = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        alert("Please log in to use this feature.");
        router.push("/Login");
        return;
      }
      setUserId(user.uid);
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (uid && filename && userId) {
      (async () => {
        try {
          const res = await fetch(`/api/getxml/${uid}/${filename}`);
          const xml = await res.text();
          setXmlData(xml);
          const parser = new XMLParser({ ignoreAttributes: false });
          const json = parser.parse(xml);
          setScoreJson(json);
        } catch (err) {
          console.error(err);
        }
      })();
    }
  }, [uid, filename, userId]);

  useEffect(() => {
    if (scoreJson && containerRef.current) {
      drawMusic(scoreJson, containerRef.current);
    }
  }, [scoreJson]);

  function onDragStart(e, noteType) {
    dragData.current = noteType;
  }

  function onDragOver(e) {
    e.preventDefault();
  }

  function onDrop(e) {
    e.preventDefault();
    const noteType = dragData.current;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    addNoteAtPosition(noteType, x, y);
  }

  function addNoteAtPosition(type, x, y) {
    // Deep clone JSON
    const newJson = JSON.parse(JSON.stringify(scoreJson));
    const partArr = newJson['score-partwise'].part;
    const part0 = Array.isArray(partArr) ? partArr[0] : partArr;
    // Ensure measures array
    let measures = part0.measure;
    if (!Array.isArray(measures)) {
      measures = part0.measure = [measures];
    }
    const systemHeight = 220;
    const measureWidth = 280;
    const staffHeight = 80;
    const measuresPerSystem = 4;
    const systemIdx = Math.floor(y / systemHeight);
    const measureIdx = Math.floor(x / (measureWidth + 1));
    const targetIndex = systemIdx * measuresPerSystem + measureIdx;
    if (targetIndex < 0 || targetIndex >= measures.length) return;
    const target = measures[targetIndex];
    // Ensure note array
    let notesArr = target.note;
    if (!Array.isArray(notesArr)) {
      notesArr = target.note = notesArr ? [notesArr] : [];
    }
    // Get divisions for duration
    const divs = part0.measure[0].attributes.divisions;
    // Build new note
    const newNote = {
      pitch: { step: "C", octave: "4" },
      duration: divs,
      voice: "1",
      type: type,
      staff: "1",
    };
    notesArr.push(newNote);
    target.note = notesArr;
    setScoreJson(newJson);
  }

  return (
    <div>
      <h1>Editing: {filename}</h1>
      <div style={{ marginBottom: 10 }}>
        <span draggable onDragStart={(e) => onDragStart(e, 'quarter')} style={{ marginRight: 8, cursor: 'grab' }}>
          ♪ Quarter
        </span>
        <span draggable onDragStart={(e) => onDragStart(e, 'eighth')} style={{ marginRight: 8, cursor: 'grab' }}>
          ♫ Eighth
        </span>
        <span draggable onDragStart={(e) => onDragStart(e, 'half')} style={{ marginRight: 8, cursor: 'grab' }}>
          ♩ Half
        </span>
        <Link href="/SheetMusicTools/MusicLibrary">
          <button>⬅️ Back to Library</button>
        </Link>
      </div>
      <div
        ref={containerRef}
        onDragOver={onDragOver}
        onDrop={onDrop}
        style={{
          backgroundColor: '#fcfcf5',
          width: '100%',
          minHeight: '80vh',
          border: '1px solid #ccc',
        }}
      />
    </div>
  );
}


function drawMusic(json, container) {
  const parsed = json;
  const parts = Array.isArray(parsed['score-partwise'].part)
    ? parsed['score-partwise'].part
    : [parsed['score-partwise'].part];

  container.innerHTML = '';
  const renderer = new Renderer(container, Renderer.Backends.SVG);
  renderer.resize(1400, 2000);
  const ctx = renderer.getContext();

  let y = 40;
  const measureWidth = 280;
  const systemSpacing = 220;

  parts.forEach((part) => {
    const measures = Array.isArray(part.measure) ? part.measure : [part.measure];
    const stavesPerSystem = parseInt(measures[0]?.attributes?.staves || '1', 10);

    const lastClefs = Array(stavesPerSystem).fill('treble');
    const lastKeys = Array(stavesPerSystem).fill('C');
    const systems = chunkArray(measures, 4);

    systems.forEach((system) => {
      const staveYs = Array.from({ length: stavesPerSystem }, (_, i) => y + i * 80);
      const staveGrid = Array.from({ length: stavesPerSystem }, () => []);

      system.forEach((measure, mIdx) => {
        const attrs = measure.attributes || {};
        for (let s = 0; s < stavesPerSystem; s++) {
          if (attrs.clef) lastClefs[s] = extractClef(attrs.clef, s + 1);
          if (attrs.key) lastKeys[s] = extractKey(attrs.key.fifths);
        }
        const voicesByStaff = Array.from({ length: stavesPerSystem }, () => ({}));
        const beamGroupsByVoice = {};

        for (let s = 0; s < stavesPerSystem; s++) {
          const x = 40 + mIdx * (measureWidth + 1);
          const stave = new Stave(x, staveYs[s], measureWidth);
          if (mIdx === 0) {
            stave.setClef(lastClefs[s]).setKeySignature(lastKeys[s]);
            if (attrs.time) {
              const ts = attrs.time;
              stave.setTimeSignature(
                ts.symbol === 'cut' ? 'C|' : `${ts.beats}/${ts['beat-type']}`
              );
            }
            if (stavesPerSystem > 1 && s === 0) {
              const bottom = new Stave(x, staveYs[1], measureWidth);
              new StaveConnector(stave, bottom)
                .setType(StaveConnector.type.BRACE)
                .setContext(ctx)
                .draw();
            }
          }
          // barline logic
          const bars = measure.barline
            ? Array.isArray(measure.barline)
              ? measure.barline
              : [measure.barline]
            : [];
          let hasEnd = false;
          bars.forEach((bl) => {
            const loc = bl['@_location'] || bl.location;
            const rpt = bl.repeat?.['@_direction'] || bl.repeat?.direction;
            const styleVal = typeof bl['bar-style'] === 'object' ? bl['bar-style']['#text'] : bl['bar-style'];
            if (loc === 'left') {
              stave.setBegBarType(rpt === 'forward' ? Barline.type.REPEAT_BEGIN : Barline.type.SINGLE);
            } else if (loc === 'right') {
              hasEnd = true;
              if (rpt === 'backward') stave.setEndBarType(Barline.type.REPEAT_END);
              else if (styleVal === 'light-heavy') stave.setEndBarType(Barline.type.DOUBLE);
              else stave.setEndBarType(Barline.type.SINGLE);
            }
          });
          if (!hasEnd) stave.setEndBarType(Barline.type.SINGLE);

          stave.setContext(ctx).draw();
          staveGrid[s].push(stave);
        }

        const notes = Array.isArray(measure.note) ? measure.note : [measure.note];
        notes.forEach((n, idx) => {
          const staffIdx = (n.staff ? parseInt(n.staff, 10) : 1) - 1;
          const voiceId = n.voice || '1';
          const vfNote = createVFNote(n, lastClefs[staffIdx]);
          if (!vfNote) return;
          const id = `${measure.number}-${staffIdx}-${voiceId}-${idx}`;
          vfNote.setAttribute('data-note-id', id);
          voicesByStaff[staffIdx][voiceId] = voicesByStaff[staffIdx][voiceId] || [];
          voicesByStaff[staffIdx][voiceId].push(vfNote);
          if (n.beam) {
            beamGroupsByVoice[voiceId] = beamGroupsByVoice[voiceId] || [[]];
            const val = Array.isArray(n.beam) ? n.beam[0]['#text'] : typeof n.beam === 'object' ? n.beam['#text'] : n.beam;
            const grp = beamGroupsByVoice[voiceId];
            if (val === 'begin') grp.push([vfNote]);
            else if (val === 'continue' || val === 'end') grp[grp.length - 1].push(vfNote);
          }
        });

        staveGrid.forEach((row, s) => {
          const stave = row[mIdx];
          const voiceObjs = Object.values(voicesByStaff[s]).map(arr => new Voice({ num_beats: 4, beat_value: 4 }).setStrict(false).addTickables(arr));
          if (voiceObjs.length) {
            new Formatter().joinVoices(voiceObjs).format(voiceObjs, measureWidth - 20);
            voiceObjs.forEach(v => v.draw(ctx, stave));
          }
        });
        Object.values(beamGroupsByVoice).forEach(groups => groups.forEach(g => g.length > 1 && new Beam(g).setContext(ctx).draw()));
      });

      for (let m = 0; m < system.length - 1; m++) {
        for (let s = 0; s < stavesPerSystem; s++) {
          new StaveConnector(staveGrid[s][m], staveGrid[s][m + 1]).setType(StaveConnector.type.SINGLE_LEFT).setContext(ctx).draw();
        }
      }
      y += systemSpacing;
    });
  });
}

function chunkArray(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
function extractClef(data, staffNum) {
  if (!data) return 'treble';
  if (Array.isArray(data)) {
    const match = data.find(c => String(c['@_number']||'1') === String(staffNum));
    return mapClef(match?.sign);
  }
  return mapClef(data.sign);
}
function extractKey(fifths) {
  const map = {'-7':'Cb','-6':'Gb','-5':'Db','-4':'Ab','-3':'Eb','-2':'Bb','-1':'F','0':'C','1':'G','2':'D','3':'A','4':'E','5':'B','6':'F#','7':'C#'};
  return map[fifths] || 'C';
}
function mapClef(sign) {
  const map = {G:'treble',F:'bass',C:'alto',percussion:'percussion'};
  return map[sign] || 'treble';
}
function createVFNote(n, clef) {
  const durationMap = {whole:'w',half:'h',quarter:'q',eighth:'8','16th':'16','32nd':'32'};
  const type = n.type?.toLowerCase?.();
  const base = durationMap[type] || 'q';
  const isRest = !!n.rest;
  const dotCount = Array.isArray(n.dot) ? n.dot.length : n.dot ? 1 : 0;
  const duration = base + (isRest ? 'r' : '');
  const keys = isRest ? ['b/4'] : [`${n.pitch.step.toLowerCase()}/${n.pitch.octave}`];
  let acc = null;
  if (!isRest && n.accidental) {
    const xmlAcc = n.accidental.toLowerCase();
    const m = {sharp:'#',flat:'b',natural:'n','double-sharp':'##','flat-flat':'bb'};
    acc = m[xmlAcc] || null;
  }
  const hasBeam = n.beam !== undefined;
  const note = new StaveNote({keys, duration, clef, auto_stem: !hasBeam});
  if (dotCount) Dot.buildAndAttach([note], { all: true });
  if (acc) note.addModifier(new Accidental(acc), 0);
  if (hasBeam) note.setFlagStyle({ fillStyle: 'transparent', strokeStyle: 'transparent' });
  return note;
}
