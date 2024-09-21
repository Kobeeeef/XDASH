import React from 'react';

// Grid Component
const Grid = ({
                  inchesPerSquare,
                  totalMapSizeXInches,
                  totalMapSizeYInches,
                  robotLocation,
                  goalLocation,
                  obstacles,
                  path,
              }) => {
    // Calculate the total size of the grid in terms of squares
    const mapSizeXSquares = Math.floor(totalMapSizeXInches / inchesPerSquare);
    const mapSizeYSquares = Math.floor(totalMapSizeYInches / inchesPerSquare);

    return (
        <div
            className="grid"
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${mapSizeXSquares}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${mapSizeYSquares}, minmax(0, 1fr))`,
                width: '100%',
                height: '80vh',
                gap: '1px',
                backgroundColor: 'black',
                overflow: 'hidden', // Ensure no overflow
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

                    return (
                        <div
                            key={`${row}-${col}`}
                            className={`border ${
                                isRobot
                                    ? 'bg-blue-500 animate-pulse-fast-lite' // Robot
                                    : isGoal
                                        ? 'bg-green-500' // Goal
                                        : isObstacle
                                            ? 'bg-red-500' // Obstacles
                                            : isPath
                                                ? 'bg-yellow-500' // Path
                                                : 'bg-gray-800' // Empty spaces
                            }`}
                            style={{ aspectRatio: '1 / 1' }}
                        />
                    );
                })
            )}
        </div>
    );
};

export default Grid;
