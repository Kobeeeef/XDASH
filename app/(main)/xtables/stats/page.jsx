/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useContext, useEffect, useState } from 'react';
import { WebsocketContext } from '../../../../layout/context/websocketcontext';
import TimeAgo from '../../../../components/TimeAgo';
const Dashboard = () => {
    const { isConnected, lastConnectionUpdate, sendMessageAndWaitForCondition } = useContext(WebsocketContext);
    const [infoData, setInfoData] = useState({});
    const [lastStatusUpdate, setLastStatusUpdate] = useState(new Date());
    const [lastClientsUpdate, setLastClientsUpdate] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (isConnected) {
                sendMessageAndWaitForCondition({ type: 'XTABLES-STATISTICS' }, (m) => m.type === 'XTABLES-STATISTICS').then((message) => {
                    setInfoData((a) => {
                        message.message.info = JSON.parse(message.message.info)
                        if (message.message.connected !== a?.connected) setLastStatusUpdate(new Date());
                        if (message.message.info.totalClients !== a?.info?.totalClients) setLastClientsUpdate(new Date());
                        console.log(message.message)
                        return message.message;
                    });
                }).catch(() => {
                });


            }
        }, 500);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, [isConnected, sendMessageAndWaitForCondition]);


    // @ts-ignore
    return (<div className="grid">
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Backend Status</span>
                            <div
                                className={"text-900 font-medium text-xl " + (isConnected ? "text-white" : "text-red-600")}> {isConnected ? 'Connected' : 'Disconnected'}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round"
                             style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-chevron-circle-up text-blue-500 text-xl" />
                        </div>
                    </div>
                    <TimeAgo date={lastConnectionUpdate} />
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">XTABLES Status</span>
                            <div
                                className={"text-900 font-medium text-xl " + (isConnected ? infoData?.connected ? 'text-white' : 'text-red-600' : 'text-red-600')}>{isConnected ? infoData?.connected ? 'Connected' : 'Disconnected' : 'Disconnected'}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round"
                             style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-table text-blue-500 text-xl" />
                        </div>
                    </div>
                    <TimeAgo date={lastStatusUpdate} />
                </div>
            </div>

            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Clients</span>
                            <div
                                className={"text-900 font-medium text-xl " + (isConnected ? infoData?.connected ? infoData?.info?.totalClients ? 'text-white' : "text-red-600" : 'text-red-600' : 'text-red-600')}>{isConnected ? infoData?.connected ? infoData?.info?.totalClients || 'Unknown' : 'Disconnected' : 'Disconnected'}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round"
                             style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-android text-cyan-500 text-xl" />
                        </div>
                    </div>
                    <TimeAgo date={lastClientsUpdate} />
                </div>
            </div>
        <div className="col-12 lg:col-6 xl:col-3">
            <div className="card mb-0">
                <div className="flex justify-content-between mb-3">
                    <div>
                        <span className="block text-500 font-medium mb-3">Health</span>
                        <div
                            className={"text-900 font-medium text-xl "  + (isConnected ? infoData?.connected ? infoData?.info?.health === "GOOD" ? 'text-green-600' : "text-red-600" : 'text-red-600' : 'text-red-600')}>{isConnected ? infoData?.connected ? infoData?.info?.health || "UNKNOWN" : 'Disconnected' : 'Disconnected'}</div>
                    </div>
                    <div className="flex align-items-center justify-content-center bg-blue-100 border-round"
                         style={{ width: '2.5rem', height: '2.5rem' }}>
                        <i className="pi pi-heart-fill text-cyan-500 text-xl" />
                    </div>
                </div>
                <TimeAgo date={lastStatusUpdate} />
            </div>
        </div>
        <div className="col-12 lg:col-6 xl:col-3">
            <div className="card mb-0">
                <div className="flex justify-content-between mb-3">
                    <div>
                        <span className="block text-500 font-medium mb-3">IP Address</span>
                        <div
                            className={"text-900 font-medium text-xl "  + (isConnected ? infoData?.connected ? infoData?.info?.ip : 'text-red-600' : 'text-red-600')}>{isConnected ? infoData?.connected ? infoData?.info?.ip || "UNKNOWN" : 'Disconnected' : 'Disconnected'}</div>
                    </div>
                    <div className="flex align-items-center justify-content-center bg-blue-100 border-round"
                         style={{ width: '2.5rem', height: '2.5rem' }}>
                        <i className="pi pi-map-marker text-cyan-500 text-xl" />
                    </div>
                </div>
                <TimeAgo date={lastStatusUpdate} />
            </div>
        </div>
        <div className="col-12 lg:col-6 xl:col-3">
            <div className="card mb-0">
                <div className="flex justify-content-between mb-3">
                    <div>
                        <span className="block text-500 font-medium mb-3">Round Trip Latency</span>
                        <div
                            className={"text-900 font-medium text-xl "  + (isConnected ? infoData?.connected ? infoData?.roundTripLatencyMS : 'text-red-600' : 'text-red-600')}>{isConnected ? infoData?.connected ? infoData?.roundTripLatencyMS || "UNKNOWN" : 'Disconnected' : 'Disconnected'}</div>
                    </div>
                    <div className="flex align-items-center justify-content-center bg-blue-100 border-round"
                         style={{ width: '2.5rem', height: '2.5rem' }}>
                        <i className="pi pi-bolt text-cyan-500 text-xl" />
                    </div>
                </div>
                <TimeAgo date={lastStatusUpdate} />
            </div>
        </div>
        <div className="col-12 lg:col-6 xl:col-3">
            <div className="card mb-0">
                <div className="flex justify-content-between mb-3">
                    <div>
                        <span className="block text-500 font-medium mb-3">Network Latency</span>
                        <div
                            className={"text-900 font-medium text-xl "  + (isConnected ? infoData?.connected ? infoData?.networkLatencyMS : 'text-red-600' : 'text-red-600')}>{isConnected ? infoData?.connected ? infoData?.networkLatencyMS || "UNKNOWN" : 'Disconnected' : 'Disconnected'}</div>
                    </div>
                    <div className="flex align-items-center justify-content-center bg-blue-100 border-round"
                         style={{ width: '2.5rem', height: '2.5rem' }}>
                        <i className="pi pi-wifi text-cyan-500 text-xl" />
                    </div>
                </div>
                <TimeAgo date={lastStatusUpdate} />
            </div>
        </div>
        <div className="col-12 lg:col-6 xl:col-3">
            <div className="card mb-0">
                <div className="flex justify-content-between mb-3">
                    <div>
                        <span className="block text-500 font-medium mb-3">Total Messages</span>
                        <div
                            className={"text-900 font-medium text-xl "  + (isConnected ? infoData?.connected ? infoData?.info?.totalMessages : 'text-red-600' : 'text-red-600')}>{isConnected ? infoData?.connected ? infoData?.info?.totalMessages || "UNKNOWN" : 'Disconnected' : 'Disconnected'}</div>
                    </div>
                    <div className="flex align-items-center justify-content-center bg-blue-100 border-round"
                         style={{ width: '2.5rem', height: '2.5rem' }}>
                        <i className="pi pi-wifi text-cyan-500 text-xl" />
                    </div>
                </div>
                <TimeAgo date={lastStatusUpdate} />
            </div>
        </div>
        </div>);
};


export default Dashboard;
