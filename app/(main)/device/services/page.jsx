'use client';


import React, { useContext, useEffect, useRef, useState } from 'react';

import { WebsocketContext } from '@/layout/context/websocketcontext';
import TimeAgo from '@/components/TimeAgo';
import { Tag } from 'primereact/tag';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { Toast } from 'primereact/toast';

import { useSearchParams } from 'next/navigation';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import LoadingDots from '../../../../components/LoadingDots';
import { Image } from 'primereact/image';


const Dashboard = () => {
    const toast = useRef(null);
    const searchParams = useSearchParams();
    const serverParam = searchParams.get('server');
    const [server, setServer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [restartLoading, setRestartLoading] = useState(false)
    const {
        isConnected,
        lastConnectionUpdate,
        sendMessageAndWaitForCondition,
        sendMessage,
        socket
    } = useContext(WebsocketContext);
    const [lastDeviceUpdate, setLastDeviceUpdate] = useState(new Date());
    const [data, setData] = useState({});
    const [warningDialogVisible, setWarningDialogVisible] = useState(false);
    const [services, setServices] = useState([]);
    useEffect(() => {
        setServer(serverParam);
    }, [serverParam]);
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (isConnected) {
                sendMessageAndWaitForCondition({
                    type: 'DEVICE-DATA',
                    message: server
                }, (m) => m.type === 'DEVICE-DATA')
                    .then((message) => {
                        if (!message?.message?.exists) {
                            setWarningDialogVisible(true);
                            setData({});
                        } else {
                            setData(message.message);
                            setWarningDialogVisible(false);
                        }

                    }).catch(() => {
                });
            }
        }, 250);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, [isConnected, server]);
