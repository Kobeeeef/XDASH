import { ConfirmDialog } from 'primereact/confirmdialog';
import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';

export function GlobalErrorHandler({ children }) {
    const [fatalErrorDialogVisible, setFatalErrorDialogVisible] = useState(false);
    const [latestError, setLatestError] = useState(null);

    useEffect(() => {
        // Global error handling for uncaught exceptions
        const handleGlobalError = (message, source, lineno, colno, error) => {
            console.error('Uncaught Error:', { message, source, lineno, colno, error });
            setLatestError({
                summary: message || 'Unknown error occurred',
                detail: error?.message || 'No details available',
                cause: source || 'Unknown source',
                exceptionType: error?.name || 'Unknown Exception',
                stackTrace: error?.stack?.split('\n') || ['No stack trace available'],
            });
            setFatalErrorDialogVisible(true);
        };

        const handleUnhandledRejection = (event) => {
            console.error('Unhandled Promise Rejection:', event.reason);
            setLatestError({
                summary: 'Unhandled Promise Rejection',
                detail: event.reason?.message || 'No details available',
                cause: 'Promise',
                exceptionType: event.reason?.name || 'PromiseRejection',
                stackTrace: event.reason?.stack?.split('\n') || ['No stack trace available'],
            });
            setFatalErrorDialogVisible(true);
        };

        window.onerror = handleGlobalError;
        window.onunhandledrejection = handleUnhandledRejection;

        return () => {
            window.onerror = null;
            window.onunhandledrejection = null;
        };
    }, []);

    return (
        <>
            {children}
            <Dialog
                closable={false}
                visible={fatalErrorDialogVisible}
                onHide={() => setFatalErrorDialogVisible(false)}
                content={() => (
                    <div className="flex flex-column align-items-center p-4 surface-overlay border-round" style={{ maxWidth: '50vw' }}>
                        <div className="border-circle bg-red-600 inline-flex justify-content-center align-items-center h-4rem w-4rem">
                            <i className="pi pi-exclamation-triangle text-3xl"></i>
                        </div>
                        <h2 className="text-red-700 mt-3">{latestError?.summary || 'Error'}</h2>
                        <p className="text-center text-700">{latestError?.detail || 'An unknown error occurred.'}</p>
                        <div className="w-full mt-3">
                            <div className="mb-2">
                                <span className="block font-medium text-500">Cause:</span>
                                <span className="block font-bold text-900">{latestError?.cause || 'Unknown'}</span>
                            </div>
                            <div className="mb-2">
                                <span className="block font-medium text-500">Class:</span>
                                <span className="block font-bold text-900">{latestError?.exceptionType || 'Unknown'}</span>
                            </div>
                        </div>
                        <div className="mt-2">
                            <Button label="Dismiss" className="p-button-danger" onClick={() => setFatalErrorDialogVisible(false)} />
                        </div>
                    </div>
                )}
            />
        </>
    );
}

