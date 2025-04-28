"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useHotkeys } from 'react-hotkeys-hook'
import { useTTS } from "../context/TTSContext"; // Import TTS functions
import { onAuthStateChanged, updateEmail, updatePassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { auth } from "@/firebaseConfig";
import { getUserProfile, updateUserProfile } from "@/lib/firebase/auth";
import { FaCirclePause } from "react-icons/fa6";
import { FaCirclePlay } from "react-icons/fa6";
import { MdSettingsSuggest } from "react-icons/md";

export default function TTSBar() {
  const router = useRouter();
  const db = getFirestore();
  const [user, setUser] = useState(null);
  const [newTextSize, setTextSize] = useState("medium");
  const [newTTS, setTTS] = useState(false);
  const { clickTTS, setClickTTS } = useTTS(); // Use the TTS context
  const [buttonClicked, setButtonClicked] = useState(false); // State to track if the button is clicked
  const [showOptions, setShowOptions] = useState(false);  // State for the expanding button   
  const { speakPageContent, speakText, stopSpeaking, isSpeaking, currentIndex, resumeSpeaking, rate, 
        setRate, voice, setVoice, voices, setVoices, ttsAnnouncement, setTTSAnnouncement, highlightTTS, setHighlightTTS, saveTTSSettings } = useTTS(); // Use the TTS context
  const menuRef = useRef();
    
  useEffect(() => {
    // Ensure that all voices are populated to the list
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      setVoices(allVoices);
    };
  
    // Listen to voices change event
    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
  
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/Login");
        return;
      }
      try {
        const profileData = await getUserProfile(currentUser.uid);
        setUser({
          ...profileData,
        });
        setTTS(profileData.clickTTS || true);
  
        // Fetch the text size setting to work with global CSS
        const storedTextSize = profileData.textSize || "medium";
        setTextSize(storedTextSize);
        
        document.body.classList.toggle("large-text-size", storedTextSize === "large");
        document.body.classList.toggle("medium-text-size", storedTextSize === "medium");
        
        document.documentElement.style.setProperty('--custom-text-size', storedTextSize === 'large' ? '18px' : '14px');
        
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    });
  
    return () => unsubscribe();
  }, [router]);

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
      if (currentIndex != null && currentIndex >= 0) {
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
    speakText(`Speed: ${newRate}`);  // Inform the user the change in tts speed
  };

  const handleExpand = () => {
    setShowOptions(prev => !prev);
  };
  
  // Get the first 3 voices from the available voices list
  const filteredVoices = voices.slice(0, 3);

  const handleVoiceChange = (e) => {
    stopSpeaking();
    const selectedVoice = filteredVoices.find((v) => v.name === e.target.value);
    console.log("voice:", selectedVoice)
    setVoice(selectedVoice); // Update the voice in the TTS context
    speakText(`Voice: ${e.target.selectedOptions[0].text}`);  // Inform the user the change in tts voice
  };

  const handleAnnouncement = (e) => {
    const newAnnouncement = e.target.checked;
    setTTSAnnouncement(newAnnouncement);
  
    let choice = newAnnouncement ? "on" : "off";
    speakText(`Announce Page ${choice}`);
  };

  const handleToggle = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser || clickTTS === null) return;  // Ensure user is loaded and newTTS is not null
  
    const toggledTTS = !clickTTS;  // Toggle the current value
  
    try {
      // Update TTS setting in Firestore
      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(userRef, { clickTTS: toggledTTS }, { merge: true });
  
      console.log(`TTS set to ${toggledTTS ? "ON" : "OFF"}`);
      setClickTTS(toggledTTS);  // Update local state for TTS

      if (toggledTTS) {
        speakText("Click to speak on");
      }
      else {
        speakText("Click to speak off");
      }

    } catch (error) {
      console.error("Error updating TTS setting:", error);
    }
  };
  
  const handleTextSizeChange = async (newTextSize) => {
    // Toggle the text size classes on the body
    document.body.classList.toggle("large-text-size", newTextSize === "large");
    document.body.classList.toggle("medium-text-size", newTextSize === "medium");
    
    // Update the local state
    setTextSize(newTextSize);
    if (newTextSize == "medium") {
      speakText("Text size set to medium");
    }
    else {
      speakText("Text size set to large");
    }
    // Update the text size preference in Firestore
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userRef = doc(db, "users", currentUser.uid);
      try {
        await setDoc(userRef, { textSize: newTextSize }, { merge: true });
        console.log(`Text size set to ${newTextSize}`);
      } catch (error) {
        console.error("Error updating text size:", error);
      }
    }
  }; 
  
  const handleHighlight = async (e) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;  // No need to check clickTTS here
  
    const newHighlight = e.target.checked;  // Get the checkbox's new value
  
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(userRef, { highlightTTS: newHighlight }, { merge: true });
  
      setHighlightTTS(newHighlight);
  
      if (newHighlight) {
        speakText("Highlighting texts on");
      } else {
        speakText("Highlighting texts off");
      }
    } catch (error) {
      console.error("Error updating TTS setting:", error);
    }
  };
  
  return (
    <div
      style={{ position: "fixed", bottom: "10px", right: "20px", zIndex: 1000 }}
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
          <MdSettingsSuggest size={50} data-ignore-tts className= "hover:scale-125" />
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
                  <FaCirclePlay size={40} color="#303E60" />
                ) : (
                  <FaCirclePause size={40} color="#303E60"/>
                )}
              </div>

              {/* Speed Dropdown */}
              <div className="mr-5 text-custom">
                <label>Speed</label>
                <select 
                  value={rate}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleRate(e);
                  }}
                  className="content-center text-center bg-gray-300 shadow"
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

              {/* Voice Dropdown */}
              <div className="text-custom">
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
          </div>
          {/* Option to toggle the page announcement*/}
          <div className="ignore-item flex text-custom items-center space-x-2 mt-4">
            <label htmlFor="announcementToggle" className="text-custom">Announce page</label>
            <input 
              type="checkbox"
              id="announcementToggle"
              checked={ttsAnnouncement}
              onChange={(e) => handleAnnouncement(e)}
              className="tts-announcement w-6 h-6"
            />
          </div>
          <div className="ignore-item flex text-custom items-center space-x-2 mt-4">
            <label htmlFor="clickToSpeakToggle" className="text-custom">
              Click to Speak:
            </label>
              <input
                id="clickToSpeakToggle"
                type="checkbox"
                checked={clickTTS}
                onChange={handleToggle}
                className="w-6 h-6"
              />
          </div>
          {/* Option to toggle the highlight for manual TTS */}
          <div className="ignore-item flex text-custom items-center space-x-2 mt-4">
            <label htmlFor="clickToHighlight" className="text-custom">
              Highlight Texts:
            </label>
              <input
                id="clickToHighlight"
                type="checkbox"
                checked={highlightTTS}
                onChange={handleHighlight}
                className="w-6 h-6"
              />
          </div>
          {/* Text Size Buttons */}
          <div className="ignore-item flex text-custom items-center space-x-4 mt-4">
            <p>Text Sizes:</p>
            <div className="space-x-2">
              <button
                onClick={() => handleTextSizeChange("medium")}
                className={`uppercase px-3 py-2 font-bold border rounded-lg ${
                  newTextSize === "medium" ? "bg-green-500 text-white" : "bg-white text-black"
                }`}
              >
                M
              </button>
              <button
                onClick={() => handleTextSizeChange("large")}
                className={`uppercase px-3 py-1 font-bold text-[var(--custom-text-size)] border rounded-lg ${
                  newTextSize === "large" ? "bg-green-500 text-white" : "bg-white text-black"
                }`}
              >
                L
              </button>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
