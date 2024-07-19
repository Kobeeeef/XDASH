import React from 'react';
import Link from 'next/link';

const NotFoundPage = () => {
    return (
        <div className="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
            <div className="flex flex-column align-items-center justify-content-center">
                <img src="/images/logo/logo.png" alt="XBOT logo" className="xl:mb-5 lg:mb-4 sm:mb-3 xl:mb-5 lg:mb-4 sm:mb-3 mb-2 xl:w-30rem lg:w-25rem sm:w-20rem w-9 flex-shrink-0" />
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, rgba(33, 150, 243, 0.4) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center" style={{ borderRadius: '53px' }}>
                        <span className="text-blue-500 font-bold text-3xl">404</span>
                        <h1 className="text-900 font-bold text-5xl mb-2">Not Found</h1>
                        <div className="text-600 mb-5">Requested resource is not available</div>

                        <Link href="/" className="w-full flex align-items-center py-5 border-300 border-bottom-1">
                            <span className="flex justify-content-center align-items-center bg-orange-400 border-round" style={{ height: '3.5rem', width: '3.5rem' }}>
                                <i className="pi pi-fw pi-home text-50 text-2xl"></i>
                            </span>
                            <span className="ml-4 flex flex-column">
                                <span className="text-900 lg:text-xl font-medium mb-1">Go Home</span>
                                <span className="text-600 lg:text-lg">Click here to return back to dashboard</span>
                            </span>
                        </Link>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
