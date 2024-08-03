/* eslint-disable @next/next/no-img-element */
'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import React, { useContext, useEffect, useState } from 'react';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { WebsocketContext } from '../../../../layout/context/websocketcontext';
import TimeAgo from '../../../../components/TimeAgo';
import Loader from '../../../../components/XBOTLoader';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { ToggleButton } from 'primereact/togglebutton';


const Dashboard = () => {
    const {
        isConnected,
        lastConnectionUpdate,
        sendMessageAndWaitForCondition,
        socket
    } = useContext(WebsocketContext);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [data, setData] = useState([]);
    const [status, setStatus] = useState('SHUTDOWN');
    const [running, setRunning] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('Start the scanner to begin subnet scanning.');
    const [totalScanned, setTotalScanned] = useState(0);
    useEffect(() => {
        const listener = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'NETWORK-SUBNET-SCAN') {
                const msg = JSON.parse(data.message);
                const status = msg.status;
                setStatus(status);
                setRunning(msg.running);
                setMessage(msg.message);
                if (status === 'CHECKING') {
                    setTotalScanned(a => a + 1);
                } else if (status === 'SHUTDOWN') {
                    setRunning(false);
                    setLoading(false);
                } else if (status === 'FINISHED' || status === 'STOPPING') {
                    setLoading(true);
                } else if (status === 'FOUND') {
                    setData(d => [...d, { hostname: msg?.hostname, address: msg?.address }]);
                }
            }
        };
        if (socket.current) {
            socket.current.addEventListener('message', listener);
        }
        return () => {
            socket.current.removeEventListener('message', listener);
        };
    }, [socket.current, running]);

    function startScanning() {
        setLoading(true);
        setRunning(true);
        setTotalScanned(0);
        setData([]);
        sendMessageAndWaitForCondition({
            type: 'NETWORK-START-SUBNET-SCAN'
        }, (m) => m.type === 'NETWORK-SUBNET-SCAN' && JSON.parse(m.message)?.status === 'STARTING').then(() => {
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }

    function stopScanning() {
        setLoading(true);
        sendMessageAndWaitForCondition({
            type: 'NETWORK-STOP-SUBNET-SCAN'
        }, (m) => {
            return m.type === 'NETWORK-SUBNET-SCAN' && JSON.parse(m.message)?.status === 'STOPPING';
        }).catch((e) => {
            console.log(e);
            setLoading(false);
        });
    }

    // @ts-ignore
    return (
        <div className="grid fadeIn">
            <ConfirmDialog />
            <div className="col-12 lg:col-6 xl:col-3">
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

            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Total Found</span>
                            <div
                                className="text-900 font-medium text-xl">{isConnected ? data?.length ?? 0 : 'Disconnected'}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round"
                             style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-android text-cyan-500 text-xl" />
                        </div>
                    </div>
                    <TimeAgo date={lastUpdate} />
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Total Scanned</span>
                            <div
                                className={'text-900 font-medium text-xl '}>{isConnected ? totalScanned ?? 0 : 'Disconnected'}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round"
                             style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-android text-cyan-500 text-xl" />
                        </div>
                    </div>
                    <TimeAgo date={lastUpdate} />
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Current Status</span>
                            <div
                                className={'text-900 font-medium text-xl ' + (status === 'SHUTDOWN' || status === 'UNAVAILABLE' || status === 'FAILED' || !isConnected ? 'text-red-600' : status === 'CHECKING' || status === 'STARTING' ? 'text-yellow-600 animate-pulse-fast' : status === 'FOUND' || status === 'FINISHED' || status === 'QUEUED' ? 'text-green-600' : status === 'STOPPING' ? 'text-red-600 animate-pulse-fast' : '')}>{isConnected ? status ?? 'Unknown' : 'Disconnected'}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round"
                             style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-android text-cyan-500 text-xl" />
                        </div>
                    </div>
                    <TimeAgo date={lastUpdate} />
                </div>
            </div>

            <div className={'col-12'}>

                <div className="card flex items-center" >
                        <ToggleButton className="mr-2 " onLabel={'Stop Scanner'} offLabel={'Start Scanner'}
                                      checked={running} disabled={loading || !isConnected} onClick={(event) => {
                            if (running) {
                                stopScanning();
                            } else {
                                startScanning();
                            }
                        }} />
                    <span className={' flex-1'} style={{
                        background: 'var(--surface-card);',
                        border: '1px solid var(--surface-border);',
                        padding: '1rem;',
                        'margin-bottom': '0rem;',
                        'box-shadow': 'var(--card-shadow);',
                        'border-radius': '12px;',
                    }}><span className={"text-sm "+ (status === 'SHUTDOWN' || status === 'UNAVAILABLE' || status === 'FAILED' || !isConnected ? 'text-red-600' : status === 'CHECKING' || status === 'STARTING' ? 'text-yellow-600 animate-pulse-fast' : status === 'FOUND' || status === 'FINISHED' || status === 'QUEUED' ? 'text-green-600' : status === 'STOPPING' ? 'text-red-600 animate-pulse-fast' : '')}>{message}</span></span>

                </div>
            </div>
            <div className={'col-12'}>
                <div className="card">
                    <DataTable
                        size={'normal'}
                        paginator={isConnected && data?.length > 0}
                        showHeaders={isConnected && data?.length > 0}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        removableSort value={isConnected ? data : []}
                        emptyMessage={Loader({ message: isConnected ? 'No devices found on the network' : 'Connecting to backend' })}
                        rows={5}>
                        <Column frozen={true} field="hostname" filter header="Hostname" style={{ width: '50%' }} />
                        <Column body={(d) =>
                            <Button tooltip={'Open in new tab'}
                                    tooltipOptions={{ showDelay: 100, position: 'top', mouseTrack: true }}
                                    label={d?.address} link
                                    onClick={() => window.open('http://' + d?.address, '_blank')} />
                        } header="Address" style={{ width: '50%' }} />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};


export default Dashboard;
