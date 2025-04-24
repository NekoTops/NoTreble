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

  // TTS settings and preferences
  const [ttsAnnouncement, setTTSAnnouncement] = useState(true);
  const [clickTTS, setClickTTS] = useState(() => {
    if (typeof window !== "undefined") {
      const storedClickTTS = localStorage.getItem("clickTTS");
      return storedClickTTS ? JSON.parse(storedClickTTS) : true; // Default to true if not set
    }
    return true;
  });

  const pathname = usePathname(); // Get current page route
  const db = getFirestore();
  const lastAnnouncementRef = useRef(""); // For preventing repeated announcements

  // --------------- EFFECT HOOKS ---------------
  // Load voices and create utterance when page changes
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
  
    // Check if the clicked element is an image or contains an image
    if (element.tagName === "IMG") {
      content = element.alt?.trim();  // Read the alt text of the clicked image
    } else if (element.tagName === "A" && element.querySelector("img")) {
      const img = element.querySelector("img");
      content = img.alt?.trim();  // Read the alt text of the image inside the anchor
    } else if (["INPUT", "LABEL", "TEXTAREA"].includes(element.tagName)) {
      content = element.value?.trim() || element.getAttribute("placeholder")?.trim() || element.getAttribute("name")?.trim();
    } else {
      content = element.innerText?.trim();
    }
  
    // If content exists (i.e., alt text or inner text), read it; otherwise, read the entire page
    if (content) {
      console.log("Clicked element:", element);
      stopSpeaking();  // Stop any current speech to make room for the new content
      speakPageContent(0, content, element);  // Read the content of the clicked element
    } else {
      return;
    }
  };
  
  // --------------- FIRESTORE FUNCTIONS ---------------
  const saveTTSSettings = async (rate, voice, ttsAnnouncement) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
  
    try {
      const userRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(userRef);
  
      if (docSnap.exists()) {
        const userData = docSnap.data();
        
        // Preserve other fields and only update TTS settings
        const updatedData = {
          ...userData,
          speed: rate,               // Only update the TTS speed
          voice: voice?.name || "",  // Only update the voice
          announcement: ttsAnnouncement // Only update the announcement setting
        };
  
        await updateDoc(userRef, updatedData); // Update only TTS settings
        console.log("Saving voice to Firestore:", voice?.name);
      }
    } catch (error) {
      console.error("Error saving TTS settings:", error.message);
    }
  };
  

  // --------------- PAGE CONTENT EXTRACTION ---------------
  const getPageText = () => {
    const bodyClone = document.body.cloneNode(true);

    const ttsBar = bodyClone.querySelector(".ttsBar");
    if (ttsBar) {
      ttsBar.remove();
    }

    const unwantedTags = bodyClone.querySelectorAll("script, style, template");
    unwantedTags.forEach(tag => tag.remove());

    const images = bodyClone.querySelectorAll("img");
    images.forEach((img) => {
      const altText = img.alt || "";
      const altNode = document.createTextNode(altText + " ");
      img.replaceWith(altNode);
    });

    return bodyClone.innerText.trim();
  };

  // --------------- SIDE EFFECT HOOKS FOR ROUTE CHANGES ---------------
  useEffect(() => {
    if (ttsAnnouncement) {
      const segments = pathname.split("/").filter(Boolean);
      const lastSegment = segments[segments.length - 1] || "Home";

      const pageName = lastSegment
        .replace(/([A-Z])/g, " $1")
        .replace(/-/g, " ")
        .trim();

      const announcement = `You are on the ${pageName} page`;

      if (lastAnnouncementRef.current !== announcement) {
        lastAnnouncementRef.current = announcement;
        speakText(announcement);
      }
    }

    if (!clickTTS) return;

    const attachListeners = () => {
      const elements = document.querySelectorAll('p, h1, h2, h3, span, img, button, input, textarea, label, a');
      elements.forEach(el => el.addEventListener('click', handleClick));
    };
  
    attachListeners();
  
    // Use a MutationObserver to reattach after route changes
    const observer = new MutationObserver(() => {
      attachListeners();
    });
  
    observer.observe(document.body, { childList: true, subtree: true });
  
    return () => {
      observer.disconnect();
      const elements = document.querySelectorAll('p, h1, h2, h3, span, img, button, input, textarea, label, a');
      elements.forEach(el => el.removeEventListener('click', handleClick));
    };
  }, [pathname, clickTTS]);

  return (
    <TTSContext.Provider value={{
      getPageText, speakPageContent, resumeSpeaking, stopSpeaking, isSpeaking, currentIndex,
      rate, setRate, voice, setVoice, voices, setVoices, speakText, clickTTS, setClickTTS, ttsAnnouncement, setTTSAnnouncement
    }}>
      {children}
    </TTSContext.Provider>
  );
};

export const useTTS = () => useContext(TTSContext);
