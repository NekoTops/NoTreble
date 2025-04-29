"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function Lessons() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const LessonUnit = ({ imgSrc, address, level, delay }) => (
    <div
      className={`flex flex-col items-center transition-all duration-700 ease-out transform ${
        mounted ? "opacity-100 scale-100" : "opacity-0 scale-90"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <Link href={address}>
        <div className="flex items-center justify-center w-36 h-36 bg-white rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all overflow-hidden p-4">
          {imgSrc && (
            <img
              src={imgSrc}
              alt="Lesson Icon"
              className="object-contain w-full h-full"
            />
          )}
        </div>
      </Link>
      {level && (
        <p
          className="mt-2 text-gray-600 font-medium"
          style={{ fontSize: "calc(var(--h3-text-size) - 8px)" }}
        >
          {level}
        </p>
      )}
    </div>
  );

  return (
    <main
      className="min-h-screen"
      style={{
        background: "linear-gradient(to bottom, white, #4b5583)",
        paddingBottom: "2rem",
      }}
    >
      {/* Title Box */}
      <div className="flex justify-center mt-8">
          <h1
            className="text-center font-bold"
            style={{
              fontSize: "calc(var(--h3-text-size) + 8px)",
            }}
          >
            Music Theory Lessons
          </h1>
      </div>

      {/* Card Background */}
      <div className="mb-6 bg-gray-200 p-10 rounded-lg shadow-lg w-full mt-8 max-w-6xl mx-auto">

        {/* Intro Section */}
        <div className="text-center mb-10">
          <h2
            className="font-semibold text-gray-700 mb-6"
            style={{ fontSize: "calc(var(--h3-text-size) + 2px)" }}
          >
            Intro
          </h2>
          <div className="flex justify-center">
            <LessonUnit
              imgSrc="/images/intro.png"
              address="/Lessons/Introduction"
              level="Intro"
              delay={100}
            />
          </div>
        </div>

        {/* Scales Section */}
        <div className="text-center mb-10">
          <h2
            className="font-semibold text-gray-700 mb-6"
            style={{ fontSize: "calc(var(--h3-text-size) + 2px)" }}
          >
            Scales
          </h2>
          <div className="flex justify-center gap-10 flex-wrap">
            <LessonUnit
              imgSrc="/images/scales.png"
              address="/Lessons/Key/Lesson1-Pitches"
              level="Level 1"
              delay={200}
            />
            <LessonUnit
              imgSrc="/images/scales.png"
              address="/Lessons/Key/Lesson2-Scales"
              level="Level 2"
              delay={300}
            />
            <LessonUnit
              imgSrc="/images/scales.png"
              address="/Lessons/Key/Lesson3-Key-Signatures"
              level="Level 3"
              delay={400}
            />
          </div>
        </div>

        {/* Rhythm Section */}
        <div className="text-center mb-10">
          <h2
            className="font-semibold text-gray-700 mb-6"
            style={{ fontSize: "calc(var(--h3-text-size) + 2px)" }}
          >
            Rhythm
          </h2>
          <div className="flex justify-center gap-10 flex-wrap">
            <LessonUnit
              imgSrc="/images/rhythm.png"
              address="/Lessons/Rhythm/Lesson1-Rhythmic-Values"
              level="Level 1"
              delay={500}
            />
            <LessonUnit
              imgSrc="/images/rhythm.png"
              address="/Lessons/Rhythm/Lesson2-Beams-and-Borrowed-Divisions"
              level="Level 2"
              delay={600}
            />
            <LessonUnit
              imgSrc="/images/rhythm.png"
              address="/Lessons/Rhythm/Lesson3-Meter"
              level="Level 3"
              delay={700}
            />
          </div>
        </div>

        {/* Melody Section */}
        <div className="text-center">
          <h2
            className="font-semibold text-gray-700 mb-6"
            style={{ fontSize: "calc(var(--h3-text-size) + 2px)" }}
          >
            Melody
          </h2>
          <div className="flex justify-center gap-10 flex-wrap">
            <LessonUnit
              imgSrc="/images/melody.png"
              address="/Lessons/Melody/Lesson1-Intervals"
              level="Level 1"
              delay={800}
            />
            <LessonUnit
              imgSrc="/images/melody.png"
              address="/Lessons/Melody/Lesson2-Triads-and-Seventh-Chords"
              level="Level 2"
              delay={900}
            />
            <LessonUnit
              imgSrc="/images/melody.png"
              address="/Lessons/Melody/Lesson3-Motion"
              level="Level 3"
              delay={1000}
            />
          </div>
        </div>

      </div>
    </main>
  );
}
