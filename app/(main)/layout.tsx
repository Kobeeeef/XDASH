import { Metadata } from 'next';
import Layout from '../../layout/layout';
import { WebSocketProvider } from '@/layout/context/websocketcontext';

interface AppLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: 'XDASH - Control Panel',
    robots: { index: false, follow: false },
    viewport: { initialScale: 1, width: 'device-width' },
    icons: {
        icon: '/favicon.ico'
    }
};

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <WebSocketProvider url="ws://localhost:8080/ws">
            <Layout>{children}</Layout>
        </WebSocketProvider>
    );
}
