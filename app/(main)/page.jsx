'use client';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { LayoutContext } from '../../layout/context/layoutcontext';
import { Tag } from 'primereact/tag';
import { WebsocketContext } from '@/layout/context/websocketcontext';
import TimeAgo from '@/components/TimeAgo';

import { Toast } from 'primereact/toast';

import { useRouter } from 'next/navigation';
import LogComponent from '../../utilities/Ansi';
import Loader from '../../components/XBOTLoader';
import { Dialog } from 'primereact/dialog';
import { Image } from 'primereact/image';
import {
    playErrorNotificationSound,
    playNotificationSound,
    playSuccessNotificationSound
} from '../../utilities/notification';
import { Divider } from 'primereact/divider';
import { Badge } from 'primereact/badge';
import { InputText } from 'primereact/inputtext';
import { Exception } from 'sass';


const Dashboard = () => {
    const toast = useRef(null);
    const [lastLogUpdate, setLastLogUpdate] = useState(new Date());
    const [loadingStates, setLoadingStates] = useState({});
    const { isConnected, lastConnectionUpdate, sendMessageAndWaitForCondition } = useContext(WebsocketContext);
    const [xtableStatus, setXtableStatus] = useState("UNKNOWN");
    const [devicesData, setDevicesData] = useState([]);
    const [lastXTablesStatusUpdate, setLastXTablesStatusUpdate] = useState(new Date());
    const [lastDevicesUpdate, setLastDevicesUpdate] = useState(new Date());
    const [logs, setLogs] = useState([]);
    const router = useRouter();
    const [serviceNumber, setServiceNumber] = useState(1);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [addDeviceDialogVisible, setAddDeviceDialogVisible] = useState(false);
    const [serviceRequestChildren, setServiceRequestChildren] = useState(null);
    const [stopRequest, setStopRequest] = useState(false);
    const [loading, setLoading] = useState(false);
    const [timeoutIDs, setTimeoutIDs] = useState([]);
    const [, setLock2] = useState(false);

    const [addDeviceHostnameInput, setAddDeviceHostnameInput] = useState(null)
    const [addDeviceUsernameInput, setAddDeviceUsernameInput] = useState(null)
    const [addDevicePasswordInput, setAddDevicePasswordInput] = useState(null)
    const [addDeviceAddressInput, setAddDeviceAddressInput] = useState(null)



    useEffect(() => {
        const intervalId = setInterval(() => {
            if (isConnected) {
                sendMessageAndWaitForCondition({ type: 'DEVICES-DATA' }, (m) => m.type === 'DEVICES-DATA')
                    .then((message) => {

                        setXtableStatus(
                             message?.message?.xtablesConnectedStatus || "UNKNOWN"
                        );
                        setLogs((a) => {
                            if (a.toString() !== message?.message?.logs?.toString()) setLastLogUpdate(new Date());
                            return message?.message?.logs ?? [];
                        });
                        setDevicesData((a) => {
                            const json = JSON.parse(message?.message?.devices ?? []);
                            if (json?.length !== a?.length) {
                                setLastDevicesUpdate(new Date());
                                setLock2(a => {
                                    if(a) {
                                        playNotificationSound()
                                    }
                                    return true;
                                })
                            }
                            return json;
                        });
                    })
                    .catch(() => {
                    });
            }
        }, 100);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, [isConnected, sendMessageAndWaitForCondition]);
    function sendAddDeviceData() {
        setLoading(true);

        sendMessageAndWaitForCondition({
            type: 'DEVICE-ADD',
            message: JSON.stringify({
                hostname: addDeviceHostnameInput,
                username: addDeviceUsernameInput,
                address: addDeviceAddressInput,
                password: addDevicePasswordInput
            })
        }, (m) => m.type === "DEVICE-ADD", 2000)
            .then((m) => {
                if(m.message?.success) {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Machine Registered!',
                        detail: m?.message?.response ?? "The machine has been registered!"
                    });
                    playSuccessNotificationSound()
                    setAddDeviceDialogVisible(false)
                } else {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Failed to register!',
                        detail: m?.message?.response ?? "The machine failed to register!"
                    });
                    playErrorNotificationSound()
                }

                setLoading(false);
            })
            .catch((e) => {
                toast.current.show({
                    severity: 'error',
                    summary: 'Exception Occurred!',
                    detail: e?.message || 'Unknown Exception...'
                });
                playErrorNotificationSound()
                setLoading(false);
            });
    }
    const handleStop = () => {
        setStopRequest(true);
        setDialogVisible(false);
        setServiceNumber(1);
        timeoutIDs.forEach(id => {
            clearTimeout(id);
        });
    };

    const startScanning = () => {
        setStopRequest(false);
        setServiceNumber(1);
        setDialogVisible(true);
    };
    useEffect(() => {
        if (dialogVisible) {
            scanForDevices();
        }
    }, [serviceNumber, dialogVisible]);

    const scanForDevices = () => {
        setLoading(true);
        setServiceRequestChildren(Loader({ message: `Requesting service #${serviceNumber}` }));
        sendMessageAndWaitForCondition({
            type: 'DEVICES-SEARCH',
            message: serviceNumber
        }, (m) => m.type === 'DEVICES-SEARCH', 4000)
            .then((message) => {
                const data = message.message;
                if (data?.exists) {
                    setServiceRequestChildren(
                        <div className={'grid'}>
                            <div className="col-12">
                                <Image style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center'

                                }} alt={'XBOT ROBOTICS LOGO'}
                                       src={'/images/logo/logo.png'} />
                            </div>
                            <div className="col-3">
                                <div className="card mb-0">
                                    <div className="flex justify-content-between mb-3">
                                        <div>
                                            <span className="block text-500 font-medium mb-3">Machine Server</span>
                                            <div
                                                className={'text-900 font-medium text-xl text-green-600'}>{isConnected ? (data?.server ?? 'Unknown') : 'Unknown'}</div>
                                        </div>
                                        <div
                                            className="flex align-items-center justify-content-center bg-blue-100 border-round"
                                            style={{ width: '2.5rem', height: '2.5rem' }}>
                                            <i className="pi pi-chevron-circle-up text-blue-500 text-xl" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="card mb-0">
                                    <div className="flex justify-content-between mb-3">
                                        <div>
                                            <span className="block text-500 font-medium mb-3">Hostname</span>
                                            <div
                                                className={'text-900 font-medium text-xl text-green-600'}>{isConnected ? (data?.hostname ?? 'Unknown') : 'Unknown'}</div>

                                        </div>
                                        <div
                                            className="flex align-items-center justify-content-center bg-blue-100 border-round"
                                            style={{ width: '2.5rem', height: '2.5rem' }}>
                                            <i className="pi pi-address-book text-blue-500 text-xl" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="card mb-0">
                                    <div className="flex justify-content-between mb-3">
                                        <div>
                                            <span className="block text-500 font-medium mb-3">IP Address</span>
                                            <div
                                                className={'text-900 font-medium text-xl text-green-600'}>{isConnected ? (data?.address ?? 'Unknown') : 'Unknown'}</div>

                                        </div>
                                        <div
                                            className="flex align-items-center justify-content-center bg-blue-100 border-round"
                                            style={{ width: '2.5rem', height: '2.5rem' }}>
                                            <i className="pi pi-map-marker text-blue-500 text-xl" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="card mb-0">
                                    <div className="flex justify-content-between mb-3">
                                        <div>
                                            <span className="block text-500 font-medium mb-3">Status</span>
                                            <div
                                                className={'text-900 font-medium text-xl ' + (data?.status === 'CONNECTED' ? 'text-green-600' : data?.status === 'CONNECTING' ? 'text-yellow-500 animate-pulse-fast' : 'text-red-600 animate-pulse')}>{isConnected ? (data?.status ?? 'Unknown') : 'Unknown'}</div>
                                        </div>
                                        <div
                                            className="flex align-items-center justify-content-center bg-blue-100 border-round"
                                            style={{ width: '2.5rem', height: '2.5rem' }}>
                                            <i className="pi pi-chevron-circle-up text-blue-500 text-xl" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>);
                } else {
                    setServiceRequestChildren(Loader({ message: `Failed to find service #${serviceNumber}` }));
                }

                const id = setTimeout(() => {
                    if (!stopRequest) {
                        setServiceNumber(prev => prev + 1);
                    }
                }, data?.exists ? 5000 : 2000);
                setTimeoutIDs(ids => [...ids, id]);
                setLoading(false);
            }).catch((e) => {
            const errorMessage = e.message || 'An unexpected error occurred.';
            setServiceRequestChildren(Loader({ message: `Failed to find service #${serviceNumber}. Reason: ${errorMessage}` }));
            const id = setTimeout(() => {
                if (!stopRequest) {
                    setServiceNumber(prev => prev + 1);
                }
            }, 1000);
            setTimeoutIDs(ids => [...ids, id]);
            setLoading(false);
        });
    };
    return (
        <div className="grid fadeIn">
            <Toast ref={toast} />
            <Dialog maximizable={false} closable={false} maximized={false} header="Machine Auto Discovery"
                    visible={dialogVisible} onHide={handleStop}
                    footer={<Button className={'w-full'} label="Stop" onClick={handleStop} />}>
                {serviceRequestChildren}
            </Dialog>
            <Dialog draggable={false} style={{ 'width': '50%'}} maximizable={false} closable={true} maximized={false}
                    visible={addDeviceDialogVisible} onHide={() => setAddDeviceDialogVisible(false)}
                    footer={<Button className={'w-full'} label="Submit" disabled={!isConnected || !addDeviceUsernameInput || !addDevicePasswordInput || !addDeviceHostnameInput || !addDeviceAddressInput} loading={loading} onClick={sendAddDeviceData} />}>
                <Divider align="center">
                    <Badge value="Hostname"></Badge>
                </Divider>

                <InputText placeholder={'Machine Hostname'} className={'w-full'} value={addDeviceHostnameInput}
                           onChange={(e) => setAddDeviceHostnameInput(e.target.value)} />


                <Divider align="center">
                    <Badge value="Address"></Badge>
                </Divider>

                <InputText placeholder={'Machine Address'} className={'w-full'} value={addDeviceAddressInput}
                           onChange={(e) => setAddDeviceAddressInput(e.target.value)} />
                <Divider align="center">
                    <Badge value="Username"></Badge>
                </Divider>

                <InputText placeholder={'Machine Username'} className={'w-full'} value={addDeviceUsernameInput}
                           onChange={(e) => setAddDeviceUsernameInput(e.target.value)} />
                <Divider align="center">
                    <Badge value="Password"></Badge>
                </Divider>

                <InputText placeholder={'Machine Password'} className={'w-full'} value={addDevicePasswordInput}
                           onChange={(e) => setAddDevicePasswordInput(e.target.value)} />
            </Dialog>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Backend Status</span>
                            <div
                                className="text-900 font-medium text-xl">{isConnected ? 'Connected' : 'Disconnected'}</div>
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
                                className="text-900 font-medium text-xl">{isConnected ? (xtableStatus) : 'Disconnected'}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round"
                             style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-table text-blue-500 text-xl" />
                        </div>
                    </div>
                    <TimeAgo date={lastXTablesStatusUpdate} />
                </div>
            </div>

            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Devices</span>
                            <div className="text-900 font-medium text-xl">{devicesData?.length ?? 0}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round"
                             style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-android text-blue-500 text-xl" />
                        </div>
                    </div>
                    <TimeAgo date={lastDevicesUpdate}></TimeAgo>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Notifications</span>
                            <div className="text-900 font-medium text-xl">{(logs ?? []).length}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round"
                             style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-comment text-blue-500 text-xl" />
                        </div>
                    </div>
                    <TimeAgo date={lastLogUpdate}></TimeAgo>
                </div>
            </div>
            <div className={'col-12'}>
                <div className="card">
                    <DataTable
                        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                        rowsPerPageOptions={[5, 10, 25, 50]} paginatorLeft={() => {
                        return (<><Button
                            icon="pi pi-refresh" text loading={loading} disabled={!isConnected}
                            onClick={startScanning} />
                            <Button
                                icon="pi pi-plus" text loading={loading} disabled={!isConnected}
                                onClick={() => {
                                    setAddDeviceDialogVisible(true)
                                }} />
                            <Button
                                icon="pi pi-search" text loading={loading} disabled={!isConnected}
                                onClick={() => {
                                    setLoading(true)
                                    router.replace('/network/XCASTER');
                                }} />
                        </>);
                    }} removableSort value={isConnected ? devicesData : []}
                        emptyMessage={Loader({ message: isConnected ? 'Searching for machines running XCASTER' : 'Connecting to backend' })}
                        rows={5} paginator>
                        <Column frozen={true} field="hostname" header="Hostname" sortable style={{ width: '25%' }}
                                body={(data) => {
                                    return (<span className={'text-lg'}>{data.hostname}</span>);
                                }} />
                        <Column field="server" header="Server" style={{ width: '25%' }} />
                        <Column field="address" header="Address" style={{ width: '25%' }} />
                        <Column
                            style={{ width: '25%' }}
                            header="Status"
                            body={(data) => (
                                <div>
                                    <Tag
                                        className={data?.status === 'CONNECTING' ? 'animate-pulse-fast' : data?.status === 'DISCONNECTED' ? 'animate-pulse' : ''}
                                        severity={data.connected ? 'success' : data?.status === 'CONNECTED' ? 'success' : data?.status === 'CONNECTING' ? 'warning' : 'danger'}
                                        value={data.connected ? 'Connected' : data?.status === 'CONNECTED' ? 'Connected' : data?.status === 'CONNECTING' ? 'Connecting' : 'Disconnected'}
                                        rounded></Tag>
                                </div>
                            )}
                        />

                        <Column
                            header="View"
                            body={(data) => (
                                <>
                                    <Button loading={loadingStates[data?.server]}
                                            disabled={!isConnected || data?.status !== 'CONNECTED'} icon="pi pi-search"
                                            text onClick={() => {
                                        const server = data?.server;
                                        if (!server) {
                                            toast.current.show({
                                                severity: 'error',
                                                summary: 'Server Not Found!',
                                                detail: 'The server was not found.'
                                            });
                                            playErrorNotificationSound()
                                            return;
                                        }
                                        setLoadingStates(prev => ({ ...prev, [server]: true }));
                                        toast.current.show({
                                            severity: 'info',
                                            summary: 'Redirecting...',
                                            detail: 'You are being redirected to the machine control panel...'
                                        });
                                        router.replace('/device/files?server=' + server + '&directory=/');


                                    }} />
                                </>
                            )}
                        />
                        <Column
                            header="Logs"
                            body={(data) => (
                                <>
                                    <Button loading={loadingStates[data?.server]}
                                            disabled={!isConnected || data?.status !== 'CONNECTED'} icon="pi pi-bell"
                                            text onClick={() => {
                                        const server = data?.server;
                                        if (!server) {
                                            toast.current.show({
                                                severity: 'error',
                                                summary: 'Server Not Found!',
                                                detail: 'The server was not found.'
                                            });
                                            playErrorNotificationSound()
                                            return;
                                        }
                                        setLoadingStates(prev => ({ ...prev, [server]: true }));
                                        toast.current.show({
                                            severity: 'info',
                                            summary: 'Redirecting...',
                                            detail: 'You are being redirected to the machine logs panel...'
                                        });
                                        router.replace('/device/notifications?server=' + server);


                                    }} />
                                </>
                            )}
                        />
                        <Column
                            header="Services"
                            body={(data) => (
                                <>
                                    <Button loading={loadingStates[data?.server]}
                                            disabled={!isConnected || data?.status !== 'CONNECTED'} icon="pi pi-server"
                                            text onClick={() => {
                                        const server = data?.server;
                                        if (!server) {
                                            toast.current.show({
                                                severity: 'error',
                                                summary: 'Server Not Found!',
                                                detail: 'The server was not found.'
                                            });
                                            playErrorNotificationSound()
                                            return;
                                        }
                                        setLoadingStates(prev => ({ ...prev, [server]: true }));
                                        toast.current.show({
                                            severity: 'info',
                                            summary: 'Redirecting...',
                                            detail: 'You are being redirected to the machine control panel...'
                                        });


                                        router.replace('/device/services?server=' + server);


                                    }} />
                                </>
                            )}
                        />
                        <Column
                            header="Control"
                            body={(data) => (
                                <>
                                    <Button loading={loadingStates[data?.server]}
                                            disabled={!isConnected || data?.status !== 'CONNECTED'} icon="pi pi-desktop"
                                            text onClick={() => {
                                        const server = data?.server;
                                        if (!server) {
                                            toast.current.show({
                                                severity: 'error',
                                                summary: 'Server Not Found!',
                                                detail: 'The server was not found.'
                                            });
                                            playErrorNotificationSound()
                                            return;
                                        }
                                        setLoadingStates(prev => ({ ...prev, [server]: true }));
                                        toast.current.show({
                                            severity: 'info',
                                            summary: 'Redirecting...',
                                            detail: 'You are being redirected to the machine control panel...'
                                        });


                                        router.replace('/device?server=' + server);


                                    }} />
                                </>
                            )}
                        />

                        <Column
                            header="Reboot"
                            body={(data) => (
                                <>
                                    <Button loading={loadingStates[data?.server]}
                                            disabled={!isConnected || data?.status !== 'CONNECTED'}
                                            className={'text-red-500'}
                                            icon="pi pi-sync" text onClick={() => {
                                        if (isConnected) {
                                            const server = data?.server;
                                            if (!server) {
                                                toast.current.show({
                                                    severity: 'error',
                                                    summary: 'Server Not Found!',
                                                    detail: 'The server was not found.'
                                                });
                                                playErrorNotificationSound()
                                                return;
                                            }
                                            setLoadingStates(prev => ({ ...prev, [server]: true }));
                                            sendMessageAndWaitForCondition({
                                                type: 'DEVICE-REBOOT',
                                                message: server
                                            }, (m) => m.type === 'DEVICE-REBOOT', 5000)
                                                .then((message) => {
                                                    toast.current.show({
                                                        severity: 'success',
                                                        summary: 'Server Rebooting!',
                                                        detail: 'The command was sent to the machine.'
                                                    });
                                                    playSuccessNotificationSound()
                                                    setLoadingStates(prev => ({ ...prev, [server]: false }));
                                                })
                                                .catch(() => {
                                                    toast.current.show({
                                                        severity: 'error',
                                                        summary: 'Server Unresponsive!',
                                                        detail: 'The server did not respond in time.'
                                                    });
                                                    playErrorNotificationSound()
                                                    setLoadingStates(prev => ({ ...prev, [server]: false }));
                                                });
                                        }
                                    }} />
                                </>
                            )}
                        />
                    </DataTable>
                </div>
            </div>
            <div className={'col-12'}>
                <div className="card">
                    <div className="overflow-y-auto" style={{ 'maxHeight': '40rem' }}>
                        {isConnected && (logs ?? []).length > 0 ? logs.map((log, index) => (
                            <LogComponent key={index} log={log}></LogComponent>
                        )) : Loader({ message: isConnected ? (logs ?? []).length > 0 ? 'Loading resources' : 'There are no logs recorded' : 'Connecting to backend' })}

                    </div>
                </div>
            </div>


            {/*<div className="col-12 lg:col-6">*/}
            {/*    <div className="card max-h-35rem overflow-auto">*/}
            {/*        <div className="flex align-items-center justify-content-between mb-4">*/}
            {/*            <h5>Notifications</h5>*/}
            {/*        </div>*/}

            {/*        <span className="block text-600 font-medium mb-3">TODAY</span>*/}
            {/*        <ul className="p-0 mx-0 mt-0 mb-4 list-none">*/}
            {/*            <li className="flex align-items-center py-2">*/}
            {/*                <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-orange-100 border-circle mr-3 flex-shrink-0">*/}
            {/*                    <i className="pi pi-download text-xl text-orange-500" />*/}
            {/*                </div>*/}
            {/*                <span className="text-700 line-height-3">*/}
            {/*                    Random <span className="text-blue-500 font-medium"></span> event.*/}
            {/*                </span>*/}
            {/*            </li>*/}
            {/*        </ul>*/}

            {/*        <span className="block text-600 font-medium mb-3">YESTERDAY</span>*/}
            {/*        <ul className="p-0 m-0 list-none">*/}
            {/*            <li className="flex align-items-center py-2 border-bottom-1 surface-border">*/}
            {/*                <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">*/}
            {/*                    <i className="pi pi-dollar text-xl text-blue-500" />*/}
            {/*                </div>*/}
            {/*                <span className="text-900 line-height-3">*/}
            {/*                    ok*/}
            {/*                    <span className="text-700">*/}
            {/*                        {' '}*/}
            {/*                        test <span className="text-blue-500">1</span>*/}
            {/*                    </span>*/}
            {/*                </span>*/}
            {/*            </li>*/}
            {/*            <li className="flex align-items-center py-2 border-bottom-1 surface-border">*/}
            {/*                <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-pink-100 border-circle mr-3 flex-shrink-0">*/}
            {/*                    <i className="pi pi-question text-xl text-pink-500" />*/}
            {/*                </div>*/}
            {/*                <span className="text-900 line-height-3">*/}
            {/*                    not ready*/}
            {/*                    <span className="text-700"> testinbg</span>*/}
            {/*                </span>*/}
            {/*            </li>*/}
            {/*        </ul>*/}
            {/*    </div>*/}
            {/*</div>*/}
            {/*<div className="col-12 lg:col-6">*/}
            {/*    <div className="card">*/}
            {/*        <h5>Machine Overview</h5>*/}
            {/*        <Chart type="line" data={lineData} options={lineOptions} />*/}
            {/*    </div>*/}
            {/*</div>*/}


        </div>
    );
};

export default Dashboard;
