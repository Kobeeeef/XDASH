'use client';
import { LayoutProvider } from '../layout/context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';
import { WebSocketProvider } from '../layout/context/websocketcontext';

interface RootLayoutProps {
    children: React.ReactNode;
}

const value = {
    ripple: true,
};

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" suppressHydrationWarning>
        <head>
            <link id="theme-css" href={`/themes/lara-dark-indigo/theme.css`} rel="stylesheet"></link>
        </head>
        <body>
        <PrimeReactProvider value={value}>

                <LayoutProvider>{children}</LayoutProvider>

        </PrimeReactProvider>
        </body>
        </html>
    );
}
