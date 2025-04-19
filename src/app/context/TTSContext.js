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
  const [clickTTS, setClickTTS] = useState(true);
  const pathname = usePathname(); // Gets the current page route
  const db = getFirestore();
  const lastAnnouncementRef = useRef("");
  useEffect(() => {
    if (voice) {
      saveTTSSettings(rate, voice);
    }
  }, [rate, voice]);
  

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
  

  const speakPageContent = (startIndex = 0, content = getPageText()) => {
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
    const target = event.target;
    let content = "";
  
    window.speechSynthesis.pause();

    // When clicking the speaker icon, it should read "TTS Menu" instead of the whole page
    if (event.target.closest('[data-ignore-tts]')) {
      if (isSpeaking) return;
      stopSpeaking();
      speakText("TTS Menu");
      return;
    }

    // Take in the alt texts if an element is an image
    if (target.tagName === "INPUT" || target.tagName === "LABEL") {
      content = target.value?.trim();   // Read the input's value
    }
    else if (target.tagName === "IMG") {
      content = target.alt?.trim();     // Read the alt text of images
    } else {
      content = target.innerText?.trim();
    }

    console.log('Clicked element:', event.target);
    // on click read
    console.log("I herd a clickkk");

    speakPageContent(0, content); // Read current paragraph
  };

  // TEST FIXME: need to unmount the event listener when the pathname changes
  // Old event listeners are still attached when they don't exist anymore
  useEffect(() => {
    if (!pathname) return;

    const pageName = pathname === "/"
    ? "Home"    // If the route is just /, we label it "Home"
    : pathname.replace("/","").replace(/([A-Z])/g, " $1");  // Add a space before any capital letters

    const announcement = `You are on the ${pageName} page`;
    // Only speak if the announcement changed
    if (lastAnnouncementRef.current !== announcement) {
      lastAnnouncementRef.current = announcement;
      speakText(announcement);
    }
    
    if (!clickTTS) return;  // Unactive this when user choose to turn off this feature
    const elements = document.querySelectorAll('p, h1, h2, h3, span, img, button, input, label'); // Select all <p> elements
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

  const saveTTSSettings = async (rate, voice) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;   // Don't save the changes if not logged in
    
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        speed: rate,
        voice: voice?.name || "", // Store voice name
      });
      console.log("Saving voice to Firestore:", voice?.name);
      console.log("TTS settings saved to Firestore");
    } catch (error) {
      console.error("Error saving TTS settings:", error.message);
    }
  };

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
        }
      } catch (err) {
        console.error("Failed to load TTS settings:", err.message);
      }
    };
  
    fetchSettings();
  }, [voices]);


// END TEST
  return (
    <TTSContext.Provider value={{ getPageText, speakPageContent, resumeSpeaking, stopSpeaking, isSpeaking, currentIndex,
       rate, setRate, voice, setVoice, voices, setVoices, speakText, clickTTS, setClickTTS }}>
      {children}
    </TTSContext.Provider>
  );
};

export const useTTS = () => useContext(TTSContext);
