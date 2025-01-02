export enum Directions {
    North = 0b1,
    East = 0b10,
    South = 0b100,
    West = 0b1000,
}

const OPPOSITE = {
    [Directions.North]: Directions.South,
    [Directions.South]: Directions.North,
    [Directions.East]: Directions.West,
    [Directions.West]: Directions.East,
};

const DX = {
    [Directions.North]: 0,
    [Directions.South]: 0,
    [Directions.East]: 1,
    [Directions.West]: -1,
};

const DY = {
    [Directions.North]: -1,
    [Directions.South]: 1,
    [Directions.East]: 0,
    [Directions.West]: 0,
};

export class Maze {
    cells: Uint8Array;
    width: number;
    height: number;
    mask: Uint8Array;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.cells = new Uint8Array(width * height);
        this.mask = new Uint8Array(width * height);
    }

    getCell(x: number, y: number) {
        return this.cells[y * this.width + x];
    }

    setCell(x: number, y: number, v: Directions) {
        this.cells[y * this.width + x] = v;
    }

    getMask(x: number, y: number) {
        return this.mask[y * this.width + x] === 0;
    }

    setMask(x: number, y: number, v: boolean) {
        this.mask[y * this.width + x] = v ? 1 : 0;
    }

    connect(x1: number, y1: number, x2: number, y2: number, dir1: Directions) {
        this.setCell(x1, y1, this.getCell(x1, y1) | dir1);
        this.setCell(x2, y2, this.getCell(x2, y2) | OPPOSITE[dir1]);
    }
}

export class MazeRecursiveBacktracker {
    public stack: [number, number][];
    constructor(public maze: Maze, x: number, y: number) {
        this.stack = [[x, y]];
    }

    isDone() {
        return this.stack.length === 0;
    }

    step() {
        if (this.stack.length > 0) {
            const [x, y] = this.stack[this.stack.length - 1]!;

            const neighbors: [number, number, Directions][] = [];

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
                    this.maze.getCell(nx, ny) === 0 &&
                    this.maze.getMask(nx, ny)
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
function randomDirs() {
    return shuffle([
        Directions.North,
        Directions.East,
        Directions.South,
        Directions.West,
    ]);
}
