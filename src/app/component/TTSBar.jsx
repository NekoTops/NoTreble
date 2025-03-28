"use client";
import { useState } from 'react';
import { FaCirclePause } from "react-icons/fa6";
import { FaCirclePlay } from "react-icons/fa6";

export default function TTSBar() {
    const [buttonClicked, setButtonClicked] = useState(false); // State to track if the button is clicked
    const [isHovered, setIsHovered] = useState(false); // State to track hover status
    const [position, setPosition] = useState({ x: 100, y: 200 }); // Initial position
    const [dragging, setDragging] = useState(false); // Drag state
    const [offset, setOffset] = useState({ x: 0, y: 0 }); // Offset when dragging

    const handleMouseDown = (e) => {
        setDragging(true);
        setOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    // Handle mouse move to move the element when dragging
    const handleMouseMove = (e) => {
        if (!dragging) return;
        setPosition({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };

    // Handle mouse up to stop dragging
    const handleMouseUp = () => {
        setDragging(false);
    };

    // Handle the icon click to toggle play/pause
    const handleClick = () => {
        setButtonClicked(!buttonClicked);
    };

    return (
        <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="flex justify-center items-center w-[300px] h-[80px] bg-white border-4 border-gray-200 drop-shadow rounded-[50px]"
            style={{
                position: "absolute", 
                left: `${position.x}px`, 
                top: `${position.y}px`, 
                bottom: "20px", 
                right: "20px", 
                zIndex: 1000,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <p className="content-center text-xl mr-5">TTS Play/Pause</p>
            
            {/* Click on the icon to toggle */}
            <div className="transition-transform transform hover:scale-150"
                onClick={handleClick}>
                {buttonClicked ? (
                    <FaCirclePause 
                        size={40} 
                        color={isHovered ? '#303E60' : '#455090'} 
                    />
                ) : (
                    <FaCirclePlay 
                        size={40} 
                        color={isHovered ? '#303E60' : '#455090'}
                    />
                )}
            </div>
        </div>
    );
}
