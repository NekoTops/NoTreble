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
  
  const wrapWordsInSpans = () => {
    const container = document.getElementById("tts-wrapper");
    if (!container) return;
  
    const ignoredTags = ['SCRIPT', 'STYLE'];
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    
    let node;
    let wordIndex = 0;
  
    while ((node = walker.nextNode())) {
      const parent = node.parentNode;
  
      if (!ignoredTags.includes(parent.nodeName) && node.textContent.trim()) {
        const words = node.textContent.trim().split(/\s+/);
        const fragment = document.createDocumentFragment();
  
        words.forEach((word) => {
          const span = document.createElement("span");
          span.className = "tts-word";
          span.setAttribute("data-index", wordIndex++);
          span.textContent = word + " ";
          fragment.appendChild(span);
        });
  
        parent.replaceChild(fragment, node);
      }
    }
  };
  
  const speakPageContent = (startIndex = 0, content = getPageText(), element = null) => {
    if (!utterance) return;
  
    // Remove previous word spans if any
    document.querySelectorAll('.tts-word').forEach(span => {
      const textNode = document.createTextNode(span.textContent);
      span.parentNode.replaceChild(textNode, span);
    });
  
    wrapWordsInSpans();
  
    let lastHighlight = null;
    const text = content;
    if (!text) return;
  
    const words = text.split(/\s+/);
    const resumedText = words.slice(startIndex).join(" ");
  
    window.speechSynthesis.cancel();
  
    utterance.rate = rate;
    utterance.voice = voice;
    utterance.text = resumedText;
  
    const allWords = Array.from(document.querySelectorAll(".tts-word"));
  
    utterance.onboundary = (event) => {
      if (event.name === "word") {
        const allWords = Array.from(document.querySelectorAll(".tts-word"));
        let charCounter = 0;
    
        for (let i = 0; i < allWords.length; i++) {
          const word = allWords[i].textContent || '';
          charCounter += word.length;
          if (charCounter >= event.charIndex) {
            if (lastHighlight) lastHighlight.classList.remove("tts-highlight");
            allWords[i].classList.add("tts-highlight");
            lastHighlight = allWords[i];
            setCurrentIndex(i);
            break;
          }
        }
      }
    };
  
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  
    utterance.onend = () => {
      if (element) element.classList.remove("tts-highlight");
      setIsSpeaking(false);
      setCurrentIndex(null);
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

    // Determine what to read for input, label and images
    if (["INPUT", "LABEL", "TEXTAREA"].includes(element.tagName)) {
      content = element.value?.trim() || element.getAttribute("placeholder")?.trim() || element.getAttribute("name")?.trim();
    } else if (element.tagName === "IMG") {
      content = element.alt?.trim();
    } else {
      content = element.innerText?.trim();
    }

    console.log('Clicked element:', element);
    // on click read
    console.log("I herd a clickkk");

    speakPageContent(0, content, element); // Read current paragraph
  };

  // TEST FIXME: need to unmount the event listener when the pathname changes
  // Old event listeners are still attached when they don't exist anymore
  useEffect(() => {
    if (!pathname) return;

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
    
    if (!clickTTS) return;  // Unactive this when user choose to turn off this feature
    const elements = document.querySelectorAll('p, h1, h2, h3, span, img, button, input, textarea, label');
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


  return (
    <TTSContext.Provider value={{ getPageText, speakPageContent, resumeSpeaking, stopSpeaking, isSpeaking, currentIndex,
       rate, setRate, voice, setVoice, voices, setVoices, speakText, clickTTS, setClickTTS }}>
      {children}
    </TTSContext.Provider>
  );
};

export const useTTS = () => useContext(TTSContext);
