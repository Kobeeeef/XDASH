/* eslint-disable @next/next/no-img-element */
'use client';


import React, { useContext, useEffect, useRef, useState } from 'react';

import { WebsocketContext } from '../../../layout/context/websocketcontext';
import TimeAgo from '../../../components/TimeAgo';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { MultiSelect } from 'primereact/multiselect';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Divider } from 'primereact/divider';
import { Badge } from 'primereact/badge';
import { SelectButton } from 'primereact/selectbutton';
import { isValidDirectoryPath, isValidPath } from '../../../utilities/utilities';
import { playErrorNotificationSound, playSuccessNotificationSound } from '../../../utilities/notification';
import { TabPanel, TabView } from 'primereact/tabview';
import { Terminal } from 'primereact/terminal';
import TerminalDisplay from '../../../components/TerminalDisplay';


const Dashboard = () => {
    const toast = useRef(null);
    const { isConnected, lastConnectionUpdate, sendMessageAndWaitForCondition } = useContext(WebsocketContext);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [devices, setDevices] = useState([]);
    const [selectedDevices, setSelectedDevices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [buildStatus, setBuildStatus] = useState({
        STARTING: [],
        BUILDING: [],
        SAVING: [],
        COMPLETED: [],
        CLEANING: [],
        FINISHED: [],
    })
    const stepperRef = useRef(null);
    const [buildIndex, setBuildIndex] = useState(0)
    const isMounted = useRef(true); // Tracks if the component is mounted
    const timeoutId = useRef(null); // Stores the timeout ID persistently

    useEffect(() => {
        isMounted.current = true; // Set the mounted flag
        let isRequestInProgress = false;

        const sendRequest = () => {
            if (isMounted.current && isConnected && !isRequestInProgress) {
                isRequestInProgress = true;
                try {
                    sendMessageAndWaitForCondition({ type: 'DEVICES-DATA-LIMITED' }, (m) => m.type === 'DEVICES-DATA-LIMITED')
                        .then((message) => {
                            setDevices((d) => {
                                try {
                                    const json = JSON.parse(message?.message?.devices);
                                    if (d.length !== json?.length) setLastUpdate(new Date());
                                    return json;
                                } catch (e) {
                                    return [];
                                }
                            });
                            isRequestInProgress = false;
                            if (isMounted.current) {
                                timeoutId.current = setTimeout(sendRequest, 200); // Schedule next call
                            }
                        })
                        .catch(() => {
                            isRequestInProgress = false;
                            if (isMounted.current) {
                                timeoutId.current = setTimeout(sendRequest, 400); // Retry on failure
                            }
                        });
                } catch (e) {
                    console.error(e);
                    isRequestInProgress = false;
                }
            }
        };

        sendRequest();

        // Cleanup on component unmount
        return () => {
            isMounted.current = false; // Mark as unmounted
            if (timeoutId.current) {
                clearTimeout(timeoutId.current); // Clear any active timeouts
            }
        };
    }, [isConnected, sendMessageAndWaitForCondition]);


    // @ts-ignore
    return (
        <div className="grid fadeIn">
            <Toast ref={toast} />
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
                            <span className="block text-500 font-medium mb-3">Total Machines</span>
                            <div
                                className="text-900 font-medium text-xl font-bold">{isConnected ? devices?.length ?? 0 : 'Disconnected'}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round"
                             style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-android text-cyan-500 text-xl" />
                        </div>
                    </div>
                    <TimeAgo date={lastUpdate} />
                </div>
            </div>
            <div className="col-12">
                <div className="card mb-0">
                    <MultiSelect disabled={!isConnected} onChange={(e) => {
                        const filtered = e.value.filter(e => e?.status !== 'CONNECTED');
                        if (filtered.length > 0) {
                            playErrorNotificationSound()
                            filtered.forEach(e => {
                                toast.current.show({
                                    severity: 'error',
                                    summary: 'Server Not Connected!',
                                    detail: `${e.server} is not connected.`
                                });
                            });
                        }
                        setSelectedDevices(e.value.filter(e => e?.status === 'CONNECTED'));
                    }} value={selectedDevices} options={devices} optionLabel="server" display="chip"
                                 placeholder="Select Machines" itemTemplate={template} className="w-full" />
                </div>
            </div>
            <div className="col-12">
                <div className="card mb-0">
                    <Stepper linear={true} ref={stepperRef} style={{ flexBasis: '50rem' }} orientation="vertical">
                        <StepperPanel header="Build">
                            <TabView activeIndex={buildIndex} scrollable={true}>
                                <TabPanel className={'w-full'} header="STARTING" leftIcon="pi pi-play-circle mr-2">
                                    <TerminalDisplay
                                        messages={buildStatus?.STARTING?.reverse() ?? []}
                                        loadingDots={true}
                                        placeholder={"Waiting for a message"}
                                    />
                                </TabPanel>
                                <TabPanel className={'w-full'} header="BUILDING" leftIcon="pi pi-hammer mr-2">
                                    <TerminalDisplay
                                        messages={buildStatus?.BUILDING?.reverse() ?? []}
                                        loadingDots={true}
                                        placeholder={"Waiting for a message"}
                                    />
                                </TabPanel>
                                <TabPanel className={'w-full'} header="SAVING" leftIcon="pi pi-save mr-2">
                                    <TerminalDisplay
                                        messages={buildStatus?.SAVING?.reverse() ?? []}
                                        loadingDots={true}
                                        placeholder={"Waiting for a message"}
                                    />
                                </TabPanel>
                                <TabPanel className={'w-full'} header="COMPLETED" leftIcon="pi pi-image mr-2">
                                    <TerminalDisplay
                                        messages={buildStatus?.COMPLETED?.reverse() ?? []}
                                        loadingDots={true}
                                        placeholder={"Waiting for a message"}
                                    />
                                </TabPanel>
                                <TabPanel className={'w-full'} header="CLEANING" leftIcon="pi pi-trash mr-2">
                                    <TerminalDisplay
                                        messages={buildStatus?.CLEANING?.reverse() ?? []}
                                        loadingDots={true}
                                        placeholder={"Waiting for a message"}
                                    />
                                </TabPanel>
                                <TabPanel className={'w-full'} header="FINISHED" leftIcon="pi pi-stop-circle mr-2">
                                    <TerminalDisplay
                                        messages={buildStatus?.FINISHED?.reverse() ?? []}
                                        loadingDots={true}
                                        placeholder={"Waiting for a message"}
                                    />
                                </TabPanel>
                            </TabView>
                        </StepperPanel>
                        <StepperPanel header="Transport & Execute">
                            <div className="flex flex-column h-12rem">
                                <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">Content II</div>
                            </div>
                            <div className="flex py-4 gap-2">
                                <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                                <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
                            </div>
                        </StepperPanel>
                        <StepperPanel header="Final Status">
                            <div className="flex flex-column h-12rem">
                                <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">Content III</div>
                            </div>
                            <div className="flex py-4">
                                <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                            </div>
                        </StepperPanel>
                    </Stepper>
                </div>
            </div>

        </div>
    );


};

const template = (option) => {
    return (
        <div className="ml-4 flex items-center justify-between w-full border border-gray-300 rounded-lg shadow-md">
            <span className="text-lg font-medium">{option.server}&nbsp;|&nbsp;{option.address}&nbsp;|&nbsp;</span>
            <span
                className={('text-lg font-bold ') + (option?.status === 'CONNECTED' ? 'text-green-500' : option?.status === 'CONNECTING' ? 'text-yellow-500' : 'text-red-500')}>{option.status}</span>
        </div>
    );
};


export default Dashboard;
