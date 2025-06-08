import "./style.css";
import { Directions, Maze, MazeRecursiveBacktracker } from "./Maze";

const canvas = document.getElementById("canvas")! as HTMLCanvasElement;
let size = window.matchMedia("(max-width: 600px)").matches ? [4, 6] : [4, 5];
let maze = new Maze(size[0], size[1]);
let rback = new MazeRecursiveBacktracker(
    maze,
    Math.floor(Math.random() * maze.width),
    Math.floor(Math.random() * maze.height)
);
let stepDt = 0.1; // second

function renderMaze(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    maze: Maze,
    stack: [number, number][]
) {
    canvas.width = maze.width * 8;
    canvas.height = maze.height * 8;
    ctx.imageSmoothingEnabled = false;
    ctx.resetTransform();
    // ctx.translate(0.5, 0.5);
    // ctx.beginPath();
    // ctx.moveTo(0, 0);
    // ctx.lineTo(maze.width * 2, 0);
    // ctx.moveTo(0, 0);
    // ctx.lineTo(0, maze.height * 2);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let x = 0; x < maze.width; x++) {
        for (let y = 0; y < maze.height; y++) {
            const cell = maze.getCell(x, y);
            const stackIdx = stack.findIndex(
                ([sx, sy]) => sx === x && sy === y
            );
            if (stackIdx !== -1) {
                let hue = Math.round(
                    ((stackIdx / (maze.width * 6)) * 360) % 360
                );
                ctx.fillStyle = `hsl(${hue}deg, ${
                    stackIdx === stack.length - 1 ? 100 : 80
                }%, ${stackIdx === stack.length - 1 ? 30 : 50}%)`;
                ctx.fillRect(8 * x, 8 * y, 8, 8);
            } else if (cell === 0) {
                ctx.fillStyle = `#000000`;
                ctx.fillRect(8 * x, 8 * y, 8, 8);
            } else {
                if ((cell & Directions.East) === 0) {
                    ctx.fillStyle = `#000000`;
                    ctx.fillRect(8 * (x + 1), 8 * y, 1, 9);
                    // ctx.moveTo((x + 1) * 8 + 0.5, y * 8 + 0.5);
                    // ctx.lineTo((x + 1) * 8 + 0.5, (y + 1) * 8 + 0.5);
                }
                if ((cell & Directions.South) === 0) {
                    ctx.fillStyle = `#000000`;
                    ctx.fillRect(8 * x, 8 * (y + 1), 9, 1);
                    // ctx.moveTo((x + 1) * 8 + 0.5, y * 8 + 0.5);
                    // ctx.lineTo((x + 1) * 8 + 0.5, (y + 1) * 8 + 0.5);
                }
                // if ((cell & Directions.South) === 0) {
                //     ctx.moveTo(x * 8 + 0.5, (y + 1) * 8 + 0.5);
                //     ctx.lineTo((x + 1) * 8 + 0.5, (y + 1) * 8 + 0.5);
                // }
            }
        }
    }
    // ctx.stroke();
}
let ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;

let lastTime: number = 0;
let accum: number = 0;

let finishing = false;

function frame(time: number) {
    const dt = (time - lastTime) / 1000;
    accum += dt;
    lastTime = time;
    while (accum >= stepDt) {
        accum -= stepDt;
        rback.step();
    }
    if (!rback.isDone()) {
        renderMaze(canvas, ctx, maze, rback.stack);
    } else {
        renderMaze(canvas, ctx, maze, []);
        if (!finishing) finish();
    }
    requestAnimationFrame(frame);
}

function finish() {
    finishing = true;

    setTimeout(() => {
        let newHeight = Math.round(maze.height * 1.5);
        let newWidth = Math.round(maze.width * 1.5);
        if (newHeight > 50) {
            newHeight = 50;
        }
        if (newWidth > 40) {
            newWidth = 40;
        }
        const newMaze = new Maze(newWidth, newHeight);
        // for (let x = 0; x < maze.width; x++) {
        //     for (let y = 0; y < maze.height; y++) {
        //         newMaze.cells[y * newWidth + x] =
        //             maze.cells[y * maze.width + x];
        //     }
        // }
        maze = newMaze;
        rback = new MazeRecursiveBacktracker(
            maze,
            maze.width - 1,
            maze.height - 1
        );
        stepDt = 0.5 / maze.height;
        finishing = false;
    }, 3000);
}

requestAnimationFrame(frame);

document.getElementById("REALLY-BIG")!.onclick = () => {
    maze = new Maze(80, 80);
    rback = new MazeRecursiveBacktracker(
        maze,
        Math.floor(Math.random() * maze.width),
        Math.floor(Math.random() * maze.height)
    );
    stepDt = 0.01;
};
