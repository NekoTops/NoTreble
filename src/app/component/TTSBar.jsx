"use client";
import { useState, useEffect, useRef } from "react";
import { FaCirclePause } from "react-icons/fa6";
import { FaCirclePlay } from "react-icons/fa6";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import { useHotkeys } from 'react-hotkeys-hook'
import { useTTS } from "../context/TTSContext"; // Import TTS functions

export default function TTSBar() {
  const [buttonClicked, setButtonClicked] = useState(false); // State to track if the button is clicked
  const [isHovered, setIsHovered] = useState(false);
  const [showOptions, setShowOptions] = useState(false);  // State for the expanding button   
  const { speakPageContent, stopSpeaking, isSpeaking, currentIndex, resumeSpeaking, rate, setRate, voice, setVoice, voices, setVoices, ttsAnnouncement, setTTSAnnouncement } = useTTS(); // Use the TTS context
  const menuRef = useRef();
    
  useEffect(() => {
    // Ensure the voices are populated from the SpeechSynthesis API
    const allVoices = window.speechSynthesis.getVoices();
    setVoices(allVoices); // Set the available voices in the TTS context
  }, []);

  useEffect(() =>{
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowOptions(false);
      }
    }

    if (showOptions){
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOptions]);

  // Bind play/pause button with space bar
  useHotkeys("space", (e) => {
    e.preventDefault()   // Stop spacebar from scrolling
    handleTTS(e);
  });

  const handleTTS = (e) => {
    const target = e.target

    e.stopPropagation();    // stop the event bubbling
    setButtonClicked(!buttonClicked);
    if (isSpeaking) {
      stopSpeaking();  // Stop speech if currently speaking
    } else {
      // Start from the beginning, or resume from the last word
      if (currentIndex !== null) {
        resumeSpeaking(); // Resume if we have a current index
      } else {
        speakPageContent(); // Start speaking if no previous index
      }
    }
  };

  const handleRate = (e) => {
    // Stop speaking when user chooses a new rate
    stopSpeaking();
    const newRate = parseFloat(e.target.value);
    setRate(newRate);
  };

  const handleExpand = () => {
    setShowOptions(prev => !prev);
  };

  const filteredVoices = voices.slice(0, 3);

  const handleVoiceChange = (e) => {
    stopSpeaking();
    const selectedVoice = filteredVoices.find((v) => v.name === e.target.value);
    console.log("voice:", selectedVoice)
    setVoice(selectedVoice); // Update the voice in the TTS context
  };

  // Get the first 3 voices from the available voices list

  return (
    <div
      className="ttsBar"
      style={{ position: "fixed", bottom: "10px", right: "60px", zIndex: 1000 }}
    >
      <div style={{ position: "relative" }} ref={menuRef}>
        {/* Speaker button (only toggles dropdown) */}
        <button
          data-ignore-tts
          onClick={(e) => {
            e.stopPropagation();
            handleExpand();
          }}
        >
          <HiMiniSpeakerWave size={50} className="hover:scale-125" />
        </button>

        {/* Dropdown Options */}
        {showOptions && (
          <div
            className="absolute bottom-12 right-0 bg-[#f5f5f5] border rounded-xl p-3 transition-all duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()} // Prevent dropdown clicks from closing the menu
          >
            <div className="flex items-center">
              {/* Play / Pause button */}
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

              {/* Speed Dropdown */}
              <div className="mr-5 text-body">
                <label>Speed</label>
                <select
                  value={rate}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleRate(e);
                  }}
                  className="content-center text-center text-body bg-gray-300 shadow"
                >
                  <option value="0.5">0.5</option>
                  <option value="0.75">0.75</option>
                  <option value="1">1</option>
                  <option value="1.5">1.5</option>
                  <option value="1.75">1.75</option>
                  <option value="2">2</option>
                </select>
              </div>

              {/* Voice Dropdown */}
              <div className="text-body">
                <label>Voice</label>
                <select
                  className="bg-gray-300 shadow"
                  value={voice?.name}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleVoiceChange(e);
                  }}
                >
                  {filteredVoices.map((v, i) => (
                    <option key={i} value={v.name}>{`Voice ${i + 1}`}</option>
                  ))}
                </select>
              </div>
          </div>
          {/* Option to toggle the page announcement*/}
          <div>
            <input 
              type="checkbox"
              id="announcementToggle"
              checked={ttsAnnouncement}
              onChange={(e) => setTTSAnnouncement(e.target.checked)}
              className="w-6 h-6 m-4"
            />
            <label htmlFor="announcementToggle" className="text-body">Announce page</label>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
