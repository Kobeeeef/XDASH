function truncateString(str, maxLength) {
    if (str.length > maxLength) {
        return str.slice(0, maxLength) + '...';
    }
    return str;
}
function isValidPath(path) {
    const windowsPathPattern = /^[A-Za-z]:[\\\/]([^\\\/:*?"<>|\r\n]+[\\\/])*([^\\\/:*?"<>|\r\n]+)$/;  // C:\path\to\file
    const unixPathPattern = /^(\.\/|\.\.\/|\/|[A-Za-z0-9_-]+\/?)([A-Za-z0-9_-]+\/?)*([^\/:*?"<>|\r\n]+)$/;  // /home/user/file or ./file

    // Check if the path is valid in Windows format (e.g., C:\path\to\file)
    if (windowsPathPattern.test(path)) {
        return true;
    }

    // Check if the path is valid in Unix format (e.g., /home/user/file or ./file)
    if (unixPathPattern.test(path)) {
        return true;
    }

    // If it's neither a valid Windows nor Unix path
    return false;
}
function countdown(seconds, onTick, onComplete) {
    let timeLeft = seconds;
    onTick(timeLeft);
    timeLeft--;
    const timer = setInterval(() => {
        onTick(timeLeft);
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(timer);
            onComplete();
        }
    }, 1000);
}
module.exports.countdown = countdown;
module.exports.truncateString = truncateString;
module.exports.isValidPath = isValidPath;
