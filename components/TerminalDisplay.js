import React, { useState, useEffect } from 'react';
import LoadingDots from './LoadingDots';

const TerminalDisplay = ({ messages, prompt = 'XDASH $ ', maxHeight = '300px', maxWidth = "100%", placeholder = null, loadingDots = false }) => {


    return (
        <div
            className="bg-gray-900 text-white border-round p-4 rounded-lg"
            style={{
                maxHeight,
                maxWidth,
                overflowY: 'auto',      // Ensures vertical scrolling when content exceeds maxHeight
                overflowX: 'hidden',    // Prevents horizontal overflow
                wordWrap: 'break-word',  // Allows words to break and wrap at the container width
                whiteSpace: 'pre-wrap',  // Maintains the whitespace structure but allows wrapping
                wordBreak: 'break-word', // Ensures long words break at boundaries
            }}
        >
            {(messages?.length === 0 && placeholder ? [placeholder] : messages).map((message, idx) => (
                <div key={idx} className="flex">
                    <span className="text-gray-400 mr-2" style={{ whiteSpace: 'nowrap' }}>{prompt}</span>
                    <span className="text-primary-300">{message}{messages.length === 0 && placeholder && loadingDots && <LoadingDots delay={250}/>}</span>
                </div>
            ))}
        </div>
    );
};

export default TerminalDisplay;
