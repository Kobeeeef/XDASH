'use client';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useState } from 'react';
import { LayoutContext } from '../../layout/context/layoutcontext';
import { Tag } from 'primereact/tag';
import { WebsocketContext } from '@/layout/context/websocketcontext';
import TimeAgo from '@/components/TimeAgo';
import LoadingDots from '../../components/LoadingDots';

const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            backgroundColor: '#2f4860',
            borderColor: '#2f4860',
            tension: 0.4
        },
        {
            label: 'Second Dataset',
            data: [28, 48, 40, 19, 86, 27, 90],
            fill: false,
            backgroundColor: '#00bb7e',
            borderColor: '#00bb7e',
            tension: 0.4
        }
    ]
};

const Dashboard = () => {
    const [lineOptions, setLineOptions] = useState({});
    const { layoutConfig } = useContext(LayoutContext);
    const { isConnected, lastConnectionUpdate, sendMessageAndWaitForCondition } = useContext(WebsocketContext);
    const [xtableStatus, setXtableStatus] = useState(false);
    const [devicesData, setDevicesData] = useState([])
    const [lastXTablesStatusUpdate, setLastXTablesStatusUpdate] = useState(new Date());
    const [lastDevicesUpdate, setLastDevicesUpdate] = useState(new Date());
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (isConnected) {
                sendMessageAndWaitForCondition({ type: 'DEVICES-DATA' }, (m) => m.type === 'DEVICES-DATA')
                    .then((message) => {
                        setXtableStatus((a) => {
                            if (message?.message?.xtablesConnectedStatus !== a) setLastXTablesStatusUpdate(new Date());
                            return message.message?.xtablesConnectedStatus;
                        });
                        setDevicesData((a) => {
                            const json = JSON.parse(message?.message?.devices ??[])
                            if (JSON.stringify(json) !== JSON.stringify(a)) setLastDevicesUpdate(new Date());
                            return json;
                        })
                    })
                    .catch(() => {});
            }
        }, 100);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, [isConnected, sendMessageAndWaitForCondition]);
    const applyLightTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };

    const applyDarkTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };


    useEffect(() => {
        if (layoutConfig.colorScheme === 'light') {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }, [layoutConfig.colorScheme]);

    return (
        <div className="grid">
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Backend Status</span>
                            <div className="text-900 font-medium text-xl">{isConnected ? 'Connected' : 'Disconnected'}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
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
                            <div className="text-900 font-medium text-xl">{isConnected ? (xtableStatus ? 'Connected' : 'Disconnected') : 'Disconnected'}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
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
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
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
                            <div className="text-900 font-medium text-xl">0</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-comment text-blue-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-bold">1 </span>
                    <span className="text-500">minute ago</span>
                </div>
            </div>
            <div className={'col-12'}>
                <div className="card">
                    <DataTable removableSort loading={!isConnected} value={devicesData} emptyMessage={(<p>Searching for machines running XCASTER<LoadingDots delay={150}/></p>)} rows={5} paginator responsiveLayout="scroll">
                        <Column field="hostname" header="Hostname" sortable style={{ width: '35%' }} />
                        <Column field="address" header="Address" sortable style={{ width: '35%' }} body={(data) => data.address} />
                        <Column
                            field="status"
                            header="Status"
                            sortable
                            style={{ width: '35%' }}
                            body={(data) => (
                                <div>
                                    <Tag severity={data.connected ? 'success' : 'danger'} value={data.connected ? 'Connected' : 'Disconnected'} rounded></Tag>
                                </div>
                            )}
                        />
                        <Column
                            header="View"
                            body={() => (
                                <>
                                    <Button icon="pi pi-search" text />
                                </>
                            )}
                        />
                        <Column
                            header="Control"
                            body={() => (
                                <>
                                    <Button className={'text-purple-500'} icon="pi pi-desktop" text />
                                </>
                            )}
                        />
                        <Column
                            header="Reboot"
                            body={() => (
                                <>
                                    <Button className={'text-red-500'} icon="pi pi-sync" text />
                                </>
                            )}
                        />
                    </DataTable>
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
