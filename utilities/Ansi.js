
import React from 'react';
import AnsiToHtml from 'ansi-to-html';

const ansiToHtml = new AnsiToHtml({
    fg: '#FFF', // Default foreground color
    bg: '#000', // Default background color
    newline: true,
    escapeXML: false,
    stream: false
});

const convertAnsiToHtml = (log) => {
    return ansiToHtml.toHtml(log?.replace("\u001B[?2004h", "\u001b[92m")?.replace("\u001B[?2004l", "") ?? "");
};

const LogComponent = ({ log }) => {
    const htmlLog = convertAnsiToHtml(log);

    return (
        <pre dangerouslySetInnerHTML={{ __html: htmlLog }} />
    );
};

export default LogComponent;
