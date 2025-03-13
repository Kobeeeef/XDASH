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
import axios from 'axios';
import { Tag } from 'primereact/tag';

const Dashboard = () => {
    const toast = useRef(null);
    const { isConnected, lastConnectionUpdate, sendMessageAndWaitForCondition, socket } = useContext(WebsocketContext);
    const [lastStatusUpdate, setLastStatusUpdate] = useState(new Date());
    const [hostnames, setHostnames] = useState([]);
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

    // @ts-ignore
    return (
        <div className="grid fadeIn">
            <Toast ref={toast} />
            <ConfirmDialog />
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
                                <span className="block text-500 font-medium mb-3">Devices</span>
                                <div className="text-900 font-medium text-xl"> {isConnected ? `${hostnames.length} Devices` : 'Disconnected'}</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-qrcode text-blue-500 text-xl" />
                            </div>
                        </div>
                        <TimeAgo date={lastStatusUpdate} />
                    </div>
                </div>
            </>
        </div>
    );
};

export default Dashboard;
