// alg: DFS
const solveMaze = (maze) => {
  const stack = [{ path: [{ x: 1, y: 1 }] }];

  if (!maze.length) {
    return null;
  }

  while (stack.length > 0) {
    const currentProblem = stack.pop();
    const currentPath = currentProblem.path;
    const currentCoord = currentPath[currentPath.length - 1];

    for (let xDif = -1; xDif <= 1; xDif++) {
      for (let yDif = -1; yDif <= 1; yDif++) {
        if (
          (xDif === 0 && yDif === 0) ||
          (Math.abs(xDif) === 1 && Math.abs(yDif) === 1)
        ) {
          continue;
        }
        const nextCoord = {
          x: currentCoord.x + xDif,
          y: currentCoord.y + yDif,
        };
        const nextTileValue = maze[nextCoord.y][nextCoord.x];
        const nextPath = [...currentPath, nextCoord];
        if (nextTileValue === "#") {
          continue;
        }
        if (
          currentPath.some(
            (coord) => coord.x === nextCoord.x && coord.y === nextCoord.y
          )
        ) {
          continue;
        }
        if (nextTileValue === "E") {
          return nextPath;
        }

        stack.push({ path: nextPath });
      }
    }
  }
  return null;
};

const testMaze = [
  ["#", "#", "#", "#", "#", "#"],
  ["#", "S", ".", "#", "#", "#"],
  ["#", "#", ".", ".", ".", "#"],
  ["#", "#", "#", "#", ".", "#"],
  ["#", "#", "#", "#", "E", "#"],
  ["#", "#", "#", "#", "#", "#"],
];

console.log(solveMaze(testMaze));