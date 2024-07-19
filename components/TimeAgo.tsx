// components/TimeAgo.tsx
import React, { useEffect, useState } from 'react';
import { formatTimeAgo } from '@/utilities/timeago';

interface TimeAgoProps {
    date: Date;
    className?: string;
}

const TimeAgo: React.FC<TimeAgoProps> = ({ date, className }) => {
    const [timeAgo, setTimeAgo] = useState('');

    useEffect(() => {
        setTimeAgo(formatTimeAgo(date));
        const interval = setInterval(() => {
            setTimeAgo(formatTimeAgo(date));
        }, 100); // Update interval to 1000ms (1 second)

        return () => clearInterval(interval);
    }, [date]);

    return <span className={className}>{timeAgo}</span>;
};

export default TimeAgo;
