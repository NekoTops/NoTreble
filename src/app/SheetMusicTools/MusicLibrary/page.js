"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { useRouter } from "next/navigation";
export default function Library() {
    const [files, setFiles] = useState([]);
    const [uid, setUid] = useState('');
    const router = useRouter();
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                console.alert("Please log in to use this feature");
                router.push("/Login");
                return;
            }
                setUid(user.uid);
                try {
                    const response = await fetch(`/api/listfiles/${user.uid}`);
                    const data = await response.json();
                    setFiles(data.files);
                } catch (error) {
                    console.error('Error fetching file list:', error);
                }
        });

        return () => unsubscribe();
    }, [router]);

    return (
        <div>
            <Link href="/SheetMusicTools">
                <button className="font-bold text-body hover:underline" >⬅️ Back to Tools</button>
            </Link>
            <h1 className="text-center font-bold mt-35 mb-15 text-h3" >Music Library</h1>
            <ul>
                {files.map((file) => (
                    <li key={file}>
                        <Link href={`/SheetMusicTools/MusicLibrary/MusicEditor/${uid}/${file}`} style={{ textDecoration: 'none' }}>
                            🎵 {file}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
