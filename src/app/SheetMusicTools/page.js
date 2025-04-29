"use client";
import React, { useState, useEffect } from "react";
import FileUploader from "./fileupload";
import SheetMusicInput from "../component/SheetMusicInput";
import { auth } from "@/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useTTS } from "../context/TTSContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Midi } from "@tonejs/midi";
import * as Tone from "tone";
import { GiSaveArrow } from "react-icons/gi";


export default function SheetMusicTools() {
  const router = useRouter();
  const { speakPageContent } = useTTS();

  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  const [sheet, setSheet] = useState({
    title: "",
    composer: "",
    key: "",
    timesig: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/Login");
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setSheet((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleFileChange = (selectedFile) => {
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
      handleUpload(); // Trigger upload on file selection
    } else {
      setPreview(null);
      setUploadStatus("No file selected!");
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return;

    const renamedFile = new File([file], `${user.uid}_${file.name}`, { type: file.type });
    const formData = new FormData();
    formData.append("file", renamedFile);

    setUploading(true);
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      setUploadStatus("File uploaded successfully!");
      const isXml = file.name.endsWith(".xml");

      if (!isXml) {
        const convertResponse = await fetch("/api/convert", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: user.uid,
            filename: file.name,
          }),
        });

        if (convertResponse.ok) {
          setUploadStatus("File converted and uploaded!");
        } else {
          const errText = await convertResponse.text();
          setUploadStatus(`Conversion failed: ${errText}`);
        }
      } else {
        setUploadStatus("XML file uploaded. No conversion needed.");
      }
    } else {
      setUploadStatus("Upload failed. Please try again.");
    }

    setUploading(false);
  };
  
  return (
    <main className="min-h-screen p-6" style={{ background: "linear-gradient(to bottom, white, #4b5583)" }}>
      <div className="flex justify-center mt-8">
      <h1 className="font-bold mb-7 text-h3 text-center">Sheet Music Converter</h1>
      </div>
      <div className="flex flex-col lg:flex-row gap-8 bg-gray-200 p-8 rounded-2xl border-2 border-gray-400 max-w-6xl mx-auto">
        {/* LEFT: Upload + Form + Buttons */}
        <div className="w-full lg:w-5/12 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-xl border shadow flex flex-col gap-6">
            {/* File Upload */}
            <FileUploader setFile={handleFileChange} />

            {/* Enter Piece Info */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xl">
              <div>
                <label className="block mb-1 font-medium">Title:</label>
                <SheetMusicInput
                  type="text"
                  name="title"
                  value={sheet.title}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Composer:</label>
                <SheetMusicInput
                  type="text"
                  name="composer"
                  value={sheet.composer}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </form>

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={uploading}
              className={`w-full font-bold bg-[#455090] hover:bg-[#102437] text-white text-body py-3 rounded shadow flex justify-center items-center gap-2 transition ${
                uploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {uploading ? "Saving..." : "Save File"} <GiSaveArrow className="text-xl" />
            </button>

            {/* Upload Status */}
            {uploadStatus && (
              <p className="text-gray-600 text-body text-center">{uploadStatus}</p>
            )}

            {/* Go to Music Library */}
            <Link href="/SheetMusicTools/MusicLibrary" className="w-full">
              <button className="w-full font-bold bg-[#455090] hover:bg-[#102437] text-white text-body py-3 rounded shadow mt-4">
                Go to Music Library 🎵
              </button>
            </Link>
          </div>
        </div>

        {/* RIGHT: File Preview */}
        <div className="w-full lg:w-7/12 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow w-full h-[700px] flex items-center justify-center overflow-y-auto">
            {preview ? (
              file?.type === "application/pdf" ? (
                <embed
                  src={preview}
                  type="application/pdf"
                  className="w-full h-auto min-h-[600px] rounded"
                />
              ) : (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full max-h-full object-contain rounded"
                />
              )
            ) : (
              <span className="text-gray-500 text-body">No file uploaded</span>
            )}
          </div>
        </div>
      </div>

      {/* Composer CTA */}
      <div className="bg-[#f5f5f5] mt-10 p-8 rounded-2xl shadow border border-gray-300 text-center flex flex-col items-center max-w-4xl mx-auto">
        <h2 className="text-h3 font-bold mb-2">Start Writing Your Own Music!</h2>
        <p className="text-2xl text-gray-700 mb-6 max-w-xl">
          Turn your ideas into reality with our intuitive sheet music composer. Add notes, customize rhythms, and hear your composition come to life.
        </p>

        <img
          src="/piano.jpg"
          alt="Compose your music"
          className="w-full max-w-md mb-6 rounded shadow"
        />

        <Link
          href={{
            pathname: "/SheetMusicTools/MusicComposer",
            query: {
              title: sheet.title,
              composer: sheet.composer,
            },
          }}
        >
          <button className="text-body font-bold bg-green-600 hover:bg-green-800 text-white px-10 py-4 rounded-xl shadow-lg transition duration-300">
            🎼 Start Composing
          </button>
        </Link>
      </div>
    </main>
  );
}
