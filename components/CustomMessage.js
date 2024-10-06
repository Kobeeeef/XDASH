import React from 'react';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { formatTimeAgo } from '../utilities/timeago';
import TimeAgo from './TimeAgo';


const CustomMessage = ({ header, text, priority, link, __REALTIME_TIMESTAMP }) => {
    const router = useRouter();

    const handleClick = () => {
        if (link) {
            router.push(link);
        }
    };

    const getSeverityIcon = () => {
        if (priority <= 1) return 'pi pi-exclamation-triangle';
        switch (getSeverityType()) {
            case 'info':
                return 'pi pi-info-circle';
            case 'warn':
                return 'pi pi-exclamation-circle';
            case 'error':
                return 'pi pi-times';
            default:
                return 'pi pi-info-circle';
        }
    };
    const getSeverityType = () => {
        switch (priority) {
            case 5:
                return 'info';
            case 4:
                return 'warn';
            case 3:
            case 2:
            case 1:
            case 0:
                return 'error';
            default:
                return 'info';
        }
    };
    return (
        <div
            className={`p-inline-message p-component p-inline-message-${getSeverityType()} my-2`}
            onClick={handleClick}
            style={{
                cursor: 'pointer',
                padding: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}
        >
            <icon className={getSeverityIcon()} style={{ marginRight: '0.5rem', fontSize: '1.5rem' }} />
            <div style={{ flexGrow: 1, margin: '0 1rem' }}>
                <div className="flex items-center">
                    <strong className="text-xl">{header}</strong>
                    <TimeAgo refresh={50} date={__REALTIME_TIMESTAMP/1000} className="text-xs text-gray-400 ml-2 pt-2"
                    />
                </div>

                <div className="p-inline-message-text">{text}</div>
            </div>
            <Button label="View" text={true}
                    severity={getSeverityType() === 'error' ? 'danger' : getSeverityType() === 'warn' ? 'warning' : getSeverityType()}
                    className="p-button-outlined p-button-sm" />
        </div>
    );
};

export default CustomMessage;
