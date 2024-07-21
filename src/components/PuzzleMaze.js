import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Car from './Vehicle';
import './PuzzleMaze.css';
import './Vehicle.css';

const Maze = () => {
  const size = 50; 
  const [grid, setGrid] = useState([]);
  const entrance = useMemo(() => [0, 1], []);
  const exit = useMemo(() => [size - 1, size - 2], [size]);
  const [running, setRunning] = useState(false);

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const generateMaze = useCallback((grid, x, y) => {
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    shuffle(directions);

    grid[x][y].isWall = false;
    for (const [dx, dy] of directions) {
      const nx = x + dx * 2;
      const ny = y + dy * 2;
      if (nx >= 0 && ny >= 0 && nx < size && ny < size && grid[nx][ny].isWall) {
        grid[x + dx][y + dy].isWall = false;
        generateMaze(grid, nx, ny);
      }
    }
  }, [size]);

  const initializeGrid = useCallback(() => {
    const initialGrid = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => ({ isWall: true, isEntrance: false, isExit: false }))
    );

    generateMaze(initialGrid, 1, 1);

    initialGrid[entrance[0]][entrance[1]] = { isWall: false, isEntrance: true, isExit: false };
    initialGrid[exit[0]][exit[1]] = { isWall: false, isEntrance: false, isExit: true };

    setGrid(initialGrid);
  }, [size, entrance, exit, generateMaze]);

  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

  return (
    <div className="maze-container">
     
      <div className="controls">
        <button onClick={() => setRunning(!running)}>{running ? 'Stop' : 'GO!'}</button>
      </div>
      <div className="maze-grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="maze-row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`maze-cell ${cell.isWall ? 'wall' : ''} ${cell.isEntrance ? 'entrance' : ''} ${cell.isExit ? 'exit' : ''}`}
              />
            ))}
          </div>
        ))}
        {grid.length > 0 && (
          <Car grid={grid} entrance={entrance} exit={exit} running={running} />
        )}
      </div>
    </div>
  );
};

export default Maze;