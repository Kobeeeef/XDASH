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

const helpMessage = `Available Commands: - clear: Clear the terminal screen. - put {key} {value}: Update a specific key value. - get {key}: Retrieve a value from the server. - reboot: Reboots the XTABLES server. - delete {key}: Deletes a key and all data below. - help: Show available commands and their descriptions.`;

const Dashboard = () => {
    const { isConnected, lastConnectionUpdate, sendMessageAndWaitForCondition } = useContext(WebsocketContext);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [data, setData] = useState([]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (isConnected) {
                sendMessageAndWaitForCondition({ type: 'NETWORK-SCAN' }, (m) => m.type === 'NETWORK-SCAN')
                    .then((message) => {
                        setData(d => {
                            const json = JSON.parse(message.message);
                            if (d?.toString() !== json?.toString()) setLastUpdate(new Date());
                            return json;
                        });
                    })
                    .catch(() => {
                        setData([]);
                    });
            } else {
                setData([]);
            }
        }, 300);

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

            <div className="col-12 lg:col-6">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Total Services</span>
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
            <div className={'col-12'}>
                <div className="card">
                    <DataTable
                        size={'normal'}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        removableSort value={isConnected ? data : []}
                        emptyMessage={Loader({ message: isConnected ? 'Searching for services' : 'Connecting to backend' })}
                        rows={5} paginator>
                        <Column frozen={true} field="serviceName" filter header="Name" style={{ width: '16%' }} />
                        <Column field="address" body={(d) =>
                            <Button tooltip={"Open in new tab"} tooltipOptions={{ showDelay: 100, position: "top", mouseTrack: true}} label={d?.address} link
                                    onClick={() => window.open("http://" + d?.address + ":" + d?.port, '_blank')} />
                        } header="Address" style={{ width: '16%' }} />
                        <Column field="port" header="Port" style={{ width: '16%' }} />
                        <Column field="type" header="Type" style={{ width: '16%' }} />
                        <Column field="application" filter header="Application" style={{ width: '16%' }} />
                        <Column field="server" filter header="Server" style={{ width: '16%' }} />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};


export default Dashboard;
