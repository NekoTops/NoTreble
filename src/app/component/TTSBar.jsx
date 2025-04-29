"use client";

import { useState, useEffect, useRef } from "react";
import { FaCirclePause } from "react-icons/fa6";
import { FaCirclePlay } from "react-icons/fa6";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import { useHotkeys } from "react-hotkeys-hook";
import { useTTS } from "../context/TTSContext";

export default function TTSBar() {
  const [buttonClicked, setButtonClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [textSize, setTextSize] = useState("medium");  // <-- Add local textSize here

  const { 
    speakPageContent, speakText, stopSpeaking, isSpeaking,
    currentIndex, resumeSpeaking, rate, setRate,
    voice, setVoice, voices, setVoices,
    ttsAnnouncement, setTTSAnnouncement 
  } = useTTS();

  const menuRef = useRef();

  useEffect(() => {
    const allVoices = window.speechSynthesis.getVoices();
    setVoices(allVoices);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowOptions(false);
      }
    };

    if (showOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOptions]);

  useHotkeys("space", (e) => {
    e.preventDefault();
    handleTTS(e);
  });

  const handleTTS = (e) => {
    e.stopPropagation();
    setButtonClicked(!buttonClicked);
    if (isSpeaking) {
      stopSpeaking();
    } else {
      if (currentIndex !== null) {
        resumeSpeaking();
      } else {
        speakPageContent();
      }
    }
  };

  const handleRate = (e) => {
    stopSpeaking();
    const newRate = parseFloat(e.target.value);
    setRate(newRate);
    speakText(`Speed: ${newRate}`);
  };

  const handleExpand = () => {
    setShowOptions((prev) => !prev);
  };

  const filteredVoices = voices.slice(0, 3);

  const handleVoiceChange = (e) => {
    stopSpeaking();
    const selectedVoice = filteredVoices.find((v) => v.name === e.target.value);
    setVoice(selectedVoice);
    speakText(`Voice: ${e.target.selectedOptions[0].text}`);
  };

  const handleAnnouncement = (e) => {
    setTTSAnnouncement(e.target.checked);
    const choice = e.target.checked ? "on" : "off";
    speakText(`Announce Page ${choice}`);
  };

  const handleTextSizeChange = (e) => {
    const newSize = e.target.value;
    setTextSize(newSize);

    // Remove both classes first to prevent conflict
    document.body.classList.remove("large-text-size", "medium-text-size");

    // Add the selected class
    if (newSize === "large") {
      document.body.classList.add("large-text-size");
    } else if (newSize === "medium") {
      document.body.classList.add("medium-text-size");
    }

    speakText(`Text size set to ${newSize}`);
  };

  return (
    <div
      style={{ position: "fixed", bottom: "10px", right: "20px", zIndex: 1000 }}
    >
      <div style={{ position: "relative" }} ref={menuRef}>
        <button
          data-ignore-tts
          onClick={(e) => {
            e.stopPropagation();
            handleExpand();
          }}
        >
          <HiMiniSpeakerWave size={70} data-ignore-tts className="hover:scale-125" />
        </button>

        {showOptions && (
          <div
            className="absolute bottom-12 right-0 bg-[#f5f5f5] border rounded-xl p-3 transition-all duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center">
              <div
                className="mr-5 transition-transform transform hover:scale-125 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTTS(e);
                }}
              >
                {!isSpeaking ? (
                  <FaCirclePlay size={40} color={isHovered ? "#303E60" : "#455090"} />
                ) : (
                  <FaCirclePause size={40} color={isHovered ? "#303E60" : "#455090"} />
                )}
              </div>

              <div className="mr-5 text-body">
                <label>Speed</label>
                <select
                  value={rate}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleRate(e);
                  }}
                  className="content-center text-center text-body bg-gray-300 shadow"
                  title={`Speed: ${rate}`}
                >
                  <option value="0.5">0.5</option>
                  <option value="0.75">0.75</option>
                  <option value="1">1</option>
                  <option value="1.5">1.5</option>
                  <option value="1.75">1.75</option>
                  <option value="2">2</option>
                </select>
              </div>

              <div className="mr-5 text-body">
                <label>Voice</label>
                <select
                  className="bg-gray-300 shadow"
                  value={voice?.name}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleVoiceChange(e);
                  }}
                  title={`Voice: ${voice?.name}`}
                >
                  {filteredVoices.map((v, i) => (
                    <option key={i} value={v.name}>{`Voice ${i + 1}`}</option>
                  ))}
                </select>
              </div>

              <div className="text-body">
                <label>Text</label>
                <select
                  className="bg-gray-300 shadow"
                  value={textSize}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleTextSizeChange(e);
                  }}
                  title={`Text Size: ${textSize}`}
                >
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>

            <div>
              <input 
                type="checkbox"
                id="announcementToggle"
                checked={ttsAnnouncement}
                onChange={(e) => handleAnnouncement(e)}
                className="tts-announcement w-6 h-6 m-4"
              />
              <label htmlFor="announcementToggle" className="text-body">Announce page</label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
