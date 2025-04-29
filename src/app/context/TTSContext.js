"use client";
import { createContext, useState, useEffect, useContext, useRef } from "react";
import { auth } from "@/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { usePathname } from "next/navigation";
import { remove } from "firebase/database";

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
  let isSpeakingAltText = false;
  let isClickSpeaking = false;

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
  
    // Remove any elements we don't want read
    const ignoreSelectors = [
      '[data-ignore-tts]',
    ];
  
    ignoreSelectors.forEach(selector => {
      bodyClone.querySelectorAll(selector).forEach(el => el.remove());
    });
  
    // Remove unwanted tags
    const unwantedTags = bodyClone.querySelectorAll("script, style, template");
    unwantedTags.forEach(tag => tag.remove());
  
    // Remove alt text from images (so it won't read them automatically)
    const images = bodyClone.querySelectorAll("img");
    images.forEach((img) => {
      if (img.alt?.trim()) {
        img.removeAttribute("alt");
      }
    });
  
    return bodyClone.innerText.trim();
  };
  
  
  // Call this function to remove all highlights
  const removeHighlights = () => {
    const highlightedElements = document.querySelectorAll(".tts-highlight");
    highlightedElements.forEach((el) => {
      el.classList.remove("tts-highlight");
    });
  };
  
  
  const wrapVisibleTextNodes = () => {
    // Create a TreeWalker to walk through all text nodes in the document body
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        // Skip nodes inside the .ttsBar element
        if (node.parentNode && node.parentNode.closest(".ttsBar")) {
          return NodeFilter.FILTER_REJECT;
        }
  
        // Reject empty or whitespace-only text nodes
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
  
        // Reject nodes that are not visible (e.g., hidden or offscreen elements)
        if (!node.parentElement || node.parentElement.offsetParent === null) {
          return NodeFilter.FILTER_REJECT;
        }
  
        // Accept visible text nodes
        return NodeFilter.FILTER_ACCEPT;
      },
    });
  
    let index = 0; // Initialize a counter for indexing each word
    const nodesToWrap = []; // Array to hold all text nodes that will be wrapped
  
    // Traverse through all text nodes and add them to the nodesToWrap array
    while (walker.nextNode()) {
      nodesToWrap.push(walker.currentNode);
    }
  
    // Process each text node in the nodesToWrap array
    nodesToWrap.forEach((textNode) => {
      const parent = textNode.parentNode;  // Get the parent of the text node
      const words = textNode.textContent.trim().split(/\s+/);  // Split the text into words
      const fragment = document.createDocumentFragment();  // Create a document fragment to batch changes
  
      // Create a span for each word and add it to the fragment
      words.forEach((word) => {
        const span = document.createElement("span");
        span.textContent = word + " ";  // Add a space after each word to preserve spacing
        span.className = "tts-word";  // Add a class to each span for CSS styling or TTS functionality
        span.dataset.ttsIndex = index++;  // Set a data-attribute to keep track of word index
        fragment.appendChild(span);  // Append the span to the fragment
      });
  
      // Replace the original text node with the new fragment of spans
      parent.replaceChild(fragment, textNode);
    });
  };

  const speakPageContent = (startIndex = 0, content = getPageText(), element = null) => {
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

    // Only add highlights if we're not using the click-to-speak functionality
    if (highlightTTS && !element && !isClickSpeaking) {

      // onboundary event handler
      utterance.onboundary = (event) => {
        if (isSpeakingAltText) {
          console.log("Currently speaking alt text, skipping boundary processing.");
          return; // Fully skip processing if speaking alt text
        }
  
        if (event.name === "word") {
          const spokenWords = resumedText.slice(0, event.charIndex).split(/\s+/).length;
          const nextWordIndex = localStartIndex + spokenWords - 1;
  
          setCurrentIndex(nextWordIndex);
          removeHighlights(); // Clear previous highlights
  
          const wordElement = document.querySelector(`[data-tts-index="${nextWordIndex}"]`);
          const imageElement = document.querySelector(`img[data-tts-index="${nextWordIndex}"]`);
  
          if (imageElement) {
            return; // Just skip processing the image alt text
          } else if (wordElement) {
            if (!isClickSpeaking) {
              wordElement.classList.add("tts-highlight");
            }
          }
        }
      };
    }
  
    // onend event handler
    utterance.onend = () => {
      removeHighlights(); // Remove all highlights when TTS ends
      setIsSpeaking(false);
      setCurrentIndex(null);
      isClickSpeaking = false;
    };
  
    // Start speaking the text
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };  

  const speakText = (text, element) => {
    const tempUtterance = new SpeechSynthesisUtterance(text);
    tempUtterance.voice = voice;
    tempUtterance.rate = rate;
  
    tempUtterance.onend = () => {
      isSpeakingAltText = false;
      if (element) {
        element.classList.remove("speaking");
      }
    };
  
    window.speechSynthesis.speak(tempUtterance);
    isSpeakingAltText = true;
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
    isClickSpeaking = true;

    window.speechSynthesis.cancel();

    removeHighlights();
    element.classList.add("tts-highlight");

    if (element.closest('.menu-button')) {
      if (isSpeaking) return;
      stopSpeaking();
      speakText("Customization Menu");
      return;
    }

    if (["INPUT", "LABEL", "TEXTAREA", "SELECT"].includes(element.tagName)) {
      content = element.value?.trim() || element.getAttribute("placeholder")?.trim() || element.getAttribute("name")?.trim() || element.getAttribute("title")?.trim();
    } else if (element.tagName === "IMG") {
      content = element.alt?.trim();
    } else {
      content = element.innerText?.trim();
    }

    if (!content) {
      removeHighlights();
      isClickSpeaking = false;
      return;
    }

    console.log("I heard a click");
    speakText(content, element);
  };


  useEffect(() => {
    if (!pathname) return;
  
    if (ttsAnnouncement) {
      // Split the path name into segments and only pick the last segment to announce it
      const segments = pathname.split("/").filter(Boolean);
      const lastSegment = segments[segments.length - 1] || "Home";
  
      const pageName = lastSegment
        .replace(/([A-Z])/g, " $1")
        .replace(/-/g, " ")
        .trim();
  
      const announcement = `You are on the ${pageName} page`;
  
      // Only speak if the announcement changed and pathname has genuinely changed (not just form field changes)
      if (lastAnnouncementRef.current !== announcement) {
        lastAnnouncementRef.current = announcement;
        speakText(announcement);
      }
    }
  
    // Skip announcement when interacting with form elements or other interactive elements
    if (!clickTTS) return;  // Disable click-based TTS if the user disabled it
    const elements = document.querySelectorAll('p, h1, h2, h3, h4, span, img, button, input, textarea, label, value, term');
    elements.forEach(element => {
      element.addEventListener('click', handleClick);
    });
  
    return () => {
      elements.forEach(element => {
        // Clean up event listeners on unmount
        element.removeEventListener('click', handleClick);
      });
    };
  }, [pathname, ttsAnnouncement, clickTTS]);  

  return (
    <TTSContext.Provider value={{ getPageText, speakPageContent, resumeSpeaking, stopSpeaking, isSpeaking, currentIndex,
       rate, setRate, voice, setVoice, voices, setVoices, speakText, clickTTS, setClickTTS, ttsAnnouncement, setTTSAnnouncement,
       highlightTTS, setHighlightTTS, saveTTSSettings, removeHighlights }}>
      {children}
    </TTSContext.Provider>
  );
};

export const useTTS = () => useContext(TTSContext);