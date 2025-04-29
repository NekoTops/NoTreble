"use client";
import { createContext, useState, useEffect, useContext, useRef } from "react";
import { auth } from "@/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
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
  const [highlightTTS, setHighlightTTS] = useState(true);
  const pathname = usePathname(); // Gets the current page route
  const db = getFirestore();
  const lastAnnouncementRef = useRef("");
  let ttsInitialized = false;
  let altTextQueue = []; // Queue to hold alt texts to be spoken
  let isSpeakingAltText = false;

  const [clickTTS, setClickTTS] = useState(() => {
    if (typeof window !== "undefined") {
      const storedClickTTS = localStorage.getItem("clickTTS");
      return storedClickTTS ? JSON.parse(storedClickTTS) : true;  // Default to true if not set
    }
    return true;  // Default value if running in server-side environment
  });

  const saveTTSSettings = async (rate, voice, ttsAnnouncement, clickTTS, highlightTTS) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        speed: rate,
        voice: voice?.name || "",
        announcement: ttsAnnouncement,
        clickTTS: clickTTS ,
        highlightTTS: highlightTTS
      });
      console.log("Saving voice and settings to Firestore:", voice?.name);
    } catch (error) {
      console.error("Error saving TTS settings:", error.message);
    }
  };

  useEffect(() => {
    if (rate !== null && voice && clickTTS !== null && highlightTTS !== null && ttsAnnouncement !== null) {
      saveTTSSettings(rate, voice, ttsAnnouncement, clickTTS, highlightTTS);
    }
  }, [rate, voice, ttsAnnouncement, clickTTS, highlightTTS]);  

  // Fetching the saved values back when the page changes or reloads
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && voices) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
  
          if (userSnap.exists()) {
            const data = userSnap.data();
  
            if (data.speed) setRate(data.speed);
            if (data.voice) {
              const matchedVoice = voices.find(v => v.name === data.voice);
              if (matchedVoice) setVoice(matchedVoice);
            }
            setTTSAnnouncement(data.hasOwnProperty("announcement") ? data.announcement : true);
            setClickTTS(data.hasOwnProperty("clickTTS") ? data.clickTTS : true);
            setHighlightTTS(data.hasOwnProperty("highlightTTS") ? data.highlightTTS : true);
          }
        } catch (err) {
          console.error("Failed to load TTS settings:", err.message);
        }
      }
    });
  
    return () => unsubscribe();  // Clean up the listener on unmount
  }, [voices]);
  
  
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
    const bodyClone = document.body.cloneNode(true);
  
    // Remove TTS bar
    const ttsBar = bodyClone.querySelector(".ttsBar");
    if (ttsBar) {
      ttsBar.remove();
    }
  
    const unwantedTags = bodyClone.querySelectorAll("script, style, template");
    unwantedTags.forEach(tag => tag.remove());
  
    // For each image, inject the alt text into reading flow
    const images = bodyClone.querySelectorAll("img");
    images.forEach((img) => {
      if (img.alt?.trim()) {
        const span = document.createElement("span");
        span.textContent = ` ${img.alt.trim()} `; // Insert alt text without removing the image
        img.parentNode.insertBefore(span, img.nextSibling);
      }
    });
  
    return bodyClone.innerText.trim();
  };  
  
  // Call this function to remove all highlights
  const removeHighlights = () => {
    document.querySelectorAll(".tts-word.tts-highlight, img.tts-highlight, a.tts-highlight-link").forEach((el) => {
      el.classList.remove("tts-highlight");
    });
  };
  
  const wrapVisibleTextNodes = () => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        if (node.parentNode && node.parentNode.closest(".ttsBar")) {
          return NodeFilter.FILTER_REJECT;
        }
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (!node.parentElement || node.parentElement.offsetParent === null) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
  
    let index = 0;
    const nodesToWrap = [];
  
    while (walker.nextNode()) {
      nodesToWrap.push(walker.currentNode);
    }
  
    nodesToWrap.forEach((textNode) => {
      const parent = textNode.parentNode;
      const words = textNode.textContent.trim().split(/\s+/);
      const fragment = document.createDocumentFragment();
  
      words.forEach((word) => {
        const span = document.createElement("span");
        span.textContent = word + " ";
        span.className = "tts-word";
        span.dataset.ttsIndex = index++; // Set the data-tts-index for text
        fragment.appendChild(span);
      });
  
      parent.replaceChild(fragment, textNode);
    });
  
    // Handle images and set their index
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      if (img.alt?.trim() && img.offsetParent !== null) {
        img.dataset.ttsAltText = img.alt.trim(); // Set alt text as dataset
        img.dataset.ttsIndex = index++; // Set the data-tts-index for images
        console.log("Image processed: ", img); // Debug log to check if images are correctly processed
      }
  
      // Check if the image is inside a link
      if (img.closest("a")) {
        img.dataset.ttsInLink = true; // Mark if the image is inside a link
      }
    });
  };
  
  const speakPageContent = (startIndex = 0, content = getPageText()) => {
    if (!utterance) return;
  
    if (!ttsInitialized) {
      wrapVisibleTextNodes(); // Initialize wrapping once
      ttsInitialized = true;
    }
  
    if (!content) return;
    console.log("Text TTS will read:\n", content);
  
    const words = content.split(/\s+/);
    const resumedText = words.slice(startIndex).join(" ");
  
    window.speechSynthesis.cancel(); // Cancel anything already speaking
  
    utterance.rate = rate;
    utterance.voice = voice;
    utterance.text = resumedText;
  
    let localStartIndex = startIndex;
  
    // onboundary event handler
    utterance.onboundary = (event) => {
      console.log("onboundary fired!", event);
      console.log("Event name:", event.name);
      console.log("Char index:", event.charIndex);
      if (altTextQueue.length > 0) {
        console.log("Alt text is still being spoken, skipping further processing.");
        return; // Don't proceed with further processing while alt text is being spoken
      }
  
      if (!highlightTTS) {
        removeHighlights(); // Remove highlights if highlighting is disabled
        return;
      }
  
      if (event.name === "word") {
        const spokenWords = resumedText.slice(0, event.charIndex).split(/\s+/).length;
        const nextWordIndex = localStartIndex + spokenWords - 1;
  
        setCurrentIndex(nextWordIndex);
        removeHighlights(); // Clear previous highlights
  
        const wordElement = document.querySelector(`[data-tts-index="${nextWordIndex}"]`);
        const imageElement = document.querySelector(`img[data-tts-index="${nextWordIndex}"]`);
  
        if (imageElement) {
          imageElement.classList.add("tts-highlight");
  
          const linkElement = imageElement.closest("a");
          if (linkElement) {
            linkElement.classList.add("tts-highlight-link");
          }
  
          window.speechSynthesis.cancel(); // Cancel previous speech
  
          // Add alt text to the queue and speak it
          altTextQueue.push(imageElement.dataset.ttsAltText);
          console.log("Queueing alt text for image: ", imageElement.dataset.ttsAltText);
          isSpeakingAltText = true; // Flag indicating alt text is being spoken
  
          // Start speaking the next alt text in the queue
          speakNextAltText();
  
          return; // Stop further processing for the current word and ensure no text is read until alt text is done
        } else if (wordElement) {
          wordElement.classList.add("tts-highlight");
        }
      }
    };
  
    // onend event handler
    utterance.onend = () => {
      removeHighlights(); // Remove all highlights when TTS ends
      setIsSpeaking(false);
      setCurrentIndex(null);
    };
  
    // Start speaking the text
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Function to speak the next alt text in the queue
  const speakNextAltText = (resumeIndex) => {
    if (altTextQueue.length === 0) {
      isSpeakingAltText = false; // Reset the flag
      speakPageContent(resumeIndex); // <<< Resume reading the page from the correct index
      return;
    }
  
    const altText = altTextQueue.shift(); // Get next alt text
    speakText(altText, () => {
      console.log("Finished speaking alt text: ", altText);
      speakNextAltText(resumeIndex); // Pass resumeIndex down so you can continue when all alt texts are spoken
    });
  };

  // Speak function for quick content
  const speakText = (text, callback = null) => {
    if (!text) return;

    const tempUtterance = new SpeechSynthesisUtterance(text);
    tempUtterance.voice = voice;
    tempUtterance.rate = rate;

    tempUtterance.onend = () => {
      if (callback) callback(); // Call the callback after speaking
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(tempUtterance);
    setIsSpeaking(true);
  };

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

    // If no content found, don't speak anything and also remove highlight
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
    const elements = document.querySelectorAll('p, h1, h2, h3, span, img, button, input, textarea, label, value, term');
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

  return (
    <TTSContext.Provider value={{ getPageText, speakPageContent, resumeSpeaking, stopSpeaking, isSpeaking, currentIndex,
       rate, setRate, voice, setVoice, voices, setVoices, speakText, clickTTS, setClickTTS, ttsAnnouncement, setTTSAnnouncement,
       highlightTTS, setHighlightTTS, saveTTSSettings, removeHighlights }}>
      {children}
    </TTSContext.Provider>
  );
};

export const useTTS = () => useContext(TTSContext);