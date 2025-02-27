/* eslint-disable @next/next/no-img-element */
'use client';


import React, { useContext, useEffect, useRef, useState } from 'react';
import { ConfirmDialog } from 'primereact/confirmdialog';

import { WebsocketContext } from '../../../layout/context/websocketcontext';
import TimeAgo from '../../../components/TimeAgo';
import { Image } from 'primereact/image';
import axios from 'axios';
import { Tag } from 'primereact/tag';
import { root } from 'postcss';


const Dashboard = () => {
    const { isConnected, lastConnectionUpdate, sendMessageAndWaitForCondition } = useContext(WebsocketContext);
    const [lastStatusUpdate, setLastStatusUpdate] = useState(new Date());
    const [lastAprilTagStatusUpdate, setLastAprilTagStatusUpdate] = useState(new Date());

    const [hostnames, setHostnames] = useState([]);
    const [statuses, setStatuses] = useState({});
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
        for (let hostname of hostnames) {

            axios
                .get(`http://${hostname}:5800/api/status`, { timeout: 2500 }) // 3 seconds timeout
                .then((response) => {
                    setStatuses((prev) => {
                        const updatedMessages = { ...prev };
                        updatedMessages[hostname] = response.data;
                        return updatedMessages;
                    });
                })
                .catch((err) => {
                    setStatuses((prev) => {
                        const updatedMessages = { ...prev };
                        updatedMessages[hostname] = null;
                        return updatedMessages;
                    });
                    console.error('Error fetching status:', err);
                });
        }
        setLastAprilTagStatusUpdate(new Date());
    }, [hostnames]);
    // @ts-ignore
    return (
        <div className="grid fadeIn">
            <ConfirmDialog />
            <div className="col-12 lg:col-6">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Machines</span>
                            <div
                                className="text-900 font-medium text-xl"> {isConnected ? `${hostnames.length} Devices` : 'Disconnected'}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round"
                             style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-chevron-circle-up text-blue-500 text-xl" />
                        </div>
                    </div>
                    <TimeAgo date={lastStatusUpdate} />
                </div>
            </div>


            <div className="col-12 lg:col-6">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">April Tag Statuses</span>
                            <div
                                className={('text-900 text-xl ') + getColorStatus(statuses)}>{getStatusSummary(statuses)}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round"
                             style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-qrcode text-blue-500 text-xl" />
                        </div>
                    </div>
                    <TimeAgo date={lastAprilTagStatusUpdate} />
                </div>
            </div>


            {Object.entries(statuses).map(([hostname, devices]) => {
                if (!devices) {
                    return (
                        <div className="col-12 lg:col-6" key={hostname}>
                            <div className="card mb-0">
                                <Image
                                    src={`/images/error/camera_lost.png`}
                                    alt="Image"
                                    width="100%"
                                    style={{ width: '100%', objectFit: 'fill' }}
                                    preview
                                />
                                <div className="px-6 pt-6 pb-2">
                                    <div>
              <span className="text-xs font-medium text-red-600 uppercase">
                    UNRESPONSIVE DEVICE
              </span>
                                        <a
                                            href={`http://${hostname}:5800/`}
                                            className="block mt-2 text-2xl text-red-500 font-semibold transition-colors duration-300 transform hover:text-gray-600 hover:underline"
                                            tabIndex="1"
                                            role="link"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {hostname}
                                        </a>
                                        <p className="mt-2 text-sm text-gray-600">
                                            {hostname} | {status?.uniqueName || "Unknown ID"} | {status?.currentPipelineIndex >= 0 ? status?.pipelineNicknames[status?.currentPipelineIndex] ?? 'No Pipeline' : status?.currentPipelineIndex ?? 'Unknown Pipeline'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }
                return devices.map((status, index) => (
                    <div className="col-12 lg:col-6" key={`${hostname}-${status.uniqueName || index}`}>
                        <div className="card mb-0">
                            <Image
                                src={`http://${hostname}:${status.outputStreamPort}/stream.mjpg`}
                                alt="Image"
                                width="100%"
                                style={{ width: '100%', objectFit: 'fill' }}
                                preview
                            />

                            <div className="px-6 pt-6 pb-2">
                                <div>
              <span className="text-xs font-medium text-blue-600 uppercase dark:text-blue-400">
                {status.cameraPath}
              </span>
                                    <div className="flex items-center justify-center gap-2 mt-2">
                                        <a
                                            href={`http://${hostname}:5800/`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-2xl font-bold transition-colors duration-300 transform hover:text-gray-600 hover:underline"
                                            tabIndex="1"
                                            role="link"
                                        >
                                            {status?.nickname ?? 'Unknown'}
                                        </a>
                                        <Tag
                                            className="px-2"
                                            rounded
                                            pt={{
                                                value: {
                                                    style: { fontSize: "0.65rem" }
                                                },
                                            }}
                                            value={status?.isConnected ? 'Online' : 'Offline'}
                                            severity={status?.isConnected ? 'success' : 'danger'}
                                        />

                                        <Tag
                                            className={'px-2'}
                                            rounded={true}
                                            pt={{
                                                value: {
                                                    style: { fontSize: "0.65rem" }
                                                },
                                            }}
                                            value={status?.ntConnected ? 'NT Connected' : 'NT Offline'}
                                            severity={status?.ntConnected ? 'success' : 'danger'}
                                        />
                                        <Tag
                                            className={'px-2'}
                                            rounded={true}
                                            pt={{
                                                value: {
                                                    style: { fontSize: "0.65rem" }
                                                },
                                            }}
                                            value={status?.xtConnected ? 'XT Connected' : 'XT Offline'}
                                            severity={status?.xtConnected ? 'success' : 'danger'}
                                        />
                                    </div>

                                    <p className="mt-2 text-sm text-gray-600">
                                        {hostname} | {status?.uniqueName ?? "Unknown ID"} | {status?.currentPipelineIndex >= 0 ? status?.pipelineNicknames[status?.currentPipelineIndex] ?? 'No Pipeline' : status?.currentPipelineIndex ?? 'Unknown Pipeline'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ));
            })}


        </div>
    );

    function getStatusSummary(statusData) {
        let totalDevices = 0;
        let offlineDevices = 0;

        // Iterate over each host
        Object.keys(statusData).forEach(hostname => {
            const devices = statusData[hostname];
            if (!devices) {
                totalDevices++;
                offlineDevices++;
                return;
            }
            devices.forEach(device => {
                totalDevices++;
                // Define a device as online if either isConnected or hasConnected is true
                if (!device.isConnected) {
                    offlineDevices++;
                }
            });
        });
        console.log(totalDevices);
        if (totalDevices === 0) {
            return 'No devices found';
        }
        if (offlineDevices === 0) {
            return 'Fully Functional';
        } else if (offlineDevices === totalDevices) {
            return 'None Functional';
        } else {
            return `${offlineDevices} Offline`;
        }
    }

    function getColorStatus(statusData) {
        let totalDevices = 0;
        let offlineDevices = 0;

        // Iterate through each host in the data
        Object.keys(statusData).forEach((hostname) => {
            const devices = statusData[hostname];
            if (!devices) {
                totalDevices++;
                offlineDevices++;
                return;
            }
            devices.forEach((device) => {
                totalDevices++;
                // Consider a device offline if neither isConnected nor hasConnected is true
                if (!device.isConnected) {
                    offlineDevices++;
                }
            });
        });

        // Return color status based on device counts
        if (totalDevices === 0) {
            return 'font-bold text-gray-400'; // UNKNOWN
        }
        if (offlineDevices === 0) {
            return 'font-bold text-green-600'; // GOOD
        }
        if (offlineDevices === totalDevices) {
            return 'font-bold text-red-600 animate-pulse-fast'; // BAD
        }
        return 'font-bold text-yellow-600 animate-pulse'; // MAYBE
    }
};


export default Dashboard;
