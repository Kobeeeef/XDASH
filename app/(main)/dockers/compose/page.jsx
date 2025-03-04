/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useContext, useEffect, useRef, useState } from 'react';

import { WebsocketContext } from '../../../../layout/context/websocketcontext';
import TimeAgo from '../../../../components/TimeAgo';
import { Stepper } from 'primereact/stepper';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { StepperPanel } from 'primereact/stepperpanel';
import { MultiSelect } from 'primereact/multiselect';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { playErrorNotificationSound, playFatalNotificationSound, playNotificationSound, playSuccessNotificationSound } from '../../../../utilities/notification';
import { TabPanel, TabView } from 'primereact/tabview';
import TerminalDisplay from '../../../../components/TerminalDisplay';
import { Tag } from 'primereact/tag';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Dropdown } from 'primereact/dropdown';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { countdown } from '../../../../utilities/utilities';
import { ToggleButton } from 'primereact/togglebutton';
import TimeoutsDialog from '../../../../components/TimeoutsDialog';
import { useRouter } from 'next/navigation';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { SelectButton } from 'primereact/selectbutton';

const Dashboard = () => {
    const toast = useRef(null);
    const router = useRouter();
    const { isConnected, lastConnectionUpdate, sendMessageAndWaitForCondition, sendMessageAndWaitForConditionWithManage, getTimeoutManagerById, timeoutsRef } = useContext(WebsocketContext);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [devices, setDevices] = useState([]);
    const [selectedDevices, setSelectedDevices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [readyDialogVisible, setReadyDialogVisible] = useState(false);
    const [buildStatus, setBuildStatus] = useState({
        STARTING: [],
        BUILDING: [],
        COMPRESSION: [],
        ERRORS: [],
        FINISHED: []
    });
    const [confirmChanges, setConfirmChanges] = useState(false);
    const [finished, setFinished] = useState(false);
    const [setup, setSetup] = useState({});
    const [reconnectionMessages, setReconnectionMessages] = useState({});
    const [reconnectionData, setReconnectionData] = useState({});

    const stepperRef = useRef(null);
    const [buildIndex, setBuildIndex] = useState(0);
    const [reconnectionIndex, setReconnectionIndex] = useState(0);
    const isMounted = useRef(true); // Tracks if the component is mounted
    const timeoutId = useRef(null); // Stores the timeout ID persistently
    const [ready, setReady] = useState(null);
    const [running, setRunning] = useState(false);
    const [readyLock, setReadyLock] = useState(false);
    const [response, setResponse] = useState(null);
    const [composePreviewDialogVisible, setComposePreviewDialogVisible] = useState(false);
    const [composePreview, setComposePreview] = useState(null);
    const [dockerfilePreviewDialogVisible, setDockerfilePreviewDialogVisible] = useState(false);
    const [dockerfilePreview, setDockerfilePreview] = useState(null);
    const [additionalArgumentsIndex, setAdditionalArgumentsIndex] = useState(-1);
    const [additionalArguments, setAdditionalArguments] = useState({
        CONTAINER_NAME: 'xdash-docker-pipeline',
        IMAGE_NAME: 'xdash-docker-image',
        ARCHITECTURE: 'linux/arm64/v8',
        FLASH_TYPE: 'HARD',
        USE_NETWORKING: false,
        COMPRESSION: 9,
        STEP: 1
    });
    const [transferMessages, setTransferMessages] = useState({});
    const [transferData, setTransferData] = useState({});
    const [transferIndex, setTransferIndex] = useState(0);
    const [projectDirectory, setProjectDirectory] = useState(null);
    const [composeDirectory, setComposeDirectory] = useState(null);
    const [finalSummary, setFinalSummary] = useState([]);
    const [shutdownPreviousThreadsDialogVisible, setShutdownPreviousThreadsDialogVisible] = useState(false);
    const [os, setOs] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userAgent = window.navigator.userAgent.toLowerCase();
            if (userAgent.includes('win')) setOs('Windows');
            else if (userAgent.includes('mac')) setOs('macOS');
            else if (userAgent.includes('linux')) setOs('Linux');
            else if (userAgent.includes('android')) setOs('Android');
            else if (userAgent.includes('iphone') || userAgent.includes('ipad')) setOs('iOS');
            else setOs('Unknown OS');
        }
    }, []);
    useEffect(() => {
        isMounted.current = true; // Set the mounted flag
        let isRequestInProgress = false;

        const sendRequest = () => {
            if (isMounted.current && isConnected && !isRequestInProgress) {
                isRequestInProgress = true;
                try {
                    sendMessageAndWaitForCondition({ type: 'DOCKER-PAGE' }, (m) => m.type === 'DOCKER-PAGE', 3000)
                        .then((message) => {
                            setDevices((d) => {
                                try {
                                    const json = JSON.parse(message?.message?.devices);
                                    if (d.length !== json?.length) setLastUpdate(new Date());

                                    return json;
                                } catch (e) {
                                    return [];
                                }
                            });
                            setReady(message?.message?.ready ?? false);
                            setRunning(message?.message?.running ?? false);
                            setProjectDirectory(message?.message?.docker_images_directory);
                            setComposeDirectory(message?.message?.docker_compose_directory);
                            setResponse(message?.message?.message);

                            isRequestInProgress = false;
                            if (isMounted.current) {
                                timeoutId.current = setTimeout(sendRequest, 250); // Schedule next call
                            }
                        })
                        .catch(() => {
                            isRequestInProgress = false;
                            if (isMounted.current) {
                                timeoutId.current = setTimeout(sendRequest, 400); // Retry on failure
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
        if (ready !== null && !ready) {
            if (!readyLock) {
                playErrorNotificationSound();
                setReadyDialogVisible(true);
            }
        }
    }, [ready, readyLock]);

    function connect_wifi(type, vFunc) {
        return sendMessageAndWaitForConditionWithManage(
            'CONNECT-WIFI',
            {
                type: 'WIFI-CONNECT',
                message: type
            },
            vFunc,
            20000
        );
    }

    async function preview_dockerfile() {
        try {
            let response = await sendMessageAndWaitForCondition(
                {
                    type: 'DOCKER-FILE-GET'
                },
                (m) => m?.type === 'DOCKER-FILE-GET',
                5000
            );
            if (response?.message?.success) {
                if (response?.message?.message) {
                    setDockerfilePreviewDialogVisible(true);
                    setDockerfilePreview(response.message.message);
                } else {
                    toast.current.show({
                        severity: 'warn',
                        summary: 'Dockerfile Preview Falsy!',
                        detail: 'The server returned a falsy message.'
                    });
                    setDockerfilePreviewDialogVisible(false);
                    setDockerfilePreview(null);
                }
            } else {
                toast.current.show({
                    severity: 'warn',
                    summary: 'Dockerfile Preview Failed!',
                    detail: response?.message?.message || 'The server returned a false success.'
                });
                setDockerfilePreviewDialogVisible(false);
                setDockerfilePreview(null);
            }
        } catch (e) {
            toast.current.show({
                severity: 'warn',
                summary: 'Dockerfile Preview Failed!',
                detail: e?.message ?? 'There was a exception while getting the Dockerfile preview.'
            });
            setDockerfilePreviewDialogVisible(false);
            setDockerfilePreview(null);
        }
    }

    async function preview_compose() {
        try {
            let response = await sendMessageAndWaitForCondition(
                {
                    type: 'DOCKER-COMPOSE-FILE-GET'
                },
                (m) => m?.type === 'DOCKER-COMPOSE-FILE-GET',
                5000
            );
            if (response?.message?.success) {
                if (response?.message?.message) {
                    setComposePreviewDialogVisible(true);
                    setComposePreview(response.message.message);
                } else {
                    toast.current.show({
                        severity: 'warn',
                        summary: 'Compose Preview Falsy!',
                        detail: 'The server returned a falsy message.'
                    });
                    setComposePreviewDialogVisible(false);
                    setComposePreview(null);
                }
            } else {
                toast.current.show({
                    severity: 'warn',
                    summary: 'Compose Preview Failed!',
                    detail: response?.message?.message || 'The server returned a false success.'
                });
                setComposePreviewDialogVisible(false);
                setComposePreview(null);
            }
        } catch (e) {
            toast.current.show({
                severity: 'warn',
                summary: 'Compose Preview Failed!',
                detail: e?.message ?? 'There was a exception while getting the compose preview.'
            });
            setComposePreviewDialogVisible(false);
            setComposePreview(null);
        }
    }

    function finish() {
        setFinished(true);
        setComposePreviewDialogVisible(false);
        setLoading(false);
        stepperRef.current.setActiveStep(5);
    }

    async function transfer_import(sync_only) {
        setFinished(false);
        setTransferData({});
        setTransferMessages({});
        setTransferIndex(0);
        stepperRef.current.setActiveStep(4);
        setLoading(true);

        setTransferIndex(selectedDevices.length);
        setTransferData((prev) => ({
            ...prev,
            messages: ['Fetching compose preview...', ...(prev?.messages ?? [])]
        }));
        await preview_compose();

        sendMessageAndWaitForConditionWithManage(
            'DEVICES-DOCKER-IMPORT',
            {
                type: 'DEVICES-DOCKER-IMPORT',
                message: JSON.stringify({
                    servers: selectedDevices.map((m) => m.server),
                    containerName: additionalArguments?.CONTAINER_NAME,
                    imageName: additionalArguments?.IMAGE_NAME,
                    architecture: additionalArguments?.ARCHITECTURE,
                    flashType: additionalArguments?.FLASH_TYPE,
                    useCompose: true,
                    syncOnly: sync_only === true,
                    wasGZFile: additionalArguments?.COMPRESSION !== 0
                })
            },
            (m) => {
                if (m?.type === 'DEVICES-DOCKER-IMPORT') {
                    let manager = getTimeoutManagerById('DEVICES-DOCKER-IMPORT');
                    if (manager) manager.extendTimeout(30000);
                    const msg = JSON.parse(m?.message);
                    if (msg?.server) {
                        setTransferMessages((prev) => {
                            const updatedMessages = { ...prev };
                            const array = updatedMessages[msg.server] ?? [];
                            updatedMessages[msg.server] = [msg?.response || '', ...array];
                            return updatedMessages; // Return the updated object
                        });

                        const index = selectedDevices.findIndex((obj) => obj?.server === msg.server);
                        if (index !== -1) {
                            setTransferIndex(index);
                        }
                    }
                    if (msg?.success === false) {
                        playErrorNotificationSound();
                        if (msg?.response) {
                            setTransferData((prev) => {
                                const updatedData = { ...prev };
                                updatedData.messages = [msg.response || `Unknown unsuccessful error from server.`, ...(prev?.messages ?? [])];
                                return updatedData;
                            });
                        }
                    }
                    if (msg.finished) {
                        setTransferIndex(selectedDevices.length);
                        return true;
                    }
                }
            },
            400000
        )
            .then((m) => {
                setLoading(false);
                setTransferData((prev) => {
                    const updatedData = { ...prev };
                    updatedData.messages = [m?.message?.response || `No final message received back from server.`, ...(prev?.messages ?? [])];
                    return updatedData;
                });
                setFinalSummary((prevArray) => [m?.message?.response || `No final message received back from server.`, ...prevArray]);

                if (m?.message?.success) {
                    playSuccessNotificationSound();
                    finish();
                } else {
                    playFatalNotificationSound();
                    setFinished(true);
                }
            })
            .catch((e) => {
                setTransferData((prev) => ({
                    ...prev,
                    messages: [e?.message ?? `There was an unknown exception.`, ...(prev?.messages ?? [])]
                }));
                setFinished(true);
                playFatalNotificationSound();
                setLoading(false);
            });
    }

    function reconnection() {
        setFinished(false);
        stepperRef.current.setActiveStep(3);
        setReconnectionData({});
        setReconnectionMessages({});
        setLoading(true);
        sendMessageAndWaitForConditionWithManage(
            'DEVICES-RECONNECT',
            {
                type: 'DEVICES-RECONNECT',
                message: JSON.stringify(selectedDevices)
            },
            (m) => {
                if (m?.type === 'DEVICES-RECONNECT') {
                    let manager = getTimeoutManagerById('DEVICES-RECONNECT');
                    if (manager) manager.extendTimeout(10000);
                    const msg = JSON.parse(m?.message);
                    if (msg?.sshHostAddress) {
                        const device = JSON.parse(msg?.sshHostAddress);
                        setReconnectionMessages((prev) => ({
                            ...prev,
                            [device.server]: [msg?.response || `Unknown message while reconnecting on machine: ${device?.server}...`, ...(prev[device.server] ?? [])]
                        }));

                        const index = selectedDevices.findIndex((obj) => obj?.server === device?.server);
                        if (index !== -1) {
                            setReconnectionIndex(index);
                        }
                    }
                    if (msg.finished) {
                        setReconnectionIndex(selectedDevices.length);
                        setReconnectionData((prev) => {
                            return {
                                ...prev,
                                DEVICES_RECONNECTION_SUCCESS: msg?.success ?? false
                            };
                        });
                        return true;
                    }
                }
            },
            65000
        )
            .then((m) => {
                setReconnectionData((prev) => ({
                    ...prev,
                    messages: [m?.message?.response || `No final message received back from server.`, ...(prev?.messages ?? [])]
                }));
                if (m?.message?.success) {
                    playSuccessNotificationSound();
                    countdown(
                        3,
                        (s) => {
                            setReconnectionData((prev) => ({
                                ...prev,
                                messages: [`Continuing onto transfer & execute in ${s} seconds...`, ...(prev?.messages ?? [])]
                            }));
                        },
                        transfer_import
                    );
                } else {
                    setLoading(false);
                    playFatalNotificationSound();
                }
            })
            .catch((e) => {
                setReconnectionData((prev) => ({
                    ...prev,
                    messages: [e?.message ?? `There was an unknown exception.`, ...(prev?.messages ?? [])],
                    DEVICES_RECONNECTION_SUCCESS: false
                }));
                setReconnectionIndex(selectedDevices.length);
                playFatalNotificationSound();
                setLoading(false);
            });
    }

    async function build(onlyBuild) {
        stepperRef.current.setActiveStep(1);
        setFinished(false);
        setBuildStatus({});
        setLoading(true);

        await preview_dockerfile();

        sendMessageAndWaitForConditionWithManage(
            'DOCKER-BUILD',
            {
                type: 'DOCKER-BUILD',
                message: JSON.stringify({
                    CONTAINER_NAME: additionalArguments?.CONTAINER_NAME,
                    IMAGE_NAME: additionalArguments?.IMAGE_NAME,
                    ARCHITECTURE: additionalArguments?.ARCHITECTURE,
                    COMPRESSION: additionalArguments?.COMPRESSION
                })
            },
            (m) => {
                if (m.type === 'DOCKER-BUILD') {
                    let manager = getTimeoutManagerById('DOCKER-BUILD');
                    if (manager) manager.extendTimeout(30000);
                    const msg = JSON.parse(m.message);
                    if (msg.step === 'STARTING') {
                        setBuildIndex(0);
                        setBuildStatus((prev) => {
                            const array = prev?.STARTING ?? [];
                            array.unshift(msg?.message || 'Unknown message while building on step STARTING...');
                            return {
                                ...prev,
                                STARTING: array
                            };
                        });
                    } else if (msg.step === 'BUILDING') {
                        setBuildIndex(1);
                        setBuildStatus((prev) => {
                            const array = prev?.BUILDING ?? [];
                            array.unshift(msg?.message || '');
                            return {
                                ...prev,
                                BUILDING: array
                            };
                        });
                    } else if (msg.step === 'COMPRESSION') {
                        setBuildIndex(2);
                        setBuildStatus((prev) => {
                            const array = prev?.COMPRESSION ?? [];
                            array.unshift(msg?.message || '');
                            return {
                                ...prev,
                                COMPRESSION: array
                            };
                        });
                    } else if (msg.step === 'FINISHED') {
                        setBuildIndex(4);
                        setBuildStatus((prev) => {
                            const array = prev?.FINISHED ?? [];
                            array.unshift(msg?.message || 'Unknown message while building on step FINISHED...');
                            return {
                                ...prev,
                                FINISHED: array
                            };
                        });
                    } else {
                        setBuildIndex(3);
                        setBuildStatus((prev) => {
                            const array = prev?.ERRORS ?? [];
                            array.unshift(msg?.message || 'Unknown Exception while building...');
                            return {
                                ...prev,
                                ERRORS: array
                            };
                        });
                        playErrorNotificationSound();
                    }

                    if (msg?.success === true || msg?.success === false) {
                        if (msg?.finished) {
                            if (msg?.success === true) playSuccessNotificationSound();
                            return true;
                        }
                    }
                }
            },
            120000
        )
            .then((msg) => {
                if (msg?.message.success === false) {
                    playFatalNotificationSound();
                    setLoading(false);
                } else if (msg?.message.success === true) {
                    playSuccessNotificationSound();

                    if (onlyBuild === true) {
                        setDockerfilePreviewDialogVisible(false);
                        toast.current.show({
                            severity: 'info',
                            summary: 'Build Finished!',
                            life: 6000,
                            detail: 'The pipeline is no longer continuing.'
                        });
                        playNotificationSound();
                        setLoading(false);
                        return;
                    }
                    setLoading(true);
                    stepperRef.current.setActiveStep(2);
                    setSetup((prev) => ({
                        ...prev,
                        ROBOT_CONNECTION_MESSAGES: ['Attempting to connect back to robot WiFi now...']
                    }));
                    if (!additionalArguments?.USE_NETWORKING) {
                        toast.current.show({
                            severity: 'info',
                            summary: 'Network Skipped!',
                            life: 6000,
                            detail: 'The robot wifi connection was skipped.'
                        });
                        toast.current.show({
                            severity: 'info',
                            summary: 'Reconnection Skipped!',
                            life: 6000,
                            detail: 'The machine reconnection was skipped.'
                        });
                        return transfer_import();
                    }
                    connect_wifi('ROBOT', (m) => {
                        if (m.type === 'WIFI-CONNECT') {
                            let msg = JSON.parse(m.message);

                            setSetup((prev) => {
                                prev.ROBOT_CONNECTION_MESSAGES.unshift(msg.message);
                                return {
                                    ...prev,
                                    ROBOT_CONNECTION_SUCCESS: msg?.success === true ? true : msg?.success === false ? false : prev?.ROBOT_CONNECTION_SUCCESS,
                                    ROBOT_CONNECTION_MESSAGES: prev.ROBOT_CONNECTION_MESSAGES
                                };
                            });
                            if (msg?.finished) {
                                return true;
                            }
                        }
                    })
                        .then((msg) => {
                            if (msg?.message?.success === false) {
                                playFatalNotificationSound();
                                setLoading(false);
                            } else if (msg?.message?.success === true) {
                                playSuccessNotificationSound();
                                countdown(
                                    5,
                                    (s) => {
                                        setSetup((prev) => {
                                            prev.ROBOT_CONNECTION_MESSAGES.unshift(`Continuing onto reconnection in ${s} seconds...`);
                                            return {
                                                ...prev,
                                                ROBOT_CONNECTION_MESSAGES: prev.ROBOT_CONNECTION_MESSAGES
                                            };
                                        });
                                    },
                                    reconnection
                                );
                            }
                        })
                        .catch((e) => {
                            setSetup((prev) => {
                                prev.ROBOT_CONNECTION_MESSAGES.unshift(e?.message || 'Unknown Exception while connecting to robot WiFi...');
                                return {
                                    ...prev,
                                    ROBOT_CONNECTION_SUCCESS: false,
                                    ROBOT_CONNECTION_MESSAGES: prev.ROBOT_CONNECTION_MESSAGES
                                };
                            });
                            playFatalNotificationSound();
                            setLoading(false);
                        });
                }
            })
            .catch((e) => {
                setLoading(false);
                playFatalNotificationSound();
                setBuildStatus((prev) => {
                    const array = prev?.ERRORS ?? [];
                    array.unshift(e?.message || 'Unknown Exception while building...');
                    return {
                        ...prev,
                        ERRORS: array
                    };
                });
            });
    }

    function shutdownAllPreviousThreads() {
        return sendMessageAndWaitForConditionWithManage(
            'DEVICES-DOCKER-IMPORT-SHUTDOWN-THREADS',
            {
                type: 'DEVICES-DOCKER-IMPORT-SHUTDOWN-THREADS'
            },
            (m) => m.type === 'DEVICES-DOCKER-IMPORT-SHUTDOWN-THREADS',
            10000
        );
    }

    function start() {
        if (running) {
            playFatalNotificationSound();
            setShutdownPreviousThreadsDialogVisible(true);
            return;
        }

        setSetup({});
        setTransferData({});
        setTransferMessages({});
        setFinished(false);
        setFinalSummary([]);
        setTransferIndex(0);
        setAdditionalArgumentsIndex(-1);
        stepperRef.current.setActiveStep(0);
        if (!ready) {
            toast.current.show({
                severity: 'error',
                summary: 'Pipeline Setup Incomplete!',
                detail: response ?? 'The docker pipeline is not ready.'
            });
            playErrorNotificationSound();
            return;
        }
        if (!additionalArguments?.ARCHITECTURE || !additionalArguments?.CONTAINER_NAME || !additionalArguments?.IMAGE_NAME) {
            toast.current.show({
                severity: 'error',
                summary: 'Pipeline Setup Incomplete!',
                detail: 'There are missing required arguments.'
            });
            playErrorNotificationSound();
            return;
        }
        if (!projectDirectory) {
            toast.current.show({
                severity: 'error',
                summary: 'Pipeline Setup Incomplete!',
                detail: 'There is no project directory configured.'
            });
            playErrorNotificationSound();
            return;
        }
        if (!composeDirectory) {
            toast.current.show({
                severity: 'error',
                summary: 'Pipeline Setup Incomplete!',
                detail: 'There is no docker compose file configured.'
            });
            playErrorNotificationSound();
            return;
        }

        setLoading(true);
        setSetup((prev) => ({
            ...prev,
            INTERNET_CONNECTION_MESSAGES: ['Attempting to connect to internet WiFi now...']
        }));
        if (additionalArguments?.STEP === 1) {
            return build();
        } else if (additionalArguments?.STEP === 3) {
            return reconnection();
        } else if (additionalArguments?.STEP === 4) {
            return transfer_import();
        }
        if (!additionalArguments?.USE_NETWORKING) {
            toast.current.show({
                severity: 'info',
                life: 6000,
                summary: 'Network Skipped!',
                detail: 'The internet wifi connection was skipped.'
            });
            return build();
        }
        connect_wifi('INTERNET', (m) => {
            if (m.type === 'WIFI-CONNECT') {
                let msg = JSON.parse(m.message);
                console.log(msg);
                setSetup((prev) => {
                    prev.INTERNET_CONNECTION_MESSAGES.unshift(msg.message);
                    return {
                        ...prev,
                        INTERNET_CONNECTION_SUCCESS: msg?.success === true ? true : msg?.success === false ? false : prev?.INTERNET_CONNECTION_SUCCESS,
                        INTERNET_CONNECTION_MESSAGES: prev.INTERNET_CONNECTION_MESSAGES
                    };
                });
                if (msg?.finished) {
                    return true;
                }
            }
        })
            .then((msg) => {
                if (msg?.message?.success === false) {
                    playFatalNotificationSound();
                    setLoading(false);
                } else if (msg?.message?.success === true) {
                    playSuccessNotificationSound();
                    countdown(
                        5,
                        (s) => {
                            setSetup((prev) => {
                                prev.INTERNET_CONNECTION_MESSAGES.unshift(`Continuing onto build in ${s} seconds...`);
                                return {
                                    ...prev,
                                    INTERNET_CONNECTION_MESSAGES: prev.INTERNET_CONNECTION_MESSAGES
                                };
                            });
                        },
                        build
                    );
                }
            })
            .catch((e) => {
                setSetup((prev) => {
                    prev.INTERNET_CONNECTION_MESSAGES.unshift(e?.message || 'Unknown Exception while connecting to internet WiFi...');
                    return {
                        ...prev,
                        INTERNET_CONNECTION_SUCCESS: false,
                        INTERNET_CONNECTION_MESSAGES: prev.INTERNET_CONNECTION_MESSAGES
                    };
                });
                playFatalNotificationSound();
                setLoading(false);
            });
    }

    function checkConfirmChangesArgs() {
        if (!confirmChanges) {
            playErrorNotificationSound();
            confirmDialog({
                group: 'headless',
                breakpoints: { '1100px': '75vw', '960px': '100vw' },
                position: 'center'
            });
        }
    }

    // @ts-ignore
    return (
        <div className="grid fadeIn">
            <Toast ref={toast} />
            <TimeoutsDialog timeoutsRef={timeoutsRef} updateInterval={10} />
            <Dialog position={'top'} modal={false} header={'Compose Preview'} closeOnEscape={true} style={{ width: '50%' }} visible={composePreviewDialogVisible} onHide={() => setComposePreviewDialogVisible(false)}>
                <SyntaxHighlighter language={'yml'} showLineNumbers={true} wrapLines={true} style={vs2015}>
                    {composePreview}
                </SyntaxHighlighter>
            </Dialog>
            <Dialog position={'top'} modal={false} header={'Dockerfile Preview'} closeOnEscape={true} style={{ width: '50%' }} visible={dockerfilePreviewDialogVisible} onHide={() => setDockerfilePreviewDialogVisible(false)}>
                <SyntaxHighlighter language={'dockerfile'} showLineNumbers={true} wrapLines={true} style={vs2015}>
                    {dockerfilePreview}
                </SyntaxHighlighter>
            </Dialog>
            <Dialog
                group="shutdownThreads"
                closable={false}
                visible={shutdownPreviousThreadsDialogVisible}
                content={({ headerRef, contentRef, footerRef, hide, message }) => (
                    <div className="flex flex-column align-items-center p-5 surface-overlay border-round">
                        <div className="border-circle bg-red-600 inline-flex justify-content-center align-items-center h-6rem w-6rem -mt-8">
                            <i className="pi pi-exclamation-triangle text-5xl"></i>
                        </div>
                        <span className="font-bold text-2xl block mb-2 mt-4" ref={headerRef}>
                            Shutdown Required
                        </span>
                        <div className="p-4 rounded-lg shadow-md" ref={contentRef}>
                            <p className="text-lg">There are previous tasks submitted. You must shut down all previous threads before submitting a new request.</p>
                            <ul className="mt-2 list-disc list-inside text-base">
                                <li>Failure to shut down threads may cause performance degradation.</li>
                                <li>Resources allocated to old threads might lead to conflicts with new tasks.</li>
                                <li>Ensuring all threads are terminated prevents unintended errors.</li>
                            </ul>
                            <p className="mt-2 text-lg font-medium text-red-600">Proceed only if you have confirmed that all previous threads are safely shut down.</p>
                        </div>
                        <div className="flex align-items-center gap-2 mt-4" ref={footerRef}>
                            <Button label="Cancel" outlined={true} onClick={(event) => setShutdownPreviousThreadsDialogVisible(false)} className="w-8rem"></Button>
                            <Button
                                outlined={false}
                                label="Shutdown"
                                loading={loading}
                                onClick={(event) => {
                                    setLoading(true);
                                    shutdownAllPreviousThreads()
                                        .then((m) => {
                                            setLoading(false);
                                            if (m?.message?.success) {
                                                setShutdownPreviousThreadsDialogVisible(false);
                                                toast.current.show({
                                                    severity: 'success',
                                                    summary: 'Shutdown Success!',
                                                    detail: 'The threads have been shutdown.'
                                                });
                                                playSuccessNotificationSound();
                                            } else {
                                                toast.current.show({
                                                    severity: 'warn',
                                                    summary: 'Shutdown Failed!',
                                                    detail: m?.message?.message ?? 'The server returned a bad status code.'
                                                });
                                                playErrorNotificationSound();
                                            }
                                        })
                                        .catch((e) => {
                                            toast.current.show({
                                                severity: 'warn',
                                                summary: 'Shutdown Failed!',
                                                detail: e?.message ?? 'There was a exception while shutting down threads.'
                                            });
                                            playFatalNotificationSound();
                                            setLoading(false);
                                        });
                                }}
                                className="w-8rem"
                            ></Button>
                        </div>
                    </div>
                )}
                onHide={() => setShutdownPreviousThreadsDialogVisible(false)}
            />
            <ConfirmDialog
                group="headless"
                content={({ headerRef, contentRef, footerRef, hide, message }) => (
                    <div className="flex flex-column align-items-center p-5 surface-overlay border-round">
                        <div className="border-circle bg-primary inline-flex justify-content-center align-items-center h-6rem w-6rem -mt-8">
                            <i className="pi pi-exclamation-triangle text-5xl"></i>
                        </div>
                        <span className="font-bold text-2xl block mb-2 mt-4" ref={headerRef}>
                            Confirm Changes
                        </span>
                        <div className="p-4 rounded-lg shadow-md" ref={contentRef}>
                            <p className="text-lg">You are about to modify the preset additional arguments. Changing these settings could result in unintended behavior, including:</p>
                            <ul className="mt-2 list-disc list-inside text-base">
                                <li>Multiple instances of the same Docker containers running.</li>
                                <li>Potential conflicts or errors in container management.</li>
                                <li>XDASH will lose track of existing containers/images, breaking management.</li>
                            </ul>
                            <p className="mt-2 text-lg font-medium text-red-600">Only proceed if you understand the implications of these changes.</p>
                        </div>
                        <div className="flex align-items-center gap-2 mt-4" ref={footerRef}>
                            <Button label="Cancel" outlined={false} onClick={(event) => hide(event)} className="w-8rem"></Button>
                            <Button
                                outlined={true}
                                label="Okay"
                                onClick={(event) => {
                                    hide(event);
                                    setConfirmChanges(true);
                                    toast.current.show({
                                        severity: 'warn',
                                        life: 6000,
                                        summary: 'Changes Confirmed',
                                        detail: 'You have agreed to modify the arguments. Proceed with caution.'
                                    });
                                }}
                                className="w-8rem"
                            ></Button>
                        </div>
                    </div>
                )}
            />
            <ConfirmDialog
                closable={false}
                group="notReady"
                visible={readyDialogVisible}
                content={({ headerRef, contentRef, footerRef, hide, message }) => (
                    <div className="flex flex-column align-items-center p-5 surface-overlay border-round">
                        <div className="border-circle bg-red-600 inline-flex justify-content-center align-items-center h-6rem w-6rem -mt-8">
                            <i className="pi pi-ban text-5xl"></i>
                        </div>
                        <span className="font-bold text-2xl block mb-2 mt-4" ref={headerRef}>
                            Docker Pipeline
                        </span>
                        <div className="p-4 rounded-lg shadow-md" ref={contentRef}>
                            <p className="text-lg">
                                <strong>The Docker pipeline is not ready to be used.</strong>
                                <br />
                                The XDASH Docker pipeline setup is incomplete. Please verify and finalize all configuration steps before continuing to ensure proper functionality.
                            </p>
                            <div className="mt-2">
                                <p className="text-lg">
                                    <strong>Missing Configuration Details:</strong>
                                </p>
                                <code className="list-disc list-inside text-base ml-5">{response}</code>
                            </div>
                            <p className="mt-4 text-lg font-medium text-red-600">
                                If you need assistance, refer to the{' '}
                                <a onClick={() => router.push('/documentation')} className="text-primary" style={{ cursor: 'pointer' }}>
                                    setup documentation
                                </a>{' '}
                                or contact support.
                            </p>
                        </div>
                        <div className="flex align-items-center gap-2 mt-4" ref={footerRef}>
                            <Button
                                outlined={true}
                                label="Okay"
                                onClick={(event) => {
                                    setReadyDialogVisible(false);
                                    setReadyLock(true);
                                }}
                                className="w-8rem"
                            ></Button>
                        </div>
                    </div>
                )}
            />
            <div className="col-12 lg:col-6">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Backend Status</span>
                            <div className="text-900 font-medium text-xl font-bold"> {isConnected ? 'Connected' : 'Disconnected'}</div>
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
                            <span className="block text-500 font-medium mb-3">Total Machines</span>
                            <div className="text-900 font-medium text-xl font-bold">{isConnected ? devices?.length ?? 0 : 'Disconnected'}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-android text-cyan-500 text-xl" />
                        </div>
                    </div>
                    <TimeAgo date={lastUpdate} />
                </div>
            </div>
            <div className="col-12">
                <div className="card mb-0">
                    <div className={'grid'}>
                        <div className={'col-12'}>
                            <MultiSelect
                                disabled={!isConnected || loading}
                                onChange={(e) => {
                                    const filtered = e.value.filter((e) => e?.status !== 'CONNECTED');
                                    if (filtered.length > 0) {
                                        playErrorNotificationSound();
                                        filtered.forEach((e) => {
                                            toast.current.show({
                                                severity: 'error',
                                                summary: 'Server Not Connected!',
                                                detail: `${e.server} is not connected.`
                                            });
                                        });
                                    }
                                    stepperRef.current.setActiveStep(0);
                                    setSetup({});
                                    setFinished(false);
                                    setSelectedDevices(e.value.filter((e) => e?.status === 'CONNECTED'));
                                }}
                                value={selectedDevices}
                                options={devices}
                                optionLabel="server"
                                display="chip"
                                placeholder="Select Machines"
                                itemTemplate={template}
                                className="w-full"
                            />
                        </div>
                        <div className={'col-12'}>
                            <Accordion activeIndex={additionalArgumentsIndex} onTabChange={(e) => setAdditionalArgumentsIndex(e.index)}>
                                <AccordionTab disabled={loading || !isConnected} header="Additional Arguments">
                                    <div className={'grid'}>
                                        <div className={'col-6'}>
                                            <div className="flex flex-column gap-2">
                                                <label htmlFor="Project_DIRECTORY" className={'text-sm'}>
                                                    Project Directory
                                                </label>
                                                <div className="p-inputgroup flex-1">
                                                    <InputText disabled={!isConnected || loading} value={projectDirectory} readOnly={true} className={'w-full'} placeholder={'There is no project directory configured.'} />
                                                    <Button
                                                        onClick={() => {
                                                            setLoading(true);
                                                            preview_dockerfile()
                                                                .then(() => setLoading(false))
                                                                .catch(() => setLoading(false))
                                                                .finally(() => setLoading(false));
                                                        }}
                                                        icon="pi pi-search"
                                                        disabled={!isConnected || !projectDirectory}
                                                        loading={loading}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className={'col-6'}>
                                            <div className="flex flex-column gap-2">
                                                <label htmlFor="USE_NETWORKING" className={'text-sm'}>
                                                    Network
                                                </label>
                                                <ToggleButton
                                                    disabled={!isConnected || loading}
                                                    onLabel={'Disable Networking'}
                                                    offLabel={'Enable Networking'}
                                                    checked={additionalArguments?.USE_NETWORKING}
                                                    onChange={(e) => {
                                                        setAdditionalArguments((prev) => {
                                                            return {
                                                                ...prev,
                                                                STEP: e.value ? 0 : 1,
                                                                USE_NETWORKING: e.value
                                                            };
                                                        });
                                                        stepperRef.current.setActiveStep(e.value ? 0 : 1);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className={'col-12 lg:col-6'}>
                                            <div className="flex flex-column gap-2">
                                                <label htmlFor="ARCHITECTURE" className={'text-sm'}>
                                                    Architecture
                                                </label>
                                                <Dropdown
                                                    id={'ARCHITECTURE'}
                                                    value={additionalArguments?.ARCHITECTURE}
                                                    onChange={(e) => {
                                                        setAdditionalArguments((prev) => {
                                                            return {
                                                                ...prev,
                                                                ARCHITECTURE: e.value
                                                            };
                                                        });
                                                    }}
                                                    editable={true}
                                                    valueTemplate={archTemplate}
                                                    itemTemplate={archTemplate}
                                                    options={[
                                                        'linux/amd64',
                                                        'windows/amd64',
                                                        'darwin/amd64',
                                                        'linux/aarch64',
                                                        'aarch64',
                                                        'linux/arm64/v8',
                                                        'linux/arm64',
                                                        'windows/arm64',
                                                        'darwin/arm64',
                                                        'linux/arm/v7',
                                                        'windows/arm/v7',
                                                        'linux/arm/v6',
                                                        'linux/ppc64le',
                                                        'linux/s390x'
                                                    ]}
                                                    disabled={!isConnected || loading}
                                                    className={'w-full'}
                                                    placeholder={'There is no architecture configured.'}
                                                />
                                            </div>
                                        </div>
                                        <div className={'col-12 lg:col-6'}>
                                            <div className="flex flex-column gap-2">
                                                <label htmlFor="FLASH_TYPE" className={'text-sm'}>
                                                    Flash Type
                                                </label>
                                                <ToggleButton
                                                    disabled={!isConnected || loading}
                                                    onLabel={'Hard Flash'}
                                                    offLabel={'Light Flash'}
                                                    checked={additionalArguments?.FLASH_TYPE === 'HARD'}
                                                    onChange={(e) => {
                                                        if (!confirmChanges) return checkConfirmChangesArgs();
                                                        setAdditionalArguments((prev) => {
                                                            return {
                                                                ...prev,
                                                                FLASH_TYPE: e.value ? 'HARD' : 'LIGHT'
                                                            };
                                                        });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className={'col-12 lg:col-6 '}>
                                            <div className="flex flex-column gap-2">
                                                <label htmlFor="IMAGE_NAME" className={'text-sm'}>
                                                    Image
                                                </label>
                                                <InputText
                                                    id={'IMAGE_NAME'}
                                                    onChange={(e) => {
                                                        if (!confirmChanges) return checkConfirmChangesArgs();
                                                        setAdditionalArguments((prev) => {
                                                            return {
                                                                ...prev,
                                                                IMAGE_NAME: e.target.value
                                                            };
                                                        });
                                                    }}
                                                    value={additionalArguments?.IMAGE_NAME}
                                                    disabled={!isConnected || loading}
                                                    className={'w-full'}
                                                    placeholder={'There is no image name configured.'}
                                                />
                                            </div>
                                        </div>
                                        <div className={'col-12 lg:col-6'}>
                                            <div className="flex flex-column gap-2">
                                                <label htmlFor="Docker_compose_DIRECTORY" className={'text-sm'}>
                                                    Compose File Directory
                                                </label>
                                                <div className="p-inputgroup flex-1">
                                                    <InputText disabled={!isConnected || loading} readOnly={true} value={composeDirectory} className={'w-full'} placeholder={'There is no docker compose file configured.'} />
                                                    <Button
                                                        onClick={() => {
                                                            setLoading(true);
                                                            preview_compose()
                                                                .then(() => setLoading(false))
                                                                .catch(() => setLoading(false))
                                                                .finally(() => setLoading(false));
                                                        }}
                                                        icon="pi pi-search"
                                                        disabled={!isConnected || !composeDirectory}
                                                        loading={loading}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="flex flex-column gap-2 align-items-center">
                                                <label htmlFor="Docker_compose_DIRECTORY" className="text-sm text-center">
                                                    Compression Status
                                                </label>
                                                <ToggleButton
                                                    disabled={!isConnected || loading}
                                                    onChange={(e) => {
                                                        setAdditionalArguments((prev) => {
                                                            return {
                                                                ...prev,
                                                                COMPRESSION: e.value ? 9 : 0
                                                            };
                                                        });
                                                    }}
                                                    checked={additionalArguments?.COMPRESSION !== 0}
                                                    offLabel={'Compression Algorithm Inactive'}
                                                    onLabel={'Compression Algorithm Active'}
                                                    className="w-full"
                                                />
                                                <Dropdown
                                                    loading={loading}
                                                    onChange={(e) => {
                                                        setAdditionalArguments((prev) => {
                                                            return {
                                                                ...prev,
                                                                COMPRESSION: e.target.value
                                                            };
                                                        });
                                                    }}
                                                    value={additionalArguments?.COMPRESSION}
                                                    disabled={additionalArguments?.COMPRESSION === 0 || !isConnected || loading}
                                                    className="w-full"
                                                    options={[
                                                        { label: 'Default Compression', value: -1 },
                                                        { label: 'Fastest Compression', value: 1 },
                                                        { label: 'Very Fast Compression', value: 2 },
                                                        { label: 'Fast Compression', value: 3 },
                                                        { label: 'Balanced Speed/Size', value: 4 },
                                                        { label: 'Moderate Compression', value: 5 },
                                                        { label: 'Standard Compression', value: 6 },
                                                        { label: 'Good Compression', value: 7 },
                                                        { label: 'High Compression', value: 8 },
                                                        { label: 'Maximum Compression', value: 9 }
                                                    ]}
                                                />
                                            </div>
                                        </div>

                                        <div className={'col-12'}>
                                            <div className="flex flex-column gap-2 align-items-center">
                                                <label htmlFor="Docker_compose_DIRECTORY" className={'text-sm'}>
                                                    Start Step
                                                </label>
                                                <SelectButton
                                                    disabled={!isConnected || loading}
                                                    className={'w-full'}
                                                    value={additionalArguments?.STEP || 0}
                                                    onChange={(e) => {
                                                        if (!confirmChanges) return checkConfirmChangesArgs();
                                                        setAdditionalArguments((prev) => ({
                                                            ...prev,
                                                            STEP: e.target.value
                                                        }));
                                                        stepperRef.current.setActiveStep(e.target.value);
                                                    }}
                                                    options={[
                                                        { label: 'Internet', value: 0 },
                                                        {
                                                            label: 'Build',
                                                            value: 1
                                                        },
                                                        { label: 'Reconnection', value: 3 },
                                                        {
                                                            label: 'Transfer & Execute',
                                                            value: 4
                                                        }
                                                    ]}
                                                    pt={{
                                                        root: {
                                                            style: {
                                                                display: 'flex',
                                                                width: '100%',
                                                                justifyContent: 'space-between'
                                                            }
                                                        },
                                                        button: {
                                                            style: {
                                                                flex: 1,
                                                                textAlign: 'center'
                                                            }
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </AccordionTab>
                            </Accordion>
                        </div>
                        <div className={'col-12'}>
                            <div className={'grid'}>
                                <div className={'col-12 lg:col-6'}>
                                    <Button onClick={start} disabled={!isConnected || selectedDevices.length < 1} className={'w-full'} loading={loading} severity={'danger'} label={'Execute Docker Pipeline'} />
                                </div>
                                <div className={'col-12 lg:col-6'}>
                                    <Button
                                        onClick={() => {
                                            if (os !== 'Linux') {
                                                playFatalNotificationSound();
                                                toast.current.show({
                                                    severity: 'error',
                                                    summary: 'Unsupported OS!',
                                                    detail: `You are running ${os}, which is not supported!`,
                                                    life: 6000
                                                });
                                            } else {
                                                setFinished(false);
                                                setFinalSummary([]);
                                                transfer_import(true);
                                            }
                                        }}
                                        disabled={!isConnected || selectedDevices.length < 1}
                                        loading={loading}
                                        className={'w-full'}
                                        severity={'warning'}
                                        label={'Synchronize'}
                                    />
                                </div>
                                <div className={'col-12'}>
                                    <Button onClick={() => build(true)} disabled={!isConnected} loading={loading} className={'w-full'} severity={'secondary'} label={'Build'} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="card mb-0">
                    <Stepper linear={!finished} ref={stepperRef} style={{ flexBasis: '50rem' }} orientation="vertical">
                        <StepperPanel header="Internet">
                            <TerminalDisplay messages={setup?.INTERNET_CONNECTION_MESSAGES ?? []} loadingDots={true} placeholder={'Waiting for a message'} />

                            <Button
                                disabled={!isConnected}
                                loading={loading}
                                className={'mt-3 w-full ' + ((setup?.INTERNET_CONNECTION_SUCCESS ?? true) && 'hidden')}
                                severity={'warning'}
                                label="Yes, I am connected to the internet."
                                icon="pi pi-arrow-right"
                                iconPos="right"
                                onClick={() => {
                                    setSetup((prev) => {
                                        return {
                                            ...prev,
                                            INTERNET_CONNECTION_SUCCESS: true
                                        };
                                    });
                                    build();
                                }}
                            />
                        </StepperPanel>
                        <StepperPanel header="Build">
                            <TabView activeIndex={buildIndex} onTabChange={(e) => setBuildIndex(e.index)} scrollable={true}>
                                <TabPanel className={'w-full'} header="STARTING" leftIcon="pi pi-play-circle mr-2">
                                    <TerminalDisplay messages={buildStatus?.STARTING ?? []} loadingDots={true} placeholder={'Waiting for a message'} />
                                </TabPanel>
                                <TabPanel className={'w-full'} header="BUILDING" leftIcon="pi pi-hammer mr-2">
                                    <TerminalDisplay messages={buildStatus?.BUILDING ?? []} loadingDots={true} placeholder={'Waiting for a message'} />
                                </TabPanel>
                                <TabPanel className={'w-full'} header="COMPRESSION" leftIcon="pi pi-window-minimize mr-2">
                                    <TerminalDisplay messages={buildStatus?.COMPRESSION ?? []} loadingDots={true} placeholder={'Waiting for a message'} />
                                </TabPanel>
                                <TabPanel className={'w-full'} header="EXCEPTIONS" leftIcon="pi pi-exclamation-circle mr-2">
                                    <TerminalDisplay messages={buildStatus?.ERRORS ?? []} loadingDots={true} placeholder={'Waiting for a message'} />
                                </TabPanel>
                                <TabPanel className={'w-full'} header="FINISHED" leftIcon="pi pi-stop-circle mr-2">
                                    <TerminalDisplay messages={buildStatus?.FINISHED ?? []} loadingDots={true} placeholder={'Waiting for a message'} />
                                </TabPanel>
                            </TabView>
                        </StepperPanel>
                        <StepperPanel header="Robot">
                            <TerminalDisplay messages={setup?.ROBOT_CONNECTION_MESSAGES ?? []} loadingDots={true} placeholder={'Waiting for a message'} />

                            <Button
                                disabled={!isConnected}
                                loading={loading}
                                className={'mt-3 w-full ' + ((setup?.ROBOT_CONNECTION_SUCCESS ?? true) && 'hidden')}
                                severity={'warning'}
                                label="Yes, I am connected to the robot."
                                icon="pi pi-arrow-right"
                                iconPos="right"
                                onClick={() => {
                                    setSetup((prev) => {
                                        return {
                                            ...prev,
                                            ROBOT_CONNECTION_SUCCESS: true
                                        };
                                    });
                                    reconnection();
                                }}
                            />
                        </StepperPanel>
                        <StepperPanel header="Reconnection">
                            <TabView activeIndex={reconnectionIndex} onTabChange={(e) => setReconnectionIndex(e.index)} scrollable={true}>
                                {selectedDevices.map((m, key) => (
                                    <TabPanel
                                        key={key}
                                        className={'w-full'}
                                        header={m?.hostname}
                                        leftIcon={
                                            'mr-2 pi ' +
                                            (additionalArguments?.ARCHITECTURE.toLowerCase().includes('windows')
                                                ? 'pi-microsoft'
                                                : additionalArguments?.ARCHITECTURE.toLowerCase().includes('mac')
                                                ? 'pi-apple'
                                                : additionalArguments?.ARCHITECTURE.toLowerCase().includes('linux')
                                                ? 'pi-microchip'
                                                : 'pi-desktop')
                                        }
                                    >
                                        <TerminalDisplay messages={reconnectionMessages[m?.server] ?? []} loadingDots={true} placeholder={'Waiting for a message'} />
                                    </TabPanel>
                                ))}
                                <TabPanel className={'w-full'} header={'Information'} leftIcon={'mr-2 pi pi-info-circle'}>
                                    <TerminalDisplay messages={reconnectionData?.messages ?? []} loadingDots={true} placeholder={'Waiting for a message'} />
                                </TabPanel>
                            </TabView>
                            <Button
                                disabled={!isConnected}
                                loading={loading}
                                className={'mt-3 w-full ' + ((reconnectionData?.DEVICES_RECONNECTION_SUCCESS ?? true) && 'hidden')}
                                severity={'warning'}
                                label="Reconnection returned bad status. Continue anyways?"
                                icon="pi pi-arrow-right"
                                iconPos="right"
                                onClick={() => {
                                    setSetup((prev) => {
                                        return {
                                            ...prev,
                                            DEVICES_RECONNECTION_SUCCESS: true
                                        };
                                    });
                                    transfer_import();
                                }}
                            />
                        </StepperPanel>
                        <StepperPanel header="Transport & Execute">
                            <TabView activeIndex={transferIndex} onTabChange={(e) => setTransferIndex(e.index)} scrollable={true}>
                                {selectedDevices.map((m, key) => (
                                    <TabPanel
                                        key={key}
                                        className={'w-full'}
                                        header={m?.hostname}
                                        leftIcon={
                                            'mr-2 pi ' +
                                            (additionalArguments?.ARCHITECTURE.toLowerCase().includes('windows')
                                                ? 'pi-microsoft'
                                                : additionalArguments?.ARCHITECTURE.toLowerCase().includes('mac')
                                                ? 'pi-apple'
                                                : additionalArguments?.ARCHITECTURE.toLowerCase().includes('linux')
                                                ? 'pi-microchip'
                                                : 'pi-desktop')
                                        }
                                    >
                                        <TerminalDisplay messages={transferMessages[m?.server] ?? []} loadingDots={true} placeholder={'Waiting for a message'} />
                                    </TabPanel>
                                ))}
                                <TabPanel className={'w-full'} header={'Information'} leftIcon={'mr-2 pi pi-info-circle'}>
                                    <TerminalDisplay messages={transferData?.messages ?? []} loadingDots={true} placeholder={'Waiting for a message'} />
                                </TabPanel>
                            </TabView>
                        </StepperPanel>
                        <StepperPanel header="Pipeline Summary">
                            <TerminalDisplay messages={finalSummary} loadingDots={true} placeholder={'Waiting for a message'} />
                            <Button
                                disabled={!isConnected}
                                loading={loading}
                                className={'mt-3 w-full'}
                                severity={'warning'}
                                label="Restart?"
                                icon="pi pi-sync"
                                iconPos="right"
                                onClick={() => {
                                    start();
                                }}
                            />
                        </StepperPanel>
                    </Stepper>
                </div>
            </div>
        </div>
    );
};

const template = (option) => {
    return (
        <div className="ml-4 flex items-center justify-between w-full border border-gray-300 rounded-lg shadow-md">
            <span className="text-lg font-medium">
                {option.server}&nbsp;|&nbsp;{option.address}&nbsp;|&nbsp;
            </span>
            <span className={'text-lg font-bold ' + (option?.status === 'CONNECTED' ? 'text-green-500' : option?.status === 'CONNECTING' ? 'text-yellow-500' : 'text-red-500')}>{option.status}</span>
        </div>
    );
};
const archTemplate = (option) => {
    return (
        <div className="flex items-center justify-between w-full border border-gray-300 rounded-lg shadow-md">
            {
                <i
                    className={
                        'pi ' +
                        (option.toLowerCase().includes('windows')
                            ? 'pi-microsoft'
                            : option.toLowerCase().includes('mac') || option.toLowerCase().includes('darwin')
                            ? 'pi-apple'
                            : option.toLowerCase().includes('linux')
                            ? 'pi-microchip'
                            : 'pi-desktop')
                    }
                />
            }
            <span className={'ml-2'}>{option}</span>
        </div>
    );
};
const linuxIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path d="M220.8 123.3c1 .5 1.8 1.7 3 1.7 1.1 0 2.8-.4 2.9-1.5 .2-1.4-1.9-2.3-3.2-2.9-1.7-.7-3.9-1-5.5-.1-.4 .2-.8 .7-.6 1.1 .3 1.3 2.3 1.1 3.4 1.7zm-21.9 1.7c1.2 0 2-1.2 3-1.7 1.1-.6 3.1-.4 3.5-1.6 .2-.4-.2-.9-.6-1.1-1.6-.9-3.8-.6-5.5 .1-1.3 .6-3.4 1.5-3.2 2.9 .1 1 1.8 1.5 2.8 1.4zM420 403.8c-3.6-4-5.3-11.6-7.2-19.7-1.8-8.1-3.9-16.8-10.5-22.4-1.3-1.1-2.6-2.1-4-2.9-1.3-.8-2.7-1.5-4.1-2 9.2-27.3 5.6-54.5-3.7-79.1-11.4-30.1-31.3-56.4-46.5-74.4-17.1-21.5-33.7-41.9-33.4-72C311.1 85.4 315.7 .1 234.8 0 132.4-.2 158 103.4 156.9 135.2c-1.7 23.4-6.4 41.8-22.5 64.7-18.9 22.5-45.5 58.8-58.1 96.7-6 17.9-8.8 36.1-6.2 53.3-6.5 5.8-11.4 14.7-16.6 20.2-4.2 4.3-10.3 5.9-17 8.3s-14 6-18.5 14.5c-2.1 3.9-2.8 8.1-2.8 12.4 0 3.9 .6 7.9 1.2 11.8 1.2 8.1 2.5 15.7 .8 20.8-5.2 14.4-5.9 24.4-2.2 31.7 3.8 7.3 11.4 10.5 20.1 12.3 17.3 3.6 40.8 2.7 59.3 12.5 19.8 10.4 39.9 14.1 55.9 10.4 11.6-2.6 21.1-9.6 25.9-20.2 12.5-.1 26.3-5.4 48.3-6.6 14.9-1.2 33.6 5.3 55.1 4.1 .6 2.3 1.4 4.6 2.5 6.7v.1c8.3 16.7 23.8 24.3 40.3 23 16.6-1.3 34.1-11 48.3-27.9 13.6-16.4 36-23.2 50.9-32.2 7.4-4.5 13.4-10.1 13.9-18.3 .4-8.2-4.4-17.3-15.5-29.7zM223.7 87.3c9.8-22.2 34.2-21.8 44-.4 6.5 14.2 3.6 30.9-4.3 40.4-1.6-.8-5.9-2.6-12.6-4.9 1.1-1.2 3.1-2.7 3.9-4.6 4.8-11.8-.2-27-9.1-27.3-7.3-.5-13.9 10.8-11.8 23-4.1-2-9.4-3.5-13-4.4-1-6.9-.3-14.6 2.9-21.8zM183 75.8c10.1 0 20.8 14.2 19.1 33.5-3.5 1-7.1 2.5-10.2 4.6 1.2-8.9-3.3-20.1-9.6-19.6-8.4 .7-9.8 21.2-1.8 28.1 1 .8 1.9-.2-5.9 5.5-15.6-14.6-10.5-52.1 8.4-52.1zm-13.6 60.7c6.2-4.6 13.6-10 14.1-10.5 4.7-4.4 13.5-14.2 27.9-14.2 7.1 0 15.6 2.3 25.9 8.9 6.3 4.1 11.3 4.4 22.6 9.3 8.4 3.5 13.7 9.7 10.5 18.2-2.6 7.1-11 14.4-22.7 18.1-11.1 3.6-19.8 16-38.2 14.9-3.9-.2-7-1-9.6-2.1-8-3.5-12.2-10.4-20-15-8.6-4.8-13.2-10.4-14.7-15.3-1.4-4.9 0-9 4.2-12.3zm3.3 334c-2.7 35.1-43.9 34.4-75.3 18-29.9-15.8-68.6-6.5-76.5-21.9-2.4-4.7-2.4-12.7 2.6-26.4v-.2c2.4-7.6 .6-16-.6-23.9-1.2-7.8-1.8-15 .9-20 3.5-6.7 8.5-9.1 14.8-11.3 10.3-3.7 11.8-3.4 19.6-9.9 5.5-5.7 9.5-12.9 14.3-18 5.1-5.5 10-8.1 17.7-6.9 8.1 1.2 15.1 6.8 21.9 16l19.6 35.6c9.5 19.9 43.1 48.4 41 68.9zm-1.4-25.9c-4.1-6.6-9.6-13.6-14.4-19.6 7.1 0 14.2-2.2 16.7-8.9 2.3-6.2 0-14.9-7.4-24.9-13.5-18.2-38.3-32.5-38.3-32.5-13.5-8.4-21.1-18.7-24.6-29.9s-3-23.3-.3-35.2c5.2-22.9 18.6-45.2 27.2-59.2 2.3-1.7 .8 3.2-8.7 20.8-8.5 16.1-24.4 53.3-2.6 82.4 .6-20.7 5.5-41.8 13.8-61.5 12-27.4 37.3-74.9 39.3-112.7 1.1 .8 4.6 3.2 6.2 4.1 4.6 2.7 8.1 6.7 12.6 10.3 12.4 10 28.5 9.2 42.4 1.2 6.2-3.5 11.2-7.5 15.9-9 9.9-3.1 17.8-8.6 22.3-15 7.7 30.4 25.7 74.3 37.2 95.7 6.1 11.4 18.3 35.5 23.6 64.6 3.3-.1 7 .4 10.9 1.4 13.8-35.7-11.7-74.2-23.3-84.9-4.7-4.6-4.9-6.6-2.6-6.5 12.6 11.2 29.2 33.7 35.2 59 2.8 11.6 3.3 23.7 .4 35.7 16.4 6.8 35.9 17.9 30.7 34.8-2.2-.1-3.2 0-4.2 0 3.2-10.1-3.9-17.6-22.8-26.1-19.6-8.6-36-8.6-38.3 12.5-12.1 4.2-18.3 14.7-21.4 27.3-2.8 11.2-3.6 24.7-4.4 39.9-.5 7.7-3.6 18-6.8 29-32.1 22.9-76.7 32.9-114.3 7.2zm257.4-11.5c-.9 16.8-41.2 19.9-63.2 46.5-13.2 15.7-29.4 24.4-43.6 25.5s-26.5-4.8-33.7-19.3c-4.7-11.1-2.4-23.1 1.1-36.3 3.7-14.2 9.2-28.8 9.9-40.6 .8-15.2 1.7-28.5 4.2-38.7 2.6-10.3 6.6-17.2 13.7-21.1 .3-.2 .7-.3 1-.5 .8 13.2 7.3 26.6 18.8 29.5 12.6 3.3 30.7-7.5 38.4-16.3 9-.3 15.7-.9 22.6 5.1 9.9 8.5 7.1 30.3 17.1 41.6 10.6 11.6 14 19.5 13.7 24.6zM173.3 148.7c2 1.9 4.7 4.5 8 7.1 6.6 5.2 15.8 10.6 27.3 10.6 11.6 0 22.5-5.9 31.8-10.8 4.9-2.6 10.9-7 14.8-10.4s5.9-6.3 3.1-6.6-2.6 2.6-6 5.1c-4.4 3.2-9.7 7.4-13.9 9.8-7.4 4.2-19.5 10.2-29.9 10.2s-18.7-4.8-24.9-9.7c-3.1-2.5-5.7-5-7.7-6.9-1.5-1.4-1.9-4.6-4.3-4.9-1.4-.1-1.8 3.7 1.7 6.5z" />
    </svg>
);

export default Dashboard;
