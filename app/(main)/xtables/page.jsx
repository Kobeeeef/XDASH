/* eslint-disable @next/next/no-img-element */
'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';




import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';




import { Terminal } from 'primereact/terminal';
import { TerminalService } from 'primereact/terminalservice';
import { WebsocketContext } from '../../../layout/context/websocketcontext';
import TimeAgo from '../../../components/TimeAgo';


const helpMessage = `Available Commands: - clear: Clear the terminal screen. - put {key} {value}: Update a specific key value. - get {key}: Retrieve a value from the server. - sync: Syncs all data from server to refresh. - help: Show available commands and their descriptions.`;

const Dashboard = () => {
    const { isConnected, lastConnectionUpdate, sendMessageAndWaitForCondition} = useContext(WebsocketContext);
    const [statusData, setStatusData] = useState({})
    const [lastStatusUpdate, setLastStatusUpdate] = useState(new Date());
    const [lastDataSizeUpdate, setLastDataSizeUpdate] = useState(new Date());
    const dt = useRef(null);
    const [data, setData] = useState([]);
    const [rawJSON, setRawJSON] = useState({});
    const [expandedRows, setExpandedRows] = useState(null);
    const commandHandler = useCallback((text) => {
        let argsIndex = text.indexOf(' ');
        let command = argsIndex !== -1 ? text.substring(0, argsIndex) : text;
        let tokens = text.split(" ");
        if(!isConnected) return TerminalService.emit('response', "Please connect to backend socket first!");
        if(!statusData?.connected) return TerminalService.emit('response', "Please connect to XTABLES server first!");

        switch (command) {
            case 'help':
            case 'ls':
                TerminalService.emit('response', helpMessage);
                break;
            case 'clear':
                TerminalService.emit('clear');
                break;
        }

    }, [isConnected, statusData]);
    function getStringSize(str) {
        if (typeof str !== 'string') {
            throw new TypeError('Input must be a string');
        }

        // Calculate the byte size of the string
        const byteSize = new Blob([str]).size;

        // Determine the appropriate unit and format the size
        if (byteSize < 1024) {
            return `${byteSize} bytes`;
        } else if (byteSize < 1024 * 1024) {
            return `${(byteSize / 1024).toFixed(2)} KB`;
        } else if (byteSize < 1024 * 1024 * 1024) {
            return `${(byteSize / (1024 * 1024)).toFixed(2)} MB`;
        } else {
            return `${(byteSize / (1024 * 1024 * 1024)).toFixed(2)} GB`;
        }
    }
    useEffect(() => {
        const intervalId = setInterval( () => {
            if (isConnected) {
                sendMessageAndWaitForCondition(
                    { type: "XTABLES-DATA" },
                    (m) => m.type === "XTABLES-DATA"
                ).then((message) => {
                    setStatusData((a) => {
                        if(message.message.connected !== a?.connected) setLastStatusUpdate(new Date())
                        if(message.message.json !== a?.json) setLastDataSizeUpdate(new Date());
                        return message.message;
                    });
                    setRawJSON(JSON.parse(message.message.json) || {});
                }).catch(() => {});



            }
        }, 500);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, [isConnected, sendMessageAndWaitForCondition]);
    useEffect(() => {

        TerminalService.on('command', commandHandler);
        return () => {
            TerminalService.off('command', commandHandler);
        };
    }, [commandHandler]);
    useEffect(() => {
        setData(convertJSON(rawJSON));
    }, [rawJSON]);
    const allowExpansion = (rowData) => {
        return rowData.data && Object.keys(rowData.data).length > 0;
    };
    const rowExpansionTemplate = (data) => {
        return (<div className="p-3">
            <DataTable showGridlines={false} value={data.data}
                       rowExpansionTemplate={rowExpansionTemplate}
                       onRowToggle={(e) => setExpandedRows(e.data)}
                       selectionMode="single"
                       expandedRows={expandedRows}
                       dataKey="key" removableSort>
                <Column expander={allowExpansion} style={{width: '5rem'}}/>
                <Column field="name" header="" />
                <Column field="value" header="" frozen={true}
                        className="font-bold max-w-1 overflow-hidden whitespace-nowrap"
                />
                <Column
                    field="type"
                    className="capitalize max-w-1 overflow-hidden whitespace-nowrap"

                />
            </DataTable>
        </div>);
    };


    // @ts-ignore
    return (
        <div className="grid">
            <div className="col-12 lg:col-6 xl:col-4">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Backend Status</span>
                            <div className="text-900 font-medium text-xl"> {isConnected ? "Connected" : "Disconnected"}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round"
                             style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-chevron-circle-up text-blue-500 text-xl" />
                        </div>
                    </div>
                    <TimeAgo date={lastConnectionUpdate} />
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-4">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">XTABLES Status</span>
                            <div className="text-900 font-medium text-xl">{isConnected ? statusData?.connected ? "Connected" : "Disconnected" : "Disconnected"}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round"
                             style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-table text-blue-500 text-xl" />
                        </div>
                    </div>
                    <TimeAgo date={lastStatusUpdate} />
                </div>
            </div>

            <div className="col-12 lg:col-6 xl:col-4">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Data Size</span>
                            <div className="text-900 font-medium text-xl">{isConnected ? statusData?.connected ? getStringSize( statusData?.json) || "Unknown" : "Disconnected" : "Disconnected"}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round"
                             style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-android text-cyan-500 text-xl" />
                        </div>
                    </div>
                    <TimeAgo date={lastDataSizeUpdate} />
                </div>
            </div>
            <div className="col-12">
                <div className="card mb-0">

                    <Terminal
                        welcomeMessage="Welcome to XTABLES control panel!"
                        prompt="XTABLES $"
                        pt={{
                            root: 'bg-gray-900 text-white border-round',
                            prompt: 'text-gray-400 mr-2',
                            command: 'text-primary-300',
                            response: 'text-primary-300'
                        }}
                    />

                </div>

            </div>
            <div className="col-12">
                <div className="card mb-0">
                    <DataTable
                        ref={dt}
                        value={data}
                        selectionMode="single"
                        showGridlines={false}
                        globalFilterFields={['name', 'value']}
                        removableSort
                        filterDisplay="row"
                        expandedRows={expandedRows}
                        onRowToggle={(e) => setExpandedRows(e.data)}
                        loading={!isConnected || !statusData?.connected}
                        rowExpansionTemplate={rowExpansionTemplate}
                        dataKey="key"
                        scrollable
                        scrollHeight={"50vh"}
                        tableStyle={{ minWidth: '15rem'}}
                    >
                        <Column expander={allowExpansion} style={{width: '5rem'}}/>
                        <Column field="name" header="Name" sortable  f/>
                        <Column
                            field="value"
                            header="Value"
                            className="font-bold max-w-1 overflow-hidden whitespace-nowrap"

                            sortable
                        />
                        <Column
                            field="type"
                            header="Type"
                            className="capitalize max-w-1 overflow-hidden whitespace-nowrap"
                            sortable
                        />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};
function isValidJSON(jsonString) {
    try {
        JSON.parse(jsonString);
        return true; // The JSON is valid
    } catch (e) {
        return false; // The JSON is not valid
    }
}
function convertJSON(json) {
    const transformRecursively = (obj, parentKey = '') => {
        return Object.entries(obj).map(([key, value]) => {
            // Create a new object for the array
            let transformed = {
                key: parentKey ? `${parentKey}.${key}` : key, name: key
            };

            if (typeof value === 'object' && value !== null) {
                if (value.hasOwnProperty('value')) {
                    transformed.value = value.value;
                    transformed.type = (typeof JSON.parse(value.value)).toString()
                }
                // Recurse if there's nested data
                if (value.data) {
                    transformed.data = transformRecursively(value.data, transformed.key);
                }
            } else {
                transformed.value = value;
                transformed.type = (typeof JSON.parse(value)).toString()
            }

            return transformed;
        });
    };

    // Start the transformation with the top-level keys
    return transformRecursively(json);
}

export default Dashboard;
