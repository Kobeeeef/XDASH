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

const totalMapSizeXInches = 651;
const totalMapSizeYInches = 323;
const defaultInchesPerSquare = 10;

const Dashboard = () => {
    const { isConnected, lastConnectionUpdate, sendMessageAndWaitForCondition } = useContext(WebsocketContext);
    const [statusData, setStatusData] = useState({});
    const [lastStatusUpdate, setLastStatusUpdate] = useState(new Date());
    const [inchesPerSquare, setInchesPerSquare] = useState(defaultInchesPerSquare);
    const [resize, setResize] = useState(inchesPerSquare);
    const [status, setStatus] = useState('STANDBY');
    const [robotLocation, setRobotLocation] = useState([2, 1]);

    const [path, setPath] = useState([[2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7], [2, 8], [2, 9], [2, 10], [2, 11], [2, 12], [2, 13], [2, 14], [2, 15], [2, 16], [2, 17], [2, 18], [2, 19], [2, 20], [2, 21], [2, 22], [2, 23], [2, 24], [2, 25], [3, 25], [3, 26], [3, 27], [3, 28], [3, 29], [3, 30], [3, 31], [3, 32], [3, 33], [3, 34], [3, 35], [3, 36], [3, 37], [3, 38], [3, 39], [3, 40], [3, 41], [3, 42], [3, 43], [3, 44], [3, 45], [3, 46], [3, 47], [3, 48], [3, 49], [3, 50], [3, 51], [3, 52], [3, 53], [3, 54], [3, 55], [3, 56], [3, 57], [3, 58], [3, 59], [3, 60], [3, 61], [3, 62], [3, 63], [3, 64], [3, 65], [3, 66], [3, 67], [3, 68], [3, 69], [4, 69], [4, 70], [5, 70], [5, 71], [6, 71], [6, 72], [7, 72], [7, 73], [8, 73], [8, 74], [9, 74], [9, 75], [10, 75], [10, 76], [11, 76], [11, 77], [12, 77], [12, 78], [13, 78], [13, 79], [14, 79], [14, 80], [15, 80], [15, 81], [16, 81], [16, 82], [17, 82], [17, 83], [18, 83], [18, 84], [19, 84], [19, 85], [20, 85], [20, 86], [21, 86], [21, 87], [22, 87], [22, 88], [23, 88], [23, 89], [24, 89], [24, 90], [25, 90]]);

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


    const goalLocation = [25, 90]; // Goal location
    const obstacles = [[44, 106], [31, 31], [46, 74], [54, 112], [54, 122], [29, 105], [2, 67], [13, 69], [62, 73], [61, 25], [39, 126], [29, 106], [26, 73], [7, 108], [53, 29], [50, 126], [47, 11], [31, 48], [46, 44], [52, 129], [61, 57], [51, 36], [56, 112], [50, 48], [16, 63], [55, 23], [47, 44], [11, 22], [48, 27], [9, 69], [34, 87], [34, 93], [21, 122], [55, 84], [25, 108], [21, 7], [52, 75], [51, 26], [19, 122], [29, 5], [57, 56], [45, 8], [28, 109], [45, 29], [53, 49], [10, 83], [50, 111], [13, 61], [34, 83], [36, 54], [56, 96], [6, 41], [16, 44], [19, 71], [6, 44], [62, 66], [51, 10], [17, 23], [37, 1], [2, 122], [2, 26], [13, 46], [54, 61], [55, 126], [33, 63], [45, 94], [6, 117], [13, 124], [25, 68], [22, 126], [27, 10], [37, 113], [49, 117], [31, 128], [53, 66], [15, 24], [54, 27], [46, 50], [44, 7], [39, 103], [38, 97], [63, 127], [24, 106], [24, 22], [25, 127], [60, 23], [0, 35], [0, 35], [33, 77], [51, 81], [28, 81], [51, 66], [31, 117], [57, 80], [15, 35], [3, 4], [57, 72], [4, 64], [55, 10], [5, 128]];


    useEffect(() => {
        let intervalId;

        // Only start moving the robot if the status is NAVIGATING and there is a path to follow
        if (status === 'NAVIGATING' && path.length > 0) {
            const moveRobot = () => {
                const nextPosition = path[0]; // Get the next position from the path
                setRobotLocation(nextPosition); // Move the robot to the next position
                setPath((prevPath) => prevPath.slice(1)); // Remove the position from the path
            };

            intervalId = setInterval(() => {
                if (path.length > 0) {
                    moveRobot();
                } else {
                    clearInterval(intervalId); // Clear the interval when path is empty
                    setStatus('STANDBY'); // Stop moving when the path is completed

                }
            }, 50); // Move every 1 second
        }
        if(path.length === 0) {setStatus('STANDBY');}

        // Cleanup interval on component unmount or when status/path changes
        return () => clearInterval(intervalId);
    }, [status, path.length]); // Listen to changes in `status` and `path.length`

    const handleStartNavigation = () => {
        if (path.length > 0) {
            setStatus('NAVIGATING'); // Set the status to NAVIGATING when starting the path
        }
    };


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
            {/*<div className="col-12 hidden">*/}
            {/*    <div className="card mb-0">*/}
            {/*        <div className={'grid mb-0'}>*/}
            {/*            <div className={'col-12 lg:col-6'}>*/}
            {/*                <Button style={{ width: '100%' }} label={'Move to Closest'} severity={'danger'}*/}
            {/*                        size={'large'}*/}
            {/*                        loading={true} />*/}
            {/*            </div>*/}
            {/*            <div className={'col-12 lg:col-6'}>*/}
            {/*                <Button style={{ width: '100%' }} label={'Point to Closest'} severity={'danger'}*/}
            {/*                        size={'large'}*/}
            {/*                        loading={true} />*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
            {/*<div className="col-12 hidden">*/}
            {/*    <div className="card mb-0">*/}
            {/*        <div className="w-full bg-gray-200">*/}
            {/*            <ProbabilityMap robotImagePath={'/images/logo/favicon.ico'}*/}
            {/*                            initialRobotPosition={initialRobotPosition}*/}
            {/*                            initialGamePieces={gamePieces} />*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
            <div className="col-12">
                <div className="card mb-0">
                    <div className="grid mb-3">
                        <div className="col-12 lg:col-4">

                            <label htmlFor="minmax-buttons" className="font-bold block mb-2">Inches Per Square</label>
                            <InputNumber suffix={' Inches'} className={'w-full'} inputId="minmax-buttons" min={1}
                                         max={Math.min(totalMapSizeXInches, totalMapSizeYInches)}
                                         value={inchesPerSquare}
                                         onValueChange={(e) => {
                                             setInchesPerSquare(e.value);
                                             setResize(e.value);
                                         }} showButtons

                            />
                        </div>
                        <div className="col-12 lg:col-4">

                            <label htmlFor="minmax-buttons" className="font-bold block mb-2">Reset Settings</label>
                            <Button className={'w-full'} label={'Reset'}
                                    onClick={() => {
                                        setInchesPerSquare(defaultInchesPerSquare);
                                        setResize(defaultInchesPerSquare);
                                        handleStartNavigation();
                                    }}
                            />
                        </div>
                        <div className="col-12 lg:col-4">
                            <label htmlFor="minmax-buttons" className="font-bold block mb-2">Inches Per Square
                                Zoom</label>
                            <InputNumber suffix={' Inches'} className={'w-full'} inputId="minmax-buttons"
                                         min={inchesPerSquare}
                                         max={Math.min(totalMapSizeXInches, totalMapSizeYInches)} value={resize}
                                         onValueChange={(e) => setResize(e.value)} showButtons

                            />
                        </div>
                        <div className={'col-12 lg:col-6'}>
                            <Button style={{ width: '100%' }} label={'Move to Closest'} severity={'success'}
                                    size={'large'}
                                    loading={false} />
                        </div>
                        <div className={'col-12 lg:col-6'}>
                            <Button style={{ width: '100%' }} label={'Point to Closest'} severity={'success'}
                                    size={'large'}
                                    loading={false} />
                        </div>
                    </div>
                    <div className="w-full bg-gray-200">
                        <Grid
                            status={status}
                            resizedInchesPerSquare={resize}
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
