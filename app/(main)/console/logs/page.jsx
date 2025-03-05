/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useContext, useEffect, useRef, useState } from 'react';
import { ConfirmDialog } from 'primereact/confirmdialog';

import { WebsocketContext } from '../../../../layout/context/websocketcontext';
import TimeAgo from '../../../../components/TimeAgo';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { Toast } from 'primereact/toast';
import { loadAllSounds, playErrorNotificationSound, playNotificationSound, playSuccessNotificationSound } from '../../../../utilities/notification';
import TerminalDisplay from '../../../../components/TerminalDisplay';
import { Dropdown } from 'primereact/dropdown';
import TerminalDisplayColored from '../../../../components/TerminalDisplayColored';

const Dashboard = () => {
    const toast = useRef(null);
    const { isConnected, lastConnectionUpdate, sendMessageAndWaitForCondition, socket } = useContext(WebsocketContext);
    const [lastStatusUpdate, setLastStatusUpdate] = useState(new Date());
    const layoutContext = useContext(LayoutContext);
    const [isFullScreenEnabled, setIsFullScreenEnabled] = useState(false);
    const [messages, setMessages] = useState([]);
    const [timer, setTimer] = useState(null);
    const [logFiles, setLogFiles] = useState([]);
    const [scrollLock, setScrollLock] = useState(true);
    const [selectedLogFile, setSelectedLogFile] = useState(null);
    const [rioStatus, setRioStatus] = useState('UNKNOWN');
    const [loading, setLoading] = useState(false);
    const isMounted = useRef(true); // Tracks if the component is mounted
    const timeoutId = useRef(null); // Stores the timeout ID persistently
    useEffect(() => {
        isMounted.current = true; // Set the mounted flag
        let isRequestInProgress = false;

        const sendRequest = () => {
            if (isMounted.current && isConnected && !isRequestInProgress) {
                isRequestInProgress = true;
                try {
                    sendMessageAndWaitForCondition({ type: 'GET-RIO-STATUS' }, (m) => m.type === 'GET-RIO-STATUS')
                        .then((message) => {
                            setRioStatus(message?.message?.status || 'UNKNOWN');
                            setLogFiles(message?.message?.logFiles ?? []);
                            setLastStatusUpdate(new Date());
                            isRequestInProgress = false;
                            if (isMounted.current) {
                                timeoutId.current = setTimeout(sendRequest, 200); // Schedule next call
                            }
                        })
                        .catch(() => {
                            setRioStatus('ERROR');
                            isRequestInProgress = false;
                            if (isMounted.current) {
                                timeoutId.current = setTimeout(sendRequest, 1000); // Retry on failure
                            }
                        });
                } catch (e) {
                    console.error(e);
                    isRequestInProgress = false;
                }
            }
        };

        sendRequest();

        // Cleanup on component unmount
        return () => {
            isMounted.current = false; // Mark as unmounted
            if (timeoutId.current) {
                clearTimeout(timeoutId.current); // Clear any active timeouts
            }
        };
    }, [isConnected, sendMessageAndWaitForCondition]);
    useEffect(() => {
        const listener = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'RIO-LOGS') {
                const msg = JSON.parse(data.message);
                setMessages((prevArray) => [...prevArray, msg || '']);
            }
        };
        if (socket.current) {
            socket.current.addEventListener('message', listener);
        }
        return () => {
            socket.current.removeEventListener('message', listener);
        };
    }, [socket.current]);

    useEffect(() => {
        const handleKey = (event) => {
            if (event.key.toLowerCase() === 'l' && event.type === 'keydown') {
                setScrollLock((prev) => {
                    toast.current?.show({
                        severity: prev ? 'info' : 'success',
                        summary: 'Scroll Lock',
                        detail: `The scroll lock has been ${prev ? 'disabled' : 'enabled'}!`
                    });
                    return !prev;
                });
            }
            if (event.key.toLowerCase() !== 'd') return;

            if (event.type === 'keydown' && !timer) {
                if (!isFullScreenEnabled) {
                    setIsFullScreenEnabled(true);
                    enterFullScreen();
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Driver Mode Enabled!',
                        detail: "Hold 'D' for 3 seconds to disable.",
                        life: 6000
                    });
                    playNotificationSound();
                } else {
                    setTimer(
                        setTimeout(() => {
                            setIsFullScreenEnabled(false);
                            exitFullScreen();
                            toast.current?.show({
                                severity: 'success',
                                summary: 'Driver Mode Disabled!',
                                detail: 'The driver mode was disabled.'
                            });
                        }, 1500)
                    );
                }
            } else if (event.type === 'keyup') {
                clearTimeout(timer);
                setTimer(null);
            }
        };

        const preventExitKeys = (event) => {
            if (isFullScreenEnabled) {
                if (['Escape', 'F11'].includes(event.key)) {
                    event.preventDefault();
                    event.stopPropagation();
                    toast.current?.show({
                        severity: 'warn',
                        summary: 'Fullscreen Lock Active!',
                        detail: "Press 'D' for 3 seconds to exit.",
                        life: 3000
                    });
                    playErrorNotificationSound();
                    enterFullScreen();
                }
            }
        };

        const monitorFullscreen = () => {
            if (!document.fullscreenElement && isFullScreenEnabled) {
                enterFullScreen();
            }
        };

        document.addEventListener('keydown', preventExitKeys);
        document.addEventListener('fullscreenchange', monitorFullscreen);
        window.addEventListener('keydown', handleKey);
        window.addEventListener('keyup', handleKey);

        return () => {
            document.removeEventListener('keydown', preventExitKeys);
            document.removeEventListener('fullscreenchange', monitorFullscreen);
            window.removeEventListener('keydown', handleKey);
            window.removeEventListener('keyup', handleKey);
        };
    }, [isFullScreenEnabled, timer]);

    const enterFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(console.error);
        }
    };

    const exitFullScreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(console.error);
        }
    };

    useEffect(() => {
        if (isFullScreenEnabled) {
            layoutContext.setLayoutState((prevLayoutState) => ({
                ...prevLayoutState,
                overlayMenuActive: false,
                staticMenuMobileActive: false,
                staticMenuDesktopInactive: true,
                useTopbarMenuActive: false
            }));
        } else {
            layoutContext.setLayoutState((prevLayoutState) => ({
                ...prevLayoutState,
                overlayMenuActive: true,
                staticMenuMobileActive: true,
                staticMenuDesktopInactive: false,
                useTopbarMenuActive: true
            }));
        }
    }, [isFullScreenEnabled]);
    useEffect(() => {
        loadAllSounds();
    });
    function fetchLogs(filename) {
        setLoading(true);
        setMessages([]);
        setSelectedLogFile(filename);

        sendMessageAndWaitForCondition({ type: 'GET-RIO-LOGS', message: filename.path }, (m) => m.type === 'GET-RIO-LOGS', 3000)
            .then((message) => {
                setLoading(false);
                if (message?.message) {
                    const messages = (message?.message?.messages || []).map((msg) => ({ message: msg, textClass: getColorFromMessageStart(msg) }));
                    if (message?.message?.success) {
                        setMessages(messages);
                        playSuccessNotificationSound();
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Logs Loaded!',
                            detail: 'The logs have been successfully rendered.'
                        });
                    } else {
                        setMessages([{ message: 'There was an non success status returned by server: ' }, ...messages]);
                        playErrorNotificationSound();
                        toast.current?.show({
                            severity: 'error',
                            summary: 'Logs Failed!',
                            detail: 'There was a error fetching logs.'
                        });
                    }
                }
            })
            .catch((e) => {
                setLoading(false);
                setRioStatus('ERROR');
                setMessages([{ message: e?.message || 'There was an unknown error fetching logs.' }]);
                playErrorNotificationSound();
                toast.current?.show({
                    severity: 'error',
                    summary: 'Logs Failed!',
                    detail: 'There was a unknown error fetching logs.'
                });
            });
    }

    // @ts-ignore
    return (
        <div className="grid fadeIn">
            <Toast ref={toast} />
            <ConfirmDialog />
            {!isFullScreenEnabled && (
                <>
                    <div className="col-12 lg:col-6">
                        <div className="card mb-0">
                            <div className="flex justify-content-between mb-3">
                                <div>
                                    <span className="block text-500 font-medium mb-3">Backend Status</span>
                                    <div className="text-900 font-medium text-xl"> {isConnected ? 'Connected' : 'Disconnected'}</div>
                                </div>
                                <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                    <i className="pi pi-chevron-circle-up text-blue-500 text-xl" />
                                </div>
                            </div>
                            <TimeAgo date={lastConnectionUpdate} />
                        </div>
                    </div>

                    <div className="col-12 lg:col-6">
                        <div className="card mb-0">
                            <div className="flex justify-content-between mb-3">
                                <div>
                                    <span className="block text-500 font-medium mb-3">RIO Status</span>
                                    <div className={'text-900 text-xl text-green-600 ' + getColorStatus(rioStatus)}>{rioStatus}</div>
                                </div>
                                <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                    <i className="pi pi-qrcode text-blue-500 text-xl" />
                                </div>
                            </div>
                            <TimeAgo date={lastStatusUpdate} />
                        </div>
                    </div>
                </>
            )}
            <div className="col-12">
                <div className="card mb-0">
                    <Dropdown
                        itemTemplate={(m) => {
                            return (
                                <>
                                    {m.path.replace('.txt', '')} (<TimeAgo className={'font-extrabold text-primary-500'} date={m.timestamp} refresh={100} />)
                                </>
                            );
                        }}
                        valueTemplate={(m) => {
                            if (!m) return loading ? 'Rendering logs now.' : 'Select a log to render.';
                            return (
                                <>
                                    {m?.path?.replace('.txt', '')} (<TimeAgo className={'font-extrabold text-primary-500'} date={m?.timestamp} refresh={100} />)
                                </>
                            );
                        }}
                        disabled={loading || !isConnected}
                        checkmark={true}
                        onChange={(e) => fetchLogs(e.value)}
                        value={selectedLogFile}
                        options={logFiles}
                        loading={loading}
                        placeholder={loading ? 'Loading log file...' : 'Select log file to view.'}
                        className={'w-full'}
                    />
                </div>
            </div>
            <div className="col-12">
                <TerminalDisplayColored backGroundColor={''} messages={messages} loadingDots={true} scrollLog={scrollLock} placeholder={loading ? 'Loading logs now' : 'Waiting for log selection'} maxHeight={isFullScreenEnabled ? '90vh' : '63vh'} />
            </div>
        </div>
    );

    function getColorStatus(rioStatus) {
        // Return color status based on device counts
        if (rioStatus === 'UNKNOWN') {
            return 'font-bold text-gray-400'; // UNKNOWN
        }
        if (rioStatus === 'CONNECTED') {
            return 'font-bold text-green-600'; // GOOD
        }
        if (rioStatus === 'DISCONNECTED') {
            return 'font-bold text-red-600 animate-pulse'; // BAD
        }
        if (rioStatus === 'ERROR') {
            return 'font-bold text-red-800 animate-pulse-fast-super'; // SUPER BAD
        }
        return 'font-bold text-yellow-600 animate-pulse-fast'; // MAYBE
    }

    function getColorFromMessageStart(message) {
        message = message.toLowerCase();
        if (message.startsWith('warn')) {
            return 'text-yellow-600 font-semibold';
        }
        if (message.startsWith('error')) {
            return 'text-red-600 font-extrabold';
        }
        if (message.includes('contract')) {
            return 'text-blue-500 font-extrabold text-lg';
        }
        if (message.startsWith('info')) {
            return 'text-purple-200';
        }
        if (message.startsWith('log start')) {
            return 'text-green-400 font-extrabold text-lg';
        }

        return 'text-white';
    }
};

export default Dashboard;
