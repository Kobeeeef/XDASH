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
import { Divider } from 'primereact/divider';
import Link from 'next/link';


const Dashboard = () => {
    const { isConnected, lastConnectionUpdate, sendMessageAndWaitForCondition } = useContext(WebsocketContext);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [data, setData] = useState([]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (isConnected) {
                sendMessageAndWaitForCondition({ type: 'NETWORK-STATS' }, (m) => m.type === 'NETWORK-STATS')
                    .then((message) => {
                        setData(d => {
                            const json = JSON.parse(message.message);
                            console.log(json);
                            if (JSON.stringify(d) !== JSON.stringify(json)) setLastUpdate(new Date());
                            return json;
                        });
                    })
                    .catch(() => {
                    });
            }
        }, 800);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, [isConnected, sendMessageAndWaitForCondition]);


    // @ts-ignore
    return (
        <div className="grid fadeIn">
            <ConfirmDialog />
            <div className="col-12 lg:col-6">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Backend Status</span>
                            <div
                                className="text-900 font-medium text-xl font-bold"> {isConnected ? 'Connected' : 'Disconnected'}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round"
                             style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-chevron-circle-up text-blue-500 text-xl" />
                        </div>
                    </div>
                    <TimeAgo date={lastConnectionUpdate} />
                </div>
            </div>

            <div className="col-12 lg:col-6">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Total Interfaces</span>
                            <div
                                className="text-900 font-medium text-xl font-bold">{isConnected ? data?.length ?? 0 : 'Disconnected'}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round"
                             style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-android text-cyan-500 text-xl" />
                        </div>
                    </div>
                    <TimeAgo date={lastUpdate} />
                </div>
            </div>
            {(data ?? []).length > 0 ? data.map((d, index) => {
                return (
                    <div key={index} className={'col-12'}>
                        <div className="card">
                            <h5 className="text-center">{d.displayName}</h5>
                            <Divider className={'mb-5'} />
                            <div className={'grid'}>
                                <div className="col-12 lg:col-6 xl:col-3">
                                    <div className="card mb-0">
                                        <div className="flex justify-content-between mb-3">
                                            <div>
                                                <span className="block text-500 font-medium mb-3">Name</span>
                                                <div
                                                    className={'text-900 font-medium text-xl ' + (d?.isUp ? 'text-green-600' : 'text-red-600 animate-pulse')}>{d?.name ?? 'Unknown'}</div>
                                            </div>
                                            <div
                                                className="flex align-items-center justify-content-center bg-blue-100 border-round"
                                                style={{ width: '2.5rem', height: '2.5rem' }}>
                                                <i className="pi pi-chevron-circle-up text-blue-500 text-xl" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 lg:col-6 xl:col-3">
                                    <div className="card mb-0">
                                        <div className="flex justify-content-between mb-3">
                                            <div>
                                                <span className="block text-500 font-medium mb-3">Mac Address</span>
                                                <div
                                                    className={'text-900 font-medium text-xl ' + (d?.isUp ? 'text-green-600' : 'text-red-600 animate-pulse')}>{d?.macAddress ?? 'Unknown'}</div>
                                            </div>
                                            <div
                                                className="flex align-items-center justify-content-center bg-blue-100 border-round"
                                                style={{ width: '2.5rem', height: '2.5rem' }}>
                                                <i className="pi pi-chevron-circle-up text-blue-500 text-xl" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 lg:col-6 xl:col-3">
                                    <div className="card mb-0">
                                        <div className="flex justify-content-between mb-3">
                                            <div>
                                                <span className="block text-500 font-medium mb-3">Maximum Transmission Unit</span>
                                                <div
                                                    className={'text-900 font-medium text-xl ' + (d?.isUp ? 'text-green-600' : 'text-red-600 animate-pulse')}>{d?.maximumTransmissionUnit?.toLocaleString() ?? 'Unknown'}</div>
                                            </div>
                                            <div
                                                className="flex align-items-center justify-content-center bg-blue-100 border-round"
                                                style={{ width: '2.5rem', height: '2.5rem' }}>
                                                <i className="pi pi-chevron-circle-up text-blue-500 text-xl" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 lg:col-6 xl:col-3">
                                    <div className="card mb-0">
                                        <div className="flex justify-content-between mb-3">
                                            <div>
                                                <span className="block text-500 font-medium mb-3">Bytes Sent</span>
                                                <div
                                                    className={'text-900 font-medium text-xl ' + (d?.isUp ? 'text-green-600' : 'text-red-600 animate-pulse')}>{d?.bytesSent.toLocaleString() ?? 'Unknown'}</div>
                                            </div>
                                            <div
                                                className="flex align-items-center justify-content-center bg-blue-100 border-round"
                                                style={{ width: '2.5rem', height: '2.5rem' }}>
                                                <i className="pi pi-chevron-circle-up text-blue-500 text-xl" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 lg:col-6 xl:col-3">
                                    <div className="card mb-0">
                                        <div className="flex justify-content-between mb-3">
                                            <div>
                                                <span className="block text-500 font-medium mb-3">Bytes Received</span>
                                                <div
                                                    className={'text-900 font-medium text-xl ' + (d?.isUp ? 'text-green-600' : 'text-red-600 animate-pulse')}>{d?.bytesReceived.toLocaleString() ?? 'Unknown'}</div>
                                            </div>
                                            <div
                                                className="flex align-items-center justify-content-center bg-blue-100 border-round"
                                                style={{ width: '2.5rem', height: '2.5rem' }}>
                                                <i className="pi pi-chevron-circle-up text-blue-500 text-xl" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 lg:col-6 xl:col-3">
                                    <div className="card mb-0">
                                        <div className="flex justify-content-between mb-3">
                                            <div>
                                                <span className="block text-500 font-medium mb-3">Network Speed</span>
                                                <div
                                                    className={'text-900 font-medium text-xl ' + (d?.isUp ? 'text-green-600' : 'text-red-600 animate-pulse')}>{d?.speedBits.toLocaleString() ?? 'Unknown'}</div>
                                            </div>
                                            <div
                                                className="flex align-items-center justify-content-center bg-blue-100 border-round"
                                                style={{ width: '2.5rem', height: '2.5rem' }}>
                                                <i className="pi pi-chevron-circle-up text-blue-500 text-xl" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 lg:col-6 xl:col-3">
                                    <div className="card mb-0">
                                        <div className="flex justify-content-between mb-3">
                                            <div>
                                                <span className="block text-500 font-medium mb-3">Packets Sent</span>
                                                <div
                                                    className={'text-900 font-medium text-xl ' + (d?.isUp ? 'text-green-600' : 'text-red-600 animate-pulse')}>{d?.packetsSent?.toLocaleString() ?? 'Unknown'}</div>
                                            </div>
                                            <div
                                                className="flex align-items-center justify-content-center bg-blue-100 border-round"
                                                style={{ width: '2.5rem', height: '2.5rem' }}>
                                                <i className="pi pi-chevron-circle-up text-blue-500 text-xl" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 lg:col-6 xl:col-3">
                                    <div className="card mb-0">
                                        <div className="flex justify-content-between mb-3">
                                            <div>
                                                <span
                                                    className="block text-500 font-medium mb-3">Packets Received</span>
                                                <div
                                                    className={'text-900 font-medium text-xl ' + (d?.isUp ? 'text-green-600' : 'text-red-600 animate-pulse')}>{d?.packetsReceived?.toLocaleString() ?? 'Unknown'}</div>
                                            </div>
                                            <div
                                                className="flex align-items-center justify-content-center bg-blue-100 border-round"
                                                style={{ width: '2.5rem', height: '2.5rem' }}>
                                                <i className="pi pi-chevron-circle-up text-blue-500 text-xl" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={"grid mt-1"}>
                                <div className="col-12 lg:col-6">
                                    <div className="card mb-0 h-full">
                                        <DataTable
                                            showHeaders={false}
                                            header={() => <h5 className={'text-center'}>IPv4 Addresses</h5>}
                                            size={'small'}
                                            removableSort value={isConnected ? d?.ipv4Addresses : []}
                                            emptyMessage={Loader({ message: isConnected ? 'There are no IPv4\'s found' : 'Connecting to backend' })}
                                        >
                                            <Column frozen={true} field="ip" body={(d) => {
                                                return <a target={"_blank"} href={"http://" + d}>{d}</a>
                                            }}
                                                    style={{ width: '100%' }} />

                                        </DataTable>

                                    </div>
                                </div>
                                <div className="col-12 lg:col-6">
                                    <div className="card mb-0 h-full">
                                        <DataTable
                                            showHeaders={false}
                                            header={() => <h5 className={'text-center'}>IPv6 Addresses</h5>}
                                            size={'small'}
                                            removableSort value={isConnected ? d?.ipv6Addresses : []}
                                            emptyMessage={Loader({ message: isConnected ? 'There are no IPv6\'s found' : 'Connecting to backend' })}
                                        >
                                            <Column frozen={true} field="ip" body={(d) => {
                                                return <a target={"_blank"} href={"http://[" + d + "]"}>{d}</a>
                                            }}
                                                    style={{ width: '100%' }} />

                                        </DataTable>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }) : (<div className={'col-12'}>
                <div className="card"><Loader message={'Requesting resources'} /></div>
            </div>)
            }
        </div>
    );
};


export default Dashboard;