function restartService(service) {
    if (!server) {
        toast.current.show({
            severity: 'error',
            summary: 'Server Not Found!',
            detail: 'The server was not found.'
        });
        return;
    }
    if(!service) {
        toast.current.show({
            severity: 'error',
            summary: 'Service Not Found!',
            detail: 'The service was not found.'
        });
        return;
    }
    setRestartLoading(true)
    sendMessageAndWaitForCondition({
        type: 'DEVICE-SERVICE-RESTART',
        message: JSON.stringify({
            server:server,
            serviceID: service
        })
    }, (m) => m.type === 'DEVICE-SERVICE-RESTART', 10000).then((e) => {
        setRestartLoading(false);
        toast.current.show({
            severity: 'success',
            summary: 'Service Daemon Restarted!',
            detail: "The service has been restarted."
        });
        reloadServices()
    }).catch((e) => {
        const errorMessage = e.message || 'An unexpected error occurred.';
        toast.current.show({
            severity: 'error',
            summary: 'Failed to restart',
            detail: errorMessage
        });

        setRestartLoading(false);
        reloadServices()
    });
}
    function reloadServices() {
        if (isConnected) {

            setLoading(true);
            sendMessageAndWaitForCondition({
                type: 'DEVICE-SERVICES-DATA',
                message: server
            }, (m) => m.type === 'DEVICE-SERVICES-DATA').then((e) => {
                setLoading(false);
                const services = JSON.parse(e.message.services);
                setServices(services);
            }).catch((e) => {
                toast.current.show({
                    severity: 'error',
                    summary: 'Failed to reload',
                    detail: e
                });
                setLoading(false);
            });
        }
    }


    const renderLoader = (message) => {
        return (<div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'

        }}>
            <Image className={data?.status === "CONNECTING" ? 'animate-pulse-fast' : 'animate-pulse'} alt={'XBOT ROBOTICS LOGO'}
                   src={'/images/logo/logo.png'} />
            <p className={'font-bold'}>{message}<LoadingDots delay={400} /></p>
        </div>);
    };
    return (
        <div className="grid fadeIn">
            <Toast ref={toast} />
            <Dialog
                header={`Machine Discovery Failed`}
                modal={false}
                visible={warningDialogVisible}
                position={'top-right'}
                style={{ width: '50vw' }}
                onHide={() => {
                    if (!warningDialogVisible) return;
                    setWarningDialogVisible(false);
                }}
                closable={false}
                draggable={true}
                resizable={false}
            >
                <p className="m-0">
                    The machine with the server name <strong>{server}</strong> was not found on the network running
                    XCASTER. Please check your network connection, verify the machine is on and try again later.
                </p>
            </Dialog>

            <div className="col-12 lg:col-6 sm:col-4 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Backend Status</span>
                            <div
                                className={'text-900 font-medium text-xl ' + (isConnected ? 'text-green-600' : 'text-red-600 animate-pulse')}>{isConnected ? 'Connected' : 'Disconnected'}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round"
                             style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-chevron-circle-up text-blue-500 text-xl" />
                        </div>
                    </div>
                    <TimeAgo date={lastConnectionUpdate} />
                </div>
            </div>
            <div className="col-12 lg:col-6 sm:col-4 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Machine Server</span>
                            <div
                                className={'text-900 font-medium text-xl ' + (isConnected && server ? data?.status === 'CONNECTED' ? 'text-green-600' : data?.status === 'CONNECTING' ? 'animate-pulse-fast text-yellow-500' : 'animate-pulse text-red-600' : 'animate-pulse text-red-600')}>{isConnected ? (server ?? 'Unknown') : 'Disconnected'}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round"
                             style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-desktop text-blue-500 text-xl" />
                        </div>
                    </div>
                    <TimeAgo date={lastConnectionUpdate} />
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Hostname</span>
                            <div
                                className={'text-900 font-medium text-xl ' + (isConnected && server && data?.hostname ? data?.status === 'CONNECTED' ? 'text-green-600' : data?.status === 'CONNECTING' ? 'animate-pulse-fast text-yellow-500' : 'animate-pulse text-red-600' : 'animate-pulse text-red-600')}>{isConnected ? (data?.hostname ?? 'Unknown') : 'Unknown'}</div>

                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round"
                             style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-address-book text-blue-500 text-xl" />
                        </div>
                    </div>
                    <TimeAgo date={lastDeviceUpdate} />
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">IP Address</span>
                            <div
                                className={'text-900 font-medium text-xl ' + (isConnected && server && data?.address ? data?.status === 'CONNECTED' ? 'text-green-600' : data?.status === 'CONNECTING' ? 'animate-pulse-fast text-yellow-500' : 'animate-pulse text-red-600' : 'animate-pulse text-red-600')}>{isConnected ? (data?.address ?? 'Unknown') : 'Unknown'}</div>

                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round"
                             style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-map-marker text-blue-500 text-xl" />
                        </div>
                    </div>
                    <TimeAgo date={lastDeviceUpdate} />
                </div>
            </div>
            <div className="col-12">
                <div className="card mb-0">
                    <DataTable

                        emptyMessage={renderLoader(loading ? "Requesting resources" : !isConnected ? "Connecting to backend" : !data?.exists ? "Machine not running XCASTER" : data?.status !== "CONNECTED" ? "Connecting to machine" : "No resources found" )}
                        value={loading || (services ?? []).length === 0 || !isConnected || data?.status !== "CONNECTED" || !data?.exists ? [] : services} paginator rows={5}
                        rowsPerPageOptions={[5, 10, 25, 50, 75]}
                        tableStyle={{ minWidth: '50rem' }}
                        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                        currentPageReportTemplate="{first} to {last} of {totalRecords}"
                        paginatorLeft={() => <Button disabled={!isConnected || data?.status !== "CONNECTED"} loading={loading || restartLoading} type="button" icon="pi pi-refresh" text
                                                     onClick={reloadServices} />}>
                        <Column filter field="id" frozen={true} header="Name" style={{ width: '16%' }} key="id"/>
                        <Column filter field="execMainPID" header="PID" style={{ width: '16%' }} key="execMainPID"/>
                        <Column
                            filter
                            body={(data) => (
                                <Tag
                                    className={
                                        data?.activeState === 'active' ? 'glow-green-weak' :
                                            data?.activeState === 'inactive' ? 'animate-pulse' :
                                                data?.activeState === 'activating' || data?.activeState === 'reloading' || data?.activeState === 'maintenance' ? 'animate-pulse-fast' : ''
                                    }
                                    severity={
                                        data?.activeState === 'active' ? 'success' :
                                            data?.activeState === 'inactive' ? 'danger' :
                                                data?.status === 'activating' || data?.activeState === 'reloading' || data?.activeState === 'maintenance' ? 'warning' : 'danger'
                                    }
                                    value={data?.activeState ?? 'Unknown'}
                                    rounded
                                />
                            )}
                            header="Status"
                            style={{ width: '16%' }}
                            key="status"
                        />
                        <Column
                            body={(col) => (
                                <span>{col?.memoryCurrent === 0 ? 'Unknown' : col?.memoryCurrent ?? 'Unknown'}</span>
                            )}
                            header="Memory"
                            style={{ width: '16%' }}
                            key="memory"
                        />
                        <Column field="cpuUsageNSec" header="CPU" style={{ width: '16%' }} key="cpu"></Column>
                        <Column field="execMainStartTimestamp" header="Timestamp" style={{ width: '16%' }} key="timestamp"></Column>
                        <Column
                            header="Restart"
                            body={(col) => (
                                <Button
                                    className={'text-red-500'}
                                    loading={loading || restartLoading}
                                    disabled={!isConnected || col.activeState !== 'active' || data?.status !== 'CONNECTED'}
                                    icon="pi pi-sync"
                                    text
                                    onClick={() => restartService(col.id)}
                                />
                            )}
                            key="restart"
                        />
                    </DataTable>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
