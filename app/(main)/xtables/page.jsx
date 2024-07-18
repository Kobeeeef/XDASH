/* eslint-disable @next/next/no-img-element */
'use client';


import React, { useEffect } from 'react';




import { Terminal } from 'primereact/terminal';
import { TerminalService } from 'primereact/terminalservice';




const Dashboard = () => {
    const commandHandler = (text) => {

    }
    useEffect(() => {
        TerminalService.on('command', commandHandler);

        return () => {
            TerminalService.off('command', commandHandler);
        };
    }, []);



    // @ts-ignore
    return (
        <div className="grid">
            <div className="col-12 lg:col-6 xl:col-4">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Backend Status</span>
                            <div className="text-900 font-medium text-xl">Connected</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round"
                             style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-chevron-circle-up text-blue-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-bold">1 </span>
                    <span className="text-500">minute ago</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-4">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">XTABLES Status</span>
                            <div className="text-900 font-medium text-xl">Connected</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round"
                             style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-table text-blue-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-bold">1 </span>
                    <span className="text-500">minute ago</span>
                </div>
            </div>

            <div className="col-12 lg:col-6 xl:col-4">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Clients</span>
                            <div className="text-900 font-medium text-xl">5</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round"
                             style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-android text-cyan-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-bold">1 </span>
                    <span className="text-500">minute ago</span>
                </div>
            </div>
            <div className="col-12">
                <div className="card mb-0">
                    <Terminal
                        welcomeMessage="Welcome to XTABLES control panel!"
                        prompt="XTABLES $"
                        pt={{
                            root: 'bg-gray-900 text-white border-round',
                            prompt: 'text-gray-400 mr-2',
                            command: 'text-primary-300',
                            response: 'text-primary-300'
                        }}
                    />
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
