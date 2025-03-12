/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useContext, useEffect, useRef, useState } from 'react';
import { ConfirmDialog } from 'primereact/confirmdialog';

import { WebsocketContext } from '../../../../layout/context/websocketcontext';
import TimeAgo from '../../../../components/TimeAgo';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { Toast } from 'primereact/toast';
import {
    loadAllSounds,
    playErrorNotificationSound,
    playNotificationSound,
    playSuccessNotificationSound
} from '../../../../utilities/notification';
import TerminalDisplay from '../../../../components/TerminalDisplay';
import { Dropdown } from 'primereact/dropdown';
import TerminalDisplayColored from '../../../../components/TerminalDisplayColored';
import axios from 'axios';
import { Tag } from 'primereact/tag';

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
    const [hostnames, setHostnames] = useState([]);
    const [hostname, setHostname] = useState(null);
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
                    sendMessageAndWaitForCondition({ type: 'GET-PHOTONVISION-HOSTNAMES' }, (m) => m.type === 'GET-PHOTONVISION-HOSTNAMES')
                        .then((message) => {
                            setHostnames(message.message);
                            setLastStatusUpdate(new Date());
                            isRequestInProgress = false;
                            if (isMounted.current) {
                                timeoutId.current = setTimeout(sendRequest, 2000); // Schedule next call
                            }
                        })
                        .catch(() => {
                            isRequestInProgress = false;
                            if (isMounted.current) {
                                timeoutId.current = setTimeout(sendRequest, 3000); // Retry on failure
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
                        detail: 'Hold \'D\' for 3 seconds to disable.',
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
                        detail: 'Press \'D\' for 3 seconds to exit.',
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

    function fetchLogs() {
        setLoading(true);
        axios.get(`http://${hostname}:5800/api/logs`, {
            timeout: 3000,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            withCredentials: false
        }).then((m) => {
            setLoading(false);
            setLogFiles(m.data)
        }).catch((err) => {
            console.log(err)
            setLoading(false);
            playErrorNotificationSound();
            toast.current?.show({
                severity: 'error',
                summary: 'Logs Failed!',
                detail: 'There was a unknown error fetching logs.'
            });
        });
    }

    function fetchLog(fileData) {
        setLoading(true);
        setMessages([]);
        setSelectedLogFile(fileData);
        axios.get(`http://${hostname}:5800/api/log?path=${encodeURIComponent(fileData?.path)}`, {
            timeout: 5000,
            responseType: "text",
            withCredentials: false
        }).then((m) => {
            setLoading(false);
            console.log(m.data);
            setMessages(m.data.split("\n").map(m => ({ message: m.trim(), textClass: getColorFromMessageStart(m) })));
        }).catch((err) => {
            console.log(err)
            setLoading(false);
            playErrorNotificationSound();
            toast.current?.show({
                severity: 'error',
                summary: 'Log Failed!',
                detail: 'There was a unknown error fetching log file.'
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
                                    <div
                                        className="text-900 font-medium text-xl"> {isConnected ? 'Connected' : 'Disconnected'}</div>
                                </div>
                                <div className="flex align-items-center justify-content-center bg-blue-100 border-round"
                                     style={{ width: '2.5rem', height: '2.5rem' }}>
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
                                    <span className="block text-500 font-medium mb-3">Devices</span>
                                    <div
                                        className="text-900 font-medium text-xl"> {isConnected ? `${hostnames.length} Devices` : 'Disconnected'}</div>
                                </div>
                                <div className="flex align-items-center justify-content-center bg-blue-100 border-round"
                                     style={{ width: '2.5rem', height: '2.5rem' }}>
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
                    <div className="grid">
                        <div className={'col-12'}>
                            <Dropdown
                                disabled={loading || !isConnected}
                                checkmark={true}
                                onChange={(e) => setHostname(e.value)}
                                value={hostname}
                                options={hostnames}
                                loading={loading}
                                placeholder={'Select device to view'}
                                className={'w-full'}
                            />
                        </div>
                        <div className={'col-12'}>
                            <Dropdown
                                virtualScrollerOptions={{
                                    lazy: true,
                                    onLazyLoad: () => fetchLogs(),
                                    itemSize: 38,
                                    showLoader: true,
                                    loading: loading,
                                }}
                                itemTemplate={(m) => {
                                    return (
                                        <>
                                        {m.path.replace('.log', '')} (<TimeAgo
                                            className={'font-extrabold text-primary-500'} date={m?.timestamp}
                                            refresh={100} />) {m?.fmsInfo && (<><Tag className={"font-bold"} severity={m?.fmsInfo?.IsRedAlliance ? "danger" : "secondary"} value={m?.fmsInfo?.IsRedAlliance ? "RED" : "BLUE"} />{" "}
                                            <Tag severity={"info"} value={`Match ${m?.fmsInfo?.MatchNumber}`}/></>) }
                                        </>
                                    );
                                }}
                                valueTemplate={(m) => {
                                    if (!m) return loading ? 'Rendering logs now.' : 'Select a log to render.';
                                    return (
                                        <>
                                            {m.path.replace('.log', '')} (<TimeAgo
                                            className={'font-extrabold text-primary-500'} date={m?.timestamp}
                                            refresh={100} />) {m?.fmsInfo && (<><Tag className={"font-bold"} severity={m?.fmsInfo?.IsRedAlliance ? "danger" : "secondary"} value={m?.fmsInfo?.IsRedAlliance ? "RED" : "BLUE"} />{" "}
                                            <Tag severity={"info"} value={`Match ${m?.fmsInfo?.MatchNumber}`}/></>) }
                                        </>
                                    );
                                }}
                                onChange={(e) => fetchLog(e.value)}
                                disabled={loading || !isConnected || !hostname}
                                checkmark={true}
                                value={selectedLogFile}
                                options={logFiles}
                                loading={loading}
                                placeholder={loading ? 'Loading log file...' : 'Select log file to view.'}
                                className={'w-full'}
                            />
                        </div>
                    </div>

                </div>
            </div>
            <div className="col-12">
                <TerminalDisplayColored backGroundColor={''} messages={messages} loadingDots={true}
                                        scrollLog={scrollLock}
                                        placeholder={loading ? 'Please wait while rendering logs' : 'Waiting for log selection'}
                                        maxHeight={isFullScreenEnabled ? '90vh' : '63vh'} />
            </div>
        </div>
    );

    function getColorFromMessageStart(message) {
        message = message.toLowerCase();
        if (message.includes('[warn]')) {
            return 'text-yellow-600 font-semibold';
        }
        if (message.includes('[error]')) {
            return 'text-red-600 font-extrabold';
        }

        if (message.includes('[info]')) {
            return 'text-blue-500';
        }


        return 'text-gray-400';
    }
};

export default Dashboard;
