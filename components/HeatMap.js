import React, { useRef, useEffect } from "react";

const Heatmap = ({ width, height, points }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!width || !height) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // Clear canvas before each render
        ctx.clearRect(0, 0, width, height);

        // Draw each point as a heat circle
        points.forEach((point) => {
            const { x, y, heat, size, color } = point;

            // Map the heat value to opacity (0 to 1 range)
            const opacity = heat / 100;

            // Set gradient for the circle's opacity
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
            gradient.addColorStop(0, `rgba(${hexToRgb(color)}, ${opacity})`);
            gradient.addColorStop(1, `rgba(${hexToRgb(color)}, 0)`);

            // Set fill color
            ctx.fillStyle = gradient;

            // Draw the circle (size determines the max radius)
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
        });
    }, [width, height, points]);

    // Convert hex color to rgb for opacity control
    const hexToRgb = (hex) => {
        let r = 0,
            g = 0,
            b = 0;
        if (hex.length === 7) {
            r = parseInt(hex.slice(1, 3), 16);
            g = parseInt(hex.slice(3, 5), 16);
            b = parseInt(hex.slice(5, 7), 16);
        }
        return `${r},${g},${b}`;
    };

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            style={{
                width: "100%",  // Fill the container's width
                height: "100%", // Fill the container's height
            }}
        />
    );
};

export default Heatmap;
