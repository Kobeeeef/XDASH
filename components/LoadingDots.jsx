// components/LoadingDots.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const LoadingDots = ({ delay = 500 }) => {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prevDots) => {
                switch (prevDots) {
                    case '':
                        return '.';
                    case '.':
                        return '..';
                    case '..':
                        return '...';
                    default:
                        return '';
                }
            });
        }, delay); // Use the delay prop for interval timing

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [delay]);

    return <span>{dots}</span>;
};

LoadingDots.propTypes = {
    delay: PropTypes.number,
};

export default LoadingDots;
