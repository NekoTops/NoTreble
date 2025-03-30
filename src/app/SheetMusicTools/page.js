"use client";
import React, { useState } from "react";
import Link from "next/link";
import FileUploader from "./fileupload";

export default function SheetMusicTools() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    //Music sheet starts out with 4 properties
    const [sheet, setSheet]=useState({
        title: "",
        composer: "",
        key: "",
        timesig: ""
    });

    //Handle the change when the input changes and assign it to the appropriate field
    const handleChange = ({ target }) => {
        const { name, value } = target;
        setSheet((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    //Prevent resetting the page to default after every input
    const handleSubmit = (event) => {
        event.preventDefault();
      };


    function handleFileChange(selectedFile) {
        setFile(selectedFile);
        
        // Generate preview URL for images/PDFs
        if (selectedFile) {
            setPreview(URL.createObjectURL(selectedFile)); 
        } else {
            setPreview(null); // Clear preview if no file is selected
        }
    }

    return (
        <main>
            <div className="m-20">
                <h1 className="font-bold text-5xl mb-7">Sheet Music Reader</h1>
                
                {/* Responsive Container */}
                <div className="w-auto h-[600px] bg-gray-200 -z-10 rounded-2xl text-2xl p-4 pl-7 flex flex-col md:flex-row border-2 border-gray-400">
                    
                    {/* Left Section: File Upload + Info */}
                    <div className="md:w-1/2 flex flex-col justify-between p-4">
                    <FileUploader setFile={handleFileChange} />

                        {/* Info Section (Anchored to Bottom) */}
                        <Link href = "/musiclibrary">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded">Go to Music Library</button>
                        </Link>
                        <div className="mt-auto text-left md:text-4xl text-lg">
                            <p className="pb-3">Piece Title: </p>
                            <p className="pb-3">Key: </p>
                            <p className="pb-3">Time Signature: </p>
                            <p className="pb-3">Composer: </p>
                        </div>
                    </div>

                    {/* Right Section: Image/PDF Preview */}
                    <div className="w-1/2 p-4 align-top shrink">
                            {preview ? (
                                file.type === "application/pdf" ? (
                                    <embed src={preview} type="application/pdf"  className="w-full h-full max-h-full object-contain"/>
                                ) : (
                                    <img src={preview} alt="Preview" className="w-full h-full max-h-full object-contain rounded" />
                                )
                            ) : (
                                <span className="text-gray-500">No file uploaded</span>
                            )}
                    </div>
                </div>
            </div>

            <br />
            
            <div className="ml-20 mr-20 mb-20">
                <h1 className="font-bold text-5xl mb-7">Sheet Music Composer</h1>
                <form className= "inset-2 bg-gray-200 -z-10 rounded-2xl p-4 pl-7 text-3xl border-2 border-gray-400">
                    <label className="mt-5 block">
                        Enter Title:
                        <input 
                            type="text"
                            name="title"
                            value={sheet.title}
                            onChange={handleChange} 
                            className="mt-2 ml-3 px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:border-blue-600"
                        />
                    </label>
                    <label className="mt-5 block">
                        Enter Composer Name:
                        <input
                            type="text" 
                            name="composer"
                            value={sheet.composer}
                            onChange={handleChange}  
                            className="mt-2 ml-3 px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:border-blue-600"
                        />
                    </label>
                    <label className="mt-5 block">
                        Enter Key:
                        <input
                            type="text" 
                            name="key"
                            value={sheet.key}
                            onChange={handleChange} 
                            className="mt-2 ml-3 px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:border-blue-600"
                        />
                    </label>
                    <label className="mt-5 block">
                        Enter Time Signature:
                        <input
                            type="text" 
                            name="timesig"
                            value={sheet.timesig}
                            onChange={handleChange}  
                            className="mt-2 ml-3 px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:border-blue-600"
                        />
                    </label>
                </form>
                <div className="w-1/2 p-4 align-top shrink">
                    <img 
                    src="null" 
                    alt="Generated or Placeholder" 
                    />
                </div>
            </div>
        </main>
    );
}