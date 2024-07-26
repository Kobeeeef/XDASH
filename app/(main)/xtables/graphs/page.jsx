'use client';
import React, { useContext, useEffect, useRef, useState } from 'react';

import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { Chart } from 'primereact/chart';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { ToggleButton } from 'primereact/togglebutton';
import { WebsocketContext } from '../../../../layout/context/websocketcontext';
import TimeAgo from '../../../../components/TimeAgo';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import KeyValidator from '../../../../utilities/KeyValidator';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { exportExcel } from '../../../../utilities/fileManager';

const GraphsPage = () => {
    const dt = useRef();
    const [options, setOptions] = useState({});
    const [addKeyDialogVisible, setAddKeyDialogVisible] = useState(false);
    const { isConnected, lastConnectionUpdate, sendMessageAndWaitForCondition } = useContext(WebsocketContext);
    const [xtableStatus, setXtableStatus] = useState(false);
    const [lastStatusUpdate, setLastStatusUpdate] = useState(new Date());
    const [chartData, setChartData] = useState({});
    const [chartType, setChartType] = useState({ name: 'Line Chart', type: 'line' });
    const { layoutConfig } = useContext(LayoutContext);
    const toast = useRef(null);
    const [recordIntervalMS, setRecordIntervalMS] = useState(1000);
    const [recording, setRecording] = useState(false);
    const [keys, setKeys] = useState([]);
    const documentStyle = getComputedStyle(document.documentElement);
    const [removeKeyInput, setRemoveKeyInput] = useState(null);
    const [keyInput, setKeyInput] = useState('');
    const [dataTable, setDataTable] = useState();
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (isConnected) {
                sendMessageAndWaitForCondition({ type: 'XTABLES-DATA' }, (m) => m.type === 'XTABLES-DATA')
                    .then((message) => {
                        setXtableStatus((a) => {
                            if (message?.message?.connected !== a) setLastStatusUpdate(new Date());
                            if (!message?.message?.connected) setRecording(false);
                            return message?.message?.connected ?? false;
                        });

                        if (recording) {
                            const currentDate = new Date().toISOString()
                            const data = convertJSON(JSON.parse(message.message.json)) || [];

                            const findDataEntry = (data, key) => {
                                for (let entry of data) {
                                    if (entry.key === key) {
                                        return entry;
                                    }
                                    if (entry.data) {
                                        const foundEntry = findDataEntry(entry.data, key);
                                        if (foundEntry) {
                                            return foundEntry;
                                        }
                                    }
                                }
                                return null;
                            };
                            setDataTable((prevDataTableState) => {
                                const obj = { time: currentDate };
                                keys.forEach((key) => {
                                    let dataEntry = findDataEntry(data, key);
                                    if (dataEntry) {
                                        obj[dataEntry.key] = dataEntry?.value
                                    }
                                });
                                return [obj, ...(prevDataTableState || [])]
                            })
                            setChartData((prevState) => {
                                let dataAdded = false; // Flag to check if any new data was added
                                const newDatasets = (prevState.lineData?.datasets || []).map((dataset) => ({ ...dataset }));
                                const newLabels = [...(prevState.lineData?.labels || [])];

                                keys.forEach((key) => {
                                    let dataset = newDatasets.find((ds) => ds.label === key);
                                    let dataEntry = findDataEntry(data, key);

                                    const value = dataEntry?.value;
                                    if (dataEntry) {
                                        if (!dataset) {
                                            dataset = {
                                                label: key,
                                                data: [],
                                                fill: false,
                                                tension: 0.4
                                            };
                                            newDatasets.push(dataset);
                                        }
                                        dataset.data = [...(dataset.data || []), value];
                                        dataAdded = true; // New data was added
                                    }
                                });

                                if (dataAdded) {
                                    newLabels.push(currentDate); // Add the new label only if data was added

                                    const returnChartData = {
                                        lineData: {
                                            labels: newLabels,
                                            datasets: newDatasets
                                        }
                                    };
                                    return returnChartData;
                                } else {
                                    return prevState; // Return the previous state if no new data was added
                                }
                            });

                        }
                    })
                    .catch(() => {
                    });
            }
        }, recordIntervalMS);
        const intervalId2 = setInterval(() => {
            if (isConnected) {
                sendMessageAndWaitForCondition({ type: 'XTABLES-STATUS' }, (m) => m.type === 'XTABLES-STATUS')
                    .then((message) => {
                        setXtableStatus((a) => {
                            if (message?.message?.connected !== a) setLastStatusUpdate(new Date());
                            return message?.message?.connected ?? false;
                        });
                    })
                    .catch(() => {
                    });
            }
        }, 500);
        // Cleanup interval on component unmount
        return () => {
            clearInterval(intervalId);
            clearInterval(intervalId2);
        };
    }, [isConnected, sendMessageAndWaitForCondition, recordIntervalMS, recording]);
    useEffect(() => {
        const textColor = documentStyle.getPropertyValue('--text-color') || '#495057';
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary') || '#6c757d';
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border') || '#dfe7ef';

        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    },
                    border: {
                        display: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    },
                    border: {
                        display: false
                    }
                }
            }
        };

        setOptions({
            lineOptions
        });
    }, [layoutConfig]);
    const productDialogFooter = (
        <>
            <Button
                label="Cancel"
                icon="pi pi-times"
                text
                onClick={() => {
                    setAddKeyDialogVisible(false);
                    setKeyInput(null);
                }}
            />
            <Button
                disabled={KeyValidator(keyInput) !== null}
                label="Save"
                icon="pi pi-check"
                onClick={() => {
                    setAddKeyDialogVisible(false);
                    setKeys((a) => {
                        a.push(keyInput);
                        return a;
                    });
                    setKeyInput(null);
                }}
            />
        </>
    );
    return (
        <div className="grid p-fluid fadeIn">
            <Toast ref={toast} />
            <Dialog
                style={{ width: '450px' }}
                visible={addKeyDialogVisible}
                header="Key Details"
                modal
                className="p-fluid"
                footer={productDialogFooter}
                onHide={() => {
                    setAddKeyDialogVisible(false);
                    setKeyInput(null);
                }}
            >
                <div className="field">
                    <label htmlFor="key">Key Name</label>
                    <InputText
                        id="key"
                        value={keyInput}
                        onChange={(e) => {
                            setKeyInput(e.target.value);
                        }}
                        required
                        autoFocus
                        className={classNames({
                            'p-invalid': KeyValidator(keyInput) !== null
                        })}
                    />
                    {KeyValidator(keyInput) === null ? null :
                        <small className="p-invalid">{KeyValidator(keyInput)}</small>}
                </div>
            </Dialog>
            <div className="col-12 lg:col-6 xl:col-4">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Backend Status</span>
                            <div
                                className={'text-900 font-medium text-xl ' + (isConnected ? 'text-green-600' : 'text-red-600 animate-pulse')}> {isConnected ? 'Connected' : 'Disconnected'}</div>
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
                            <div
                                className={'text-900 font-medium text-xl ' + (isConnected && xtableStatus ? 'text-green-600' : 'text-red-600 animate-pulse')}>{isConnected ? (xtableStatus ? 'Connected' : 'Disconnected') : 'Disconnected'}</div>
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
                            <span className="block text-500 font-medium mb-3">Intervals Recorded</span>
                            <div
                                className="text-900 font-medium text-xl">{dataTable?.length ?? 0}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round"
                             style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-database text-blue-500 text-xl" />
                        </div>
                    </div>
                    <TimeAgo date={lastStatusUpdate} />
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <div className="grid">
                        <div className="col-12 lg:col-3">
                            <Button
                                disabled={recording || !isConnected || !xtableStatus}
                                label="Add"
                                icon="pi pi-plus"
                                onClick={() => {
                                    setAddKeyDialogVisible(true);
                                }}
                            />
                        </div>
                        <div className="col-12 md:col-3">
                            <div className="p-inputgroup">
                                <Button
                                    onClick={() => {
                                        setKeys((a) => {
                                            const removeIndex = a.indexOf(removeKeyInput);
                                            if (removeIndex === -1) {
                                                toast.current.show({
                                                    severity: 'error',
                                                    summary: 'Failure',
                                                    detail: 'The key was not found.'
                                                });
                                                return a;
                                            }
                                            let success = a.splice(removeIndex, 1).length > 0;
                                            if (success) {
                                                setRemoveKeyInput(null);
                                                toast.current.show({
                                                    severity: 'success',
                                                    summary: 'Success',
                                                    detail: 'The key was removed.'
                                                });
                                            } else {
                                                toast.current.show({
                                                    severity: 'error',
                                                    summary: 'Failure',
                                                    detail: 'The key could not be removed.'
                                                });
                                            }
                                            return a;
                                        });
                                        setRemoveKeyInput(null);
                                    }}
                                    disabled={recording || !isConnected || !xtableStatus || !keys?.length}
                                    severity={'danger'}
                                    label="Remove"
                                />
                                <Dropdown
                                    disabled={recording || !isConnected || !xtableStatus || !keys?.length}
                                    value={removeKeyInput}
                                    onChange={(e) => {
                                        setRemoveKeyInput(e.value);
                                    }}
                                    options={keys}
                                    placeholder="Delete Key"
                                />
                            </div>
                        </div>
                        <div className="col-12 lg:col-3 ">
                            <InputNumber disabled={recording || !isConnected || !xtableStatus} value={recordIntervalMS}
                                         onValueChange={(e) => setRecordIntervalMS(e.value ?? 100)}
                                         suffix={` millisecond${recordIntervalMS > 1 ? 's' : ''} per record`} />
                        </div>
                        <div className="col-12 lg:col-3 ">
                            <Dropdown
                                disabled={recording || !isConnected || !xtableStatus}
                                value={chartType}
                                onChange={(e) => {
                                    setChartType(e.value);
                                }}
                                options={[
                                    { name: 'Line Chart', type: 'line' },
                                    {
                                        name: 'Bar Chart',
                                        type: 'bar'
                                    },
                                    { name: 'Radar Chart', type: 'radar' },
                                    {
                                        name: 'Polar Area',
                                        type: 'polarArea'
                                    },
                                    { name: 'Pie Chart', type: 'pie' },
                                    { name: 'Doughnut Chart', type: 'doughnut' }
                                ]}
                                optionLabel="name"
                                placeholder="Select Chart"
                            />
                        </div>
                        <div className="col-6">
                            <Button
                                disabled={!isConnected || !xtableStatus || recording || (!chartData?.lineData?.labels?.length && !(dataTable?.length ?? 0 === 0) && !(keys?.length ?? 0 === 0))}
                                label="Reset"
                                severity="danger"
                                onClick={() => {
                                    setChartData({});
                                    setDataTable([]);
                                    setKeys([]);
                                    toast.current.show({
                                        severity: 'success',
                                        summary: 'Success',
                                        detail: 'All settings and charts reset.'
                                    });
                                }}
                            />
                        </div>
                        <div className="col-6">
                            <ToggleButton disabled={!isConnected || !xtableStatus || !keys?.length}
                                          onLabel="Stop Recording" offLabel="Start Recording" checked={recording}
                                          onChange={(e) => setRecording(e.value)} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <Chart type={chartType?.type ?? 'line'} data={chartData.lineData}
                           options={options.lineOptions}></Chart>
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <div className="grid">
                        <div className={'col-6'}>
                            <Button disabled={(dataTable?.length ?? 0) === 0} label="Export CSV" icon="pi pi-file"
                                    onClick={() => {
                                        dt.current.exportCSV({ selectionOnly: false });
                                    }} />
                        </div>
                        <div className={'col-6'}>
                            <Button disabled={(dataTable?.length ?? 0) === 0} severity={'success'} label="Export Excel"
                                    icon="pi pi-file-excel" onClick={() => {
                                exportExcel('XTABLES-GRAPHS', dataTable);
                            }} />
                        </div>
                        <div className={'col-12'}>
                            <DataTable scrollable virtualScrollerOptions={{ itemSize: 15 }} scrollHeight="500px"
                                       ref={dt} emptyMessage="There is no data recorded."
                                       value={dataTable}
                            >
                                <Column field="time" header="Time"></Column>

                                {keys.map((key, i) => (
                                    <Column key={i} field={key} header={key} />
                                ))}
                            </DataTable>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

function convertJSON(json) {
    const transformRecursively = (obj, parentKey = '') => {
        return Object.entries(obj).map(([key, value]) => {
            // Create a new object for the array
            let transformed = {
                key: parentKey ? `${parentKey}.${key}` : key,
                name: key
            };

            if (typeof value === 'object' && value !== null) {
                if (value.hasOwnProperty('value')) {
                    transformed.value = value.value;
                    transformed.type = (typeof JSON.parse(value.value)).toString();
                }
                // Recurse if there's nested data
                if (value.data) {
                    transformed.data = transformRecursively(value.data, transformed.key);
                }
            } else {
                transformed.value = value;
                transformed.type = (typeof JSON.parse(value)).toString();
            }

            return transformed;
        });
    };

    // Start the transformation with the top-level keys
    return transformRecursively(json);
}

export default GraphsPage;
