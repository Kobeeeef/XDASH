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


const Dashboard = () => {
    const toast = useRef(null);
    const { isConnected, lastConnectionUpdate, sendMessageAndWaitForCondition } = useContext(WebsocketContext);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [devices, setDevices] = useState([]);
    const [selectedDevices, setSelectedDevices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [rebootDialogVisible, setRebootDialogVisible] = useState(false);
    const [transferFilesInputDialogVisible, setTransferFilesInputDialogVisible] = useState(false);
    const [transferFilesDialogVisible, setTransferFilesDialogVisible] = useState(false);
    const [finalResponseData, setFinalResponseData] = useState(null);
    const [finalResponseStatus, setFinalResponseStatus] = useState(null);
    const rebootStepperRef = useRef(null);
    const transferFilesStepperRef = useRef(null);

    const [localDirectoryInput, setLocalDirectoryInput] = useState(null);
    const [targetDirectoryInput, setTargetDirectoryInput] = useState(null);
    useEffect(() => {
        let isRequestInProgress = false;

        const sendRequest = () => {
            if (isConnected && !isRequestInProgress) {
                isRequestInProgress = true;
                try {
                    sendMessageAndWaitForCondition({ type: 'DEVICES-DATA-LIMITED' }, (m) => m.type === 'DEVICES-DATA-LIMITED')
                        .then((message) => {
                            setDevices(d => {
                                try {
                                    const json = JSON.parse(message?.message?.devices);
                                    if (d.length !== json?.length) setLastUpdate(new Date());
                                    return json;
                                } catch (e) {
                                    return [];
                                }
                            });
                            isRequestInProgress = false;
                            // Call the function again immediately after the previous request starts
                            setTimeout(sendRequest, 200);
                        })
                        .catch(() => {
                            isRequestInProgress = false;
                            // Retry immediately on failure
                            setTimeout(sendRequest, 400);
                        });
                } catch (e) {
                    console.log(e)
                }
            }
        };

        sendRequest();

        // Cleanup on component unmount
        return () => {
            isRequestInProgress = false;
        };
    }, [isConnected, sendMessageAndWaitForCondition]);
    function transferFiles() {
        setLoading(true);
        setTransferFilesDialogVisible(true);
        setTransferFilesInputDialogVisible(false)
        setFinalResponseData(null);
        setFinalResponseStatus(null);
        setSelectedDevices(devices => {
            return devices.map(m => {
                m.success = null
                m.response = null
                return m
            });
        })
        sendMessageAndWaitForCondition({
            type: 'DEVICES-TRANSFER-FILES',
            message: JSON.stringify({
                servers: selectedDevices.map(m => m.server),
                localDirectory: localDirectoryInput,
                remoteDirectory: targetDirectoryInput
            })
        }, (m) => {
            if (m.type === 'DEVICES-TRANSFER-FILES') {
                const msg = JSON.parse(m.message);
                if (msg.finished) {
                    if (transferFilesStepperRef.current) transferFilesStepperRef.current.setActiveStep(selectedDevices.length + 2);
                    setFinalResponseData(prevState => ({
                        ...prevState,
                        response: msg?.response ?? 'There was no response back from server.',
                    }));
                    setFinalResponseStatus(msg?.success === true ? true : msg?.success === false ? false : null);
                    return true;
                }
                if (transferFilesStepperRef.current)
                    transferFilesStepperRef.current.setActiveStep(msg.step);

                if(msg.step === 0) {

                    setFinalResponseData(prevState => ({
                        ...prevState,
                        tar_response: msg.response,
                        tar_success: msg.success
                    }));
                }
                if(msg.step === selectedDevices.length + 1) {
                    setFinalResponseData(prevState => ({
                        ...prevState,
                        cleanup_response: msg.response,
                        cleanup_success: msg.success
                    }));
                }
                if (msg.server) {
                    setSelectedDevices(prevState =>
                        prevState.map(s =>
                            s.server === msg.server
                                ? {
                                    ...s,
                                    response: msg.response || s.response,
                                    success: msg?.success
                                }
                                : s
                        )
                    );

                }
                return false;
            }

        }, 1200000)
            .then(() => {
                setLoading(false);
            })
            .catch((e) => {
                toast.current.show({
                    severity: 'error',
                    summary: 'Exception Occurred!',
                    detail: e?.message || 'Unknown Exception...'
                });
                if (transferFilesStepperRef.current)
                    transferFilesStepperRef.current.setActiveStep(selectedDevices.length + 1);
                setFinalResponseStatus(false)
                setFinalResponseData({ response: e?.message || 'Unknown Exception...'})
                setLoading(false);
            });
    }
    function reboot() {
        setLoading(true);
        setRebootDialogVisible(true);
        setFinalResponseData(null);
        setFinalResponseStatus(null);
        setSelectedDevices(devices => {
            return devices.map(m => {
                m.success = null
                m.response = null
                return m
            });
        })
        sendMessageAndWaitForCondition({
            type: 'DEVICES-REBOOT',
            message: JSON.stringify(selectedDevices.map(m => m.server))
        }, (m) => {
            if (m.type === 'DEVICES-REBOOT') {
                const msg = JSON.parse(m.message);
                if (msg.finished) {
                    if (rebootStepperRef.current) rebootStepperRef.current.setActiveStep(selectedDevices.length);
                    setFinalResponseData({ response: msg?.response ?? 'There was no response back from server.'});
                    setFinalResponseStatus(msg?.success === true ? true : msg?.success === false ? false : null);
                    return true;
                }
                if (rebootStepperRef.current)
                    rebootStepperRef.current.setActiveStep(msg.step);
                if (msg.server) {
                    let server = selectedDevices.find(s => s.server === msg.server);
                    if (server) {
                        if (msg.response) {
                            server.response = msg.response;
                        }
                        if (msg.success) {
                            server.success = msg.success;
                        } else {
                            server.success = false;
                        }
                    }
                }
                return false;
            }

        }, 5000)
            .then(() => {
                setLoading(false);
            })
            .catch((e) => {
                toast.current.show({
                    severity: 'error',
                    summary: 'Exception Occurred!',
                    detail: e?.message || 'Unknown Exception...'
                });
                setLoading(false);
            });
    }

    // @ts-ignore
    return (
        <div className="grid fadeIn">
            <Toast ref={toast} />
            <Dialog header={'Select Host & Target Destination'} draggable={false}
                    visible={transferFilesInputDialogVisible}
                    style={{ width: '50vw' }} onHide={() => {
                if (!transferFilesInputDialogVisible) return;
                setTransferFilesInputDialogVisible(false);
            }} footer={() => (
                <Button loading={loading} onClick={transferFiles}
                        disabled={!isConnected || !localDirectoryInput || !targetDirectoryInput} label={'Execute'}
                        severity={'danger'} className={'w-full'}></Button>
            )}>
                <Divider align="center">
                    <Badge value="Local Directory"></Badge>
                </Divider>

                <InputText placeholder={'Local Directory Path'} className={'w-full'} value={localDirectoryInput}
                           onChange={(e) => setLocalDirectoryInput(e.target.value)} />


                <Divider align="center">
                    <Badge value="Target Directory"></Badge>
                </Divider>

                <InputText placeholder={'Target Directory Path'} className={'w-full'} value={targetDirectoryInput}
                           onChange={(e) => setTargetDirectoryInput(e.target.value)} />
            </Dialog>
            <Dialog draggable={false} visible={transferFilesDialogVisible} style={{ width: '50vw' }} onHide={() => {
                if (!transferFilesDialogVisible) return;
                setTransferFilesDialogVisible(false);
            }}>
                <Stepper ref={transferFilesStepperRef} style={{ flexBasis: '50rem' }} orientation="vertical">
                    <StepperPanel header={'Tar Files'}>
                        <div className="flex flex-column h-12rem items-center justify-center">
                            <div
                                className={('flex justify-content-center align-items-center text-2xl mb-2 font-bold ') + (finalResponseData?.tar_success === true ? 'text-green-500' : finalResponseData?.tar_success === false ? 'text-red-500' : 'text-yellow-500')}>
                                {finalResponseData?.tar_success === true ? 'All Files Compressed' : finalResponseData?.tar_success === false ? 'Systems Failed Compression' : 'Awaiting Final Response'}
                            </div>
                            <div
                                className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                                {finalResponseData?.tar_response || finalResponseData?.response}
                            </div>
                        </div>
                    </StepperPanel>
                    {selectedDevices.map((m, key) => {
                        return (
                            <StepperPanel header={m?.server ?? 'Unknown Server'} key={key}>
                                <div className="flex flex-column h-12rem items-center justify-center">
                                    <div
                                        className={('flex justify-content-center align-items-center text-2xl mb-2 font-bold ') + (m?.success === true ? 'text-green-500' : m?.success === false ? 'text-red-500' : 'text-yellow-500')}>
                                        {m?.success === true ? 'Files Transferred Successfully' : m?.success === false ? 'System Failed Transfer' : 'System Awaiting Transfer'}
                                    </div>
                                    <div
                                        className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                                        {m?.response}
                                    </div>
                                </div>


                            </StepperPanel>
                        );
                    })}
                    <StepperPanel header={'Cleanup'}>
                        <div className="flex flex-column h-12rem items-center justify-center">
                            <div
                                className={('flex justify-content-center align-items-center text-2xl mb-2 font-bold ') + (finalResponseData?.cleanup_success === true ? 'text-green-500' : finalResponseData?.cleanup_success === false ? 'text-red-500' : 'text-yellow-500')}>
                                {finalResponseData?.cleanup_success === true ? 'All Files Compressed' : finalResponseData?.cleanup_success === false ? 'Systems Failed Compression' : 'Awaiting Final Response'}
                            </div>
                            <div
                                className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                                {finalResponseData?.cleanup_response || finalResponseData?.response}
                            </div>
                        </div>
                    </StepperPanel>
                    <StepperPanel header={'Final Status'}>
                        <div className="flex flex-column h-12rem items-center justify-center">
                            <div
                                className={('flex justify-content-center align-items-center text-2xl mb-2 font-bold ') + (finalResponseStatus === true ? 'text-green-500' : finalResponseStatus === false ? 'text-red-500' : 'text-yellow-500')}>
                                {finalResponseStatus === true ? 'All Files Transfered' : finalResponseStatus === false ? 'Systems Failed Transfer' : 'Awaiting Final Response'}
                            </div>
                            <div
                                className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                                {finalResponseData?.response}
                            </div>
                        </div>
                    </StepperPanel>
                </Stepper>
            </Dialog>
            <Dialog draggable={false} visible={rebootDialogVisible} style={{ width: '50vw' }} onHide={() => {
                if (!rebootDialogVisible) return;
                setRebootDialogVisible(false);
            }}>
                <Stepper ref={rebootStepperRef} style={{ flexBasis: '50rem' }} orientation="vertical">

                    {selectedDevices.map((m, key) => {
                        return (
                            <StepperPanel header={m?.server ?? 'Unknown Server'} key={key}>
                                <div className="flex flex-column h-12rem items-center justify-center">
                                    <div
                                        className={('flex justify-content-center align-items-center text-2xl mb-2 font-bold ') + (m?.success === true ? 'text-green-500' : m?.success === false ? 'text-red-500' : 'text-yellow-500')}>
                                        {m?.success === true ? 'Command Sent Successfully' : m?.success === false ? 'System Failed Reboot' : 'System Awaiting Reboot'}
                                    </div>
                                    <div
                                        className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                                        {m?.response}
                                    </div>
                                </div>


                            </StepperPanel>
                        );
                    })}

                    <StepperPanel header={'Finish'}>
                        <div className="flex flex-column h-12rem items-center justify-center">
                            <div
                                className={('flex justify-content-center align-items-center text-2xl mb-2 font-bold ') + (finalResponseStatus === true ? 'text-green-500' : finalResponseStatus === false ? 'text-red-500' : 'text-yellow-500')}>
                                {finalResponseStatus === true ? 'All Systems Rebooted' : finalResponseStatus === false ? 'Systems Failed Reboot' : 'Awaiting Final Response'}
                            </div>
                            <div
                                className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                                {finalResponseData?.response}
                            </div>
                        </div>

                    </StepperPanel>
                </Stepper>
            </Dialog>
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
                <div
                    className="card mb-0 flex items-center justify-between w-full p-5 border border-gray-300 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <i className="pi pi-unlock" style={{ fontSize: '2rem', color: '#5865f2' }}></i>
                        <div className="ml-4">
                            <div className="text-xl font-semibold">Unlock & Mount Filesystem</div>
                            <span className="text-sm text-gray-500 block">Unlock the filesystem and mount the disk for immediate access.</span>
                        </div>
                    </div>
                    <Button icon={'pi pi-play-circle'} severity={'danger'} loading={loading}
                            disabled={!isConnected || selectedDevices.length === 0} label={'Execute'}
                            className="ml-auto"></Button>
                </div>
            </div>
            <div className="col-12">
                <div
                    className="card mb-0 flex items-center justify-between w-full p-5 border border-gray-300 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <i className="pi pi-folder" style={{ fontSize: '2rem', color: '#5865f2' }}></i>
                        <div className="ml-4">
                            <div className="text-xl font-semibold">Transfer and Synchronize Folder</div>
                            <span className="text-sm text-gray-500 block">Compress, transfer, and extract the folder on the remote system.</span>
                        </div>
                    </div>
                    <Button onClick={() => setTransferFilesInputDialogVisible(true)} icon={'pi pi-play-circle'}
                            severity={'danger'} loading={loading}
                            disabled={!isConnected || selectedDevices.length === 0} label={'Execute'}
                            className="ml-auto"></Button>
                </div>
            </div>
            <div className="col-12">
                <div
                    className="card mb-0 flex items-center justify-between w-full p-5 border border-gray-300 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <i className="pi pi-save" style={{ fontSize: '2rem', color: '#5865f2' }}></i>
                        <div className="ml-4">
                            <div className="text-xl font-semibold">Reload & Deploy</div>
                            <span className="text-sm text-gray-500 block"> Reload service daemons and redeploy services.</span>
                        </div>
                    </div>
                    <Button onClick={() => setTransferFilesInputDialogVisible(true)} icon={'pi pi-play-circle'}
                            severity={'danger'} loading={loading}
                            disabled={!isConnected || selectedDevices.length === 0} label={'Execute'}
                            className="ml-auto"></Button>
                </div>
            </div>
            <div className="col-12">
                <div
                    className="card mb-0 flex items-center justify-between w-full p-5 border border-gray-300 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <i className="pi pi-wifi" style={{ fontSize: '2rem', color: '#5865f2' }}></i>
                        <div className="ml-4">
                            <div className="text-xl font-semibold">Restart Networking</div>
                            <span className="text-sm text-gray-500 block">Restart network services to re-establish connections.</span>
                        </div>
                    </div>
                    <Button icon={'pi pi-play-circle'} severity={'danger'} loading={loading}
                            disabled={!isConnected || selectedDevices.length === 0} label={'Execute'}
                            className="ml-auto"></Button>
                </div>
            </div>
            <div className="col-12">
                <div
                    className="card mb-0 flex items-center justify-between w-full p-5 border border-gray-300 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <i className="pi pi-sitemap" style={{ fontSize: '2rem', color: '#5865f2' }}></i>
                        <div className="ml-4">
                            <div className="text-xl font-semibold">Flush DNS Cache</div>
                            <span className="text-sm text-gray-500 block">Clear DNS cache to resolve domain resolution issues.</span>
                        </div>
                    </div>
                    <Button icon={'pi pi-play-circle'} severity={'danger'} loading={loading}
                            disabled={!isConnected || selectedDevices.length === 0} label={'Execute'}
                            className="ml-auto"></Button>
                </div>
            </div>
            <div className="col-12">
                <div
                    className="card mb-0 flex items-center justify-between w-full p-5 border border-gray-300 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <i className="pi pi-inbox" style={{ fontSize: '2rem', color: '#5865f2' }}></i>
                        <div className="ml-4">
                            <div className="text-xl font-semibold">Update Software Packages</div>
                            <span className="text-sm text-gray-500 block">Update installed software packages to their latest versions.</span>
                        </div>
                    </div>
                    <Button icon={'pi pi-play-circle'} severity={'danger'} loading={loading}
                            disabled={!isConnected || selectedDevices.length === 0} label={'Execute'}
                            className="ml-auto"></Button>
                </div>
            </div>

            <div className="col-12">
                <div
                    className="card mb-0 flex items-center justify-between w-full p-5 border border-gray-300 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <i className="pi pi-sync" style={{ fontSize: '2rem', color: '#5865f2' }}></i>
                        <div className="ml-4">
                            <div className="text-xl font-semibold">Reboot Machine</div>
                            <span className="text-sm text-gray-500 block">Restart the system for a clean state.</span>
                        </div>
                    </div>
                    <Button onClick={reboot} icon={'pi pi-play-circle'} severity={'danger'} loading={loading}
                            disabled={!isConnected || selectedDevices.length === 0} label={'Execute'}
                            className="ml-auto"></Button>
                </div>
            </div>
            <div className="col-12">
                <div
                    className="card mb-0 flex items-center justify-between w-full p-5 border border-gray-300 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <i className="pi pi-book" style={{ fontSize: '2rem', color: '#5865f2' }}></i>
                        <div className="ml-4">
                            <div className="text-xl font-semibold">Custom Script</div>
                            <span className="text-sm text-gray-500 block">Run a custom script on the machines.</span>
                        </div>
                    </div>
                    <Button icon={'pi pi-play-circle'} severity={'danger'} loading={loading}
                            disabled={!isConnected || selectedDevices.length === 0} label={'Execute'}
                            className="ml-auto"></Button>
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
