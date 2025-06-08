// An enum of directions. These numbers are in binary
// to be a bitfield. The first (rightmost) bit is North,
// then the second bit is East, and so on. By ORing (||)
// these together, a cell can contain any combination of
// connections to other cells.
const Directions = {
    North: 0b1,
    East: 0b10,
    South: 0b100,
    West: 0b1000,
};

// A map from a direction to its opposite.
const OPPOSITE = {
    [Directions.North]: Directions.South,
    [Directions.South]: Directions.North,
    [Directions.East]: Directions.West,
    [Directions.West]: Directions.East,
};

// Delta x
const DX = {
    [Directions.North]: 0,
    [Directions.South]: 0,
    [Directions.East]: 1,
    [Directions.West]: -1,
};

// Delta y. N.b. positive y is down
const DY = {
    [Directions.North]: -1,
    [Directions.South]: 1,
    [Directions.East]: 0,
    [Directions.West]: 0,
};

class Maze {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.cells = new Uint8Array(width * height);
    }

    getCell(x, y) {
        return this.cells[y * this.width + x];
    }

    setCell(x, y, v) {
        this.cells[y * this.width + x] = v;
    }

    // This ORs the directions together for both cells.
    // A proper implementation would check that (x1, y1)
    // and (x2, y2) are touching.
    connect(x1, y1, x2, y2, dir1) {
        this.setCell(x1, y1, this.getCell(x1, y1) | dir1);
        this.setCell(x2, y2, this.getCell(x2, y2) | OPPOSITE[dir1]);
    }
}

class MazeRecursiveBacktracker {
    constructor(maze, x, y) {
        this.maze = maze;
        // This uses a manual stack, and starts at the
        // start cell.
        this.stack = [[x, y]];
    }

    isDone() {
        return this.stack.length === 0;
    }

    step() {
        if (this.stack.length > 0) {
            // This does not pop the item off the stack.
            const [x, y] = this.stack[this.stack.length - 1];

            const neighbors = [];

            for (const dir of [
                Directions.North,
                Directions.East,
                Directions.South,
                Directions.West,
            ]) {
                const nx = x + DX[dir];
                const ny = y + DY[dir];

                if (
                    nx >= 0 &&
                    nx < this.maze.width &&
                    ny >= 0 &&
                    ny < this.maze.height &&
                    this.maze.getCell(nx, ny) === 0 // If the cell has no connections, it is 0
                ) {
                    neighbors.push([nx, ny, dir]);
                }
            }

            if (neighbors.length > 0) {
                const [nextX, nextY, direction] =
                    neighbors[Math.floor(Math.random() * neighbors.length)];

                this.maze.connect(x, y, nextX, nextY, direction);

                this.stack.push([nextX, nextY]);
            } else {
                this.stack.pop();
            }
        }
    }
}

const maze = new Maze(10, 10);
const backtracker = new MazeRecursiveBacktracker(maze, 0, 0);
while (!backtracker.isDone()) {
    backtracker.step();
}

// print the maze as ascii
let lines = ["#".repeat(maze.width * 2 + 2)];
for (let y = 0; y < maze.height; y++) {
    let line = "#";
    for (let x = 0; x < maze.width; x++) {
        line += " ";
        if ((maze.getCell(x, y) & Directions.East) === 0) {
            line += "#";
        } else {
            line += " ";
        }
    }
    lines.push(line);
    line = "#";
    for (let x = 0; x < maze.width; x++) {
        if ((maze.getCell(x, y) & Directions.South) === 0) {
            line += "#";
        } else {
            line += " ";
        }
        line += "#";
    }
    lines.push(line);
}

console.log(lines.join("\n"));
