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
    <main>
      <div className="m-20">
        <h1 className="font-bold mb-7 text-4xl">Sheet Music Converter</h1>

  <div className="w-auto h-auto bg-gray-200 rounded-2xl text-body p-4 pl-7 flex flex-col md:flex-row border-2 border-gray-400">
    <div className="md:w-1/2 flex flex-col justify-between p-4">
      <FileUploader setFile={handleFileChange} />


    </div>

          <div className="w-1/2 p-4">
            {preview ? (
              file.type === "application/pdf" ? (
                <embed
                  src={preview}
                  type="application/pdf"
                  className="w-full h-full max-h-full object-contain"
                />
              ) : (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full max-h-full object-contain rounded"
                />
              )
            ) : (
              <span className="text-gray-500">No file uploaded</span>
            )}
          </div>
          {uploadStatus && <p className="mt-2 text-body">{uploadStatus}</p>}

        </div>

        <div >
        <button className="text-center text-body  font-bold hover:bg-[#102437] bg-[#455090] text-white px-8 py-4 rounded-md mb-6 shadow-lg ml-80 float-right inline-flex gap-4" 
        onClick={handleUpload} disabled={uploading}>
      {uploading ? "Saving..." : "Save File"} <GiSaveArrow className="text-gray-800 text-4xl" />
      </button>

        <Link href="SheetMusicTools/MusicLibrary">
      <button className="text-center text-body font-bold hover:bg-[#102437] bg-[#455090] text-white px-4 py-4 rounded-md mb-4 shadow-lg">
      Go to Music Library 🎵 
      </button>
    </Link>

      </div>
  <div >
  
  
  
  </div>
</div>

      <div className="ml-20 mr-20 mb-20">
        <h1 className="font-bold mb-7 text-4xl">Sheet Music Composer</h1>
        <form className="block bg-gray-200 rounded-2xl p-4 pl-7 text-3xl border-2 border-gray-400" onSubmit={handleSubmit}>
          <label className="block mb-4">
            Enter Title:
            <SheetMusicInput type="text" name="title" value={sheet.title} onChange={handleChange} />
          </label>
          <label className="block mb-4">
            Enter Composer Name:
            <SheetMusicInput type="text" name="composer" value={sheet.composer} onChange={handleChange} />
          </label>
          <label className="block mb-4">
            Enter Key:
            <SheetMusicInput type="text" name="key" value={sheet.key} onChange={handleChange} />
          </label>
          <label className="block mb-4">
            Enter Time Signature:
            <SheetMusicInput type="text" name="timesig" value={sheet.timesig} onChange={handleChange} />
          </label>
        </form>

        <Link
          href={{
            pathname: "/SheetMusicTools/MusicComposer",
            query: {
              title: sheet.title,
              key: sheet.key,
              timesig: sheet.timesig,
              composer: sheet.composer,
            },
          }}
        >
          <button className="mt-4">🎼 Start Composing</button>
        </Link>
      </div>
    </main>
  );
}
