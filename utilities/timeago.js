// utils/timeago.js
const formatTimeAgo = (date) => {
    const milliseconds = new Date() - new Date(date);
    const seconds = Math.floor(milliseconds / 1000);
    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return `${interval} years ago`;
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return `${interval} months ago`;
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return `${interval} days ago`;
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return `${interval} hours ago`;
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return `${interval} minutes ago`;
    }
    if (seconds >= 1) {
        return `${seconds} seconds ago`;
    }
    if (milliseconds > 1) {
        return `${milliseconds} milliseconds ago`;
    }
    return `just now`;
};

export { formatTimeAgo };
