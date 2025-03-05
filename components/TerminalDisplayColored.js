import React, { useState, useEffect, useRef } from 'react';
import LoadingDots from './LoadingDots';
import { Toast } from 'primereact/toast';
import { playNotificationSound } from '../utilities/notification';

const TerminalDisplayColored = ({ messages, prompt = 'XDASH $ ', maxHeight = '300px', maxWidth = "100%", placeholder = null, loadingDots = false ,scrollLog = false, backGroundColor = "bg-gray-900"}) => {
    const scrollRef = useRef(null);
    const toastRef = useRef(null);
    useEffect(() => {
        if (scrollLog && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, scrollLog]);
    const maxPromptLength = Math.max(
        ...(messages?.map(m => m.prompt?.length || 0) ?? [0]),
        prompt.length
    );
    const handleCopy = (text) => {
        if(!text || !text.trim()) return;
        navigator.clipboard.writeText(text).then(() => {
                toastRef.current.show({
                    severity: 'success',
                    summary: 'Clipboard Copied!',
                    detail: "The log was copied to clipboard.",
                    life: 1000,
                })
            playNotificationSound()
            }).catch(err => {
            toastRef.current.show({
                severity: 'error',
                summary: 'Failed to copy!',
                detail: err?.message || "Something unknown went wrong.",
                life: 6000,

            })        });
    };
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
            <Toast ref={toastRef}/>
            {(messages?.length === 0 && placeholder ? [{ message: placeholder }] : messages).map((message, idx) => (
                <div key={idx} className={("flex ") + (message?.message?.trim() && "cursor-pointer")} onClick={() => handleCopy(message?.message)}>
                    <span
                        className={message?.promptClass ?? "text-gray-400 mr-2"}
                        style={{
                            display: 'inline-block',
                            minWidth: `${maxPromptLength}ch`,
                            whiteSpace: 'nowrap'
                        }}
                    >
                {message?.prompt ?? prompt}
            </span>
                    <span className={message?.textClass || "text-primary-300"}>
                {message?.message}
                        {messages.length === 0 && placeholder && loadingDots && <LoadingDots delay={250}/>}
            </span>
                </div>
            ))}
        </div>
    );
};

export default TerminalDisplayColored;
