'use client';
import { Metadata } from 'next';
import Layout from '../../layout/layout';
import { WebsocketContext, WebSocketProvider } from '@/layout/context/websocketcontext';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { truncateString } from '@/utilities/utilities';
import { playErrorNotificationSound, playFatalNotificationSound, playNotificationSound } from '@/utilities/notification';
import { Button } from 'primereact/button';
import { ConfirmDialog } from 'primereact/confirmdialog';
import TimeAgo from '@/components/TimeAgo';
import TerminalDisplay from '@/components/TerminalDisplay';

interface AppLayoutProps {
    children: React.ReactNode;
}

// Component that accesses the WebSocket context
function AppLayout({ children }: AppLayoutProps) {
    const { latestLog, latestNotification }: any = useContext(WebsocketContext); // Now it will properly consume the context
    const toast = useRef<Toast | null>(null);
    const [fatalErrorDialogVisible, setFatalErrorDialogVisible] = useState(false);
    useEffect(() => {
        if (latestLog && latestLog?.PRIORITY < 4) {
            // Ensure latestLog has a valid PRIORITY
            toast.current?.show({
                severity: 'error',
                summary: latestLog?._HOSTNAME || latestLog?._COMM || latestLog?._SYSTEMD_UNIT || latestLog?.system || latestLog?._CMDLINE || latestLog?.SYSLOG_IDENTIFIER || 'unknown source',
                detail: truncateString(latestLog?.MESSAGE, 100) || 'There was a unknown error message on one of the machines.',
                life: 6000,
                closable: false
            });
            playErrorNotificationSound();
        }
    }, [latestLog]);
    useEffect(() => {
        if (latestNotification) {
            if (latestNotification?.type === 'normal' && latestNotification?.severity) {
                toast.current?.show({
                    severity: latestNotification?.severity,
                    summary: latestNotification?.summary,
                    detail: latestNotification?.detail,
                    life: 5000
                });
                if (latestNotification?.severity === 'error' || latestNotification?.severity === 'warn') {
                    playErrorNotificationSound();
                } else playNotificationSound();
            } else if (latestNotification?.type === 'fatal') {
                setFatalErrorDialogVisible(true);
                playFatalNotificationSound();
            }
        }
    }, [latestNotification]);

    return (
        <Layout>
            <Toast ref={toast} />
            <ConfirmDialog
                closable={false}
                group="notReady"
                visible={fatalErrorDialogVisible}
                content={({ headerRef, contentRef, footerRef, hide, message }) => (
                    <div className="flex flex-column align-items-center p-5 surface-overlay border-round" style={{ width: '100vh' }}>
                        <div className="border-circle bg-red-600 inline-flex justify-content-center align-items-center h-6rem w-6rem -mt-8">
                            <i className="pi pi-exclamation-triangle text-5xl"></i>
                        </div>
                        <span className="font-extrabold text-red-700 text-2xl block mb-2 mt-4" ref={headerRef}>
                            {latestNotification?.summary || 'Uncaught Backend Exception'}
                        </span>
                        <div className="grid w-full mt-4 overflow-y-auto" style={{ maxHeight: '50vh' }}>
                            <div className="col-12">
                                <div className="card mb-0">
                                    <div className="flex justify-content-between mb-3">
                                        <div>
                                            <span className="block text-500 font-medium mb-3">Exception</span>
                                            <div className="text-900 font-medium text-xl font-bold">{latestNotification?.detail ?? 'Unknown'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="card mb-0">
                                    <div className="flex justify-content-between mb-3">
                                        <div>
                                            <span className="block text-500 font-medium mb-3">Cause</span>
                                            <div className="text-900 font-medium text-xl font-bold">{latestNotification?.cause ?? 'Unknown'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="card mb-0">
                                    <div className="flex justify-content-between mb-3">
                                        <div>
                                            <span className="block text-500 font-medium mb-3">Class</span>
                                            <div className="text-900 font-medium text-xl font-bold">{latestNotification?.exceptionType ?? 'Unknown'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <TerminalDisplay messages={latestNotification?.stackTrace ?? ['No stack trace available']} />
                            </div>
                        </div>
                        <div className="flex align-items-center gap-2 mt-4">
                            <Button
                                outlined={true}
                                label="Okay"
                                onClick={(event) => {
                                    setFatalErrorDialogVisible(false);
                                }}
                                className="w-8rem"
                            />
                        </div>
                    </div>
                )}
            />

            {children}
        </Layout>
    );
}

// Wrap the AppLayout inside the WebSocketProvider
export default function App({ children }: AppLayoutProps) {
    return (
        <WebSocketProvider url={'ws://localhost:8080/ws'}>
            <AppLayout>{children}</AppLayout>
        </WebSocketProvider>
    );
}
