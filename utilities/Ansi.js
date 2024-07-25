import React from 'react';

const ansiToHtml = (log) => {
    const ansiToHtmlMap = {
        "\u001B[0m": null,
        "\u001B[31m": 'red',
        "\u001B[33m": 'yellow',
        "\u001B[34m": 'blue',
        "\u001B[35m": 'purple'
    };

    const parts = log.split(/(\u001B\[[0-9;]*m)/g);
    const elements = [];

    let currentColor = null;

    parts.forEach((part, index) => {
        const color = ansiToHtmlMap[part];
        if (color !== undefined) {
            currentColor = color;
        } else if (part) {
            elements.push(
       <span key={index} style={{ color: currentColor }}>{part}</span>
            );
        }
    });

    return elements;
};

export default ansiToHtml;
