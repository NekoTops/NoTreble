import React from "react";
                                        //setFile is var to use elsewhere via import
export default function FileUploader({ setFile }) {
    function handleFileChange(e) {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        // Only accept png, jpeg, jpg, and pdf files
        const validTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
        if (!validTypes.includes(selectedFile.type)) {
            alert("Invalid file type. Please upload an image or a PDF.");
            return;
        }

        setFile(selectedFile); // Send file to parent component
    }
    
  return (
        <div>
            <input
                type="file"
                id="fileInput"
                onChange={handleFileChange}
                accept="image/*, application/pdf"
                style={{ display: "none" }}
            />
            <button  className="w-150 mt-4 px-3 py-2 md:text-4xl text-lg border-2 border-black bg-white text-black rounded hover:bg-gray-400 duration-300"
            onClick={() => document.getElementById("fileInput").click()}>
                    Upload Image or PDF
            </button> 
        </div>
    );
}

