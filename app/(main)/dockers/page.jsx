/* eslint-disable @next/next/no-img-element */
'use client';


import React, { useContext, useEffect, useRef, useState } from 'react';

import { WebsocketContext } from '../../../layout/context/websocketcontext';
import TimeAgo from '../../../components/TimeAgo';
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
import { isValidDirectoryPath, isValidPath } from '../../../utilities/utilities';
import { playErrorNotificationSound, playSuccessNotificationSound } from '../../../utilities/notification';
import { TabPanel, TabView } from 'primereact/tabview';
import { Terminal } from 'primereact/terminal';
import TerminalDisplay from '../../../components/TerminalDisplay';
import { Tag } from 'primereact/tag';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Dropdown } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';


const Dashboard = () => {
    const toast = useRef(null);
    const { isConnected, lastConnectionUpdate, sendMessageAndWaitForCondition } = useContext(WebsocketContext);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [devices, setDevices] = useState([]);
    const [selectedDevices, setSelectedDevices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [readyDialogVisible, setReadyDialogVisible] = useState(false);
    const [buildStatus, setBuildStatus] = useState({
        STARTING: [],
        BUILDING: [],
        ERRORS: [],
        FINISHED: []
    });
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
    const [readyLock, setReadyLock] = useState(false);
    const [response, setResponse] = useState(null);
    const [additionalArguments, setAdditionalArguments] = useState({
        CONTAINER_NAME: 'XDASH-DOCKER-PIPELINE',
        IMAGE_NAME: 'xdash-docker-image',
        ARCHITECTURE: 'ARM64_LINUX'
    });
    const [transferMessages, setTransferMessages] = useState({})
    const [transferData, setTransferData] = useState({})
    const [transferIndex, setTransferIndex] = useState(0)
    const [projectDirectory, setProjectDirectory] = useState(null);
    const [finalSummary, setFinalSummary] = useState([])
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
                            setReady(
                                message?.message?.ready ?? false
                            );
                            setProjectDirectory(message?.message?.docker_images_directory);
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
            if (!readyLock)
                setReadyDialogVisible(true);
        }
    }, [ready, readyLock]);

    function connect_wifi(type, vFunc) {
        return sendMessageAndWaitForCondition({ type: 'WIFI-CONNECT', message: type }, vFunc, 4000);
    }
    function finish() {
        setFinished(true)
        setLoading(false)
        stepperRef.current.setActiveStep(5);
    }
    function transfer_import() {
        setFinished(false);
        setTransferData({})
        setTransferMessages({})
        setTransferIndex(0)
        stepperRef.current.setActiveStep(4);
        setLoading(true);
        sendMessageAndWaitForCondition({
            type: 'DEVICES-DOCKER-IMPORT', message: JSON.stringify({
                servers: selectedDevices.map(m => m.server),
                containerName: additionalArguments?.CONTAINER_NAME,
                imageName: additionalArguments?.IMAGE_NAME,
                architecture: additionalArguments?.ARCHITECTURE
            })
        }, (m) => {
            if (m?.type === 'DEVICES-DOCKER-IMPORT') {
                const msg = JSON.parse(m?.message);
                console.log(msg)
                if (msg?.server) {
                    setTransferMessages((prev) => {
                        const updatedMessages = { ...prev };
                        const array = updatedMessages[msg.server] ?? [];
                        updatedMessages[msg.server] = [msg?.response || `Unknown message while importing on machine: ${msg.server}...`, ...array];
                        return updatedMessages; // Return the updated object
                    });

                    const index = selectedDevices.findIndex(obj => obj?.server === msg.server);
                    if(index !== -1) {
                        setTransferIndex(index)
                    }
                }
                if (msg.finished) {
                    setTransferIndex(selectedDevices.length)
                    return true;
                }
            }
        }, 400000).then((m) => {
            setLoading(false)
            setTransferData((prev) => {
                const updatedData = { ...prev };
                updatedData.messages = [
                    m?.message?.response || `No final message received back from server.`,
                    ...(prev?.messages ?? []),
                ];
                return updatedData;
            });
            setFinalSummary((prevArray) => [(m?.message?.response || `No final message received back from server.`), ...prevArray]);

            if(m?.message?.success) {
                playSuccessNotificationSound()
                finish()
            } else {
                playErrorNotificationSound()
            }
        }).catch((e) => {
            setTransferData((prev) => ({
                ...prev,
                messages: [
                    e?.message ?? `There was an unknown exception.`,
                    ...(prev?.messages ?? []),
                ],
            }));
            playErrorNotificationSound()
            setLoading(false);
        });
    }
    function reconnection() {
        setFinished(false);
        stepperRef.current.setActiveStep(3);
        setReconnectionData({});
        setReconnectionMessages({});
        setLoading(true);
        sendMessageAndWaitForCondition({
            type: 'DEVICES-RECONNECT', message: JSON.stringify(selectedDevices)
        }, (m) => {
            if (m?.type === 'DEVICES-RECONNECT') {
                const msg = JSON.parse(m?.message);
                if (msg?.sshHostAddress) {
                    const device = JSON.parse(msg?.sshHostAddress);
                    setReconnectionMessages((prev) => ({
                        ...prev,
                        [device.server]: [
                            msg?.response || `Unknown message while reconnecting on machine: ${device?.server}...`,
                            ...(prev[device.server] ?? []),
                        ],
                    }));

                    const index = selectedDevices.findIndex(obj => obj?.server === device?.server);
                    if(index !== -1) {
                        setReconnectionIndex(index)
                    }
                }
                if (msg.finished) {
                    setReconnectionIndex(selectedDevices.length)
                    setReconnectionData((prev) => {
                        return ({
                            ...prev,
                            DEVICES_RECONNECTION_SUCCESS: msg?.success ?? false
                        });
                    });
                    return true;
                }
            }
        }, 65000).then((m) => {
            setReconnectionData((prev) => ({
                ...prev,
                messages: [
                    m?.message?.response || `No final message received back from server.`,
                    ...(prev?.messages ?? []),
                ],
            }));
            if(m?.message?.success) {
                playSuccessNotificationSound()
                setReconnectionData((prev) => ({
                    ...prev,
                    messages: [
                        `Continuing onto transfer & execute in 3 seconds...`,
                        ...(prev?.messages ?? []),
                    ],
                }));
                setTimeout(transfer_import, 3000)
            } else {
                setLoading(false)
                playErrorNotificationSound()
            }
        }).catch((e) => {
            setReconnectionData((prev) => ({
                ...prev,
                messages: [
                    e?.message ?? `There was an unknown exception.`,
                    ...(prev?.messages ?? []),
                ],
                DEVICES_RECONNECTION_SUCCESS: false,
            }));
            setReconnectionIndex(selectedDevices.length)
            playErrorNotificationSound()
            setLoading(false);
        });
    }

    function build() {
        stepperRef.current.setActiveStep(1);
        setFinished(false);
        setBuildStatus(null);
        setLoading(true);
        sendMessageAndWaitForCondition({
            type: 'DOCKER-BUILD', message: JSON.stringify({
                CONTAINER_NAME: additionalArguments?.CONTAINER_NAME,
                IMAGE_NAME: additionalArguments?.IMAGE_NAME,
                ARCHITECTURE: additionalArguments?.ARCHITECTURE
            })
        }, (m) => {
            if (m.type === 'DOCKER-BUILD') {
                const msg = JSON.parse(m.message);
                if (msg.step === 'STARTING') {
                    setBuildIndex(0);
                    setBuildStatus((prev) => {
                        const array = prev?.STARTING ?? [];
                        array.unshift(msg?.message || 'Unknown message while building on step STARTING...');
                        return ({
                            ...prev,
                            STARTING: array
                        });
                    });
                } else if (msg.step === 'BUILDING') {
                    setBuildIndex(1);
                    setBuildStatus((prev) => {
                        const array = prev?.BUILDING ?? [];
                        array.unshift(msg?.message || 'Unknown message while building on step BUILDING...');
                        return ({
                            ...prev,
                            BUILDING: array
                        });
                    });
                } else if (msg.step === 'FINISHED') {
                    setBuildIndex(3);
                    setBuildStatus((prev) => {
                        const array = prev?.FINISHED ?? [];
                        array.unshift(msg?.message || 'Unknown message while building on step FINISHED...');
                        return ({
                            ...prev,
                            FINISHED: array
                        });
                    });
                } else {
                    setBuildIndex(2);
                    setBuildStatus((prev) => {
                        const array = prev?.ERRORS ?? [];
                        array.unshift(msg?.message || 'Unknown Exception while building...');
                        return ({
                            ...prev,
                            ERRORS: array
                        });
                    });
                    playErrorNotificationSound();
                }

                if (msg?.success === true || msg?.success === false) {
                    if (msg?.finished) {
                        playSuccessNotificationSound();
                        return true;
                    }
                }
            }
        }, 120000).then((msg) => {

            if (msg?.message.success === false) {
                playErrorNotificationSound();
                setLoading(false);
            } else if (msg?.message.success === true) {
                setLoading(true);
                playSuccessNotificationSound();
                stepperRef.current.setActiveStep(2);
                setSetup((prev) => ({
                    ...prev,
                    ROBOT_CONNECTION_MESSAGES: ['Attempting to connect back to robot WiFi now...']
                }));
                connect_wifi('ROBOT', (m) => {
                    if (m.type === 'WIFI-CONNECT') {
                        let msg = JSON.parse(m.message);

                        setSetup((prev) => {
                            prev.ROBOT_CONNECTION_MESSAGES.unshift(msg.message);
                            return ({
                                ...prev,
                                ROBOT_CONNECTION_SUCCESS: msg?.success === true ? true : msg?.success === false ? false : prev?.ROBOT_CONNECTION_SUCCESS,
                                ROBOT_CONNECTION_MESSAGES: prev.ROBOT_CONNECTION_MESSAGES
                            });
                        });
                        if (msg?.finished) {
                            return true;
                        }
                    }
                })
                    .then((msg) => {

                        if (msg?.message?.success === false) {
                            playErrorNotificationSound();
                            setLoading(false);
                        } else if (msg?.message?.success === true) {
                            playSuccessNotificationSound();
                            setSetup((prev) => {
                                prev.ROBOT_CONNECTION_MESSAGES.unshift('Continuing onto reconnection in 3 seconds.');
                                return ({
                                    ...prev,
                                    ROBOT_CONNECTION_MESSAGES: prev.ROBOT_CONNECTION_MESSAGES
                                });
                            });
                            playSuccessNotificationSound();
                            setTimeout(reconnection, 3000);
                        }
                    }).catch((e) => {
                    setSetup((prev) => {
                        prev.ROBOT_CONNECTION_MESSAGES.unshift(e?.message || 'Unknown Exception while connecting to robot WiFi...');
                        return ({
                            ...prev,
                            ROBOT_CONNECTION_SUCCESS: false,
                            ROBOT_CONNECTION_MESSAGES: prev.ROBOT_CONNECTION_MESSAGES
                        });
                    });
                    setLoading(false);
                });
            }
        }).catch((e) => {
            setLoading(false);
            setBuildStatus((prev) => {
                prev.ERRORS.unshift(e?.message || 'Unknown Exception while building...');
                return ({
                    ...prev,
                    ERRORS: prev.ERRORS
                });
            });
        });
    }

    function start() {
        setSetup({});
        setTransferData({})
        setTransferMessages({})
        setFinished(false);
        setFinalSummary([])
        setTransferIndex(0)
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

        setLoading(true);
        setSetup((prev) => ({
            ...prev,
            INTERNET_CONNECTION_MESSAGES: ['Attempting to connect to internet WiFi now...']
        }));
        connect_wifi('INTERNET', (m) => {
            if (m.type === 'WIFI-CONNECT') {
                let msg = JSON.parse(m.message);
                console.log(msg);
                setSetup((prev) => {
                    prev.INTERNET_CONNECTION_MESSAGES.unshift(msg.message);
                    return ({
                        ...prev,
                        INTERNET_CONNECTION_SUCCESS: msg?.success === true ? true : msg?.success === false ? false : prev?.INTERNET_CONNECTION_SUCCESS,
                        INTERNET_CONNECTION_MESSAGES: prev.INTERNET_CONNECTION_MESSAGES
                    });
                });
                if (msg?.finished) {
                    return true;
                }
            }
        })
            .then((msg) => {

                if (msg?.message?.success === false) {
                    playErrorNotificationSound();
                    setLoading(false);
                } else if (msg?.message?.success === true) {
                    playSuccessNotificationSound();
                    setSetup((prev) => {
                        prev.INTERNET_CONNECTION_MESSAGES.unshift('Continuing onto build in 3 seconds...');
                        return ({
                            ...prev,
                            INTERNET_CONNECTION_MESSAGES: prev.INTERNET_CONNECTION_MESSAGES
                        });
                    });
                    setTimeout(build, 3000);
                }
            }).catch((e) => {
            setSetup((prev) => {
                prev.INTERNET_CONNECTION_MESSAGES.unshift(e?.message || 'Unknown Exception while connecting to internet WiFi...');
                return ({
                    ...prev,
                    INTERNET_CONNECTION_SUCCESS: false,
                    INTERNET_CONNECTION_MESSAGES: prev.INTERNET_CONNECTION_MESSAGES
                });
            });
            setLoading(false);
        });

    }

    // @ts-ignore
    return (
        <div className="grid fadeIn">
            <Toast ref={toast} />
            <Dialog header={() => (
                <>
                    <div>
                        <i className="pi pi-exclamation-triangle text-xl text-yellow-600"
                           style={{ marginRight: '8px' }} />
                        <div className={'text-2xl'} style={{ display: 'inline', margin: 0 }}>Docker Pipeline</div>
                    </div>

                </>
            )} footer={() => response ? (
                <Tag severity={'warning'} value={response} />
            ) : null} modal={true} visible={readyDialogVisible} onHide={() => {
                setReadyDialogVisible(false);
                setReadyLock(true);
            }}
                    position={'right'}
                    style={{ width: '60vw' }} closable={true} draggable={false} resizable={false}>
                <p className="m-0 text-base">
                    The Docker pipeline is not ready to be used. It appears that the full setup for the XDASH Docker
                    pipeline has not been completed yet. Please ensure all configuration steps are finalized before
                    proceeding. If you need assistance, refer to the setup documentation or contact support.
                </p>
            </Dialog>
            <div className="col-12 lg:col-6">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Backend Status</span>
                            <div
                                className="text-900 font-medium text-xl font-bold"> {isConnected ? 'Connected' : 'Disconnected'}</div>
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
                            <span className="block text-500 font-medium mb-3">Total Machines</span>
                            <div
                                className="text-900 font-medium text-xl font-bold">{isConnected ? devices?.length ?? 0 : 'Disconnected'}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round"
                             style={{ width: '2.5rem', height: '2.5rem' }}>
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
                            <MultiSelect disabled={!isConnected || loading} onChange={(e) => {
                                const filtered = e.value.filter(e => e?.status !== 'CONNECTED');
                                if (filtered.length > 0) {
                                    playErrorNotificationSound();
                                    filtered.forEach(e => {
                                        toast.current.show({
                                            severity: 'error',
                                            summary: 'Server Not Connected!',
                                            detail: `${e.server} is not connected.`
                                        });
                                    });
                                }
                                stepperRef.current.setActiveStep(0)
                                setSetup({})
                                setFinished(false)
                                setSelectedDevices(e.value.filter(e => e?.status === 'CONNECTED'));
                            }} value={selectedDevices} options={devices} optionLabel="server" display="chip"
                                         placeholder="Select Machines" itemTemplate={template} className="w-full" />
                        </div>
                        <div className={'col-12'}>
                            <Accordion>
                                <AccordionTab disabled={loading || !isConnected}
                                              header="Additional Arguments">
                                    <div className={'grid'}>
                                        <div className={'col-12'}>
                                            <InputText value={projectDirectory} disabled={true} className={'w-full'}
                                                       placeholder={'There is no project directory configured.'} />
                                        </div>
                                        <div className={'col-12'}>
                                            <Dropdown value={additionalArguments?.ARCHITECTURE} onChange={(e) => {
                                                setAdditionalArguments((prev) => {
                                                    return ({
                                                        ...prev,
                                                        ARCHITECTURE: e.value
                                                    });
                                                });
                                            }} valueTemplate={archTemplate} itemTemplate={archTemplate}
                                                      options={['X86_LINUX', 'ARM64_LINUX', 'ARM_V7_LINUX', 'ARM_V6_LINUX', 'ARM_V6_LINUX', 'POWERPC_LINUX', 'S390X_LINUX', 'ARM64_WINDOWS', 'X86_WINDOWS', 'ARM_V7_WINDOWS', 'X86_MACOS', 'ARM64_MACOS']}
                                                      disabled={!isConnected || loading} className={'w-full'}
                                                      placeholder={'There is no architecture configured.'} />
                                        </div>
                                        <div className={'col-12 lg:col-6'}>
                                            <div className="flex flex-column gap-2">
                                                <label htmlFor="CONTAINER_NAME" className={'text-sm'}>Container
                                                    Name</label>
                                                <InputText id={'CONTAINER_NAME'} onChange={(e) => {
                                                    setAdditionalArguments((prev) => {
                                                        return ({
                                                            ...prev,
                                                            CONTAINER_NAME: e.target.value
                                                        });
                                                    });
                                                }} value={additionalArguments?.CONTAINER_NAME}
                                                           disabled={!isConnected || loading} className={'w-full'}
                                                           placeholder={'There is no container name configured.'} />
                                            </div>
                                        </div>
                                        <div className={'col-12 lg:col-6 '}>
                                            <div className="flex flex-column gap-2">
                                                <label htmlFor="IMAGE_NAME" className={'text-sm'}>Image Name</label>
                                                <InputText id={'IMAGE_NAME'} onChange={(e) => {
                                                    setAdditionalArguments((prev) => {
                                                        return ({
                                                            ...prev,
                                                            IMAGE_NAME: e.target.value
                                                        });
                                                    });
                                                }} value={additionalArguments?.IMAGE_NAME}
                                                           disabled={!isConnected || loading} className={'w-full'}
                                                           placeholder={'There is no image name configured.'} />
                                            </div>
                                        </div>
                                    </div>

                                </AccordionTab>
                            </Accordion>
                        </div>
                        <div className={'col-12'}>
                            <Button onClick={start} disabled={!isConnected || selectedDevices.length < 1}
                                    className={'w-full'} loading={loading} severity={'danger'}
                                    label={'Execute Docker Pipeline'} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="card mb-0">
                    <Stepper linear={!finished} ref={stepperRef} style={{ flexBasis: '50rem' }}
                             orientation="vertical">
                        <StepperPanel header="Internet">
                            <TerminalDisplay
                                messages={setup?.INTERNET_CONNECTION_MESSAGES ?? []}
                                loadingDots={true}
                                placeholder={'Waiting for a message'}
                            />

                            <Button disabled={!isConnected} loading={loading}
                                    className={('mt-3 w-full ') + ((setup?.INTERNET_CONNECTION_SUCCESS ?? true) && 'hidden')}
                                    severity={'warning'} label="Yes, I am connected to the internet."
                                    icon="pi pi-arrow-right" iconPos="right"
                                    onClick={() => {
                                        setSetup((prev) => {
                                            return ({
                                                ...prev,
                                                INTERNET_CONNECTION_SUCCESS: true
                                            });
                                        });
                                        build();
                                    }} />

                        </StepperPanel>
                        <StepperPanel header="Build">
                            <TabView activeIndex={buildIndex} onTabChange={(e) => setBuildIndex(e.index)}
                                     scrollable={true}>
                                <TabPanel className={'w-full'} header="STARTING" leftIcon="pi pi-play-circle mr-2">
                                    <TerminalDisplay
                                        messages={buildStatus?.STARTING ?? []}
                                        loadingDots={true}
                                        placeholder={'Waiting for a message'}
                                    />
                                </TabPanel>
                                <TabPanel className={'w-full'} header="BUILDING" leftIcon="pi pi-hammer mr-2">
                                    <TerminalDisplay
                                        messages={buildStatus?.BUILDING ?? []}
                                        loadingDots={true}
                                        placeholder={'Waiting for a message'}
                                    />
                                </TabPanel>
                                <TabPanel className={'w-full'} header="EXCEPTIONS"
                                          leftIcon="pi pi-exclamation-circle mr-2">
                                    <TerminalDisplay
                                        messages={buildStatus?.ERRORS ?? []}
                                        loadingDots={true}
                                        placeholder={'Waiting for a message'}
                                    />
                                </TabPanel>
                                <TabPanel className={'w-full'} header="FINISHED" leftIcon="pi pi-stop-circle mr-2">
                                    <TerminalDisplay
                                        messages={buildStatus?.FINISHED ?? []}
                                        loadingDots={true}
                                        placeholder={'Waiting for a message'}
                                    />
                                </TabPanel>
                            </TabView>
                        </StepperPanel>
                        <StepperPanel header="Robot">
                            <TerminalDisplay
                                messages={setup?.ROBOT_CONNECTION_MESSAGES ?? []}
                                loadingDots={true}
                                placeholder={'Waiting for a message'}
                            />

                            <Button disabled={!isConnected} loading={loading}
                                    className={('mt-3 w-full ') + ((setup?.ROBOT_CONNECTION_SUCCESS ?? true) && 'hidden')}
                                    severity={'warning'} label="Yes, I am connected to the robot."
                                    icon="pi pi-arrow-right" iconPos="right"
                                    onClick={() => {
                                        setSetup((prev) => {
                                            return ({
                                                ...prev,
                                                ROBOT_CONNECTION_SUCCESS: true
                                            });
                                        });
                                        reconnection();
                                    }} />

                        </StepperPanel>
                        <StepperPanel header="Reconnection">
                            <TabView activeIndex={reconnectionIndex} onTabChange={(e) => setReconnectionIndex(e.index)}
                                     scrollable={true}>
                                {
                                    selectedDevices.map((m, key) => (
                                        <TabPanel key={key} className={'w-full'} header={m?.hostname}
                                                  leftIcon={('mr-2 pi ') + (additionalArguments?.ARCHITECTURE.toLowerCase().includes('windows') ? 'pi-microsoft' : additionalArguments?.ARCHITECTURE.toLowerCase().includes('mac') ? 'pi-apple' : additionalArguments?.ARCHITECTURE.toLowerCase().includes('linux') ? 'pi-microchip' : 'pi-desktop')}>
                                            <TerminalDisplay
                                                messages={reconnectionMessages[m?.server] ?? []}
                                                loadingDots={true}
                                                placeholder={'Waiting for a message'}
                                            />
                                        </TabPanel>
                                    ))
                                }
                                <TabPanel className={'w-full'}
                                          header={"Information"}
                                          leftIcon={'mr-2 pi pi-info-circle'}>
                                    <TerminalDisplay
                                        messages={reconnectionData?.messages ?? []}
                                        loadingDots={true}
                                        placeholder={'Waiting for a message'}
                                    />
                                </TabPanel>
                            </TabView>
                            <Button disabled={!isConnected} loading={loading}
                                    className={('mt-3 w-full ') + ((reconnectionData?.DEVICES_RECONNECTION_SUCCESS ?? true) && 'hidden')}
                                    severity={'warning'} label="Reconnection returned bad status. Continue anyways?"
                                    icon="pi pi-arrow-right" iconPos="right"
                                    onClick={() => {
                                        setSetup((prev) => {
                                            return ({
                                                ...prev,
                                                DEVICES_RECONNECTION_SUCCESS: true
                                            });
                                        });
                                        transfer_import()
                                    }} />
                        </StepperPanel>
                        <StepperPanel header="Transport & Execute">
                            <TabView activeIndex={transferIndex} onTabChange={(e) => setTransferIndex(e.index)}
                                     scrollable={true}>
                                {
                                    selectedDevices.map((m, key) => (
                                        <TabPanel key={key} className={'w-full'} header={m?.hostname}
                                                  leftIcon={('mr-2 pi ') + (additionalArguments?.ARCHITECTURE.toLowerCase().includes('windows') ? 'pi-microsoft' : additionalArguments?.ARCHITECTURE.toLowerCase().includes('mac') ? 'pi-apple' : additionalArguments?.ARCHITECTURE.toLowerCase().includes('linux') ? 'pi-microchip' : 'pi-desktop')}>
                                            <TerminalDisplay
                                                messages={transferMessages[m?.server] ?? []}
                                                loadingDots={true}
                                                placeholder={'Waiting for a message'}
                                            />
                                        </TabPanel>
                                    ))
                                }
                                <TabPanel className={'w-full'}
                                          header={"Information"}
                                          leftIcon={'mr-2 pi pi-info-circle'}>
                                    <TerminalDisplay
                                        messages={transferData?.messages ?? []}
                                        loadingDots={true}
                                        placeholder={'Waiting for a message'}
                                    />
                                </TabPanel>
                            </TabView>
                        </StepperPanel>
                        <StepperPanel header="Pipeline Summary">
                            <TerminalDisplay
                                messages={finalSummary}
                                loadingDots={true}
                                placeholder={'Waiting for a message'}
                            />
                            <Button disabled={!isConnected} loading={loading}
                                    className={'mt-3 w-full'}
                                    severity={'warning'} label="Restart?"
                                    icon="pi pi-sync" iconPos="right"
                                    onClick={() => {
                                        start()
                                    }} />
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
            <span className="text-lg font-medium">{option.server}&nbsp;|&nbsp;{option.address}&nbsp;|&nbsp;</span>
            <span
                className={('text-lg font-bold ') + (option?.status === 'CONNECTED' ? 'text-green-500' : option?.status === 'CONNECTING' ? 'text-yellow-500' : 'text-red-500')}>{option.status}</span>
        </div>
    );
};
const archTemplate = (option) => {
    return (
        <div className="flex items-center justify-between w-full border border-gray-300 rounded-lg shadow-md">
            {(
                <i className={('pi ') + (option.toLowerCase().includes('windows') ? 'pi-microsoft' : option.toLowerCase().includes('mac') ? 'pi-apple' : option.toLowerCase().includes('linux') ? 'pi-microchip' : 'pi-desktop')} />)}
            <span className={'ml-2'}>{option}</span>
        </div>
    );
};
const linuxIcon = () =>
    (<svg xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512">
        <path
            d="M220.8 123.3c1 .5 1.8 1.7 3 1.7 1.1 0 2.8-.4 2.9-1.5 .2-1.4-1.9-2.3-3.2-2.9-1.7-.7-3.9-1-5.5-.1-.4 .2-.8 .7-.6 1.1 .3 1.3 2.3 1.1 3.4 1.7zm-21.9 1.7c1.2 0 2-1.2 3-1.7 1.1-.6 3.1-.4 3.5-1.6 .2-.4-.2-.9-.6-1.1-1.6-.9-3.8-.6-5.5 .1-1.3 .6-3.4 1.5-3.2 2.9 .1 1 1.8 1.5 2.8 1.4zM420 403.8c-3.6-4-5.3-11.6-7.2-19.7-1.8-8.1-3.9-16.8-10.5-22.4-1.3-1.1-2.6-2.1-4-2.9-1.3-.8-2.7-1.5-4.1-2 9.2-27.3 5.6-54.5-3.7-79.1-11.4-30.1-31.3-56.4-46.5-74.4-17.1-21.5-33.7-41.9-33.4-72C311.1 85.4 315.7 .1 234.8 0 132.4-.2 158 103.4 156.9 135.2c-1.7 23.4-6.4 41.8-22.5 64.7-18.9 22.5-45.5 58.8-58.1 96.7-6 17.9-8.8 36.1-6.2 53.3-6.5 5.8-11.4 14.7-16.6 20.2-4.2 4.3-10.3 5.9-17 8.3s-14 6-18.5 14.5c-2.1 3.9-2.8 8.1-2.8 12.4 0 3.9 .6 7.9 1.2 11.8 1.2 8.1 2.5 15.7 .8 20.8-5.2 14.4-5.9 24.4-2.2 31.7 3.8 7.3 11.4 10.5 20.1 12.3 17.3 3.6 40.8 2.7 59.3 12.5 19.8 10.4 39.9 14.1 55.9 10.4 11.6-2.6 21.1-9.6 25.9-20.2 12.5-.1 26.3-5.4 48.3-6.6 14.9-1.2 33.6 5.3 55.1 4.1 .6 2.3 1.4 4.6 2.5 6.7v.1c8.3 16.7 23.8 24.3 40.3 23 16.6-1.3 34.1-11 48.3-27.9 13.6-16.4 36-23.2 50.9-32.2 7.4-4.5 13.4-10.1 13.9-18.3 .4-8.2-4.4-17.3-15.5-29.7zM223.7 87.3c9.8-22.2 34.2-21.8 44-.4 6.5 14.2 3.6 30.9-4.3 40.4-1.6-.8-5.9-2.6-12.6-4.9 1.1-1.2 3.1-2.7 3.9-4.6 4.8-11.8-.2-27-9.1-27.3-7.3-.5-13.9 10.8-11.8 23-4.1-2-9.4-3.5-13-4.4-1-6.9-.3-14.6 2.9-21.8zM183 75.8c10.1 0 20.8 14.2 19.1 33.5-3.5 1-7.1 2.5-10.2 4.6 1.2-8.9-3.3-20.1-9.6-19.6-8.4 .7-9.8 21.2-1.8 28.1 1 .8 1.9-.2-5.9 5.5-15.6-14.6-10.5-52.1 8.4-52.1zm-13.6 60.7c6.2-4.6 13.6-10 14.1-10.5 4.7-4.4 13.5-14.2 27.9-14.2 7.1 0 15.6 2.3 25.9 8.9 6.3 4.1 11.3 4.4 22.6 9.3 8.4 3.5 13.7 9.7 10.5 18.2-2.6 7.1-11 14.4-22.7 18.1-11.1 3.6-19.8 16-38.2 14.9-3.9-.2-7-1-9.6-2.1-8-3.5-12.2-10.4-20-15-8.6-4.8-13.2-10.4-14.7-15.3-1.4-4.9 0-9 4.2-12.3zm3.3 334c-2.7 35.1-43.9 34.4-75.3 18-29.9-15.8-68.6-6.5-76.5-21.9-2.4-4.7-2.4-12.7 2.6-26.4v-.2c2.4-7.6 .6-16-.6-23.9-1.2-7.8-1.8-15 .9-20 3.5-6.7 8.5-9.1 14.8-11.3 10.3-3.7 11.8-3.4 19.6-9.9 5.5-5.7 9.5-12.9 14.3-18 5.1-5.5 10-8.1 17.7-6.9 8.1 1.2 15.1 6.8 21.9 16l19.6 35.6c9.5 19.9 43.1 48.4 41 68.9zm-1.4-25.9c-4.1-6.6-9.6-13.6-14.4-19.6 7.1 0 14.2-2.2 16.7-8.9 2.3-6.2 0-14.9-7.4-24.9-13.5-18.2-38.3-32.5-38.3-32.5-13.5-8.4-21.1-18.7-24.6-29.9s-3-23.3-.3-35.2c5.2-22.9 18.6-45.2 27.2-59.2 2.3-1.7 .8 3.2-8.7 20.8-8.5 16.1-24.4 53.3-2.6 82.4 .6-20.7 5.5-41.8 13.8-61.5 12-27.4 37.3-74.9 39.3-112.7 1.1 .8 4.6 3.2 6.2 4.1 4.6 2.7 8.1 6.7 12.6 10.3 12.4 10 28.5 9.2 42.4 1.2 6.2-3.5 11.2-7.5 15.9-9 9.9-3.1 17.8-8.6 22.3-15 7.7 30.4 25.7 74.3 37.2 95.7 6.1 11.4 18.3 35.5 23.6 64.6 3.3-.1 7 .4 10.9 1.4 13.8-35.7-11.7-74.2-23.3-84.9-4.7-4.6-4.9-6.6-2.6-6.5 12.6 11.2 29.2 33.7 35.2 59 2.8 11.6 3.3 23.7 .4 35.7 16.4 6.8 35.9 17.9 30.7 34.8-2.2-.1-3.2 0-4.2 0 3.2-10.1-3.9-17.6-22.8-26.1-19.6-8.6-36-8.6-38.3 12.5-12.1 4.2-18.3 14.7-21.4 27.3-2.8 11.2-3.6 24.7-4.4 39.9-.5 7.7-3.6 18-6.8 29-32.1 22.9-76.7 32.9-114.3 7.2zm257.4-11.5c-.9 16.8-41.2 19.9-63.2 46.5-13.2 15.7-29.4 24.4-43.6 25.5s-26.5-4.8-33.7-19.3c-4.7-11.1-2.4-23.1 1.1-36.3 3.7-14.2 9.2-28.8 9.9-40.6 .8-15.2 1.7-28.5 4.2-38.7 2.6-10.3 6.6-17.2 13.7-21.1 .3-.2 .7-.3 1-.5 .8 13.2 7.3 26.6 18.8 29.5 12.6 3.3 30.7-7.5 38.4-16.3 9-.3 15.7-.9 22.6 5.1 9.9 8.5 7.1 30.3 17.1 41.6 10.6 11.6 14 19.5 13.7 24.6zM173.3 148.7c2 1.9 4.7 4.5 8 7.1 6.6 5.2 15.8 10.6 27.3 10.6 11.6 0 22.5-5.9 31.8-10.8 4.9-2.6 10.9-7 14.8-10.4s5.9-6.3 3.1-6.6-2.6 2.6-6 5.1c-4.4 3.2-9.7 7.4-13.9 9.8-7.4 4.2-19.5 10.2-29.9 10.2s-18.7-4.8-24.9-9.7c-3.1-2.5-5.7-5-7.7-6.9-1.5-1.4-1.9-4.6-4.3-4.9-1.4-.1-1.8 3.7 1.7 6.5z" />
    </svg>);

export default Dashboard;
