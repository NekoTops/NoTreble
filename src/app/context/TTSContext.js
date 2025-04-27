"use client";
import { createContext, useState, useEffect, useContext, useRef } from "react";
import { auth } from "@/firebaseConfig";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { usePathname } from "next/navigation";

// Create Context
const TTSContext = createContext();

export const TTSProvider = ({ children }) => {
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

  const [clickTTS, setClickTTS] = useState(() => {
    if (typeof window !== "undefined") {
      const storedClickTTS = localStorage.getItem("clickTTS");
      return storedClickTTS ? JSON.parse(storedClickTTS) : true;  // Default to true if not set
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
          const data = userSnap.data();
        
          if (data.speed) setRate(data.speed);
          if (data.voice) {
            const matchedVoice = voices.find(v => v.name === data.voice);
            if (matchedVoice) setVoice(matchedVoice);
          }
          if (data.hasOwnProperty("announcement")) {
            setTTSAnnouncement(data.announcement);
          } else {
            setTTSAnnouncement(true);
          }
          
          if (data.hasOwnProperty("clickTTS")) {
            setClickTTS(data.clickTTS);     // <-- FETCH FROM DATABASE
          } else {
            setClickTTS(true); // Default true if not set
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
      saveTTSSettings(rate, voice, ttsAnnouncement, clickTTS);  // <-- Add clickTTS
    }
  }, [rate, voice, ttsAnnouncement, clickTTS]);
  
  

  useEffect(() => {
    const synth = window.speechSynthesis;
    
    // Get the voices available for different browsers
    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);   // Store all voices

      // Set to default voice if none is saved
      if (!voice){
        setVoice(availableVoices[0]);   // Default voice
      }
    };
    const newUtterance = new SpeechSynthesisUtterance();
    setUtterance(newUtterance);
  
    // Stop speech and reset state on route change
    synth.cancel();
    setIsSpeaking(false);
    setCurrentIndex(0);

    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }
  
    loadVoices(); // Also run on mount
  
    return () => {
      synth.cancel(); // Also stop speech on unmount
    };
  }, [pathname]);

  const getPageText = () => {
    // Clone the entire body so we can manipulate it without affecting the real DOM
    const bodyClone = document.body.cloneNode(true);
  
    // Find and remove the TTS bar from the cloned body (so it’s not read out loud)
    const ttsBar = bodyClone.querySelector(".ttsBar");
    if (ttsBar) {
      ttsBar.remove();
    }
  
    // Remove any unwanted tags that might contain scripts, styles, or non-visible content
    const unwantedTags = bodyClone.querySelectorAll("script, style, template");
    unwantedTags.forEach(tag => tag.remove());
  
    // Replace each image with its alt text (if it exists)
    const images = bodyClone.querySelectorAll("img");
    images.forEach((img) => {
      const altText = img.alt || "";                          // Use the alt text if available
      const altNode = document.createTextNode(altText + " "); // Create a text node from alt text
      img.replaceWith(altNode);                               // Replace the image with that text node
    });
  
    // Return all visible, readable text from the cleaned-up cloned body
    return bodyClone.innerText.trim();
  };
  

  const speakPageContent = (startIndex = 0, content = getPageText(), element = null) => {
    if (!utterance) return;
  
    const text = content;
    if (!text) return;
    console.log("Text TTS will read:\n", content);

    const words = text.split(/\s+/); // Split text into an array of words
    const resumedText = words.slice(startIndex).join(" "); // Resume exactly where it left off
  
    window.speechSynthesis.cancel(); // Stop previous speech
  
    utterance.rate = rate;
    utterance.voice = voice;
    utterance.text = resumedText; // Only contains the remaining words
    let spokenWordCount = startIndex; // Track spoken words
  
    utterance.onboundary = (event) => {
      if (event.name === "word") {
        const spokenWords = resumedText.slice(0, event.charIndex).split(/\s+/).length; // Count the words spoken so far
        spokenWordCount = startIndex + spokenWords;
        
        setCurrentIndex(spokenWordCount - 1); // Set the index to be one less because it keeps skipping a word in between
      }
    };
  
    window.speechSynthesis.speak(utterance);   // Start speaking
    setIsSpeaking(true);
  
    utterance.onend = () => {
      if (element) {
        element.classList.remove("tts-highlight");
      }
      setIsSpeaking(false);   // Reset state when done
      setCurrentIndex(null);    // Reset so future play starts from the beginning
    };
  };
  

  // Speak function for quick content
  const speakText = (text) => {
    if (!utterance || !text) return;  

    window.speechSynthesis.cancel();    // Stop anything already speaking

    utterance.text = text;
    utterance.voice = voice;
    utterance.rate = rate;

    window.speechSynthesis.speak(utterance); // Start speaking
    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
  }

  // Resume function
  const resumeSpeaking = () => {
    if (currentIndex !== null) {
      speakPageContent(currentIndex); // Restart from last spoken word
    }
  };
  
  const stopSpeaking = () => {
    window.speechSynthesis.pause(); // resume speech
    setIsSpeaking(false); // Update state
  };

  const handleClick = (event) => {
    const element = event.target;
    let content = "";
  
    window.speechSynthesis.pause();

    // Clear previous highlights
    document.querySelectorAll(".tts-highlight").forEach(el => el.classList.remove("tts-highlight"));

    // Add highlight to the current clicked element
    element.classList.add("tts-highlight");

    // When clicking the speaker icon, it should read "TTS Menu" instead of the whole page
    if (element.closest('[data-ignore-tts]')) {
      if (isSpeaking) return;
      stopSpeaking();
      speakText("TTS Menu");
      return;
    }

    if (element.closest("tts-announcement") || element.closest("ignore-item")){
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

  const saveTTSSettings = async (rate, voice, ttsAnnouncement, clickTTS) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        speed: rate,
        voice: voice?.name || "",
        announcement: ttsAnnouncement,
        clickTTS: clickTTS   // <-- ADD THIS
      });
      console.log("Saving voice and settings to Firestore:", voice?.name);
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
