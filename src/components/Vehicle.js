import React, { useEffect, useState, useCallback, useMemo } from 'react';
import './Vehicle.css';

const Car = ({ grid, entrance, exit, running }) => {
  const [position, setPosition] = useState(entrance);
  const [direction, setDirection] = useState(0); // 0: right, 1: down, 2: left, 3: up
  const [carState, setCarState] = useState('stop');

  const directions = useMemo(() => [
    { dx: 0, dy: 1 },  // right
    { dx: 1, dy: 0 },  // down
    { dx: 0, dy: -1 }, // left
    { dx: -1, dy: 0 }, // up
  ], []);

  const isPath = useCallback((position) => {
    const [x, y] = position;
    return x >= 0 && y >= 0 && x < grid.length && y < grid[0].length && !grid[x][y].isWall;
  }, [grid]);

  const getNextPosition = useCallback((currentPosition, currentDirection) => {
    const { dx, dy } = directions[currentDirection];
    return [currentPosition[0] + dx, currentPosition[1] + dy];
  }, [directions]);

  const findNextMove = useCallback(() => {
    const rightTurn = (direction + 1) % 4;
    const forwardDirection = direction;
    const leftTurn = (direction + 3) % 4;
    const backward = (direction + 2) % 4;

    
    if (isPath(getNextPosition(position, rightTurn))) {
      return rightTurn;
    }
    
    if (isPath(getNextPosition(position, forwardDirection))) {
      return forwardDirection;
    }
    
    if (isPath(getNextPosition(position, leftTurn))) {
      return leftTurn;
    }
    
    return backward;
  }, [direction, position, isPath, getNextPosition]);

  const moveCar = useCallback(() => {
    if (position[0] === exit[0] && position[1] === exit[1]) {
      setCarState('stop');
      return;
    }

    const nextDirection = findNextMove();
    const nextPosition = getNextPosition(position, nextDirection);

    console.log("Current position:", position, "Next position:", nextPosition);

    setPosition(nextPosition);
    setDirection(nextDirection);
  }, [position, exit, findNextMove, getNextPosition]);

  useEffect(() => {
    if (running) {
      setPosition(entrance);
      setDirection(0);
      setCarState('move');
    } else {
      setCarState('stop');
    }
  }, [running, entrance]);

  useEffect(() => {
    let timer;
    if (carState === 'move') {
      timer = setTimeout(() => moveCar(), 200);
    }
    return () => clearTimeout(timer);
  }, [carState, moveCar]);

  const getCarEmoji = () => {
    switch(direction) {
      case 0: return '➡️';
      case 1: return '⬇️';
      case 2: return '⬅️';
      case 3: return '⬆️';
      default: return '➡️';
    }
  };

return (
  <div
    className={`car ${carState}`}
    style={{
      top: `${position[0] * (90 / 50)}vmin`,
      left: `${position[1] * (90 / 50)}vmin`,
      transition: 'top 0.2s, left 0.2s',
    }}
  >
    {getCarEmoji()}
  </div>
);
};

export default Car;