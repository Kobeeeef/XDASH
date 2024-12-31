/* eslint-disable @next/next/no-img-element */
'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { WebsocketContext } from '../../../../layout/context/websocketcontext';
import TimeAgo from '../../../../components/TimeAgo';
import Loader from '../../../../components/XBOTLoader';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { ToggleButton } from 'primereact/togglebutton';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Password } from 'primereact/password';
import { InputNumber } from 'primereact/inputnumber';
import { Slider } from 'primereact/slider';
import { Toast } from 'primereact/toast';
import { playErrorNotificationSound, playSuccessNotificationSound } from '../../../../utilities/notification';


const Dashboard = () => {
    const toast = useRef(null);
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
    const [message, setMessage] = useState('Start the scanner to begin XCASTER subnet scanning.');
    const [totalScanned, setTotalScanned] = useState(0);

    const [threads, setThreads] = useState(10);
    const [minMax, setMinMax] = useState([1, 256]);
    const [port, setPort] = useState(4567);
    const [subnet, setSubnet] = useState('10.4.88');

    useEffect(() => {
        const listener = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'XCASTER-SUBNET-SCAN') {
                const msg = JSON.parse(data.message);
                const status = msg.status;
                setStatus(status);
                setRunning(msg.running);
                setMessage(msg.message);
                console.log(msg);
                if (status === 'CHECKING') {
                    setTotalScanned(a => a + 1);
                } else if (status === 'SHUTDOWN') {
                    setRunning(false);
                    setLoading(false);
                } else if (status === 'FINISHED' || status === 'STOPPING') {
                    setLoading(true);
                } else if (status === 'FOUND') {
                    playSuccessNotificationSound();
                    setData(d => [...d, {
                        hostname: msg?.hostname,
                        address: msg?.address,
                        password: msg?.password,
                        username: msg?.username
                    }]);
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

    function resolveSubnet() {
        setLoading(true);
        sendMessageAndWaitForCondition({
            type: 'NETWORK-SUBNET-GET'
        }, (m) => m.type === 'NETWORK-SUBNET-GET').then((m) => {
            setLoading(false);
            if (m?.message?.success) {
                setSubnet(m?.message?.message);
                playSuccessNotificationSound();
            } else {
                playErrorNotificationSound();
                toast.current.show({
                    severity: 'error',
                    summary: 'Exception Occurred!',
                    detail: m?.message?.message ?? 'Unknown Exception...'
                });
            }
        }).catch((e) => {
            setLoading(false);
            playErrorNotificationSound();
            toast.current.show({
                severity: 'error',
                summary: 'Exception Occurred!',
                detail: e?.message || 'Unknown Exception...'
            });
        });
    }

    function startScanning() {
        setLoading(true);
        setRunning(true);
        setTotalScanned(0);
        setData([]);
        sendMessageAndWaitForCondition({
            type: 'XCASTER-START-SUBNET-SCAN',
            message: JSON.stringify({
                subnet: subnet,
                low: Math.min(minMax[0], minMax[1]),
                high: Math.max(minMax[0], minMax[1]),
                threads: threads,
                port: port
            })
        }, (m) => m.type === 'XCASTER-SUBNET-SCAN' && JSON.parse(m.message)?.status === 'STARTING').then(() => {
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }

    function stopScanning() {
        setLoading(true);
        sendMessageAndWaitForCondition({
            type: 'XCASTER-STOP-SUBNET-SCAN'
        }, (m) => {
            return m.type === 'XCASTER-SUBNET-SCAN' && JSON.parse(m.message)?.status === 'STOPPING';
        }).catch((e) => {
            console.log(e);
            setLoading(false);
        });
    }

    // @ts-ignore
    return (
        <div className="grid fadeIn">
            <Toast ref={toast} />
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

                <div className="card">
                    <div className={'grid'}>
                        <div className={'col-12'}>
                            <div>
                                <Accordion>
                                    <AccordionTab disabled={loading || !isConnected || running}
                                                  header="Additional Arguments">
                                        <div className={'grid'}>
                                            <div className={'col-12'}>
                                                <div className="p-inputgroup flex-1">
                                                    <InputText value={subnet}
                                                               onChange={(e) => setSubnet(e.target.value)}
                                                               disabled={loading || !isConnected || running}
                                                               placeholder="Network Subnet" />
                                                    <Button onClick={resolveSubnet} loading={loading}
                                                            disabled={!isConnected || running} label="Auto Resolve" />
                                                </div>
                                            </div>
                                            <div className={'col-12 lg:col-6'}>
                                                <label className="font-bold block mb-2">Threads</label>
                                                <InputNumber min={1} max={50} disabled={loading || !isConnected || running}
                                                             className={'w-full'}
                                                             onValueChange={(e) => setThreads(e.value)} value={threads}
                                                             showButtons buttonLayout="horizontal" />
                                            </div>
                                            <div className={'col-12 lg:col-6'}>
                                                <label className="font-bold block mb-2">Port</label>
                                                <InputNumber min={1023} max={65535} disabled={loading || !isConnected || running}
                                                             className={'w-full'}
                                                             onValueChange={(e) => setPort(e.value)} useGrouping={false}
                                                             value={port} buttonLayout="horizontal" />
                                            </div>
                                            <div className={'col-12'}>

                                                <div className={'justify-content-center'}>
                                                    <label className="font-bold block mb-2">Scan Range</label>
                                                    <div className="p-inputgroup flex-1">
                                                        <InputText readOnly={true} disabled={loading || !isConnected || running}
                                                                   value={minMax[0] ?? 0} className="w-full" />
                                                        <InputText readOnly={true} disabled={loading || !isConnected || running}
                                                                   value={minMax[1] ?? 0} className="w-full" />
                                                    </div>
                                                    <Slider disabled={loading || !isConnected || running} min={1} max={500}
                                                            range={true} value={minMax}
                                                            onChange={(e) => setMinMax(e.value)}
                                                            className="w-full" />
                                                </div>


                                            </div>
                                        </div>

                                    </AccordionTab>
                                </Accordion>
                            </div>
                        </div>
                        <div className={'col-12'}>
                            <div className={'grid align-items-center'}>
                                <div className={'col-2'}>
                                    <ToggleButton
                                        className="h-full w-full"
                                        onLabel={'Stop Scanner'}
                                        offLabel={'Start Scanner'}
                                        checked={running}
                                        disabled={loading || !isConnected}
                                        onClick={() => {
                                            if (running) {
                                                stopScanning();
                                            } else {
                                                startScanning();
                                            }
                                        }}
                                    />
                                </div>
                                <div className={'col-10'}>
                                    <div
                                        className={'card-small w-full h-full flex align-items-center justify-content-center'}>
                                        <code className={
                                            'text-sm ' +
                                            (status === 'SHUTDOWN' || status === 'UNAVAILABLE' || status === 'FAILED' || !isConnected
                                                ? 'text-red-600'
                                                : status === 'CHECKING' || status === 'STARTING'
                                                    ? 'text-yellow-600 animate-pulse-fast'
                                                    : status === 'FOUND' || status === 'FINISHED' || status === 'QUEUED'
                                                        ? 'text-green-600'
                                                        : status === 'STOPPING'
                                                            ? 'text-red-600 animate-pulse-fast'
                                                            : '')
                                        }>
                                            {message}
                                        </code>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

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
                        } header="Address" style={{ width: '25%' }} />
                        <Column frozen={true} field="username" header="Username" style={{ width: '25%' }} />
                        <Column body={(d) =>
                            <Password promptLabel={'N/A'} toggleMask={true} variant={'filled'} feedback={false}
                                      readOnly={true} value={d?.password} />
                        } header="Password" style={{ width: '25%' }} />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};


export default Dashboard;
