// src/app/Lessons/Textbook/page.js
"use client" 
import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { realtimeDB } from "@/firebaseConfig"; // Make sure you've set up Firebase in your project
import { useSearchParams } from "next/navigation";


export default function Textbook() {
  const [lessonData, setLessonData] = useState(null);
  const searchParams = useSearchParams();
  const lesson  = searchParams.get("lesson"); // Get the lesson from query params like "/Lessons/Textbook?lesson=intervals"

  useEffect(() => {
    const fetchLessonData = async () => {
      if(lesson) {
        const textbookRef = ref(realtimeDB, `openMusicTheory/Lessons/${lesson}`);
        const snapshot = await get(textbookRef);
        if (snapshot.exists()) {
          setLessonData(snapshot.val());
        } else {
          console.error("Lesson data not found");
        }
      }
    };
      fetchLessonData();
  }, [lesson]);

  if (!lessonData) return <p>Loading...</p>;

  return (
    <main>
      <h1 className="text-center font-bold text-4xl mt-6">Lesson: {lessonData.title}</h1>
      <div className="mb-6 bg-gray-200 p-10 rounded-lg shadow-lg w-lg mt-4">
        <p>Creator: {lessonData.creator}</p>
        <p><a href={lessonData.link} target="_blank" rel="noopener noreferrer">View Lesson</a></p>
      </div>
    </main>
  );
}
