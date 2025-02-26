/* eslint-disable @next/next/no-img-element */
'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { WebsocketContext } from '../../../layout/context/websocketcontext';
import TimeAgo from '../../../components/TimeAgo';
import Loader from '../../../components/XBOTLoader';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { TabPanel, TabView } from 'primereact/tabview';
import { Toast } from 'primereact/toast';
import { playErrorNotificationSound, playSuccessNotificationSound } from '../../../utilities/notification';
import { InputText } from 'primereact/inputtext';
import { Divider } from 'primereact/divider';
import { Badge } from 'primereact/badge';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { Chips } from 'primereact/chips';
import { Dropdown } from 'primereact/dropdown';
import { isValidFile, isValidPath } from '../../../utilities/utilities';


const Dashboard = () => {
    const { isConnected, lastConnectionUpdate, sendMessageAndWaitForCondition } = useContext(WebsocketContext);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const isMounted = useRef(true); // Tracks if the component is mounted
    const timeoutId = useRef(null); // Stores the timeout ID persistently
    const [newData, setNewData] = useState(null);
    const [saveChangesDialogVisible, setSaveChangesDialogVisible] = useState(false);
    const [wifiSSIDs, setWifiSSIDs] = useState([]);
    const [lock, setLock] = useState(false);
    useEffect(() => {
        isMounted.current = true; // Set the mounted flag
        let isRequestInProgress = false;

        const sendRequest = () => {
            if (isMounted.current && isConnected && !isRequestInProgress) {
                isRequestInProgress = true;
                sendMessageAndWaitForCondition({ type: 'CONFIG-GET' }, (m) => m.type === 'CONFIG-GET')
                    .then((message) => {
                        setData((d) => {
                            if (d?.LAST_UPDATED !== message.message?.LAST_UPDATED) setLastUpdate(new Date());
                            setLock(d => {
                                if (!d) {
                                    setNewData(message.message);
                                }
                                return true;
                            });
                            return message.message;
                        });
                        isRequestInProgress = false;
                        if (isMounted.current) {
                            timeoutId.current = setTimeout(sendRequest, 1000);
                        }
                    })
                    .catch(() => {
                        isRequestInProgress = false;
                        if (isMounted.current) {
                            timeoutId.current = setTimeout(sendRequest, 1000);
                        }
                    });
            }
        };

        sendRequest();

        // Cleanup on component unmount
        return () => {
            isMounted.current = false; // Mark the component as unmounted
            if (timeoutId.current) {
                clearTimeout(timeoutId.current); // Clear any active timeouts
            }
        };
    }, [isConnected, sendMessageAndWaitForCondition, loading]);

    function updateFields() {
        setNewData(data);
        toast.current.show({
            severity: 'success',
            summary: 'Fields Updated!',
            detail: 'The fields have been updated!'
        });
        playSuccessNotificationSound();
    }

    function save() {
        setLoading(true);
        sendMessageAndWaitForCondition({
                type: 'CONFIG-SAVE',
                message: JSON.stringify({})
            }, (m) =>
                m.type === 'CONFIG-SAVE'
        ).then((m) => {
            if (m?.message?.success) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Config Saved!',
                    detail: m?.message?.message || 'The config was saved.'
                });
                playSuccessNotificationSound();
            } else {
                toast.current.show({
                    severity: 'error',
                    summary: 'Failed to save!',
                    detail: m?.message?.message || 'Unknown Message...'
                });
                playErrorNotificationSound();
            }
            setLoading(false);
        })
            .catch((e) => {
                toast.current.show({
                    severity: 'error',
                    summary: 'Exception Occurred!',
                    detail: e?.message || 'Unknown Exception...'
                });
                playErrorNotificationSound();
                setLoading(false);
            });
    }

    function get_wifi_list() {
        setLoading(true);
        sendMessageAndWaitForCondition({
                type: 'WIFI-LIST'
            }, (m) =>
                m.type === 'WIFI-LIST'
        ).then((m) => {
            if (m?.message?.success && m?.message?.message) {
                let json = JSON.parse(m?.message?.message);
                setWifiSSIDs(json.sort((a, b) => (b?.signalStrength ?? 0) - (a?.signalStrength ?? 0)));

                setLoading(false);
            } else {
                console.log(m);
                toast.current.show({
                    severity: 'error',
                    summary: 'Failed to list!',
                    detail: m?.message?.message || 'Unknown Message...'
                });
                playErrorNotificationSound();
            }
            setLoading(false);
        })
            .catch((e) => {
                toast.current.show({
                    severity: 'error',
                    summary: 'Exception Occurred!',
                    detail: e?.message || e?.message?.message || 'Unknown Exception...'
                });
                playErrorNotificationSound();
                setLoading(false);
            });
    }

    function reload() {
        setLoading(true);
        sendMessageAndWaitForCondition({
                type: 'CONFIG-RELOAD',
                message: JSON.stringify({})
            }, (m) =>
                m.type === 'CONFIG-RELOAD'
        ).then((m) => {
            if (m?.message?.success) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Config Reloaded!',
                    detail: m?.message?.message || 'The config was reloaded.'
                });
                playSuccessNotificationSound();
            } else {
                toast.current.show({
                    severity: 'error',
                    summary: 'Failed to reload!',
                    detail: m?.message?.message || 'Unknown Exception...'
                });
                playErrorNotificationSound();
            }
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

    function set() {
        setLoading(true);
        sendMessageAndWaitForCondition({
                type: 'CONFIG-SET',
                message: JSON.stringify(newData)
            }, (m) =>
                m.type === 'CONFIG-SET'
        ).then((m) => {
            if (m?.message?.success) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Config Updated!',
                    detail: m?.message?.message || 'The config was updated.'
                });

                setLock(false);
                playSuccessNotificationSound();
            } else {
                toast.current.show({
                    severity: 'error',
                    summary: 'Failed to update!',
                    detail: m?.message?.message || 'Unknown Exception...'
                });
                playErrorNotificationSound();
            }
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

    useEffect(() => {
        const keysToRemove = ['LAST_UPDATED', 'LAST_RELOADED'];
        let copyNewData = { ...newData };
        let copyData = { ...data };

        keysToRemove.forEach(key => {
            if (key && key in copyData) {
                delete copyData[key];
            }
            if (key && key in copyNewData) {
                delete copyNewData[key];
            }
        });
        if (JSON.stringify(copyData) !== JSON.stringify(copyNewData)) setSaveChangesDialogVisible(true); else setSaveChangesDialogVisible(false);
    }, [newData, data]);


    // @ts-ignore
    return (
        <div className="grid fadeIn">
            <Dialog modal={false} closable={false}
                    footer={() => (
                        <div><Button loading={loading} disabled={!isConnected} label="Save" icon="pi pi-check"
                                     onClick={set} /><Button loading={loading} disabled={!isConnected}
                                                             severity={'danger'}
                                                             label="Reset" icon="pi pi-times" onClick={() => {
                            setNewData(data);
                        }} /></div>)} position={'bottom-right'} header="Changes Detected!"
                    visible={saveChangesDialogVisible} onHide={() => {
                if (!saveChangesDialogVisible) return;
                setSaveChangesDialogVisible(false);
            }}>
                Would you like to save your changes?
            </Dialog>
            <Toast ref={toast} />
            <div className="col-12 lg:col-4">
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

            <div className="col-12 lg:col-4">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Last Updated</span>
                            <div
                                className="text-900 font-medium text-xl">{isConnected ?
                                data?.LAST_UPDATED ? (
                                    <TimeAgo date={data?.LAST_UPDATED} />) : 'Unknown' : 'Disconnected'}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round"
                             style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-save text-blue-500 text-xl" />
                        </div>
                    </div>
                    <TimeAgo date={lastUpdate} />
                </div>
            </div>
            <div className="col-12 lg:col-4">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Last Reloaded</span>
                            <div
                                className="text-900 font-medium text-xl">{isConnected ?
                                data?.LAST_RELOADED ? (
                                    <TimeAgo date={data?.LAST_RELOADED} />) : 'Unknown' : 'Disconnected'}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round"
                             style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-sync text-blue-500 text-xl" />
                        </div>
                    </div>
                    <TimeAgo date={lastUpdate} />
                </div>
            </div>
            <div className={'col-12'}>
                <div className="card">
                    <div className={'grid mt-1'}>
                        <div className={'col-12 lg:col-6'}>
                            <Button disabled={!isConnected} loading={loading} onClick={save} outlined={true}
                                    label={'Save'} severity={'warning'}
                                    className={'w-full'} />
                        </div>
                        <div className={'col-12 lg:col-6'}>
                            <Button disabled={!isConnected} loading={loading} onClick={reload} label={'Reload'}
                                    severity={'info'}
                                    className={'w-full'} />
                        </div>
                        <div className={'col-12'}>
                            <Button outlined={true} disabled={!isConnected} loading={loading} onClick={updateFields}
                                    label={'Update Fields'}
                                    severity={'secondary'}
                                    className={'w-full'} />
                        </div>
                    </div>

                </div>
            </div>
            <div className={'col-12'}>
                <div className="card">
                    <TabView scrollable={true}>
                        <TabPanel disabled={!isConnected || loading} className={'w-full'} header="RIO"
                                  leftIcon="pi pi-microchip mr-2">

                            <Divider align="center">
                                <Badge value="RoboRIO Hostname"></Badge>
                            </Divider>
                            <InputText className={'w-full'} placeholder={'Hostname'} value={newData?.ROBORIO_HOSTNAME}
                                       onChange={(e) => setNewData(prev => ({
                                           ...prev,
                                           ROBORIO_HOSTNAME: e.target.value
                                       }))} />
                            <Divider align="center">
                                <Badge value="RoboRIO Address"></Badge>
                            </Divider>
                            <InputText className={'w-full'} placeholder={'Address'} value={newData?.ROBORIO_ADDRESS}
                                       onChange={(e) => setNewData(prev => ({
                                           ...prev,
                                           ROBORIO_ADDRESS: e.target.value
                                       }))} />
                            <Divider align="center">
                                <Badge value="RoboRIO Username"></Badge>
                            </Divider>
                            <InputText className={'w-full'} placeholder={'Username'} value={newData?.ROBORIO_USERNAME}
                                       onChange={(e) => setNewData(prev => ({
                                           ...prev,
                                           ROBORIO_USERNAME: e.target.value
                                       }))} />
                            <Divider align="center">
                                <Badge value="RoboRIO Server"></Badge>
                            </Divider>
                            <InputText className={'w-full'} placeholder={'Server'} value={newData?.ROBORIO_SERVER}
                                       onChange={(e) => setNewData(prev => ({
                                           ...prev,
                                           ROBORIO_SERVER: e.target.value
                                       }))} />

                        </TabPanel>
                        <TabPanel disabled={!isConnected || loading} className={'w-full'} header="Server"
                                  leftIcon="pi pi-server mr-2">
                            <Divider align="center">
                                <Badge value="Password"></Badge>
                            </Divider>
                            <InputText className={'w-full'} placeholder={'Password'} value={newData?.SERVER_PASSWORD}
                                       onChange={(e) => setNewData(prev => ({
                                           ...prev,
                                           SERVER_PASSWORD: e.target.value
                                       }))} />
                        </TabPanel>
                        <TabPanel disabled={!isConnected || loading} className={'w-full'} header="Machines"
                                  leftIcon="pi pi-users mr-2">
                            <Divider align="center">
                                <Badge value="Connect Timeout"></Badge>
                            </Divider>
                            <InputNumber showButtons={true} suffix={' ms'} className={'w-full'}
                                         placeholder={'SSH Connect Timeout'}
                                         value={newData?.SERVERS_CONNECT_TIMEOUT}
                                         onValueChange={(e) => setNewData(prev => ({
                                             ...prev,
                                             SERVERS_CONNECT_TIMEOUT: e.value.toString()
                                         }))} />
                            <Divider align="center">
                                <Badge value="Retry Timeout"></Badge>
                            </Divider>
                            <InputNumber showButtons={true} suffix={' ms'} className={'w-full'}
                                         placeholder={'SSH Retry Timeout'}
                                         value={newData?.SERVERS_RETRY_TIMEOUT}
                                         onValueChange={(e) => setNewData(prev => ({
                                             ...prev,
                                             SERVERS_RETRY_TIMEOUT: e.value?.toString()
                                         }))} />
                            <Divider align="center">
                                <Badge value="Username"></Badge>
                            </Divider>
                            <InputText className={'w-full'} placeholder={'Username'} value={newData?.SERVERS_USERNAME}
                                       onChange={(e) => setNewData(prev => ({
                                           ...prev,
                                           SERVERS_USERNAME: e.target.value
                                       }))} />
                            <Divider align="center">
                                <Badge value="Password"></Badge>
                            </Divider>
                            <InputText className={'w-full'} placeholder={'Password'} value={newData?.SERVERS_PASSWORD}
                                       onChange={(e) => setNewData(prev => ({
                                           ...prev,
                                           SERVERS_PASSWORD: e.target.value
                                       }))} />
                            <Divider align="center">
                                <Badge value="Sync Host Directory"></Badge>
                            </Divider>
                            <InputText invalid={!isValidPath(newData?.SYNC_DIRECTORY)}className={'w-full'} placeholder={'Host Directory'} value={newData?.SYNC_DIRECTORY}
                                       onChange={(e) => setNewData(prev => ({
                                           ...prev,
                                           SYNC_DIRECTORY: e.target.value
                                       }))} />
                            <Divider align="center">
                                <Badge value="Sync Target Directory"></Badge>
                            </Divider>
                            <InputText invalid={!isValidPath(newData?.SYNC_TARGET_DIRECTORY)} className={'w-full'} placeholder={'Target Directory'} value={newData?.SYNC_TARGET_DIRECTORY}
                                       onChange={(e) => setNewData(prev => ({
                                           ...prev,
                                           SYNC_TARGET_DIRECTORY: e.target.value
                                       }))} />
                            <Divider align="center">
                                <Badge value="Services"></Badge>
                            </Divider>
                            <div className="p-fluid">
                                <Chips separator={','} placeholder={'Services'} value={newData?.SERVICES}
                                       onChange={(e) =>
                                           setNewData(prev => {
                                               if (e.value.length > prev?.SERVICES?.length && prev?.SERVICES?.includes(e.value[e.value.length - 1])) {
                                                   toast.current.show({
                                                       severity: 'error',
                                                       summary: 'Duplicate Services!',
                                                       detail: 'There cannot be multiple duplicate services!'
                                                   });
                                                   playErrorNotificationSound();
                                                   return prev;
                                               } else {
                                                   return ({
                                                       ...prev,
                                                       SERVICES: e.value
                                                   });
                                               }
                                           })
                                       } />
                            </div>
                            <Divider align="center">
                                <Badge value="PhotonVision"></Badge>
                            </Divider>
                            <div className="p-fluid">
                                <Chips separator={','} placeholder={'Hostnames'} value={newData?.PHOTONVISION_COPROCESSOR_HOSTNAMES}
                                       onChange={(e) =>
                                           setNewData(prev => {
                                               if (e.value.length > prev?.PHOTONVISION_COPROCESSOR_HOSTNAMES?.length && prev?.PHOTONVISION_COPROCESSOR_HOSTNAMES?.includes(e.value[e.value.length - 1])) {
                                                   toast.current.show({
                                                       severity: 'error',
                                                       summary: 'Duplicate Hostnames!',
                                                       detail: 'There cannot be multiple duplicate hostnames!'
                                                   });
                                                   playErrorNotificationSound();
                                                   return prev;
                                               } else {
                                                   return ({
                                                       ...prev,
                                                       PHOTONVISION_COPROCESSOR_HOSTNAMES: e.value
                                                   });
                                               }
                                           })
                                       } />
                            </div>
                        </TabPanel>
                        <TabPanel disabled={!isConnected || loading} className={'w-full'} header="Docker"
                                  leftIcon="pi pi-image mr-2">
                            <Divider align="center">
                                <Badge value="Project Directory"></Badge>
                            </Divider>
                            <InputText invalid={!isValidPath(newData?.PROJECT_DIRECTORY)} className={'w-full'} placeholder={'Directory'} value={newData?.PROJECT_DIRECTORY}
                                       onChange={(e) => setNewData(prev => ({
                                           ...prev,
                                           PROJECT_DIRECTORY: e.target.value
                                       }))} />
                            <Divider align="center">
                                <Badge value="Images Directory"></Badge>
                            </Divider>
                            <InputText invalid={!isValidPath(newData?.DOCKER_IMAGES_DIRECTORY)} className={'w-full'} placeholder={'This is where the images are saved.'} value={newData?.DOCKER_IMAGES_DIRECTORY}
                                       onChange={(e) => setNewData(prev => ({
                                           ...prev,
                                           DOCKER_IMAGES_DIRECTORY: e.target.value
                                       }))} />
                            <Divider align="center">
                                <Badge value="Docker Compose File Directory"></Badge>
                            </Divider>
                            <InputText invalid={!isValidFile(newData?.DOCKER_COMPOSE_FILE_DIRECTORY, "yml")} className={'w-full'} placeholder={'File Directory'} value={newData?.DOCKER_COMPOSE_FILE_DIRECTORY}
                                       onChange={(e) => setNewData(prev => ({
                                           ...prev,
                                           DOCKER_COMPOSE_FILE_DIRECTORY: e.target.value
                                       }))} />
                        </TabPanel>
                        <TabPanel disabled={!isConnected || loading} className={'w-full'} header="XTABLES"
                                  leftIcon="pi pi-table mr-2">

                        </TabPanel>

                        <TabPanel disabled={!isConnected || loading} className={'w-full'} header="Mapping"
                                  leftIcon="pi pi-map mr-2">

                        </TabPanel>
                        <TabPanel disabled={!isConnected || loading} className={'w-full'} header="Preferences"
                                  leftIcon="pi pi-user mr-2">

                        </TabPanel>
                        <TabPanel disabled={!isConnected || loading} className={'w-full'} header="General"
                                  leftIcon="pi pi-cog mr-2">
                            <Divider align="center">
                                <Badge value="Internet WiFi SSID"></Badge>
                            </Divider>
                            <Dropdown panelFooterTemplate={() => (
                                <div className="py-2 px-3">
                                    {newData?.WIFI_SSID ? (
                                        <span>
                        <b>{newData?.WIFI_SSID}</b> selected.
                    </span>
                                    ) : (
                                        'No SSID selected.'
                                    )}
                                </div>
                            )} showClear={true} editable={true} itemTemplate={(option) => (
                                <div className="flex align-items-center">
                                    {getWifiSVG(option?.signalStrength ?? 0)}

                                    <div className={'text-lg my-2'}>{option?.ssid}</div>
                                </div>
                            )} className={'w-full'} placeholder={'Select Internet'}
                                      value={newData?.WIFI_SSID}
                                      onChange={(e) => setNewData(prev => ({
                                          ...prev,
                                          WIFI_SSID: e.value?.ssid ?? e.value
                                      }))}
                                      options={wifiSSIDs}
                                      virtualScrollerOptions={{
                                          lazy: true,
                                          onLazyLoad: get_wifi_list,
                                          itemSize: 30,
                                          showLoader: true,
                                          loading: loading,
                                          delay: 250
                                      }}
                            />

                            <Divider align="center">
                                <Badge value="Robot WiFi SSID"></Badge>
                            </Divider>
                            <Dropdown panelFooterTemplate={() => (
                                <div className="py-2 px-3">
                                    {newData?.ROBOT_WIFI_SSID ? (
                                        <span>
                        <b>{newData?.ROBOT_WIFI_SSID}</b> selected.
                    </span>
                                    ) : (
                                        'No SSID selected.'
                                    )}
                                </div>
                            )} showClear={true} editable={true} itemTemplate={(option) => (
                                <div className="flex align-items-center">
                                    {getWifiSVG(option?.signalStrength ?? 0)}

                                    <div className={'text-lg my-2'}>{option?.ssid}</div>
                                </div>
                            )} className={'w-full'} placeholder={'Select Robot'}
                                      value={newData?.ROBOT_WIFI_SSID}
                                      onChange={(e) => setNewData(prev => ({
                                          ...prev,
                                          ROBOT_WIFI_SSID: e.value?.ssid ?? e.value
                                      }))}
                                      options={wifiSSIDs}
                                      virtualScrollerOptions={{
                                          lazy: true,
                                          onLazyLoad: get_wifi_list,
                                          itemSize: 30,
                                          showLoader: true,
                                          loading: loading,
                                          delay: 250
                                      }}
                            />
                        </TabPanel>
                    </TabView>
                </div>
            </div>
        </div>
    );
};

function getWifiSVG(strength) {
    if (strength >= 66)
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M12 18h.01m-2.838-2.828a4 4 0 0 1 5.656 0m-8.485-2.829a8 8 0 0 1 11.314 0" />
            </svg>
        );

    if (strength >= 33)
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M12 18h.01m-2.838-2.828a4 4 0 0 1 5.656 0" />
            </svg>
        );
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" strokeLinecap="round"
                  strokeLinejoin="round" strokeWidth="2" d="M12 18h.01" />
        </svg>
    );
}

export default Dashboard;
