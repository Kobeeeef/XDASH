/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useContext, useEffect, useRef, useState } from 'react';

import { WebsocketContext } from '../../../../layout/context/websocketcontext';
import { Toast } from 'primereact/toast';
import TimeoutsDialog from '../../../../components/TimeoutsDialog';
import { DataView } from 'primereact/dataview';
import { Knob } from 'primereact/knob';
import XBOTLoader from '../../../../components/XBOTLoader';
import { Divider } from 'primereact/divider';

const Dashboard = () => {
    const toast = useRef(null);
    const { isConnected, lastConnectionUpdate, sendMessageAndWaitForCondition, sendMessageAndWaitForConditionWithManage, timeoutsRef } = useContext(WebsocketContext);

    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState([{ hostname: 'ORANGEPI' }]);
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

    // @ts-ignore
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
const template = (data, index) => {
    return (
        <div className={'col-12'}>
            <div className="flex justify-content-center w-full">
                <p className={'text-2xl'}>{data?.hostname ?? 'Unknown Hostname'}</p>
            </div>
            <Divider />
            <div className="grid my-2">
                <div className="col-12 lg:col-6 xl:col-3 flex align-items-center justify-content-center flex-column">
                    <Knob valueColor={data?.ram > 50 ? 'RED' : 'var(--primary-color, Black)'} size={150} valueTemplate={data?.ram ? '{value}%' : 'N/A'} value={data?.ram ?? 0} />
                    <div className={'font-bold'}>RAM</div>
                </div>
                <div className="col-12 lg:col-6 xl:col-3 flex align-items-center justify-content-center flex-column">
                    <Knob valueColor={data?.memory > 50 ? 'RED' : 'var(--primary-color, Black)'} size={150} valueTemplate={data?.memory ? '{value}%' : 'N/A'} value={data?.memory ?? 0} />
                    <div className={'font-bold'}>MEMORY</div>
                </div>
                <div className="col-12 lg:col-6 xl:col-3 flex align-items-center justify-content-center flex-column">
                    <Knob valueColor={data?.cpu > 50 ? 'RED' : 'var(--primary-color, Black)'} size={150} valueTemplate={data?.cpu ? '{value}%' : 'N/A'} value={data?.cpu ?? 0} />
                    <div className={'font-bold'}>CPU</div>
                </div>
                <div className="col-12 lg:col-6 xl:col-3 flex align-items-center justify-content-center flex-column">
                    <Knob valueColor={data?.network > 50 ? 'RED' : 'var(--primary-color, Black)'} size={150} valueTemplate={data?.network ? '{value}%' : 'N/A'} value={data?.network ?? 0} />
                    <div className={'font-bold'}>NETWORK</div>
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

export default Dashboard;
