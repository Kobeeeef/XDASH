'use client';
import React, { createContext, useCallback, useEffect, useRef, useState } from 'react';

export const WebsocketContext = createContext({});

export const WebSocketProvider = ({ children, url }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [lastConnectionUpdate, setLastConnectionUpdate] = useState(new Date());
    const socket = useRef(null);
    const [latestLog, setLatestLog] =useState(null)
    const [latestNotification, setLatestNotification] = useState(null)
    const timeoutsRef = useRef({})


    useEffect(() => {
        function connect() {
            console.log('Connecting to websocket');
            socket.current = new WebSocket(url);

            socket.current.onopen = () => {
                setIsConnected(true);
            };

            socket.current.onclose = () => {
                setIsConnected(false);
                cancelAllTimeouts()
                console.log('Disconnected from websocket.');
                return connect();
            };

            socket.current.onerror = (error) => {
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

    const sendMessage = (message) => {
        if (!isConnected) {
            return new Error('WebSocket is not connected');
        }

        socket.current.send(JSON.stringify(message));
    };

    const sendMessageAndWaitForConditionWithManage = useCallback((id, message, conditionFunc, timeout = 1500) => {
        if (!isConnected) {
            return Promise.reject(new Error("WebSocket is not connected"));
        }

        socket.current.send(JSON.stringify(message));

        let timeoutId;
        let startTime = Date.now();
        let remainingTime = timeout;
        let listener; // Declare the listener here for later use
        let onTimeout;
        const manageTimeout = {
            getTimeLeft: () => {
                const elapsedTime = Date.now() - startTime;
                return Math.max(remainingTime - elapsedTime, 0);
            },
            extendTimeout: (additionalTime) => {
                if (!timeoutsRef.current[id]) return;
                remainingTime += additionalTime;
                clearTimeout(timeoutId);
                timeoutId = setTimeout(onTimeout, manageTimeout.getTimeLeft());
            },
            reduceTimeout: (reductionTime) => {
                if (!timeoutsRef.current[id]) return;
                if (reductionTime >= manageTimeout.getTimeLeft()) {
                    onTimeout(); // Trigger timeout if time reduced to 0
                    return;
                }
                remainingTime -= reductionTime;
                clearTimeout(timeoutId);
                timeoutId = setTimeout(onTimeout, manageTimeout.getTimeLeft());
            },
            finish: () => {
                clearTimeout(timeoutId);
                if (listener) {
                    socket.current.removeEventListener("message", listener);
                }
                delete timeoutsRef.current[id]; // Remove from ref when canceled
                onTimeout()
            },
            cancel: () => {
                clearTimeout(timeoutId);
                if (listener) {
                    socket.current.removeEventListener("message", listener);
                }
                delete timeoutsRef.current[id]; // Remove from ref when canceled
            },
        };

        return new Promise((resolve, reject) => {
             onTimeout = () => {
                if (listener) {
                    socket.current.removeEventListener("message", listener);
                }
                reject(new Error(`Timeout: Condition not met within ${timeout} ms`));
                delete timeoutsRef.current[id]; // Auto-remove when timeout expires
            };

            listener = (event) => {
                const data = JSON.parse(event.data);
                if (conditionFunc(data)) {
                    socket.current.removeEventListener("message", listener);
                    clearTimeout(timeoutId);
                    try {
                        data.message = JSON.parse(data.message);
                    } catch (e) {
                        console.warn("Failed to parse message as JSON:", data.message);
                    }
                    resolve(data);
                    delete timeoutsRef.current[id]; // Auto-remove when resolved
                }
            };

            timeoutId = setTimeout(onTimeout, timeout);
            socket.current.addEventListener("message", listener);

            // Add to ref with the provided ID
            timeoutsRef.current[id] = manageTimeout;
        });
    }, [isConnected]);


    const getTimeoutManagerById = useCallback((id) => {
        return timeoutsRef.current[id] || null; // Return the manageTimeout by ID or null if not found
    }, []);

    const cancelAllTimeouts = useCallback(() => {
        // Iterate through all active timeouts and cancel them
        Object.values(timeoutsRef.current).forEach((timeoutManager) => {
            timeoutManager.cancel();
        });
        timeoutsRef.current = {}; // Clear the ref
    }, []);




    const sendMessageAndWaitForCondition = useCallback((message, conditionFunc, timeout = 1500) => {
        if (!isConnected) {
            return Promise.reject(new Error('WebSocket is not connected'));
        }

        socket.current.send(JSON.stringify(message));
        return new Promise((resolve, reject) => {
            const listener = (event) => {
                const data = JSON.parse(event.data);
                console.debug(data)
                if (conditionFunc(data)) {
                    socket.current.removeEventListener('message', listener);
                    clearTimeout(timeoutId);
                    let message = data?.message;
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
    }, [isConnected, socket.current]);

    useEffect(() => {
        const listener = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'DEVICE-ERROR-LOG') {
                const msg = JSON.parse(data.message);
                setLatestLog(msg)

            } else if(data.type === 'NOTIFICATION') {
                const msg = JSON.parse(data.message);
                setLatestNotification(msg)
            }
        };
        if (socket.current) {
            socket.current.addEventListener('message', listener);
        }
        return () => {
            socket.current.removeEventListener('message', listener);
        };
    }, [socket.current]);
    const listenTillCondition = (conditionFunc) => {
        if (!isConnected) {
            return Promise.reject(new Error('WebSocket is not connected'));
        }

        return new Promise((resolve) => {
            const listener = (event) => {
                const data = JSON.parse(event.data);
                if (conditionFunc(data)) {
                    socket.current.removeEventListener('message', listener);
                    resolve(data);
                }
            };

            socket.current.addEventListener('message', listener);
        });
    };


    return (
        <WebsocketContext.Provider
            value={{
                isConnected,
                lastConnectionUpdate,
                sendMessageAndWaitForCondition,
                sendMessageTillCondition,
                getTimeoutManagerById,
                cancelAllTimeouts,
                listenTillCondition,
                timeoutsRef,
                sendMessageAndWaitForConditionWithManage,
                socket,
                latestLog,
                latestNotification,
                sendMessage
            }}
        >
            {children}
        </WebsocketContext.Provider>
    );
};
