/* eslint-disable @next/next/no-img-element */
'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import React, { useContext, useEffect, useState } from 'react';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { WebsocketContext } from '../../../../layout/context/websocketcontext';
import TimeAgo from '../../../../components/TimeAgo';
import Loader from '../../../../components/XBOTLoader';
import { Divider } from 'primereact/divider';

import { Tooltip } from 'primereact/tooltip';


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
                        <Tooltip target={'.tooltip'} showDelay={100} mouseTrack={true} />
                        <div className="card">
                            <h5 className="text-center">{d.displayName}</h5>
                            <Divider className={'mb-5'} />
                            <div className={'grid'}>
                                <div className="col-12 lg:col-6 xl:col-3">
                                    <div className="card mb-0">
                                        <div
                                            data-pr-tooltip="The interface name type is a label assigned to a network interface that indicates its type and sequence on a device."
                                            className="tooltip flex justify-content-between mb-3">
                                            <div>
                                                <span className="block text-500 font-medium mb-3">Name</span>
                                                <div
                                                    className={'text-900 font-medium text-xl ' + (d?.isUp ? 'text-green-600' : 'text-red-600 animate-pulse')}>{d?.name ?? 'Unknown'}</div>
                                            </div>
                                            <div
                                                className="name flex align-items-center justify-content-center bg-blue-100 border-round"
                                                style={{ width: '2.5rem', height: '2.5rem' }}>
                                                <i className="pi pi-book text-blue-500 text-xl" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 lg:col-6 xl:col-3">
                                    <div className="card mb-0">
                                        <div
                                            data-pr-tooltip="A MAC address (Media Access Control address) is a unique 48-bit identifier assigned to a network interface card (NIC) for communication on a local network, typically expressed in hexadecimal format and used to distinguish devices within the same network."
                                            className="tooltip flex justify-content-between mb-3">
                                            <div>
                                                <span className="block text-500 font-medium mb-3">Mac Address</span>
                                                <div
                                                    className={'text-900 font-medium text-xl ' + (d?.isUp ? 'text-green-600' : 'text-red-600 animate-pulse')}>{d?.macAddress ?? 'Unknown'}</div>
                                            </div>
                                            <div
                                                className="flex align-items-center justify-content-center bg-blue-100 border-round"
                                                style={{ width: '2.5rem', height: '2.5rem' }}>
                                                <i className="pi pi-address-book text-blue-500 text-xl" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 lg:col-6 xl:col-3">
                                    <div className="card mb-0">
                                        <div
                                            data-pr-tooltip="The Maximum Transmission Unit (MTU) is the largest size, in bytes, of a data packet that can be sent over a network interface without fragmentation, typically 1500 bytes for Ethernet."
                                            className="tooltip flex justify-content-between mb-3">
                                            <div>
                                                <span className="block text-500 font-medium mb-3">Maximum Transmission Unit</span>
                                                <div
                                                    className={'text-900 font-medium text-xl ' + (d?.isUp ? 'text-green-600' : 'text-red-600 animate-pulse')}>{d?.maximumTransmissionUnit?.toLocaleString() ?? 'Unknown'}</div>
                                            </div>
                                            <div
                                                className="flex align-items-center justify-content-center bg-blue-100 border-round"
                                                style={{ width: '2.5rem', height: '2.5rem' }}>
                                                <i className="pi pi-window-maximize text-blue-500 text-xl" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 lg:col-6 xl:col-3">
                                    <div className="card mb-0">
                                        <div
                                            data-pr-tooltip="Bytes sent refers to the total amount of data, measured in bytes, transmitted from a source device to a destination device over a network."
                                            className="tooltip flex justify-content-between mb-3">
                                            <div>
                                                <span className="block text-500 font-medium mb-3">Bytes Sent</span>
                                                <div
                                                    className={'text-900 font-medium text-xl ' + (d?.isUp ? 'text-green-600' : 'text-red-600 animate-pulse')}>{d?.bytesSent.toLocaleString() ?? 'Unknown'}</div>
                                            </div>
                                            <div
                                                className="flex align-items-center justify-content-center bg-blue-100 border-round"
                                                style={{ width: '2.5rem', height: '2.5rem' }}>
                                                <i className="pi pi-upload text-blue-500 text-xl" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 lg:col-6 xl:col-3">
                                    <div className="card mb-0">
                                        <div
                                            data-pr-tooltip="Bytes received refers to the total amount of data, measured in bytes, successfully delivered to a destination device from a source device over a network."
                                            className="tooltip flex justify-content-between mb-3">
                                            <div>
                                                <span className="block text-500 font-medium mb-3">Bytes Received</span>
                                                <div
                                                    className={'text-900 font-medium text-xl ' + (d?.isUp ? 'text-green-600' : 'text-red-600 animate-pulse')}>{d?.bytesReceived.toLocaleString() ?? 'Unknown'}</div>
                                            </div>
                                            <div
                                                className="flex align-items-center justify-content-center bg-blue-100 border-round"
                                                style={{ width: '2.5rem', height: '2.5rem' }}>
                                                <i className="pi pi-download text-blue-500 text-xl" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 lg:col-6 xl:col-3">
                                    <div className="card mb-0">
                                        <div
                                            data-pr-tooltip="Network speed is the rate of data transfer over a network connection, measured in bits per second (bps)."
                                            className="tooltip flex justify-content-between mb-3">
                                            <div>
                                                <span className="block text-500 font-medium mb-3">Network Speed</span>
                                                <div
                                                    className={'text-900 font-medium text-xl ' + (d?.isUp ? 'text-green-600' : 'text-red-600 animate-pulse')}>{d?.speedBits.toLocaleString() ?? 'Unknown'}</div>
                                            </div>
                                            <div
                                                className="flex align-items-center justify-content-center bg-blue-100 border-round"
                                                style={{ width: '2.5rem', height: '2.5rem' }}>
                                                <i className="pi pi-bolt text-blue-500 text-xl" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 lg:col-6 xl:col-3">
                                    <div className="card mb-0">
                                        <div
                                            data-pr-tooltip="Packets sent refers to the number of data packets transmitted from a source device to a destination device over a network."
                                            className="tooltip flex justify-content-between mb-3">
                                            <div>
                                                <span className="block text-500 font-medium mb-3">Packets Sent</span>
                                                <div
                                                    className={'text-900 font-medium text-xl ' + (d?.isUp ? 'text-green-600' : 'text-red-600 animate-pulse')}>{d?.packetsSent?.toLocaleString() ?? 'Unknown'}</div>
                                            </div>
                                            <div
                                                className="flex align-items-center justify-content-center bg-blue-100 border-round"
                                                style={{ width: '2.5rem', height: '2.5rem' }}>
                                                <i className="pi pi-send text-blue-500 text-xl" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 lg:col-6 xl:col-3">
                                    <div className="card mb-0">
                                        <div
                                            data-pr-tooltip="Packets received refers to the number of data packets successfully delivered to a destination device from a source device over a network."
                                            className="tooltip flex justify-content-between mb-3">
                                            <div>
                                                <span
                                                    className="block text-500 font-medium mb-3">Packets Received</span>
                                                <div
                                                    className={'text-900 font-medium text-xl ' + (d?.isUp ? 'text-green-600' : 'text-red-600 animate-pulse')}>{d?.packetsReceived?.toLocaleString() ?? 'Unknown'}</div>
                                            </div>
                                            <div
                                                className="flex align-items-center justify-content-center bg-blue-100 border-round"
                                                style={{ width: '2.5rem', height: '2.5rem' }}>
                                                <i className="pi pi-inbox text-blue-500 text-xl" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={'grid mt-1'}>
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
                                                return <a target={'_blank'} href={'http://' + d}>{d}</a>;
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
                                                return <a target={'_blank'} href={'http://[' + d + ']'}>{d}</a>;
                                            }}
                                                    style={{ width: '100%' }} />

                                        </DataTable>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }) : (
                <div className={'col-12'}>
                    <div className="card"><Loader message={isConnected ? 'Requesting resources' : 'Connecting to backend'} /></div>
                </div>
            )
            }
        </div>
    )
        ;
};


export default Dashboard;
