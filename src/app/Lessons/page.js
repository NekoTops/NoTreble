"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import LevelButton from "../component/LevelButton";
import LessonHeader from "../component/LessonHeader";


export default function Lessons() { 

    const Columns = () => 
    <div className="grand_lessons_div grid grid-cols-3 mt-2">
        <div>
            <LessonHeader lesson = "Scales"></LessonHeader>
            <LevelButton level = {1} address ="/Lessons/Key/Lesson1-Pitches" ></LevelButton>
            <LevelButton level = {2} address ="/Lessons/Key/Lesson2-Scales" ></LevelButton>
            <LevelButton level = {3} address ="/Lessons/Key/Lesson3-Key-Signatures" ></LevelButton>
        </div>
        <div>
            <LessonHeader lesson = "Rhythm"></LessonHeader>
            <LevelButton level = {1} address ="/Lessons/Rhythm/Lesson1-Rhythmic-Values" ></LevelButton>
            <LevelButton level = {2} address ="/Lessons/Rhythm/Lesson2-Beams-and-Borrowed-Divisions" ></LevelButton>
            <LevelButton level = {3} address ="/Lessons/Rhythm/Lesson3-Meter" ></LevelButton>
        </div>
        <div>
            <LessonHeader lesson = "Melody"></LessonHeader>
            <LevelButton level = {1} address ="/Lessons/Melody/Lesson1-Intervals" />
            <LevelButton level = {2} address ="/Lessons/Melody/Lesson2-Triads-and-Seventh-Chords" ></LevelButton>
            <LevelButton level = {3} address ="/Lessons/Melody/Lesson3-Motion" ></LevelButton>
        </div>

    </div>
    // can add level 4 buttons again if needed
    // thinking about changing the names of the level buttons

    return (
        <main>
        <h1 className="text-center font-bold mt-6 " style={{fontSize: 'calc(var(--h3-text-size) + 8px)'}}>Music Theory Lessons</h1>    
        <div className= "mb-6 bg-gray-200 p-10 rounded-lg shadow-lg w-lg mt-4 ">
        <Link href="/Lessons/Introduction">
            <div
            className=" lvlBtn  col-span-1 text-semibold w-60 bg-[#455090] text-white   
            rounded-lg hover:bg-[#102437] shadow-md "
            style={{ display: 'block', margin: 'auto', marginBottom: '20px', marginTop: '10px', height: '10vh'}}
            >
            <p>Intro</p>
            </div>
        </Link>
        <Columns/>
        </div>
        </main>
    );
}