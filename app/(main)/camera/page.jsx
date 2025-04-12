/* eslint-disable @next/next/no-img-element */
'use client';


import React, { useContext, useEffect, useRef, useState } from 'react';

import { WebsocketContext } from '../../../layout/context/websocketcontext';
import { Toast } from 'primereact/toast';
import TimeoutsDialog from '../../../components/TimeoutsDialog';
import { DataView } from 'primereact/dataview';
import { Knob } from 'primereact/knob';
import XBOTLoader from '../../../components/XBOTLoader';
import { Divider } from 'primereact/divider';
import { Image } from 'primereact/image';


const Dashboard = () => {
    const toast = useRef(null);
    const {
        isConnected,
        lastConnectionUpdate,
        sendMessageAndWaitForCondition,
        sendMessageAndWaitForConditionWithManage,
        timeoutsRef
    } = useContext(WebsocketContext);
    const [reloadKey, setReloadKey] = useState(0); // Key to trigger re-renders
    // setReloadKey((prevKey) => prevKey + 1);
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState([{ hostname: 'ORANGEPI', ip: '10.0.0.112', cameras: 1 }]);
    const isMounted = useRef(true);
    const timeoutId = useRef(null);

    // useEffect(() => {
    //     isMounted.current = true; // Set the mounted flag
    //     let isRequestInProgress = false;
    //
    //     const sendRequest = () => {
    //         if (isMounted.current && isConnected && !isRequestInProgress) {
    //             isRequestInProgress = true;
    //             try {
    //                 sendMessageAndWaitForCondition({ type: 'DEVICES-DATA-LIMITED' }, (m) => m.type === 'DEVICES-DATA-LIMITED')
    //                     .then((message) => {
    //                         setDevices((d) => {
    //                             try {
    //                                 const json = JSON.parse(message?.message?.devices);
    //                                 if (d.length !== json?.length) setLastUpdate(new Date());
    //                                 return json;
    //                             } catch (e) {
    //                                 return [];
    //                             }
    //                         });
    //                         isRequestInProgress = false;
    //                         if (isMounted.current) {
    //                             timeoutId.current = setTimeout(sendRequest, 200); // Schedule next call
    //                         }
    //                     })
    //                     .catch(() => {
    //                         isRequestInProgress = false;
    //                         if (isMounted.current) {
    //                             timeoutId.current = setTimeout(sendRequest, 400); // Retry on failure
    //                         }
    //                     });
    //             } catch (e) {
    //                 console.error(e);
    //                 isRequestInProgress = false;
    //             }
    //         }
    //     };
    //
    //     sendRequest();
    //
    //     // Cleanup on component unmount
    //     return () => {
    //         isMounted.current = false; // Mark as unmounted
    //         if (timeoutId.current) {
    //             clearTimeout(timeoutId.current); // Clear any active timeouts
    //         }
    //     };
    // }, [isConnected, sendMessageAndWaitForCondition]);


    const template = (data, index) => {
        return (
            <div className={('col-12')}>
                <div className="flex justify-content-center w-full"><p className={'text-2xl'}>
                    {data?.hostname ?? 'Unknown Hostname'}
                </p></div>
                <Divider />
                <div className="grid my-2">
                    <div className="grid" key={reloadKey}>
                        {
                            Array.from({ length: data?.cameras || -1 }).map((_, index) => {
                                const basePort = 1181 + index * 2;
                                return (
                                    <>
                                        <div className="col-6">
                                            <Image
                                                src={`http://${data?.ip}:${basePort}/stream.mjpg`}
                                                alt="Raw Stream"
                                                width="100%"
                                                preview={true}
                                                style={{
                                                    width: "100%",
                                                    objectFit: "fill",
                                                }}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <Image
                                                src={`http://${data?.ip}:${basePort + 1}/stream.mjpg`}
                                                alt="Processed Stream"
                                                width="100%"
                                                preview={true}
                                                style={{
                                                    width: "100%",
                                                    objectFit: "fill",
                                                }}
                                            />
                                        </div>
                                    </>
                                );
                            })
                        }
                    </div>

                </div>

            </div>
        );
    };
    const itemTemplate = (items) => {
        if (!items || items.length === 0) return <XBOTLoader message={'Waiting for machines'} />;

        let list = items.map((product, index) => {
            return template(product, index);
        });
        return <div className="grid">{list}</div>;

    };


    return (
        <div className="grid fadeIn">
            <Toast ref={toast} />
            <TimeoutsDialog timeoutsRef={timeoutsRef} />
            <div className={'col-12'}>
                <div className="card">
                    <DataView value={value} listTemplate={itemTemplate} />
                </div>
            </div>
        </div>
    );
};




export default Dashboard;
