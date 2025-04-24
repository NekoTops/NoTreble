"use client";
import { createContext, useState, useEffect, useContext, useRef } from "react";
import { auth } from "@/firebaseConfig";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { usePathname } from "next/navigation";

// Create Context
const TTSContext = createContext();

export const TTSProvider = ({ children }) => {
  // --------------- STATE VARIABLES ---------------
  // Speech synthesis and related states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [utterance, setUtterance] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [rate, setRate] = useState(1);
  const [voice, setVoice] = useState();
  const [voices, setVoices] = useState();
  const [ttsAnnouncement, setTTSAnnouncement] = useState(true);
  const pathname = usePathname(); // Gets the current page route
  const db = getFirestore();
  const lastAnnouncementRef = useRef("");

  // TTS settings and preferences
  const [ttsAnnouncement, setTTSAnnouncement] = useState(true);
  const [clickTTS, setClickTTS] = useState(() => {
    if (typeof window !== "undefined") {
      const storedClickTTS = localStorage.getItem("clickTTS");
      return storedClickTTS ? JSON.parse(storedClickTTS) : true; // Default to true if not set
    }
    return true;  // Default value if running in server-side environment
  });

  useEffect(() => {
    // Save the `clickTTS` value to localStorage whenever it changes
    localStorage.setItem("clickTTS", JSON.stringify(clickTTS));
  }, [clickTTS]);

  // Fetching the saved values back when the page changes or reloads
  useEffect(() => {
    const fetchSettings = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser || !voices) return;

      try {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
  
        if (userSnap.exists()) {
          const data = userSnap.data();   // Grab data from user's document
  
          if (data.speed) {
            setRate(data.speed);    // Update the rate of TTS
          }
  
          if (data.voice) {
            const matchedVoice = voices.find(v => v.name === data.voice);
            if (matchedVoice) {
              setVoice(matchedVoice);   // Update the voice of TTS
            }
          }
          
          if (data.hasOwnProperty("announcement")) {
            setTTSAnnouncement(data.announcement); // Use the saved setting
          } else {
            setTTSAnnouncement(true); // Default if not set
          }
        }
      } catch (err) {
        console.error("Failed to load TTS settings:", err.message);
      }
    };
  
    fetchSettings();
  }, [voices]);
    
  useEffect(() => {
    if (voice) {
      saveTTSSettings(rate, voice, ttsAnnouncement);
    }
  }, [rate, voice, ttsAnnouncement]);
  

  useEffect(() => {
    const synth = window.speechSynthesis;
  
    const loadVoices = () => {
      const voices = synth.getVoices();
      if (voices.length > 0) {
        setVoices(voices);
        // Optional fallback
        if (!voice) setVoice(voices[0]);
      }
    };
  
    // Some browsers fire `onvoiceschanged`, some don’t
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }
  
    loadVoices();
  }, []);

  // Set voice and rate from localStorage AFTER voices load
  useEffect(() => {
    if (!voices || voices.length === 0) return;
  
    const storedVoiceName = localStorage.getItem("ttsVoice");
    const storedRate = parseFloat(localStorage.getItem("ttsRate"));
  
    // Set voice
    const match = voices.find(v => v.name === storedVoiceName);
    if (match && (!voice || voice.name !== match.name)) {
      setVoice(match);
    }
  
    // Set rate
    if (!isNaN(storedRate) && rate !== storedRate) {
      setRate(storedRate);
    }
  }, [voices]); // Run once when voices are available
  

  
  // Save clickTTS, rate, and voice preference to localStorage
  useEffect(() => {
    localStorage.setItem("clickTTS", JSON.stringify(clickTTS));
  }, [clickTTS]);

  useEffect(() => {
    if (voice) {
      localStorage.setItem("ttsVoice", voice.name);
    }
  }, [voice]); // Save voice immediately when it changes
  
  useEffect(() => {
    if (!isNaN(rate)) {
      localStorage.setItem("ttsRate", rate.toString());
    }
  }, [rate]); // Save rate immediately when it changes
  

  // Save TTS settings to Firestore when updated
  useEffect(() => {
    if (voice && rate) {
      saveTTSSettings(rate, voice, ttsAnnouncement); // Save settings to Firestore when they change
    }
  }, [rate, voice, ttsAnnouncement]);
  

  // Fetch settings from Firebase on mount
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
  
    const fetchSettings = async () => {
      const userRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(userRef);
  
      if (docSnap.exists()) {
        const data = docSnap.data();
  
        if (!localStorage.getItem("ttsVoice") && data.voice) {
          const match = window.speechSynthesis.getVoices().find(v => v.name === data.voice);
          if (match) setVoice(match);
        }
  
        if (!localStorage.getItem("ttsRate") && data.speed) {
          setRate(data.speed);
        }
  
        setTTSAnnouncement(data.announcement ?? true);
      }
    };
  
    fetchSettings();
  }, []);
  
  // --------------- TTS FUNCTIONS ---------------
  const speakText = (text) => {
    if (!utterance || !text) return;

    window.speechSynthesis.cancel();
    utterance.text = text;
    utterance.voice = voice;
    utterance.rate = rate;

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
  };

  const speakPageContent = (startIndex = 0, content = getPageText(), element = null) => {
    if (!content) return;
  
    const words = content.split(/\s+/);
    const resumedText = words.slice(startIndex).join(" ");
  
    // Always cancel previous utterance
    window.speechSynthesis.cancel();
  
    // Create a new utterance instance per call
    const newUtterance = new SpeechSynthesisUtterance(resumedText);
    newUtterance.rate = rate;
    newUtterance.voice = voice;
  
    let spokenWordCount = startIndex;
  
    newUtterance.onboundary = (event) => {
      if (event.name === "word") {
        const spokenWords = resumedText.slice(0, event.charIndex).split(/\s+/).length;
        spokenWordCount = startIndex + spokenWords;
        setCurrentIndex(spokenWordCount - 1);
      }
    };
  
    newUtterance.onend = () => {
      if (element) {
        document.querySelectorAll(".tts-highlight").forEach(el => el.classList.remove("tts-highlight"));
      }
      setIsSpeaking(false);
      setCurrentIndex(null);
    };
  
    setIsSpeaking(true);
    window.speechSynthesis.speak(newUtterance);
  };

  const resumeSpeaking = () => {
    if (currentIndex !== null) {
      speakPageContent(currentIndex);
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.pause();
    setIsSpeaking(false);
  };

  // --------------- USER INTERACTION HANDLING ---------------
  const handleClick = (event) => {
    const element = event.target;
    let content = "";
  
    // Clear previous highlights to avoid multiple elements being highlighted at the same time
    document.querySelectorAll(".tts-highlight").forEach(el => el.classList.remove("tts-highlight"));
  
    // Add highlight to the current clicked element
    element.classList.add("tts-highlight");
  
    // If the clicked element is a speaker icon, speak the TTS Menu
    if (element.closest('[data-ignore-tts]')) {
      if (isSpeaking) return;
      stopSpeaking();  // Stop any ongoing speech before starting a new one
      speakText("TTS Menu");
      return;
    }

    if (element.closest("tts-announcement")){
      return;
    }

    // Determine what to read for input, label and images
    if (["INPUT", "LABEL", "TEXTAREA", "SELECT"].includes(element.tagName)) {
      content = element.value?.trim() || element.getAttribute("placeholder")?.trim() || element.getAttribute("name")?.trim() || element.getAttribute("title")?.trim();
    } else if (element.tagName === "IMG") {
      content = element.alt?.trim();
    } else {
      content = element.innerText?.trim();
    }

    console.log('Clicked element:', element);

    // If no content found, provide fallback content (e.g., read the entire page or say "No content available")
    if (!content) {
      element.classList.remove("tts-highlight");
      return;
    }
    // on click read
    console.log("I herd a clickkk");

    speakPageContent(0, content, element); // Read current paragraph
  };

  useEffect(() => {
    if (!pathname) return;

    if (ttsAnnouncement){
      // Split the path name into segments and only pick the last segment to announce it
      const segments = pathname.split("/").filter(Boolean);
      const lastSegment = segments[segments.length-1] || "Home";

      const pageName = lastSegment
        .replace(/([A-Z])/g, " $1")
        .replace(/-/g, " ")
        .trim();

      const announcement = `You are on the ${pageName} page`;
      // Only speak if the announcement changed
      if (lastAnnouncementRef.current !== announcement) {
        lastAnnouncementRef.current = announcement;
        speakText(announcement);
      }
    }

    if (!clickTTS) return;  // Unactive this when user choose to turn off this feature
    const elements = document.querySelectorAll('p, h1, h2, h3, span, img, button, input, textarea, label, value');
    elements.forEach(element => {
      element.addEventListener('click', handleClick);
    });

    return () => {
    elements.forEach(element => {
      // Clean up the old event listeners and make sure the current DOM elements have nothing from the previous route
      element.removeEventListener('click', handleClick);
    });
    };
  }, [pathname, handleClick, clickTTS]);

  const saveTTSSettings = async (rate, voice, ttsAnnouncement) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
  
    try {
      // Save voice, rate and announcement settings
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        speed: rate,
        voice: voice?.name || "", 
        announcement: ttsAnnouncement
      });
      console.log("Saving voice to Firestore:", voice?.name);
      console.log("TTS settings saved to Firestore");
    } catch (error) {
      console.error("Error saving TTS settings:", error.message);
    }
  };




  return (
    <TTSContext.Provider value={{ getPageText, speakPageContent, resumeSpeaking, stopSpeaking, isSpeaking, currentIndex,
       rate, setRate, voice, setVoice, voices, setVoices, speakText, clickTTS, setClickTTS, ttsAnnouncement, setTTSAnnouncement }}>
      {children}
    </TTSContext.Provider>
  );
};

export const useTTS = () => useContext(TTSContext);
