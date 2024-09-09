/* eslint-disable @next/next/no-img-element */
'use client';

import { Column } from 'primereact/column';

import { TreeTable } from 'primereact/treetable';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import { Terminal } from 'primereact/terminal';
import { TerminalService } from 'primereact/terminalservice';
import { WebsocketContext } from '../../../layout/context/websocketcontext';
import TimeAgo from '../../../components/TimeAgo';
import validateKey from '../../../utilities/KeyValidator';
import Loader from '../../../components/XBOTLoader';
import ProbabilityMap from '../../../components/ProbabilityMap';

const Dashboard = () => {
    const { isConnected, lastConnectionUpdate, sendMessageAndWaitForCondition } = useContext(WebsocketContext);
    const [statusData, setStatusData] = useState({});
    const [lastStatusUpdate, setLastStatusUpdate] = useState(new Date());
    const [lastDataSizeUpdate, setLastDataSizeUpdate] = useState(new Date());
    const initialRobotPosition = { x: 0, y: 0 };
    const [gamePieces, setGamePieces] = useState(
        Array.from({ length: 5 }, (_, id) => ({
            id: id + 1,
            position: { x: Math.random() * 600 - 300, y: Math.random() * 400 - 200 },  // Random x, y between -300 and 300, -200 and 200
            probability: Math.random() * 100,  // Random probability between 0 and 100
        }))
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setGamePieces((prevGamePieces) =>
                prevGamePieces.map((piece, index) => {
                    const newProbability =
                        index === prevGamePieces.length - 1
                            ? Math.max(piece.probability - 1, 0)  // Slowly decrease probability for the last piece
                            : Math.random() * 100;  // Randomize for others

                    return {
                        ...piece,
                        position: { x: Math.random() * 600 - 300, y: Math.random() * 400 - 200 },  // Random x, y
                        probability: newProbability,
                    };
                })
            );
        }, 1000);  // Update every 1 second

        return () => clearInterval(interval);  // Cleanup on component unmount
    }, []);
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
                                className="text-900 font-medium text-xl">{isConnected ? (statusData?.connected ? getStringSize(statusData?.json) || 'Unknown' : 'Disconnected') : 'Disconnected'}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round"
                             style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-hammer text-cyan-500 text-xl" />
                        </div>
                    </div>
                    <TimeAgo date={lastDataSizeUpdate} />
                </div>
            </div>
            <div className="col-12">
                <div className="card mb-0">
                    <div className="w-full bg-gray-200">
                        <ProbabilityMap robotImagePath={"/images/logo/favicon.ico"} initialRobotPosition={initialRobotPosition}
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
