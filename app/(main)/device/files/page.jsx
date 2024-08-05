'use client';


import React, { useContext, useEffect, useRef, useState } from 'react';

import { WebsocketContext } from '@/layout/context/websocketcontext';
import TimeAgo from '@/components/TimeAgo';
import { Tag } from 'primereact/tag';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { Toast } from 'primereact/toast';

import { useRouter, useSearchParams } from 'next/navigation';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import Loader from '../../../../components/XBOTLoader';
import { BreadCrumb } from 'primereact/breadcrumb';


const Dashboard = () => {
    const toast = useRef(null);
    const searchParams = useSearchParams();
    const router = useRouter();
    const serverParam = searchParams.get('server');
    const [server, setServer] = useState(null);
    const directoryParam = searchParams.get('directory');
    const [directory, setDirectory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);
    const {
        isConnected,
        lastConnectionUpdate,
        sendMessageAndWaitForCondition
    } = useContext(WebsocketContext);
    const [lastDeviceUpdate, setLastDeviceUpdate] = useState(new Date());
    const [data, setData] = useState({});
    const [warningDialogVisible, setWarningDialogVisible] = useState(false);
    const [services, setServices] = useState([]);
    useEffect(() => {
        if (serverParam) setServer(serverParam);
        if (directoryParam) setDirectory(directoryParam);
    }, [serverParam, directoryParam]);
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

    useEffect(() => {
        reloadFiles();
    }, [server, directory, isConnected]);

    function reloadFiles() {
        if (isConnected) {
            setLoading(true);
            sendMessageAndWaitForCondition({
                type: 'DEVICE-SCP-LIST',
                message: JSON.stringify({
                    server: server,
                    directory: directory
                })
            }, (m) => m.type === 'DEVICE-SCP-LIST')
                .then((message) => {
                    const files = JSON.parse(message.message.files);
                    setFiles(files);
                    setLoading(false);
                }).catch((e) => {
                const errorMessage = e.message || 'An unexpected error occurred.';
                toast.current.show({
                    severity: 'error',
                    summary: 'Failed to reload',
                    detail: errorMessage
                });
                setLoading(false);
            });
        }
    }

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
                    <TimeAgo date={lastDeviceUpdate} />
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
                        showGridlines={false}
                        emptyMessage={Loader({
                            message: loading && (services ?? []).length > 0 ? 'Loading resources' : loading ? 'Requesting resources' : !isConnected ? 'Connecting to backend' : !data?.exists ? 'Machine not running XCASTER' : data?.status !== 'CONNECTED' ? 'Connecting to machine' : 'No resources found',
                            speed: data?.status === 'CONNECTING' ? 'fast' : 'normal'
                        })}
                        value={loading || (files ?? []).length === 0 || !isConnected || data?.status !== 'CONNECTED' || !data?.exists ? [] : files}
                        paginator rows={5}
                        rowsPerPageOptions={[5, 10, 25, 50, 75]}
                        tableStyle={{ minWidth: '50rem' }}
                        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                        currentPageReportTemplate="{first} to {last} of {totalRecords}"
                        paginatorLeft={() => (<div className={'flex'}><BreadCrumb
                            model={directory
                                ?.split('/')
                                .filter(m => m) // Remove empty elements
                                .map((m, i, arr) => {
                                    // Join elements from 0 to i to form the path
                                    const path = arr.slice(0, i + 1).join('/');
                                    return {
                                        label: m,
                                        disabled: directory === "/" + path,
                                        command: () => {
                                            router.replace(`/device/files?server=${server}&directory=/${path}`);
                                        }
                                    };
                                })} home={{
                            icon: 'pi pi-home', disabled: directory === "/", command(event) {
                                router.replace(`/device/files?server=${server}&directory=/`);
                            }
                        }} /></div>)}

                        paginatorRight={() => (<div className={"flex"}><Button disabled={!isConnected || data?.status !== 'CONNECTED'}
                                                            loading={loading} type="button"
                                                            icon="pi pi-upload" text
                                                           /><Button disabled={!isConnected || data?.status !== 'CONNECTED'}
                                                       loading={loading} type="button"
                                                       icon={"pi pi-refresh " + (loading && "pi-spin")} text
                                                       onClick={reloadFiles} /></div>)}>
                        <Column filter field="name" frozen={true} header="Name" style={{ width: '25%' }} />
                        <Column field="size" header="Size" style={{ width: '25%' }} />
                        <Column field="date" header="Date" style={{ width: '25%' }} />
                        <Column field="permissions" header="Permissions" style={{ width: '25%' }} />

                        <Column
                            header="Manage"
                            body={(col) => (
                                <Button
                                    loading={loading}
                                    disabled={!isConnected || data?.status !== 'CONNECTED'}
                                    icon={'pi ' + (col.permissions?.startsWith('d') ? 'pi-folder-open' : 'pi-download')}
                                    text
                                    onClick={() => {
                                        if (col?.permissions?.startsWith('d')) {
                                            setLoading(true)
                                            router.replace(`/device/files?server=${server}&directory=` + directory + `${directory.endsWith('/') ? '' : '/'}${col.name}`);
                                        }
                                    }}
                                />
                            )}
                        />
                    </DataTable>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
