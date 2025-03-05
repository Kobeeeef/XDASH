import React, { useState, useEffect, useRef } from 'react';
import LoadingDots from './LoadingDots';

const TerminalDisplayColored = ({ messages, prompt = 'XDASH $ ', maxHeight = '300px', maxWidth = "100%", placeholder = null, loadingDots = false ,scrollLog = false, backGroundColor = "bg-gray-900"}) => {
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollLog && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, scrollLog]);
    return (
        <div
            className={("text-white border-round p-4 rounded-lg ") + backGroundColor}

            ref={scrollRef}
            style={{
                backgroundColor: `var(--surface-card)`,
                maxHeight,
                maxWidth,
                overflowY: 'auto',
                overflowX: 'hidden',
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
            }}
        >
            {(messages?.length === 0 && placeholder ? [{ message: placeholder}] : messages).map((message, idx) => (
                <div key={idx} className="flex">
                    <span className={message?.promptClass ?? "text-gray-400 mr-2"} style={{ whiteSpace: 'nowrap' }}>{message?.prompt ?? prompt}</span>
                    <span className={message?.textClass || "text-primary-300"}>{message?.message}{messages.length === 0 && placeholder && loadingDots && <LoadingDots delay={250}/>}</span>
                </div>
            ))}
        </div>
    );
};

export default TerminalDisplayColored;
