/* eslint-disable @next/next/no-img-element */
'use client';


import React, { useContext, useEffect, useState } from 'react';
import { ConfirmDialog } from 'primereact/confirmdialog';

import { WebsocketContext } from '../../../layout/context/websocketcontext';
import TimeAgo from '../../../components/TimeAgo';
import ProbabilityMap from '../../../components/ProbabilityMap';
import { Button } from 'primereact/button';

const Dashboard = () => {
    const { isConnected, lastConnectionUpdate, sendMessageAndWaitForCondition } = useContext(WebsocketContext);
    const [statusData, setStatusData] = useState({});
    const [lastStatusUpdate, setLastStatusUpdate] = useState(new Date());
    const initialRobotPosition = { x: 0, y: 0 };
    const [gamePieces, setGamePieces] = useState(
        Array.from({ length: 5 }, (_, id) => ({
            id: id + 1,
            position: { x: Math.random() * 600 - 300, y: Math.random() * 400 - 200 },  // Random x, y between -300 and 300, -200 and 200
            probability: Math.random() * 100  // Random probability between 0 and 100
        }))
    );


    useEffect(() => {
        const intervalId = setInterval(() => {
            if (isConnected) {
                sendMessageAndWaitForCondition({ type: 'XTABLES-DATA' }, (m) => m.type === 'XTABLES-DATA')
                    .then((message) => {
                        setStatusData((a) => {
                            if (message.message.connected !== a?.connected) setLastStatusUpdate(new Date());
                            return message.message;
                        });
                    })
                    .catch(() => {
                    });
            }
        }, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, [isConnected, sendMessageAndWaitForCondition]);


    // @ts-ignore
    return (
        <div className="grid fadeIn">
            <ConfirmDialog />
            <div className="col-12 lg:col-6 xl:col-4">
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
            <div className="col-12 lg:col-6 xl:col-4">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">XTABLES Status</span>
                            <div
                                className="text-900 font-medium text-xl">{isConnected ? (statusData?.connected ? 'Connected' : 'Disconnected') : 'Disconnected'}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round"
                             style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-table text-blue-500 text-xl" />
                        </div>
                    </div>
                    <TimeAgo date={lastStatusUpdate} />
                </div>
            </div>

            <div className="col-12 lg:col-6 xl:col-4">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Status</span>
                            <div
                                className="text-900 font-medium text-xl">{isConnected ? (statusData?.connected ? 1 || 'Unknown' : 'Disconnected') : 'Disconnected'}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round"
                             style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-hammer text-cyan-500 text-xl" />
                        </div>
                    </div>
                    <TimeAgo date={lastStatusUpdate} />
                </div>
            </div>
            <div className="col-12">
                <div className="card mb-0">
                    <div className={'grid mb-0'}>
                        <div className={'col-12 lg:col-6'}>
                        <Button style={{ width: "100%"}} label={'Move to Closest'} severity={'danger'} size={'large'}
                                loading={true} />
                        </div>
                        <div className={'col-12 lg:col-6'}>
                        <Button style={{ width: "100%"}} label={'Point to Closest'} severity={'danger'} size={'large'}
                                loading={true} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="card mb-0">
                    <div className="w-full bg-gray-200">
                        <ProbabilityMap robotImagePath={'/images/logo/favicon.ico'}
                                        initialRobotPosition={initialRobotPosition}
                                        initialGamePieces={gamePieces} />
                    </div>
                </div>
            </div>
            <div className="col-12 lg:col-6">
                <div className="card mb-0">
                </div>
            </div>
            <div className="col-12 lg:col-6">
                <div className="card mb-0">
                </div>
            </div>

        </div>
    );
};


export default Dashboard;
