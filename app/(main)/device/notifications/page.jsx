'use client';


import React, { useContext, useEffect, useRef, useState } from 'react';

import { WebsocketContext } from '@/layout/context/websocketcontext';
import TimeAgo from '@/components/TimeAgo';


import { Toast } from 'primereact/toast';

import { useSearchParams } from 'next/navigation';
import { Dialog } from 'primereact/dialog';
import CustomMessage from '../../../../components/CustomMessage';
import { Message } from 'primereact/message';
import { DataScroller } from 'primereact/datascroller';
import { VirtualScroller } from 'primereact/virtualscroller';
import { classNames } from 'primereact/utils';
import { Skeleton } from 'primereact/skeleton';
import { DataView } from 'primereact/dataview';
import XBOTLoader from '../../../../components/XBOTLoader';
import { Button } from 'primereact/button';
import utilities from '../../../../utilities/utilities';


const Dashboard = () => {
        const toast = useRef(null);
        const searchParams = useSearchParams();
        const serverParam = searchParams.get('server');
        const [server, setServer] = useState(null);
        const {
            latestLog,
            isConnected,
            lastConnectionUpdate,
            sendMessageAndWaitForCondition
        } = useContext(WebsocketContext);
        const [lastDeviceUpdate, setLastDeviceUpdate] = useState(new Date());
        const [data, setData] = useState({});
        const [warningDialogVisible, setWarningDialogVisible] = useState(false);
        const [logs, setLogs] = useState([]);
        const [loading, setLoading] = useState(true);
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
                                setLoading(true)
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

            setLogs((a) => {
                return [latestLog, ...a];
            });

        }, [latestLog]);

        function reloadData() {
            setLoading(true);
            sendMessageAndWaitForCondition({
                type: 'DEVICE-LOGS',
                message: JSON.stringify({
                    server: server || serverParam,
                    start: 0,
                    end: 200
                })
            }, (m) => m.type === 'DEVICE-LOGS').then((e) => {
                setLoading(false);
                setLogs(e.message);
            }).catch((e) => {
                toast.current.show({
                    severity: 'error',
                    summary: 'Failed to load logs',
                    detail: e?.message || 'Unknown Error!'
                });
                setLoading(false);
            });
        }

        useEffect(() => {
            if (isConnected && data?.status === 'CONNECTED') {
                reloadData();
            }
        }, [isConnected, data?.status, server]);


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


                        <DataView
                            rows={5}
                            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                            rowsPerPageOptions={[5, 10, 25, 50]} paginatorLeft={() => {
                            return (<Button
                                icon="pi pi-refresh" text loading={loading}
                                disabled={!isConnected || data?.status !== 'CONNECTED'} onClick={reloadData}
                            />);
                        }}
                            loading={loading} paginator={true}
                            value={logs}
                            listTemplate={(items, options) => {
                                if (!items || items.length === 0) return null;
                                let list = items.filter((product) => product?.PRIORITY && product?.MESSAGE).map((product, index) => {

                                    return (
                                        <div key={index} className={'col-12'}>
                                            <CustomMessage __REALTIME_TIMESTAMP={product?.__REALTIME_TIMESTAMP}
                                                           priority={product?.PRIORITY}
                                                           text={utilities.truncateString(product?.MESSAGE, 100)}
                                                           header={product?._COMM || product?._SYSTEMD_UNIT || product?.system || product?._CMDLINE || product?.SYSLOG_IDENTIFIER || 'unknown source'} />
                                        </div>
                                    );
                                });
                                return <div className="grid grid-nogutter">{list}</div>;
                            }}
                        />


                    </div>
                </div>

            </div>
        );
    }
;
const loadingTemplate = (options) => {
    const className = classNames('flex align-items-center p-2 my-6', {
        odd: options.odd
    });

    return (
        <div className={className} style={{ height: '50px' }}>

            <Skeleton width={'100%'} height="4rem"></Skeleton>

        </div>
    );
};
export default Dashboard;
