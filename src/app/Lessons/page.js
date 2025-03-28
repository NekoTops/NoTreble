import React from "react";
import Link from "next/link";
import LevelButton from "../component/LevelButton";



export default function Lessons() {
    const Columns = () =>
    <div className="grid grid-cols-3 mt-4">
    <div className="col-span-1 font-bold text-3xl text-center">Scales</div>
    <div className="col-span-1 font-bold text-3xl text-center">Rhythm</div>
    <div className="col-span-1 font-bold text-3xl text-center">Melody</div>
    <LevelButton level = {1} address ="/Lessons/Fundamentals" ></LevelButton>
    <LevelButton level = {1} address ="/" ></LevelButton>
    <LevelButton level = {1} address ="/Lessons/Textbook?lesson=intervals" />
    <LevelButton level = {2} address ="/" ></LevelButton>
    <LevelButton level = {2} address ="/" ></LevelButton>
    <LevelButton level = {2} address ="/Lessons/Textbook?lesson=triads" ></LevelButton>
    <LevelButton level = {3} address ="/" ></LevelButton>
    <LevelButton level = {3} address ="/" ></LevelButton>
    <LevelButton level = {3} address ="/Lessons/Textbook?lesson=motion" ></LevelButton>
    </div>
    // can add level 4 buttons again if needed

    
    return (
        <main>
        <h1 className="text-center font-bold text-4xl mt-6">Music Theory Lessons</h1>    
        <div className= "mb-6 bg-gray-200 p-10 rounded-lg shadow-lg w-lg mt-4 ">
        <Columns/>
        </div>
        </main>
    );
}