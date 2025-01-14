/* eslint-disable @next/next/no-img-element */
'use client';


import React, { useContext, useEffect, useState } from 'react';
import { ConfirmDialog } from 'primereact/confirmdialog';

import { WebsocketContext } from '../../../layout/context/websocketcontext';
import TimeAgo from '../../../components/TimeAgo';
import { Button } from 'primereact/button';
import Grid from '../../../components/ProbabilityMap';
import ProbabilityMap from '../../../components/prob2';
import { InputNumber } from 'primereact/inputnumber';
import HeatMap from '../../../components/HeatMap';

const totalMapSizeXInches = 651;
const totalMapSizeYInches = 323;
const defaultInchesPerSquare = 10;

const Dashboard = () => {
    const { isConnected, lastConnectionUpdate, sendMessageAndWaitForCondition } = useContext(WebsocketContext);
    const [XTablesStatus, setXTablesStatus] = useState("DISCONNECTED");
    const [lastStatusUpdate, setLastStatusUpdate] = useState(new Date());
    const [status, setStatus] = useState('STANDBY');
    const [points, setPoints] = useState([])
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (isConnected) {
                sendMessageAndWaitForCondition({ type: 'XTABLES-CONNECTION-DETAILS' }, (m) => m.type === 'XTABLES-CONNECTION-DETAILS')
                    .then((message) => {
                        setXTablesStatus(message?.message?.message)
                        setLastStatusUpdate(new Date());
                    })
                    .catch(() => {
                    });
            }
        }, 500);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, [isConnected, sendMessageAndWaitForCondition]);

    useEffect(() => {
        // Function to generate random points and update the heat
        const generateRandomPoint = () => {
            setPoints(prevPoints => {
                // Create a new array with updated points
                const newPoints = prevPoints.map(point => {
                    // Decrease heat over time
                    const newHeat = Math.max(0, point.heat - 2); // Heat decreases by 2 every time

                    // Optionally, generate new random x, y, and size
                    const newX = Math.random() * 1600;
                    const newY = Math.random() * 600;
                    const newSize = Math.random() * 30 + 5; // Random size between 5 and 35
                    const newColor = `hsl(${Math.random() * 360}, 100%, 50%)`; // Random color in HSL

                    return {
                        ...point,
                        x: newX,
                        y: newY,
                        heat: newHeat,
                        size: newSize,
                        color: newColor,
                    };
                });

                // Add a new random point with initial values
                newPoints.push({
                    x: Math.random() * 1600,
                    y: Math.random() * 600,
                    heat: 100, // Start with max heat
                    size: Math.random() * 30 + 5, // Random size
                    color: `hsl(${Math.random() * 360}, 100%, 50%)`, // Random color
                });

                return newPoints;
            });
        };

        // Set an interval to update the points and decrease heat
        const intervalId = setInterval(generateRandomPoint, 1000); // Every 500ms

        // Clean up the interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

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
                            <span className="block text-500 font-medium mb-3">XTABLES</span>
                            <div
                                className="text-900 font-medium text-xl">{isConnected ? (XTablesStatus) : 'Disconnected'}</div>
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
                                className={('text-900 text-xl ') + (true ? status === 'NAVIGATING' ? 'font-bold text-green-600 animate-pulse' : status === 'PATHFINDING' ? 'font-bold text-yellow-600 animate-pulse-fast' : ' font-bold text-gray-400' : 'text-white')}>{true ? (status || 'Unknown') : 'Disconnected'}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round"
                             style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-arrows-alt text-blue-500 text-xl" />
                        </div>
                    </div>
                    <TimeAgo date={lastStatusUpdate} />
                </div>
            </div>



            <div className="col-12">
                <div className="card mb-0" style={{ width: "100%", height: "100%" }}>
                    <HeatMap width={1600} height={600} points={points} />
                </div>
            </div>

        </div>
    );
};


export default Dashboard;
