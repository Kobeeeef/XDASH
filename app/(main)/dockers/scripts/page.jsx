/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useContext, useEffect, useRef, useState } from 'react';

import { WebsocketContext } from '../../../../layout/context/websocketcontext';
import TimeAgo from '../../../../components/TimeAgo';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { MultiSelect } from 'primereact/multiselect';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Divider } from 'primereact/divider';
import { Badge } from 'primereact/badge';
import { SelectButton } from 'primereact/selectbutton';
import { countdown, isValidDirectoryPath, isValidPath } from '../../../../utilities/utilities';
import { playErrorNotificationSound, playSuccessNotificationSound } from '../../../../utilities/notification';
import TerminalDisplay from '../../../../components/TerminalDisplay';
import TimeoutsDialog from '../../../../components/TimeoutsDialog';
import { ProgressBar } from 'primereact/progressbar';

const Dashboard = () => {
    const toast = useRef(null);
    const { isConnected, lastConnectionUpdate, sendMessageAndWaitForCondition, sendMessageAndWaitForConditionWithManage, getTimeoutManagerById, timeoutsRef } = useContext(WebsocketContext);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [devices, setDevices] = useState([]);
    const [selectedDevices, setSelectedDevices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [rebootDialogVisible, setRebootDialogVisible] = useState(false);
    const [redeployDialogVisible, setRedeployDialogVisible] = useState(false);
    const [transferFilesInputDialogVisible, setTransferFilesInputDialogVisible] = useState(false);
    const [transferFilesDialogVisible, setTransferFilesDialogVisible] = useState(false);
    const [finalResponseData, setFinalResponseData] = useState(null);
    const [finalResponseStatus, setFinalResponseStatus] = useState(null);
    const rebootStepperRef = useRef(null);
    const transferFilesStepperRef = useRef(null);
    const redeployStepperRef = useRef(null);
    const customCLICommandStepperRef = useRef(null);
    const [executeCLICommandDialogVisible, setExecuteCLICommandDialogVisible] = useState(false);
    const [customCLICommandInput, setCustomCLICommandInput] = useState(null);
    const [customCLICommandDialogVisible, setCustomCLICommandDialogVisible] = useState(false);
    const [localDirectoryInput, setLocalDirectoryInput] = useState(null);
    const [targetDirectoryInput, setTargetDirectoryInput] = useState(null);
    const [targetMethodInput, setTargetMethodInput] = useState(true);
    const [networkingManagerTypeDialogVisible, setNetworkingManagerTypeDialogVisible] = useState(false);
    const [networkingManagerTypeInput, setNetworkingManagerTypeInput] = useState(null);
    const isMounted = useRef(true); // Tracks if the component is mounted
    const timeoutId = useRef(null); // Stores the timeout ID persistently
    const [fileEditInputDialogVisible, setFileEditInputDialogVisible] = useState(false);
    const [fileEditDialogVisible, setFileEditDialogVisible] = useState(false);
    const [fileEditInput, setFileEditInput] = useState(null);
    const [importBaseImageDialogVisible, setImportBaseImageDialogVisible] = useState(false);
    useEffect(() => {
        isMounted.current = true; // Set the mounted flag
        let isRequestInProgress = false;

        const sendRequest = () => {
            if (isMounted.current && isConnected && !isRequestInProgress) {
                isRequestInProgress = true;
                try {
                    sendMessageAndWaitForCondition({ type: 'DEVICES-DATA-LIMITED' }, (m) => m.type === 'DEVICES-DATA-LIMITED')
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
                            isRequestInProgress = false;
                            if (isMounted.current) {
                                timeoutId.current = setTimeout(sendRequest, 200); // Schedule next call
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

    function transferFiles() {
        setLoading(true);
        setTransferFilesDialogVisible(true);
        setFinalResponseData(null);
        setFinalResponseStatus(null);
        setSelectedDevices((devices) => {
            return devices.map((m) => {
                m.success = null;
                m.response = null;
                return m;
            });
        });
        sendMessageAndWaitForConditionWithManage(
            'DEVICES-TRANSFER-FILES',
            {
                type: 'DEVICES-TRANSFER-FILES',
                message: JSON.stringify({
                    servers: selectedDevices.map((m) => m.server),
                    localDirectory: localDirectoryInput,
                    remoteDirectory: targetDirectoryInput,
                    useLocalSCP: targetMethodInput
                })
            },
            (m) => {
                if (m.type === 'DEVICES-TRANSFER-FILES') {
                    const msg = JSON.parse(m.message);
                    if (msg.finished) {
                        if (transferFilesStepperRef.current) transferFilesStepperRef.current.setActiveStep(selectedDevices.length + 2);
                        setFinalResponseData((prevState) => ({
                            ...prevState,
                            response: msg?.response ?? 'There was no response back from server.'
                        }));
                        setFinalResponseStatus(msg?.success === true ? true : msg?.success === false ? false : null);
                        if (msg?.success === true) {
                            playSuccessNotificationSound();
                        } else if (msg?.success === false) {
                            playErrorNotificationSound();
                        }
                        return true;
                    }
                    if (transferFilesStepperRef.current) transferFilesStepperRef.current.setActiveStep(msg.step);

                    if (msg.step === 0) {
                        setFinalResponseData((prevState) => ({
                            ...prevState,
                            tar_response: msg.response,
                            tar_success: msg.success
                        }));
                    }
                    if (msg.step === selectedDevices.length + 1) {
                        setFinalResponseData((prevState) => ({
                            ...prevState,
                            cleanup_response: msg.response,
                            cleanup_success: msg.success
                        }));
                    }
                    if (msg.server) {
                        setSelectedDevices((prevState) =>
                            prevState.map((s) =>
                                s.server === msg.server
                                    ? {
                                          ...s,
                                          response: msg.response || s.response,
                                          success: msg?.success
                                      }
                                    : s
                            )
                        );
                    }
                    return false;
                }
            },
            1200000
        )
            .then(() => {
                setLoading(false);
            })
            .catch((e) => {
                toast.current.show({
                    severity: 'error',
                    summary: 'Exception Occurred!',
                    detail: e?.message || 'Unknown Exception...'
                });
                if (transferFilesStepperRef.current) transferFilesStepperRef.current.setActiveStep(selectedDevices.length + 1);
                setFinalResponseStatus(false);
                setFinalResponseData({ response: e?.message || 'Unknown Exception...' });
                setLoading(false);
            });
    }

    function reboot() {
        setLoading(true);
        setRebootDialogVisible(true);
        setFinalResponseData(null);
        setFinalResponseStatus(null);
        setSelectedDevices((devices) => {
            return devices.map((m) => {
                m.success = null;
                m.response = null;
                return m;
            });
        });
        sendMessageAndWaitForCondition(
            {
                type: 'DEVICES-REBOOT',
                message: JSON.stringify(selectedDevices.map((m) => m.server))
            },
            (m) => {
                if (m.type === 'DEVICES-REBOOT') {
                    const msg = JSON.parse(m.message);
                    if (msg.finished) {
                        if (rebootStepperRef.current) rebootStepperRef.current.setActiveStep(selectedDevices.length);
                        setFinalResponseData({ response: msg?.response ?? 'There was no response back from server.' });
                        setFinalResponseStatus(msg?.success === true ? true : msg?.success === false ? false : null);
                        if (msg?.success === true) {
                            playSuccessNotificationSound();
                        } else if (msg?.success === false) {
                            playErrorNotificationSound();
                        }
                        return true;
                    }
                    if (rebootStepperRef.current) rebootStepperRef.current.setActiveStep(msg.step);
                    if (msg.server) {
                        let server = selectedDevices.find((s) => s.server === msg.server);
                        if (server) {
                            if (msg.response) {
                                server.response = msg.response;
                            }
                            if (msg.success) {
                                server.success = msg.success;
                            } else {
                                server.success = false;
                            }
                        }
                    }
                    return false;
                }
            },
            5000
        )
            .then(() => {
                setLoading(false);
            })
            .catch((e) => {
                toast.current.show({
                    severity: 'error',
                    summary: 'Exception Occurred!',
                    detail: e?.message || 'Unknown Exception...'
                });
                setLoading(false);
            });
    }

    function fileEditor() {
        setLoading(true);
        setFileEditDialogVisible(true);
        setFinalResponseData([]);
        setSelectedDevices((devices) => {
            return devices.map((m) => {
                m.success = null;
                m.response = null;
                return m;
            });
        });
        sendMessageAndWaitForConditionWithManage(
            'DEVICES-FILE-EDITOR',
            {
                type: 'DEVICES-FILE-EDITOR',
                message: JSON.stringify({
                    servers: selectedDevices.map((m) => m.server),
                    remoteFilePath: fileEditInput
                })
            },
            (m) => {
                if (m.type === 'DEVICES-FILE-EDITOR') {
                    const msg = JSON.parse(m.message);
                    if (msg?.finished) {
                        if (msg?.success === true) {
                            playSuccessNotificationSound();
                        } else if (msg?.success === false) {
                            playErrorNotificationSound();
                        }
                        return true;
                    }
                    if (msg?.message) {
                        setFinalResponseData((prevArray) => [msg.message || `Unknown message received...`, ...prevArray]);
                    }
                    return false;
                }
            },
            15000
        )
            .then(() => {
                setLoading(false);
            })
            .catch((e) => {
                toast.current.show({
                    severity: 'error',
                    summary: 'Exception Occurred!',
                    detail: e?.message || 'Unknown Exception...'
                });
                setFinalResponseData((prevArray) => [e?.message || `Unknown exception...`, ...prevArray]);
                setLoading(false);
            });
    }

    function redeploy() {
        setLoading(true);
        setRedeployDialogVisible(true);
        setFinalResponseData(null);
        setFinalResponseStatus(null);
        setSelectedDevices((devices) => {
            return devices.map((m) => {
                m.success = null;
                m.response = null;
                return m;
            });
        });
        sendMessageAndWaitForCondition(
            {
                type: 'DEVICES-REDEPLOY',
                message: JSON.stringify(selectedDevices.map((m) => m.server))
            },
            (m) => {
                if (m.type === 'DEVICES-REDEPLOY') {
                    const msg = JSON.parse(m.message);
                    console.log(msg);
                    if (msg.finished) {
                        if (redeployStepperRef.current) redeployStepperRef.current.setActiveStep(selectedDevices.length);
                        setFinalResponseData((prevState) => ({
                            ...prevState,
                            response: msg?.response ?? 'There was no response back from server.'
                        }));
                        setFinalResponseStatus(msg?.success === true ? true : msg?.success === false ? false : null);
                        if (msg?.success === true) {
                            playSuccessNotificationSound();
                        } else if (msg?.success === false) {
                            playErrorNotificationSound();
                        }
                        return true;
                    }
                    if (redeployStepperRef.current) redeployStepperRef.current.setActiveStep(msg.step);
                    if (msg.server) {
                        setSelectedDevices((prevState) =>
                            prevState.map((s) =>
                                s.server === msg.server
                                    ? {
                                          ...s,
                                          response: msg.response || s.response,
                                          success: msg?.success
                                      }
                                    : s
                            )
                        );
                    }
                    return false;
                }
            },
            60000
        )
            .then(() => {
                setLoading(false);
            })
            .catch((e) => {
                toast.current.show({
                    severity: 'error',
                    summary: 'Exception Occurred!',
                    detail: e?.message || 'Unknown Exception...'
                });
                setLoading(false);
            });
    }

    function custom_command(command) {
        setLoading(true);
        setCustomCLICommandDialogVisible(true);
        setFinalResponseData(null);
        setFinalResponseStatus(null);
        setSelectedDevices((devices) => {
            return devices.map((m) => {
                m.success = null;
                m.response = null;
                return m;
            });
        });
        sendMessageAndWaitForCondition(
            {
                type: 'DEVICES-CUSTOM-COMMAND',
                message: JSON.stringify({
                    servers: selectedDevices.map((m) => m.server),
                    command: command
                })
            },
            (m) => {
                if (m.type === 'DEVICES-CUSTOM-COMMAND') {
                    const msg = JSON.parse(m.message);
                    console.log(msg);
                    if (msg.finished) {
                        if (customCLICommandStepperRef.current) customCLICommandStepperRef.current.setActiveStep(selectedDevices.length);
                        setFinalResponseData((prevState) => ({
                            ...prevState,
                            response: msg?.response ?? 'There was no response back from server.'
                        }));
                        setFinalResponseStatus(msg?.success === true ? true : msg?.success === false ? false : null);
                        if (msg?.success === true) {
                            playSuccessNotificationSound();
                        } else if (msg?.success === false) {
                            playErrorNotificationSound();
                        }
                        return true;
                    }
                    if (customCLICommandStepperRef.current) customCLICommandStepperRef.current.setActiveStep(msg.step);
                    if (msg.server) {
                        setSelectedDevices((prevState) =>
                            prevState.map((s) =>
                                s.server === msg.server
                                    ? {
                                          ...s,
                                          response: msg.response || s.response,
                                          success: msg?.success
                                      }
                                    : s
                            )
                        );
                    }
                    return false;
                }
            },
            60000
        )
            .then(() => {
                setLoading(false);
            })
            .catch((e) => {
                toast.current.show({
                    severity: 'error',
                    summary: 'Exception Occurred!',
                    detail: e?.message || 'Unknown Exception...'
                });
                setLoading(false);
            });
    }

    function importDockerImage() {
        setLoading(true);
        setImportBaseImageDialogVisible(true);
        setFinalResponseData({});
        setSelectedDevices((devices) => {
            return devices.map((m) => {
                m.success = null;
                m.response = null;
                return m;
            });
        });
        connect_wifi('INTERNET', (m) => {
            if (m.type === 'WIFI-CONNECT') {
                let msg = JSON.parse(m.message);
                setFinalResponseData((prev) => {
                    const array = prev?.MESSAGES ?? [];
                    array.unshift(msg.message || '');
                    return {
                        ...prev,
                        MESSAGES: array
                    };
                });
                if (msg?.finished) {
                    return true;
                }
            }
        })
            .then((msg) => {
                if (msg?.message?.success === false) {
                    playErrorNotificationSound();
                    setFinalResponseData((prev) => {
                        return {
                            ...prev,
                            SUCCESS: false
                        };
                    });
                    setLoading(false);
                } else if (msg?.message?.success === true) {
                    playSuccessNotificationSound();

                    countdown(
                        5,
                        (s) => {
                            setFinalResponseData((prev) => {
                                const array = prev?.MESSAGES ?? [];
                                array.unshift(`Continuing onto import in ${s} seconds...`);
                                return {
                                    ...prev,
                                    MESSAGES: array
                                };
                            });
                        },
                        () => {
                            sendMessageAndWaitForConditionWithManage(
                                'DOCKER-IMPORT-ALT-BASE',
                                {
                                    type: 'DOCKER-IMPORT-ALT-BASE'
                                },
                                (m) => {
                                    if (m.type === 'DOCKER-IMPORT-ALT-BASE') {
                                        const msg = JSON.parse(m.message);
                                        let manager = getTimeoutManagerById('DOCKER-IMPORT-ALT-BASE');
                                        if (manager) manager.extendTimeout(30000);
                                        if (msg?.message) {
                                            setFinalResponseData((prev) => {
                                                const array = prev?.MESSAGES ?? [];
                                                array.unshift(msg.message || `Unknown message received...`);
                                                return {
                                                    ...prev,
                                                    MESSAGES: array
                                                };
                                            });
                                        }

                                        setFinalResponseData((prev) => {
                                            return {
                                                ...prev,
                                                PERCENTAGE: msg?.percentage ?? 0
                                            };
                                        });

                                        if (msg?.finished) {
                                            if (msg?.success === true) {
                                                setFinalResponseData((prev) => {
                                                    return {
                                                        ...prev,
                                                        SUCCESS: true
                                                    };
                                                });
                                                playSuccessNotificationSound();
                                            } else if (msg?.success === false) {
                                                setFinalResponseData((prev) => {
                                                    return {
                                                        ...prev,
                                                        SUCCESS: false
                                                    };
                                                });
                                                playErrorNotificationSound();
                                            }
                                            return true;
                                        }
                                        return false;
                                    }
                                },
                                15000
                            )
                                .then(() => {
                                    setLoading(false);
                                })
                                .catch((e) => {
                                    toast.current.show({
                                        severity: 'error',
                                        summary: 'Exception Occurred!',
                                        detail: e?.message || 'Unknown Exception...'
                                    });
                                    setFinalResponseData((prev) => {
                                        const array = prev?.MESSAGES ?? [];
                                        array.unshift(e?.message || `Unknown exception...`);
                                        return {
                                            ...prev,
                                            SUCCESS: false,
                                            MESSAGES: array
                                        };
                                    });
                                    setLoading(false);
                                });
                        }
                    );
                }
            })
            .catch((e) => {
                setFinalResponseData((prev) => {
                    const array = prev?.MESSAGES ?? [];
                    array.unshift(e?.message || 'Unknown Exception while connecting to internet WiFi...');
                    return {
                        ...prev,
                        SUCCESS: false,
                        MESSAGES: array
                    };
                });
                setLoading(false);
            });
    }

    // @ts-ignore
    return (
        <div className="grid fadeIn">
            <Toast ref={toast} />
            <TimeoutsDialog timeoutsRef={timeoutsRef} />
            <Dialog
                header={'Select Networking Manager Type'}
                draggable={false}
                visible={networkingManagerTypeDialogVisible}
                style={{ width: '50vw' }}
                onHide={() => {
                    if (!networkingManagerTypeDialogVisible) return;
                    setNetworkingManagerTypeDialogVisible(false);
                }}
                footer={() => (
                    <Button
                        loading={loading}
                        onClick={() => {
                            custom_command('systemctl restart ' + networkingManagerTypeInput);
                        }}
                        disabled={!isConnected || !networkingManagerTypeInput}
                        label={'Execute'}
                        severity={'danger'}
                        className={'w-full'}
                    ></Button>
                )}
            >
                <Divider align="center">
                    <Badge value="Networking Manger"></Badge>
                </Divider>

                <SelectButton
                    options={[
                        { name: 'Network Manager', value: 'NetworkManager' },
                        {
                            name: 'Networking',
                            value: 'networking'
                        },
                        { name: 'Systemd Networkd', value: 'systemd-networkd' },
                        {
                            name: 'Wicd',
                            value: 'wicd'
                        },
                        { name: 'Systemd Resolved', value: 'systemd-resolved' }
                    ]}
                    allowEmpty={false}
                    pt={{
                        button: {
                            className: 'flex-1 flex justify-center items-center'
                        }
                    }}
                    className="w-full lg:flex flex-col"
                    itemTemplate={(a) => (
                        <div className="font-semibold">{a.name}</div> // Make each item take full width
                    )}
                    value={networkingManagerTypeInput}
                    onChange={(e) => setNetworkingManagerTypeInput(e.target.value)}
                />
            </Dialog>
            <Dialog
                header={'Select Host & Target Destination'}
                draggable={false}
                visible={transferFilesInputDialogVisible}
                style={{ width: '50vw' }}
                onHide={() => {
                    if (!transferFilesInputDialogVisible) return;
                    setTransferFilesInputDialogVisible(false);
                }}
                footer={() => (
                    <Button
                        loading={loading}
                        onClick={transferFiles}
                        disabled={!isConnected || !localDirectoryInput || !targetDirectoryInput || targetMethodInput === undefined || targetMethodInput === null}
                        label={'Execute'}
                        severity={'danger'}
                        className={'w-full'}
                    ></Button>
                )}
            >
                <Divider align="center">
                    <Badge value="Local Directory"></Badge>
                </Divider>

                <InputText invalid={localDirectoryInput ? !isValidPath(localDirectoryInput) : false} placeholder={'Local Directory Path'} className={'w-full'} value={localDirectoryInput} onChange={(e) => setLocalDirectoryInput(e.target.value)} />

                <Divider align="center">
                    <Badge value="Target Directory"></Badge>
                </Divider>

                <InputText
                    invalid={targetDirectoryInput ? !isValidPath(targetDirectoryInput) : false}
                    placeholder={'Target Directory Path'}
                    className={'w-full'}
                    value={targetDirectoryInput}
                    onChange={(e) => setTargetDirectoryInput(e.target.value)}
                />
                <Divider align="center">
                    <Badge value="Transfer Method"></Badge>
                </Divider>

                <SelectButton
                    options={[
                        { name: 'Java Buffering', value: false },
                        { name: 'Java SFTP', value: true }
                    ]}
                    allowEmpty={false}
                    pt={{
                        button: {
                            style: { width: '50%' }
                        }
                    }}
                    className="w-full"
                    itemTemplate={(a) => (
                        <div className="font-semibold">{a.name}</div> // Make each item take full width
                    )}
                    value={targetMethodInput}
                    onChange={(e) => setTargetMethodInput(e.target.value)}
                />
            </Dialog>
            <Dialog
                header={'Execute CLI Command'}
                draggable={false}
                visible={executeCLICommandDialogVisible}
                style={{ width: '50vw' }}
                onHide={() => {
                    if (!executeCLICommandDialogVisible) return;
                    setExecuteCLICommandDialogVisible(false);
                }}
                footer={() => <Button loading={loading} onClick={() => custom_command(customCLICommandInput)} disabled={!isConnected || !customCLICommandInput} label={'Execute'} severity={'danger'} className={'w-full'}></Button>}
            >
                <Divider align="center">
                    <Badge value="CLI Command"></Badge>
                </Divider>

                <InputText placeholder={'Custom CLI Command'} className={'w-full'} value={customCLICommandInput} onChange={(e) => setCustomCLICommandInput(e.target.value)} />
            </Dialog>
            <Dialog
                header={'Remote Directory'}
                draggable={false}
                visible={fileEditInputDialogVisible}
                style={{ width: '50vw' }}
                onHide={() => {
                    if (!fileEditInputDialogVisible) return;
                    setFileEditInputDialogVisible(false);
                }}
                footer={() => <Button loading={loading} onClick={() => fileEditor()} disabled={!isConnected || !fileEditInput} label={'Execute'} severity={'danger'} className={'w-full'}></Button>}
            >
                <Divider align="center">
                    <Badge value="Remote Directory"></Badge>
                </Divider>

                <InputText placeholder={'Remote Directory Path'} className={'w-full'} value={fileEditInput} onChange={(e) => setFileEditInput(e.target.value)} />
            </Dialog>
            <Dialog
                draggable={false}
                visible={fileEditDialogVisible}
                style={{ width: '50vw' }}
                onHide={() => {
                    if (!fileEditDialogVisible) return;
                    setFileEditDialogVisible(false);
                }}
                footer={() => <Button loading={loading} onClick={() => setFileEditDialogVisible(false)} label={'Okay'} className={'w-full'}></Button>}
            >
                <TerminalDisplay messages={finalResponseData ?? []} placeholder={'Waiting for messages'} loadingDots={true} />
            </Dialog>
            <Dialog
                draggable={false}
                visible={transferFilesDialogVisible}
                style={{ width: '50vw' }}
                onHide={() => {
                    if (!transferFilesDialogVisible) return;
                    setTransferFilesDialogVisible(false);
                }}
            >
                <Stepper ref={transferFilesStepperRef} style={{ flexBasis: '50rem' }} orientation="vertical">
                    <StepperPanel header={'Tar Files'}>
                        <div className="flex flex-column h-12rem items-center justify-center">
                            <div
                                className={
                                    'flex justify-content-center align-items-center text-2xl mb-2 font-bold ' +
                                    (finalResponseData?.tar_success === true ? 'text-green-500' : finalResponseData?.tar_success === false ? 'text-red-500 animate-pulse' : 'text-yellow-500 animate-pulse-fast')
                                }
                            >
                                {finalResponseData?.tar_success === true ? 'All Files Compressed' : finalResponseData?.tar_success === false ? 'Systems Failed Compression' : 'Awaiting Final Response'}
                            </div>
                            <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">{finalResponseData?.tar_response || finalResponseData?.response}</div>
                        </div>
                    </StepperPanel>
                    {selectedDevices.map((m, key) => {
                        return (
                            <StepperPanel header={m?.server ?? 'Unknown Server'} key={key}>
                                <div className="flex flex-column h-12rem items-center justify-center">
                                    <div
                                        className={
                                            'flex justify-content-center align-items-center text-2xl mb-2 font-bold ' +
                                            (m?.success === true ? 'text-green-500' : m?.success === false ? 'text-red-500 animate-pulse' : 'text-yellow-500 animate-pulse-fast')
                                        }
                                    >
                                        {m?.success === true ? 'Files Transferred Successfully' : m?.success === false ? 'System Failed Transfer' : 'System Awaiting Transfer'}
                                    </div>
                                    <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">{m?.response}</div>
                                </div>
                            </StepperPanel>
                        );
                    })}
                    <StepperPanel header={'Cleanup'}>
                        <div className="flex flex-column h-12rem items-center justify-center">
                            <div
                                className={
                                    'flex justify-content-center align-items-center text-2xl mb-2 font-bold ' +
                                    (finalResponseData?.cleanup_success === true ? 'text-green-500' : finalResponseData?.cleanup_success === false ? 'text-red-500 animate-pulse' : 'text-yellow-500 animate-pulse-fast')
                                }
                            >
                                {finalResponseData?.cleanup_success === true ? 'All Files Compressed' : finalResponseData?.cleanup_success === false ? 'Systems Failed Compression' : 'Awaiting Final Response'}
                            </div>
                            <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                                {finalResponseData?.cleanup_response || finalResponseData?.response}
                            </div>
                        </div>
                    </StepperPanel>
                    <StepperPanel header={'Final Status'}>
                        <div className="flex flex-column h-12rem items-center justify-center">
                            <div
                                className={
                                    'flex justify-content-center align-items-center text-2xl mb-2 font-bold ' +
                                    (finalResponseStatus === true ? 'text-green-500' : finalResponseStatus === false ? 'text-red-500 animate-pulse' : 'text-yellow-500 animate-pulse-fast')
                                }
                            >
                                {finalResponseStatus === true ? 'All Files Transfered' : finalResponseStatus === false ? 'Systems Failed Transfer' : 'Awaiting Final Response'}
                            </div>
                            <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">{finalResponseData?.response}</div>
                        </div>
                    </StepperPanel>
                </Stepper>
            </Dialog>
            <Dialog
                draggable={false}
                visible={rebootDialogVisible}
                style={{ width: '50vw' }}
                onHide={() => {
                    if (!rebootDialogVisible) return;
                    setRebootDialogVisible(false);
                }}
            >
                <Stepper ref={rebootStepperRef} style={{ flexBasis: '50rem' }} orientation="vertical">
                    {selectedDevices.map((m, key) => {
                        return (
                            <StepperPanel header={m?.server ?? 'Unknown Server'} key={key}>
                                <div className="flex flex-column h-12rem items-center justify-center">
                                    <div
                                        className={
                                            'flex justify-content-center align-items-center text-2xl mb-2 font-bold ' +
                                            (m?.success === true ? 'text-green-500' : m?.success === false ? 'text-red-500 animate-pulse' : 'text-yellow-500 animate-pulse-fast')
                                        }
                                    >
                                        {m?.success === true ? 'Command Sent Successfully' : m?.success === false ? 'System Failed Reboot' : 'System Awaiting Reboot'}
                                    </div>
                                    <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">{m?.response}</div>
                                </div>
                            </StepperPanel>
                        );
                    })}

                    <StepperPanel header={'Finish'}>
                        <div className="flex flex-column h-12rem items-center justify-center">
                            <div
                                className={
                                    'flex justify-content-center align-items-center text-2xl mb-2 font-bold ' +
                                    (finalResponseStatus === true ? 'text-green-500' : finalResponseStatus === false ? 'text-red-500 animate-pulse' : 'text-yellow-500 animate-pulse-fast')
                                }
                            >
                                {finalResponseStatus === true ? 'All Systems Rebooted' : finalResponseStatus === false ? 'Systems Failed Reboot' : 'Awaiting Final Response'}
                            </div>
                            <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">{finalResponseData?.response}</div>
                        </div>
                    </StepperPanel>
                </Stepper>
            </Dialog>
            <Dialog
                draggable={false}
                visible={customCLICommandDialogVisible}
                style={{ width: '50vw' }}
                onHide={() => {
                    if (!customCLICommandDialogVisible) return;
                    setCustomCLICommandDialogVisible(false);
                }}
            >
                <Stepper ref={customCLICommandStepperRef} style={{ flexBasis: '50rem' }} orientation="vertical">
                    {selectedDevices.map((m, key) => {
                        return (
                            <StepperPanel header={m?.server ?? 'Unknown Server'} key={key}>
                                <div className="flex flex-column h-12rem items-center justify-center">
                                    <div
                                        className={
                                            'flex justify-content-center align-items-center text-2xl mb-2 font-bold ' +
                                            (m?.success === true ? 'text-green-500' : m?.success === false ? 'text-red-500 animate-pulse' : 'text-yellow-500 animate-pulse-fast')
                                        }
                                    >
                                        {m?.success === true ? 'Command Executed Successfully' : m?.success === false ? 'System Failed Command' : 'System Awaiting Command'}
                                    </div>
                                    <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">{m?.response}</div>
                                </div>
                            </StepperPanel>
                        );
                    })}

                    <StepperPanel header={'Finish'}>
                        <div className="flex flex-column h-12rem items-center justify-center">
                            <div
                                className={
                                    'flex justify-content-center align-items-center text-2xl mb-2 font-bold ' +
                                    (finalResponseStatus === true ? 'text-green-500' : finalResponseStatus === false ? 'text-red-500 animate-pulse' : 'text-yellow-500 animate-pulse-fast')
                                }
                            >
                                {finalResponseStatus === true ? 'All Commands Executed' : finalResponseStatus === false ? 'Commands Failed Execution' : 'Awaiting Final Response'}
                            </div>
                            <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">{finalResponseData?.response}</div>
                        </div>
                    </StepperPanel>
                </Stepper>
            </Dialog>
            <Dialog
                draggable={false}
                visible={redeployDialogVisible}
                style={{ width: '50vw' }}
                onHide={() => {
                    if (!redeployDialogVisible) return;
                    setRedeployDialogVisible(false);
                }}
            >
                <Stepper ref={redeployStepperRef} style={{ flexBasis: '50rem' }} orientation="vertical">
                    {selectedDevices.map((m, key) => {
                        return (
                            <StepperPanel header={m?.server ?? 'Unknown Server'} key={key}>
                                <div className="flex flex-column h-12rem items-center justify-center">
                                    <div
                                        className={
                                            'flex justify-content-center align-items-center text-2xl mb-2 font-bold ' +
                                            (m?.success === true ? 'text-green-500' : m?.success === false ? 'text-red-500 animate-pulse' : 'text-yellow-500 animate-pulse-fast')
                                        }
                                    >
                                        {m?.success === true ? 'Machine Redeployed Successfully' : m?.success === false ? 'System Failed Redeploy' : 'System Awaiting Redeploy'}
                                    </div>
                                    <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">{m?.response}</div>
                                </div>
                            </StepperPanel>
                        );
                    })}

                    <StepperPanel header={'Finish'}>
                        <div className="flex flex-column h-12rem items-center justify-center">
                            <div
                                className={
                                    'flex justify-content-center align-items-center text-2xl mb-2 font-bold ' +
                                    (finalResponseStatus === true ? 'text-green-500' : finalResponseStatus === false ? 'text-red-500 animate-pulse' : 'text-yellow-500 animate-pulse-fast')
                                }
                            >
                                {finalResponseStatus === true ? 'All Systems Redeployed' : finalResponseStatus === false ? 'Systems Failed Redeploy' : 'Awaiting Final Response'}
                            </div>
                            <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">{finalResponseData?.response}</div>
                        </div>
                    </StepperPanel>
                </Stepper>
            </Dialog>
            <Dialog
                closable={false}
                draggable={false}
                visible={importBaseImageDialogVisible}
                style={{ width: '50vw' }}
                onHide={() => {
                    if (!importBaseImageDialogVisible) return;
                    setImportBaseImageDialogVisible(false);
                }}
                footer={() => <Button loading={loading} onClick={() => setImportBaseImageDialogVisible(false)} label={'Okay'} className={'w-full'}></Button>}
            >
                <TerminalDisplay messages={finalResponseData?.MESSAGES ?? []} placeholder={'Waiting for messages'} loadingDots={true} />
                <ProgressBar
                    color={finalResponseData?.SUCCESS === false ? 'RED' : finalResponseData?.SUCCESS === true ? 'GREEN' : 'YELLOW'}
                    displayValueTemplate={(value) => {
                        return <>{finalResponseData?.SUCCESS === false ? 'ERROR' : value + '%'}</>;
                    }}
                    value={finalResponseData?.SUCCESS === false ? 100 : finalResponseData?.PERCENTAGE}
                    className={'w-full mt-3'}
                />
            </Dialog>
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
                <h1 className="text-center mt-4">Local Machine</h1>
            </div>
            <div className="col-12">
                <div className="card mb-0 flex items-center justify-between w-full p-5 border border-gray-300 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <i className="pi pi-file-import" style={{ fontSize: '2rem', color: '#5865f2' }}></i>
                        <div className="ml-4">
                            <div className="text-xl font-semibold">Import Base Image</div>
                            <span className="text-sm text-gray-500 block">Import the base image for our Alt repository dependencies.</span>
                        </div>
                    </div>
                    <Button
                        onClick={() => {
                            importDockerImage();
                        }}
                        icon={'pi pi-play-circle'}
                        severity={'danger'}
                        loading={loading}
                        disabled={!isConnected}
                        label={'Execute'}
                        className="ml-auto"
                    ></Button>
                </div>
            </div>
            <div className="col-12">
                <h1 className="text-center mt-4">Remote Machines</h1>
            </div>
            <div className="col-12">
                <div className="card mb-0">
                    <MultiSelect
                        disabled={!isConnected}
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

export default Dashboard;
