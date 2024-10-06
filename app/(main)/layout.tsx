'use client';
import { Metadata } from 'next';
import Layout from '../../layout/layout';
import { WebsocketContext, WebSocketProvider } from '@/layout/context/websocketcontext';
import { useContext, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import {truncateString} from '@/utilities/utilities'
interface AppLayoutProps {
    children: React.ReactNode;
}



// Component that accesses the WebSocket context
function AppLayout({ children }: AppLayoutProps) {
    const { latestLog }: any = useContext(WebsocketContext); // Now it will properly consume the context
    const toast = useRef<Toast | null>(null);

    useEffect(() => {
        if (latestLog && latestLog?.PRIORITY < 4) {  // Ensure latestLog has a valid PRIORITY
            toast.current?.show({
                severity: 'error',
                summary: latestLog?._HOSTNAME || latestLog?._COMM || latestLog?._SYSTEMD_UNIT || latestLog?.system || latestLog?._CMDLINE || latestLog?.SYSLOG_IDENTIFIER || 'unknown source',
                detail: truncateString(latestLog?.MESSAGE,100) || "There was a unknown error message on one of the machines.",
                life: 6000,
                closable: false,
            });
        }
    }, [latestLog]);

    return (
        <Layout>
            <Toast ref={toast} />
            {children}
        </Layout>
    );
}

// Wrap the AppLayout inside the WebSocketProvider
export default function App({ children }: AppLayoutProps) {
    return (
        <WebSocketProvider url="ws://localhost:8080/ws">
            <AppLayout>{children}</AppLayout>
        </WebSocketProvider>
    );
}
