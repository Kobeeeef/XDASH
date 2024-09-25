import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';

// Grid Component
const Grid = ({
                  resizedInchesPerSquare,
                  inchesPerSquare,
                  totalMapSizeXInches,
                  totalMapSizeYInches,
                  robotLocation,
                  goalLocation,
                  obstacles,
                  path
              }) => {
    const [gridKey, setGridKey] = useState(0);

    // Effect to reset the grid animation when size updates
    useEffect(() => {
        setGridKey(prevKey => {
            if(prevKey !== 0) return 0; else return 1;
        }); // Update key to force re-render
    }, [inchesPerSquare, resizedInchesPerSquare]);
    // Calculate the total size of the grid in terms of squares
    let mapSizeXSquares = Math.floor(totalMapSizeXInches / inchesPerSquare);
    let mapSizeYSquares = Math.floor(totalMapSizeYInches / inchesPerSquare);
    if(resizedInchesPerSquare > inchesPerSquare) {
        if(resizedInchesPerSquare > totalMapSizeXInches || resizedInchesPerSquare > totalMapSizeYInches) {
            resizedInchesPerSquare = Math.min(totalMapSizeYInches , totalMapSizeXInches);
        }
        const {
            newPath,
            newRobotPos,
            newGoalPos,
            newObstacles,
            newMapSizeXSquares,
            newMapSizeYSquares
        } = rescalePathAndPositions(
            path,
            resizedInchesPerSquare,
            robotLocation,
            goalLocation,
            obstacles,
            totalMapSizeXInches,
            totalMapSizeYInches,
            inchesPerSquare,
        );
        mapSizeXSquares = newMapSizeXSquares;
        mapSizeYSquares = newMapSizeYSquares;
        path = newPath
        robotLocation = newRobotPos
        goalLocation = newGoalPos;
        obstacles = newObstacles;
    }
    return (
        <div
            key={gridKey}
            className="grid"
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${mapSizeXSquares}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${mapSizeYSquares}, minmax(0, 1fr))`,
                width: '100%',
                height: '80vh',
                gap: '1px',
                backgroundColor: 'black',
                overflow: 'hidden' // Ensure no overflow
            }}
        >
            {Array.from({ length: mapSizeYSquares }, (_, row) =>
                Array.from({ length: mapSizeXSquares }, (_, col) => {
                    const isRobot = robotLocation[0] === row && robotLocation[1] === col;
                    const isGoal = goalLocation[0] === row && goalLocation[1] === col;
                    const isObstacle = obstacles.some(
                        ([obsRow, obsCol]) => obsRow === row && obsCol === col
                    );
                    const isPath = path.some(
                        ([pathRow, pathCol]) => pathRow === row && pathCol === col
                    );
                    const pathIndex = path.findIndex(
                        ([pathRow, pathCol]) => pathRow === row && pathCol === col
                    );

                    return (
                        <div
                            key={`${row}-${col}`}
                            className={`cursor-pointer ${
                                isRobot
                                    ? 'bg-blue-500' // Robot
                                    : isGoal
                                        ? 'bg-green-500' // Goal
                                        : isObstacle
                                            ? 'bg-red-500 ' // Obstacles
                                            : isPath
                                                ? 'bg-yellow-500 animate-pulse-sequential' // Path
                                                : 'bg-gray-800' // Empty spaces
                            }`}
                            style={{
                                aspectRatio: '1 / 1',
                                cursor: 'pointer',
                                outline: 'none',
                                transition: 'border 0.2s, box-shadow 0.2s',
                                animationDelay: `${pathIndex * 0.04}s`, // Stagger delay based on index
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.border = '2px solid #3B82F6'; // Highlight border on hover
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.border = ''; // Reset border on leave
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.5)'; // Highlight border on focus
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.boxShadow = 'none'; // Remove border highlight on blur
                            }}
                            role="button"
                            onClick={() => {
                                // Handle button click action here
                                console.log('Button clicked');
                            }}
                            tabIndex={0}
                        />


                    );
                })
            )}
        </div>
    );
};
const rescalePathAndPositions = (
    path,
    newInchesPerSquare,
    robotPos,
    goalPos,
    obstacles,
    totalInchesX,
    totalInchesY,
    oldInchesPerSquare
) => {
    // Calculate new grid size in terms of squares
    const newMapSizeXSquares = Math.floor(totalInchesX / newInchesPerSquare);
    const newMapSizeYSquares = Math.floor(totalInchesY / newInchesPerSquare);

    // Function to rescale positions based on the new inches per square
    const rescalePosition = (pos, oldInchesPerSquare, newInchesPerSquare) => {
        const scaleFactor = oldInchesPerSquare / newInchesPerSquare;
        const newX = Math.max(0, Math.min(Math.round(pos[0] * scaleFactor), newMapSizeYSquares - 1));
        const newY = Math.max(0, Math.min(Math.round(pos[1] * scaleFactor), newMapSizeXSquares - 1));
        return [newX, newY];
    };

    // Rescale robot position, goal position, and obstacles
    const newRobotPos = rescalePosition(robotPos, oldInchesPerSquare, newInchesPerSquare);
    const newGoalPos = rescalePosition(goalPos, oldInchesPerSquare, newInchesPerSquare);
    const newObstacles = obstacles.map(obs => rescalePosition(obs, oldInchesPerSquare, newInchesPerSquare));

    // Remove duplicate obstacles after scaling
    const uniqueObstacles = Array.from(new Set(newObstacles.map(JSON.stringify))).map(JSON.parse);

    // Rescale the path positions
    const newPath = path.map(step => rescalePosition(step, oldInchesPerSquare, newInchesPerSquare));

    // Ensure new positions are within the new grid bounds and remove duplicates
    const uniquePath = Array.from(new Set(newPath.map(JSON.stringify)))
        .map(JSON.parse)
        .filter(([x, y]) => x >= 0 && x < newMapSizeYSquares && y >= 0 && y < newMapSizeXSquares);

    return {
        newPath: uniquePath,
        newRobotPos,
        newGoalPos,
        newObstacles: uniqueObstacles,
        newMapSizeXSquares,
        newMapSizeYSquares
    };
};

export default Grid;
