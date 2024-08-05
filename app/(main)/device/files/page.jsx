'use client';


import React, { useContext, useEffect, useRef, useState } from 'react';

import { WebsocketContext } from '@/layout/context/websocketcontext';
import TimeAgo from '@/components/TimeAgo';
import { Tag } from 'primereact/tag';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { Toast } from 'primereact/toast';

import { useRouter, useSearchParams } from 'next/navigation';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import Loader from '../../../../components/XBOTLoader';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Tooltip } from 'primereact/tooltip';
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar'
import generateUuid from '../../../../utilities/uuid';


const Dashboard = () => {
    const toast = useRef(null);
    const searchParams = useSearchParams();
    const router = useRouter();
    const serverParam = searchParams.get('server');
    const [server, setServer] = useState(null);
    const directoryParam = searchParams.get('directory');
    const [directory, setDirectory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);
    const {
        isConnected,
        lastConnectionUpdate,
        sendMessageAndWaitForCondition,
        listenTillCondition
    } = useContext(WebsocketContext);
    const [lastDeviceUpdate, setLastDeviceUpdate] = useState(new Date());
    const [data, setData] = useState({});
    const [warningDialogVisible, setWarningDialogVisible] = useState(false);
    const [fileUploadDialogVisible, setFileUploadDialogVisible] = useState(false);
    const [status, setStatus] = useState(null)
    const [progress, setProgress] = useState(0)
    const [disabled, setDisabled] = useState(false)
    useEffect(() => {
        if (serverParam) setServer(serverParam);
        if (directoryParam) setDirectory(directoryParam);
    }, [serverParam, directoryParam, isConnected]);
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (isConnected && !disabled) {
                sendMessageAndWaitForCondition({
                    type: 'DEVICE-DATA',
                    message: server
                }, (m) => m.type === 'DEVICE-DATA')
                    .then((message) => {
                        if (!message?.message?.exists) {
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
    }, [isConnected, server, disabled]);

    useEffect(() => {
        reloadFiles();
    }, [server, directory, isConnected]);

    function reloadFiles() {
        if (isConnected && server) {
            if(!directory) {
                router.replace(`/device/files?server=${server}&directory=/`);
                return;
            }
            setLoading(true);
            sendMessageAndWaitForCondition({
                type: 'DEVICE-SCP-LIST',
                message: JSON.stringify({
                    server: server,
                    directory: directory
                })
            }, (m) => m.type === 'DEVICE-SCP-LIST')
                .then((message) => {
                    if(message.message.success) {
                        const files = JSON.parse(message.message.files);
                        setFiles(files);
                        setLoading(false);
                    }
                }).catch((e) => {
                    console.log(e)
                const errorMessage = e.message || 'An unexpected error occurred.';
                toast.current.show({
                    severity: 'error',
                    summary: 'Failed to reload',
                    detail: errorMessage
                });
                setLoading(false);
            });
        }
    }

    const fileUploadRef = useRef(null);


    const uploadHandler = async ({ files }) => {
        let uuid = generateUuid();
        const formData = new FormData();
        formData.append('server', server);
        formData.append('directory', directory);
        formData.append('id',uuid);
        // Append each file
        Array.from(files).forEach(file => {
            formData.append('files[]', file);
        });
        setLoading(true)
        setDisabled(true)
        try {
            let id = "TRANSFER-PROGRESS-" + uuid
            listenTillCondition((message) => {
                if(message?.type === id) {
                    const msg = JSON.parse(message.message)
                    setProgress(msg?.percentage?.toFixed(0)  ?? 0)
                    setStatus(msg?.message ?? "Unknown")
                    if(msg?.finished) {
                        setDisabled(false)
                        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Files uploaded successfully' });
                        reloadFiles()
                        return true;
                    }
                    return false;
                }
            })
            const xhr = new XMLHttpRequest();

            xhr.open('POST', 'http://localhost:8080/api/upload', true);

            // Track progress
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentComplete = (event.loaded / event.total) * 100;
                    setProgress(percentComplete.toFixed(0));
                    setStatus(`Uploading to backend: ${percentComplete.toFixed(0)}%`);
                }
            };

            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    setProgress(100);
                    setStatus('Upload complete...');
                    setDisabled(false)
                } else {
                    setProgress(0);
                    setStatus('Upload failed to backend');
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'File upload failed' });
                }
            };

            xhr.onerror = () => {
                setProgress(0);
                setStatus('Upload error');
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'File upload failed due to a network error' });
            };

            xhr.send(formData);


        } catch (error) {
            setLoading(false)
            setDisabled(false)
            console.error('Upload error:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.message });
        }
    };

    const onTemplateRemove = (file, callback) => {
        setProgress(0)
        callback();
    };

    const headerTemplate = (options) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        return (
            <div className={className}
                 style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {uploadButton}
                {cancelButton}
            </div>
        );
    };

    const itemTemplate = (file, props) => {
        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center" style={{ width: '40%' }}>

                    <span className="flex flex-column text-left ml-3">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
                <Button type="button" icon="pi pi-times"
                        className="p-button-outlined p-button-rounded p-button-danger ml-auto"
                        onClick={() => onTemplateRemove(file, props.onRemove)} />
            </div>
        );
    };

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                <i className="pi pi-image mt-3 p-5" style={{
                    fontSize: '5em',
                    borderRadius: '50%',
                    backgroundColor: 'var(--surface-b)',
                    color: 'var(--surface-d)'
                }}></i>
                <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">
                    Drag and drop files here
                </span>
            </div>
        );
    };

    const chooseOptions = {
        icon: 'pi pi-fw pi-images',
        iconOnly: true,
        className: 'custom-choose-btn p-button-rounded p-button-outlined'
    };
    const uploadOptions = {
        icon: 'pi pi-fw pi-cloud-upload',
        iconOnly: true,
        className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined'
    };
    const cancelOptions = {
        icon: 'pi pi-fw pi-times',
        iconOnly: true,
        className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined'
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
            <Dialog   maximizable={true}  style={{ width: '80vw', height: '60vh' }} visible={fileUploadDialogVisible} resizable={false} onHide={() => {

                setFileUploadDialogVisible(false);
            }}>
                <div>

                    <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
                    <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
                    <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

                    <FileUpload disabled={disabled || loading} ref={fileUploadRef} multiple
                                maxFileSize={100000000}
                                customUpload={true}
                                uploadHandler={uploadHandler}
                                onClear={() => {
                                    setProgress(0)
                                }}
                                headerTemplate={headerTemplate} itemTemplate={itemTemplate}
                                emptyTemplate={emptyTemplate}
                                chooseOptions={chooseOptions} uploadOptions={uploadOptions}
                                cancelOptions={cancelOptions} />
                    {progress > 0 && (
                        <div style={{ marginTop: '20px' }}>
                            <ProgressBar value={progress} />
                            <div>{status}</div>
                        </div>
                    )}
                </div>
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
                    <DataTable
                        showGridlines={false}
                        emptyMessage={Loader({
                            message: loading && (files ?? []).length > 0 ? 'Loading resources' : loading ? 'Requesting resources' : !isConnected ? 'Connecting to backend' : !data?.exists ? 'Machine not running XCASTER' : data?.status !== 'CONNECTED' ? 'Connecting to machine' : 'No resources found',
                            speed: data?.status === 'CONNECTING' ? 'fast' : 'normal'
                        })}
                        value={loading || (files ?? []).length === 0 || !isConnected || data?.status !== 'CONNECTED' || !data?.exists ? [] : files}
                        paginator rows={5}
                        rowsPerPageOptions={[5, 10, 25, 50, 75]}
                        tableStyle={{ minWidth: '50rem' }}
                        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                        currentPageReportTemplate="{first} to {last} of {totalRecords}"
                        paginatorLeft={() => (<div className={'flex'}><BreadCrumb
                            model={directory
                                ?.split('/')
                                .filter(m => m) // Remove empty elements
                                .map((m, i, arr) => {
                                    // Join elements from 0 to i to form the path
                                    const path = arr.slice(0, i + 1).join('/');
                                    return {
                                        label: m,
                                        disabled: directory === '/' + path,
                                        command: () => {
                                            router.replace(`/device/files?server=${server}&directory=/${path}`);
                                        }
                                    };
                                })} home={{
                            icon: 'pi pi-home', disabled: directory === '/', command(event) {
                                router.replace(`/device/files?server=${server}&directory=/`);
                            }
                        }} /></div>)}

                        paginatorRight={() => (
                            <div className={'flex'}><Button disabled={!isConnected || data?.status !== 'CONNECTED'}
                                                            loading={loading} type="button"
                                                            icon="pi pi-upload" text onClick={() => {
                                                                setProgress(0)
                                                                setFileUploadDialogVisible(true)
                            }}
                            /><Button disabled={!isConnected || data?.status !== 'CONNECTED'}
                                      loading={loading} type="button"
                                      icon={'pi pi-refresh ' + (loading && 'pi-spin')} text
                                      onClick={reloadFiles} /></div>)}>
                        <Column filter field="name" frozen={true} header="Name" style={{ width: '25%' }} />
                        <Column field="size" header="Size" style={{ width: '25%' }} />
                        <Column field="date" header="Date" style={{ width: '25%' }} />
                        <Column field="permissions" header="Permissions" style={{ width: '25%' }} />

                        <Column
                            header="Manage"
                            body={(col) => (
                                <Button
                                    loading={loading}
                                    disabled={!isConnected || data?.status !== 'CONNECTED'}
                                    icon={'pi ' + (col.permissions?.startsWith('d') ? 'pi-folder-open' : 'pi-download')}
                                    text
                                    onClick={() => {
                                        if (col?.permissions?.startsWith('d')) {
                                            setLoading(true);
                                            router.replace(`/device/files?server=${server}&directory=` + directory + `${directory.endsWith('/') ? '' : '/'}${col.name}`);
                                        }
                                    }}
                                />
                            )}
                        />
                    </DataTable>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
