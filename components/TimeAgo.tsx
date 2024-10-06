// components/TimeAgo.tsx
import React, { useEffect, useState } from 'react';
import { formatTimeAgo } from '@/utilities/timeago';

interface TimeAgoProps {
    date: Date;
    className?: string;
    refresh: number;
}

const TimeAgo: React.FC<TimeAgoProps> = ({ date, className, refresh = 100 }) => {
    const [timeAgo, setTimeAgo] = useState('');

    useEffect(() => {
        setTimeAgo(formatTimeAgo(date));
        const interval = setInterval(() => {
            setTimeAgo(formatTimeAgo(date));
        }, refresh); // Update interval to 1000ms (1 second)

        return () => clearInterval(interval);
    }, [date, refresh]);

    return <span className={className}>{timeAgo}</span>;
};

export default TimeAgo;
