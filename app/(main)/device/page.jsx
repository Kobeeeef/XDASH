'use client';


import React, { useContext, useEffect, useRef, useState } from 'react';

import { WebsocketContext } from '@/layout/context/websocketcontext';
import TimeAgo from '@/components/TimeAgo';

import { Toast } from 'primereact/toast';

import { useSearchParams } from 'next/navigation';
import { InputText } from 'primereact/inputtext';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import LogComponent from '../../../utilities/Ansi';
import { SplitButton } from 'primereact/splitbutton';
import { AutoComplete } from 'primereact/autocomplete';
import linuxCommands from '../../../utilities/linuxCommands';


const Dashboard = () => {
    const [commands, setCommands] = useState([]);
    const toast = useRef(null);
    const searchParams = useSearchParams();
    const serverParam = searchParams.get('server');
    const [server, setServer] = useState(null);
    const {
        isConnected,
        lastConnectionUpdate,
        sendMessageAndWaitForCondition,
        sendMessage,
        socket
    } = useContext(WebsocketContext);
    const inputRef = useRef(null)
    const [indexState, setIndexState] = useState(0);
    const [first, setFirst] = useState(true);
    const [logs, setLogs] = useState([]);
    const logEndRef = useRef(null);
    const [input, setInput] = useState('');
    const [data, setData] = useState({});
    const [warningDialogVisible, setWarningDialogVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sudo, setSudo] = useState(false);
    const [lock, setLock] = useState(true);
    const [filteredCommands, setFilteredCommands] = useState([]);
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
                            setWarningDialogVisible(true);
                            setFirst(true)
                            setData({});
                        } else {
                            if(message.message?.status !== "CONNECTED") setFirst(true)
                            setData(message.message);
                            setWarningDialogVisible(false);
                        }

                    }).catch(() => {
                });
            }
        }, 100);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, [isConnected, server]);
    useEffect(() => {
        const handleTyping = () => {
            if (document.activeElement !== inputRef.current) {
                inputRef.current.focus();
            }
        };

        document.addEventListener('keydown', handleTyping);

        return () => {
            document.removeEventListener('keydown', handleTyping);
        };
    }, []);

    useEffect(() => {
        if (logEndRef && lock) logEndRef.current?.scrollIntoView({ behavior: 'instant' });
    }, [lock, logs]);
    useEffect(() => {
        const listener = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'DEVICE-SHELL') {
                const msg = JSON.parse(data.message);

                setLogs((a) => {
                    return [...a, '' + msg.response];
                });

            }
        };
        if (socket.current) {
            socket.current.addEventListener('message', listener);
            setLogs((a) => {
                return [...a, '\u001B[92mXDASH: Registered listener.'];
            });
        }
        return () => {
            socket.current.removeEventListener('message', listener);
            setLogs((a) => {
                return [...a, '\u001B[92mXDASH: Unregistered listener.'];
            });
        };
    }, [socket.current]);

    function sendCommand() {
        if (input.trim().toLowerCase() === 'clear') {
            setLogs([]);
            setInput('');
            return;
        } else if (!sudo && input.trim().toLowerCase().startsWith('exit')) {
            setFirst(true)
        }
        setLoading(true);
        setLogs((a) => {
            return [...a, '\u001B[92m$ ' + data?.hostname + ' ' + input];
        });
        setCommands(a => {
            return [...a, input];
        });
        const type = sudo ? 'DEVICE-COMMAND-SUDO' : 'DEVICE-COMMAND';
        sendMessage({
            type: type,
            message: JSON.stringify({
                server: server,
                command: input
            })
        });
        setInput('');
        setLoading(false);
    }

    function sendControl(control) {

        setLoading(true);
        setLogs((a) => {
            return [...a, '\u001B[92m$ ' + data?.hostname + ' ' + control];
        });
        const type = 'DEVICE-COMMAND-CONTROL';
        sendMessage({
            type: type,
            message: JSON.stringify({
                server: server,
                command: control
            })
        });
        setLoading(false);
    }


    const searchCommands = (event) => {
        setFilteredCommands([...new Set([...linuxCommands, ...(commands || [])])].filter(cmd => cmd?.startsWith(event.query)));
    };
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
                    <TimeAgo date={lastConnectionUpdate} />
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
                    <TimeAgo date={lastConnectionUpdate} />
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
                    <TimeAgo date={lastConnectionUpdate} />
                </div>
            </div>
            <div className={'col-12'}>
                <div className="card">
                    <div className="card">
                        <div className="overflow-y-auto" style={{ 'maxHeight': '40rem' }}>
                            {logs.map((log, index) => (

                                <LogComponent key={index} log={log} />
                            ))}
                            <div ref={logEndRef} />
                        </div>
                    </div>
                    <div className="p-inputgroup flex-1 w-full">
                        <SplitButton severity={first ? "success" : "danger"} disabled={!isConnected || data?.status !== 'CONNECTED'}
                                     label={first ? "Connect" : "Reconnect"}
                                     loading={loading}
                                     onClick={() => {
                                         setFirst(false)
                                         setLoading(true)
                                         sendMessageAndWaitForCondition({
                                             type: 'DEVICE-COMMAND-NEW-SESSION',
                                             message: server
                                         }, (a) => a.type === "DEVICE-COMMAND-NEW-SESSION").then((m) => {
                                             setLoading(false)
                                            if(m?.message?.success) {
                                                toast.current.show({
                                                    severity: 'success',
                                                    summary: 'Successful Creation',
                                                    detail: "A new shell channel has been created."
                                                });
                                            } else {
                                                toast.current.show({
                                                    severity: 'error',
                                                    summary: 'Unsuccessful Creation',
                                                    detail: "The new shell channel failed to create."
                                                });
                                            }

                                         }).catch(e => {
                                             const errorMessage = e.message || 'An unexpected error occurred.';
                                             toast.current.show({
                                                 severity: 'error',
                                                 summary: 'Failed To Connect',
                                                 detail: errorMessage
                                             });
                                             setLoading(false)
                                         }) ;
                                     }} model={[{
                            label: sudo ? 'Disable Root' : 'Enable Root',
                            icon: sudo ? 'pi pi-user' : 'pi pi-crown',
                            command: () => {
                                setSudo(a => !a);
                            }
                        }, {
                            label: lock ? 'Disable Lock' : 'Enable Lock',
                            icon: lock ? 'pi pi-lock' : 'pi pi-unlock',
                            command: () => {
                                setLock(a => !a);
                            }
                        }, {
                            label: 'Clear Terminal',
                            icon: 'pi pi-eraser',
                            command: () => {
                                setLogs([]);
                            }
                        }]} />
                        <span className="p-inputgroup-addon">
        <i className={'pi ' + (sudo ? 'pi-crown' : 'pi-user')}></i>
    </span>
                        <span
                            className={'p-inputgroup-addon font-bold ' + (isConnected && server && data?.address ? data?.status === 'CONNECTED' ? 'text-green-600' : data?.status === 'CONNECTING' ? 'animate-pulse-fast text-yellow-500' : 'animate-pulse text-red-600' : 'animate-pulse text-red-600')}>$ {server}</span>
                        <AutoComplete inputRef={inputRef} completeMethod={searchCommands} suggestions={filteredCommands}
                                      disabled={!isConnected || loading || data?.status !== 'CONNECTED'} value={input}
                                      onChange={(e) => {
                                          setInput(a => {
                                                  setIndexState(0);
                                                  return e.target.value;
                                              }
                                          );
                                      }
                                      } onKeyDown={(event) => {
                            if (input && (event.key === 'Enter' || event.key === 'NumpadEnter')) {
                                event.preventDefault();
                                sendCommand();
                            } else if (event.key === 'ArrowUp') {
                                event.preventDefault();
                                if (commands && commands.length) {
                                    const prevIndex = indexState - 1 < 0 ? commands.length - 1 : indexState - 1;
                                    const command = commands[prevIndex];
                                    setIndexState(prevIndex);
                                    setInput(command);
                                }
                            } else if (event.key === 'ArrowDown') {
                                event.preventDefault();
                                if (commands && commands.length) {
                                    const nextIndex = indexState + 1 >= commands.length ? 0 : indexState + 1;
                                    const command = commands[nextIndex];
                                    setIndexState(nextIndex);
                                    setInput(command);
                                }
                            } else if (event.ctrlKey && event.key === 'c') {
                                event.preventDefault();
                                sendControl('CTRL_C');
                            } else if (event.ctrlKey && event.key === 'j') {
                                event.preventDefault();
                                sendControl('CTRL_J');
                            } else if (event.ctrlKey && event.key === 'x') {
                                event.preventDefault();
                                sendControl('CTRL_X');
                            } else if (event.ctrlKey && event.key === 'd') {
                                event.preventDefault();
                                sendControl('CTRL_D');
                                setFirst(true)
                            }
                        }} />
                        <Button disabled={!isConnected || !input || data?.status !== 'CONNECTED'} loading={loading}
                                label="Send"
                                onClick={sendCommand} />
                    </div>
                </div>

            </div>


        </div>
    );
};

export default Dashboard;
