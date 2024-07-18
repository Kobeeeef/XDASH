import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

export const WebsocketContext = createContext({});

export const WebSocketProvider = ({ children, url }) => {
    const [isConnected, setIsConnected] = useState(false);
    const socket = useRef(null);

    useEffect(() => {
        socket.current = new WebSocket(url);

        socket.current.onopen = () => {
            setIsConnected(true);
        };

        socket.current.onclose = () => {
            setIsConnected(false);
        };

        socket.current.onerror = (error) => {
            console.error('WebSocket Error: ', error);
            setIsConnected(false);
        };

        return () => {
            if (socket.current) {
                socket.current.close();
            }
        };
    }, [url]);

    const ping = () => {
        if (isConnected) {
            socket.current.send(JSON.stringify({ type: 'ping' }));
        }
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

    return (
        <WebsocketContext.Provider value={{ isConnected }}>
            {children}
        </WebsocketContext.Provider>
    );
};
