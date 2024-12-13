import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const TimeoutsDialog = ({ timeoutsRef, updateInterval=100 }) => {
    const [visible, setVisible] = useState(false);
    const [timeouts, setTimeouts] = useState([]);
    const lock = useRef(false)
    useEffect(() => {
        // Function to update the timeouts state
        const updateTimeouts = () => {
            const currentTimeouts = Object.entries(timeoutsRef.current || {}).map(([id, timeoutManager]) => ({
                id,
                timeLeft: timeoutManager.getTimeLeft(),
            }));
            setTimeouts(currentTimeouts);
            if(lock.current && currentTimeouts.length > 0) {
                setVisible(false)
                return;
            }
            if(lock && currentTimeouts.length === 0) {
                lock.current = false
            }
            if(!lock.current) setVisible(currentTimeouts.length > 0);
        };

        // Initial update and periodic refresh
        updateTimeouts();
        const interval = setInterval(updateTimeouts, updateInterval);

        return () => clearInterval(interval); // Cleanup on component unmount
    }, [timeoutsRef, updateInterval]);

    // Event handlers for timeout management
    const handleExtend = (id) => {
        const additionalTime = 5000; // 5 seconds
        timeoutsRef.current[id]?.extendTimeout(additionalTime);
    };

    const handleReduce = (id) => {
        const reductionTime = 5000; // 5 seconds
        timeoutsRef.current[id]?.reduceTimeout(reductionTime);
    };

    const handleCancel = (id) => {
        timeoutsRef.current[id]?.finish();
    };

    // Dialog footer with optional buttons (if needed)


    return (
        <Dialog
            header="Requests Manager"
            visible={visible}
            modal={false}
            onHide={() => {
                lock.current = true
                setVisible(false)
            }}
            position="top-left"
            draggable={true}
            resizable={false}
        >
            <DataTable value={timeouts} responsiveLayout="scroll">
                <Column field="id" header="ID" style={{ width: "50%" }}></Column>
                <Column
                    field="timeLeft"
                    header="ms"
                    style={{ width: "50%" }}
                    body={(rowData) => Math.max(0, rowData.timeLeft).toFixed(0)}
                ></Column>
                <Column
                    header="Extend"
                    body={(rowData) => (
                        <>
                            <Button
                                text={true}
                                icon="pi pi-plus"
                                className="p-button-rounded p-button-success p-mr-2"
                                onClick={() => handleExtend(rowData.id)}
                                tooltip="Extend Timeout"
                                tooltipOptions={{ position: "top" }}
                            />
                        </>
                    )}
                />
                <Column
                    header="Cancel"
                    body={(rowData) => (
                        <>

                            <Button
                                text={true}
                                icon="pi pi-times"
                                className="p-button-rounded p-button-danger"
                                onClick={() => handleCancel(rowData.id)}
                                tooltip="Cancel Timeout"
                                tooltipOptions={{ position: "top" }}
                            />
                        </>
                    )}
                />
            </DataTable>
        </Dialog>
    );
};

export default TimeoutsDialog;
