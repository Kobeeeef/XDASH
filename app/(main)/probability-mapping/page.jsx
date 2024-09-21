/* eslint-disable @next/next/no-img-element */
'use client';


import React, { useContext, useEffect, useState } from 'react';
import { ConfirmDialog } from 'primereact/confirmdialog';

import { WebsocketContext } from '../../../layout/context/websocketcontext';
import TimeAgo from '../../../components/TimeAgo';
import { Button } from 'primereact/button';
import Grid from '../../../components/ProbabilityMap';
import ProbabilityMap from '../../../components/prob2';

const Dashboard = () => {
    const { isConnected, lastConnectionUpdate, sendMessageAndWaitForCondition } = useContext(WebsocketContext);
    const [statusData, setStatusData] = useState({});
    const [lastStatusUpdate, setLastStatusUpdate] = useState(new Date());


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
    const inchesPerSquare = 10;
    const totalMapSizeXInches = 651;
    const totalMapSizeYInches = 323;
    const robotLocation = [2, 1]; // Robot's starting position
    const goalLocation = [10, 30]; // Goal location
    const obstacles = [
        [30, 50], [28, 63], [27, 32], [15, 48], [15, 13], [11, 61],
        [25, 39], [16, 53], [4, 28], [1, 45], [10, 61], [11, 42],
        [2, 23], [28, 42], [1, 48]
    ];

    const path = [
        [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7], [2, 8], [2, 9], [2, 10],
        [2, 11], [2, 12], [2, 13], [2, 14], [2, 15], [2, 16], [2, 17], [2, 18], [2, 19],
        [2, 20], [2, 21], [2, 22], [3, 22], [3, 23], [3, 24], [3, 25], [3, 26], [3, 27],
        [3, 28], [3, 29], [3, 30], [4, 30], [5, 30], [6, 30], [7, 30], [8, 30], [9, 30],
        [10, 30]
    ];


    const initialRobotPosition = { x: 0, y: 0 };
    const [gamePieces, setGamePieces] = useState(
        Array.from({ length: 5 }, (_, id) => ({
            id: id + 1,
            position: { x: Math.random() * 600 - 300, y: Math.random() * 400 - 200 },  // Random x, y between -300 and 300, -200 and 200
            probability: Math.random() * 100  // Random probability between 0 and 100
        }))
    );
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
                            <Button style={{ width: "100%" }} label={'Move to Closest'} severity={'danger'}
                                    size={'large'}
                                    loading={true} />
                        </div>
                        <div className={'col-12 lg:col-6'}>
                            <Button style={{ width: "100%" }} label={'Point to Closest'} severity={'danger'}
                                    size={'large'}
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
            <div className="col-12">
                <div className="card mb-0">
                    <div className="w-full bg-gray-200">
                        <Grid
                            inchesPerSquare={inchesPerSquare}
                            totalMapSizeXInches={totalMapSizeXInches}
                            totalMapSizeYInches={totalMapSizeYInches}
                            robotLocation={robotLocation}
                            goalLocation={goalLocation}
                            obstacles={obstacles}
                            path={path}
                        />

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
