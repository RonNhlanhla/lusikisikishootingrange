'use client';

import React from 'react';

interface MovingTextLineProps {
    text: string;
    speed?: number; // Optional: duration in seconds
    backgroundColor?: string;
    textColor?: string;
}

const MovingTextLine: React.FC<MovingTextLineProps> = ({
    text,
    speed = 15,
    backgroundColor = 'bg-gold',
    textColor = 'text-black'
}) => {
    return (
        <div className={`group relative flex overflow-x-hidden ${backgroundColor} ${textColor} py-2 font-bold uppercase tracking-widest border-y border-black/10 transition-all duration-500 hover:brightness-110 cursor-default`}>
            <div className="animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap flex">
                <span className="mx-4">{text}</span>
                <span className="mx-4">{text}</span>
                <span className="mx-4">{text}</span>
                <span className="mx-4">{text}</span>
                {/* Repeat to ensure continuous flow */}
                <span className="mx-4">{text}</span>
                <span className="mx-4">{text}</span>
                <span className="mx-4">{text}</span>
                <span className="mx-4">{text}</span>
            </div>
        </div>
    );
};

export default MovingTextLine;
