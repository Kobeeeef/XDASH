'use client';
import React, { createContext, useEffect, useRef, useState } from 'react';

export const WebsocketContext = createContext({});

export const WebSocketProvider = ({ children, url }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [lastConnectionUpdate, setLastConnectionUpdate] = useState(new Date());
    const socket = useRef(null);

    useEffect(() => {
        function connect() {
            console.log('Connecting to websocket');
            socket.current = new WebSocket(url);

            socket.current.onopen = () => {
                setIsConnected(true);
            };

            socket.current.onclose = () => {
                setIsConnected(false);
                console.log('Disconnected from websocket.');
                return connect();
            };

            socket.current.onerror = (error) => {
                console.error('WebSocket Error: ', error);
                socket.current.close();
                setIsConnected(false);
            };
        }
        connect();
        return () => {
            if (socket.current) {
                socket.current.close();
            }
        };
    }, [url]);
    useEffect(() => {
        setLastConnectionUpdate(new Date());
    }, [isConnected]);
    const ping = () => {
        if (isConnected) {
            socket.current.send(JSON.stringify({ type: 'ping' }));
        }
    };
    const sendMessageTillCondition = (message, conditionFunc) => {
        if (!isConnected) {
            throw new Error('WebSocket is not connected');
        }

        socket.current.send(JSON.stringify(message));

        const listener = (event) => {
            const data = JSON.parse(event.data);
            if (conditionFunc(data)) {
                socket.current.removeEventListener('message', listener);
            }
        };

        socket.current.addEventListener('message', listener);
    };

    const sendMessageAndWaitForCondition = (message, conditionFunc, timeout = 1500) => {
        if (!isConnected) {
            return Promise.reject(new Error('WebSocket is not connected'));
        }

        socket.current.send(JSON.stringify(message));
        return new Promise((resolve, reject) => {
            const listener = (event) => {
                const data = JSON.parse(event.data);
                if (conditionFunc(data)) {
                    socket.current.removeEventListener('message', listener);
                    clearTimeout(timeoutId);
                    let message = data.message;
                    data.message = JSON.parse(message);
                    resolve(data);
                }
            };

            const timeoutId = setTimeout(() => {
                socket.current.removeEventListener('message', listener);
                reject(new Error(`Timeout: Condition not met within ${timeout} ms`));
            }, timeout);

            socket.current.addEventListener('message', listener);
        });
    };

    return <WebsocketContext.Provider value={{ isConnected, lastConnectionUpdate, sendMessageAndWaitForCondition, sendMessageTillCondition }}>{children}</WebsocketContext.Provider>;
};
