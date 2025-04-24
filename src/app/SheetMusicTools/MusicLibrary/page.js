"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { useRouter } from "next/navigation";
import { TfiControlBackward } from "react-icons/tfi";
import "../../cs/MusicLibrary.css"


export default function Library() {
  
    const [files, setFiles] = useState([]);
    const [uid, setUid] = useState('');
    const router = useRouter();
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                alert("Please log in to use this feature");
                router.push("/Login");
                return;
            }
                setUid(user.uid);
                try {
                    const response = await fetch(`/api/listfiles/${user.uid}`);
                    const data = await response.json();
                    setFiles(Array.isArray(data.files) ? data.files : []);
                } catch (error) {
                    console.error('Error fetching file list:', error);
                }
        });

        return () => unsubscribe();
    }, [router]);

    const pieceArray = (array, pieceSize) => {
        const pieces = [];
        for (let i = 0; i < array.length; i += pieceSize) {
          pieces.push(array.slice(i, i + pieceSize));
        }
        return pieces;
      };


      const [searchTerm, setSearchTerm] = useState("");
      const filteredFiles = (files || []).filter((file) =>
        file.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (

    <div className="min-h-screen bg-gray-100 ">
      <Link href="/SheetMusicTools" className="flex w-fit items-center bg-black text-white text-body ml-20 px-4 py-2 rounded-lg hover:bg-white hover:text-black hover:border-2 hover:border-black">
        <TfiControlBackward className="w-1/4 h-1/4 mr-2 flex-shrink-0" /> 
        Back 
      </Link>
      <h1 className="text-center font-bold mt-35 mb-15 text-h2 ">Music Library</h1>

      <div className="flex justify-end pr-40 mb-8 ">
      <input
      type="text"
      placeholder="Search your music library..."
      className="w-[30rem] max-w-md px-6 py-4 text-body border border-gray-500 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      />
      </div>
      {filteredFiles.length === 0 ? (
        <p className="text-center text-body text-gray-500 mt-10">No results found for "{searchTerm}"</p>
      ) : (

      <table className=" musiclibrary w-full shawdow-xl px-6 py-10" >
        <tbody>
          {pieceArray(filteredFiles, 3).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((file) => (
                <td className="musiclibrarydata rounded-3xl hover:scale-90 font-bold hover:underline shadow-xl py-10 " key={file}>
                <div className="flex flex-col items-center">
                  
                  <a href={`/SheetMusicTools/MusicLibrary/MusicListener/${uid}/${file}`}>
                  <img
                    src={'/musicnote.png'} 
                    className="w-60 h-60 mb-4 "
                  />
                  </a>
                  <Link
                    href={`/SheetMusicTools/MusicLibrary/MusicListener/${uid}/${file}`}
                    alt="A picture of a music note"
                    style={{ textDecoration: "none" }}
                    className="text-body"
                  > 
                    🎵 {file}
                  </Link>
                </div>
              </td>
              )) }
              {row.length < 3 &&
            Array(3 - row.length)
            .fill(null)
            .map((_, index) => <td key={`empty-${index}`} className="px-10 mb-6 border-b"></td>)}

              </tr>
          ))}
          </tbody>
          </table>
          )}
          </div>

  )
};
