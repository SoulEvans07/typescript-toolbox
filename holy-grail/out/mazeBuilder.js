class Random {
  constructor(seed = randomSeed()) {
      const [a, b, c, d] = cyrb128(String(seed));
      this.number = sfc32(a, b, c, d);
  }
  integer(val1 = 1, val2) {
      const min = val2 === undefined ? 0 : val1;
      const max = val2 === undefined ? val1 : val2;
      return min + Math.floor(this.number() * (max - min));
      // return min + Math.floor(Math.random() * (1 + max - min)); // dont know why was the +1 there @adam.szi
  }
}
function randomSeed() {
  const size = 100000000000000;
  return Math.floor(Math.random() * size);
}
// https://github.com/bryc/code/blob/master/jshash/PRNGs.md
function sfc32(a, b, c, d) {
  return function () {
      a |= 0;
      b |= 0;
      c |= 0;
      d |= 0;
      var t = (((a + b) | 0) + d) | 0;
      d = (d + 1) | 0;
      a = b ^ (b >>> 9);
      b = (c + (c << 3)) | 0;
      c = (c << 21) | (c >>> 11);
      c = (c + t) | 0;
      return (t >>> 0) / 4294967296;
  };
}
// https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
function cyrb128(str) {
  let h1 = 1779033703, h2 = 3144134277, h3 = 1013904242, h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
      k = str.charCodeAt(i);
      h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
      h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
      h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
      h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return [
      (h1 ^ h2 ^ h3 ^ h4) >>> 0,
      (h2 ^ h1) >>> 0,
      (h3 ^ h1) >>> 0,
      (h4 ^ h1) >>> 0,
  ];
}
const CellTypes = {
  WALL: "#",
  EMPTY: ".",
  ENTRANCE: "S",
  EXIT: "E",
  KEY: "K",
};
const CellClasses = {
  "#": "wall",
  ".": "empty",
  S: "start",
  E: "end",
  K: "key",
};
class MazeBuilder {
  constructor(width, height, seed) {
      this.width = width;
      this.height = height;
      this.random = new Random(seed);
      this.cols = 2 * this.width + 1;
      this.rows = 2 * this.height + 1;
      this.maze = this.fillMaze(CellTypes.EMPTY);
      // place initial walls
      this.maze.forEach((row, r) => {
          row.forEach((_, c) => {
              switch (r) {
                  case 0:
                  case this.rows - 1:
                      this.maze[r][c] = CellTypes.WALL;
                      break;
                  default:
                      if (r % 2 == 1) {
                          if (c == 0 || c == this.cols - 1) {
                              this.maze[r][c] = CellTypes.WALL;
                          }
                      }
                      else if (c % 2 == 0) {
                          this.maze[r][c] = CellTypes.WALL;
                      }
              }
          });
          if (r == 0) {
              // place exit in top row
              let doorPos = this.posToSpace(this.random.integer(1, this.width));
              this.maze[r][doorPos] = CellTypes.EXIT;
          }
          if (r == this.rows - 1) {
              // place entrance in bottom row
              let doorPos = this.posToSpace(this.random.integer(1, this.width));
              this.maze[r][doorPos] = CellTypes.ENTRANCE;
          }
      });
      // start partitioning
      this.partition(1, this.height - 1, 1, this.width - 1);
  }
  fillMaze(fillValue) {
      return new Array(this.rows)
          .fill(undefined)
          .map(() => new Array(this.cols).fill(fillValue));
  }
  posToSpace(x) {
      return 2 * (x - 1) + 1;
  }
  posToWall(x) {
      return 2 * x;
  }
  inBounds(y, x) {
      return x >= 0 && y >= 0 && x < this.cols && y < this.rows;
  }
  shuffle(array) {
      // sauce: https://stackoverflow.com/a/12646864
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(this.random.integer(i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
  }
  partition(y1, y2, x1, x2) {
      // create partition walls
      // ref: https://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_division_method
      let horiz;
      let vert;
      let x;
      let y;
      let start;
      let end;
      if (y2 < y1 || x2 < x1)
          return;
      if (y1 == y2) {
          horiz = y1;
      }
      else {
          x = y1 + 1;
          y = y2 - 1;
          start = Math.round(x + (y - x) / 4);
          end = Math.round(x + (3 * (y - x)) / 4);
          horiz = this.random.integer(start, end);
      }
      if (x1 == x2) {
          vert = x1;
      }
      else {
          x = x1 + 1;
          y = x2 - 1;
          start = Math.round(x + (y - x) / 3);
          end = Math.round(x + (2 * (y - x)) / 3);
          vert = this.random.integer(start, end);
      }
      for (let i = this.posToWall(y1) - 1; i <= this.posToWall(y2) + 1; i++) {
          for (let j = this.posToWall(x1) - 1; j <= this.posToWall(x2) + 1; j++) {
              if (i == this.posToWall(horiz) || j == this.posToWall(vert)) {
                  this.maze[i][j] = CellTypes.WALL;
              }
          }
      }
      let gaps = this.shuffle([true, true, true, false]);
      // create gaps in partition walls
      if (gaps[0]) {
          let gapPosition = this.random.integer(x1, vert);
          this.maze[this.posToWall(horiz)][this.posToSpace(gapPosition)] =
              CellTypes.EMPTY;
      }
      if (gaps[1]) {
          let gapPosition = this.random.integer(vert + 1, x2 + 1);
          this.maze[this.posToWall(horiz)][this.posToSpace(gapPosition)] =
              CellTypes.EMPTY;
      }
      if (gaps[2]) {
          let gapPosition = this.random.integer(y1, horiz);
          this.maze[this.posToSpace(gapPosition)][this.posToWall(vert)] =
              CellTypes.EMPTY;
      }
      if (gaps[3]) {
          let gapPosition = this.random.integer(horiz + 1, y2 + 1);
          this.maze[this.posToSpace(gapPosition)][this.posToWall(vert)] =
              CellTypes.EMPTY;
      }
      // recursively partition newly created chambers
      this.partition(y1, horiz - 1, x1, vert - 1);
      this.partition(horiz + 1, y2, x1, vert - 1);
      this.partition(y1, horiz - 1, vert + 1, x2);
      this.partition(horiz + 1, y2, vert + 1, x2);
  }
  isGap(...cells) {
      return cells.every((pos) => {
          const [x, y] = pos;
          const cell = this.maze[y][x];
          return (cell === CellTypes.EMPTY ||
              cell === CellTypes.ENTRANCE ||
              cell === CellTypes.EXIT);
      });
  }
  countSteps(array, y, x, count, stop) {
      if (!this.inBounds(y, x))
          return; // out of bounds
      if (array[y][x] <= count)
          return; // shorter route already mapped
      if (!this.isGap([x, y]))
          return; // not traversable
      array[y][x] = count;
      if (this.maze[y][x] === stop)
          return; // reached destination
      this.countSteps(array, y - 1, x, count + 1, stop);
      this.countSteps(array, y, x + 1, count + 1, stop);
      this.countSteps(array, y + 1, x, count + 1, stop);
      this.countSteps(array, y, x - 1, count + 1, stop);
  }
  getKeyLocation() {
      let fromEntrance = this.fillMaze(undefined);
      let fromExit = this.fillMaze(undefined);
      let totalSteps = -1;
      for (let x = 1; x < this.cols - 1; x++) {
          if (this.maze[this.rows - 1][x] === CellTypes.ENTRANCE) {
              this.countSteps(fromEntrance, this.rows - 1, x, 0, CellTypes.EXIT);
          }
          if (this.maze[0][x] === CellTypes.EXIT) {
              this.countSteps(fromExit, 0, x, 0, CellTypes.ENTRANCE);
          }
      }
      let [fc, fr] = [-1, -1];
      this.maze.forEach((row, r) => {
          row.forEach((_, c) => {
              if (typeof fromEntrance[r][c] == "undefined") {
                  return;
              }
              let stepCount = fromEntrance[r][c] + fromExit[r][c];
              if (stepCount > totalSteps) {
                  fr = r;
                  fc = c;
                  totalSteps = stepCount;
              }
          });
      });
      return [fr, fc];
  }
  placeKey() {
      const [fr, fc] = this.getKeyLocation();
      this.maze[fr][fc] = CellTypes.KEY;
  }
  getMaze() {
      return this.maze;
  }

  display(id) {
    this.parentDiv = document.getElementById(id);

    if (!this.parentDiv) {
      alert('Cannot initialise maze - no element found with id "' + id + '"');
      return false;
    }

    while (this.parentDiv.firstChild) {
      this.parentDiv.removeChild(this.parentDiv.firstChild);
    }

    const container = document.createElement("div");
    container.id = "maze";
    container.dataset.steps = this.totalSteps;

    this.maze.forEach((row, y) => {
      let rowDiv = document.createElement("div");
      row.forEach((cell, x) => {
        let cellDiv = document.createElement("div");
        if (cell) {
          cellDiv.className = `cell-${x}-${y} ` + CellClasses[cell];
        }
        rowDiv.appendChild(cellDiv);
      });
      container.appendChild(rowDiv);
    });

    this.parentDiv.appendChild(container);

    return true;
  }

  solve() {
    const ascii = this.toASCII();
    const toFirstKey = solveMaze(ascii, "S", "K");
    toFirstKey.forEach((path) => {
      const cell = document.querySelector(`.cell-${path.x}-${path.y}`);
      cell.classList.add("path-key-1");
    });

    const toExit = solveMaze(ascii, "K", "E");
    toExit.forEach((path) => {
      const cell = document.querySelector(`.cell-${path.x}-${path.y}`);
      cell.classList.add("path-exit");
    });
  }
}