<script lang="ts">
    import { Directions, Maze, MazeRecursiveBacktracker } from "$lib";
    import { onMount } from "svelte";

    export let stepDt = 0.01; // second

    let canvas: HTMLCanvasElement;
    export let maze: Maze;
    export let rback: MazeRecursiveBacktracker;
    export let onfinish: () => void = () => {};
    export let gen = 0;

    function renderMaze(
        canvas: HTMLCanvasElement,
        ctx: CanvasRenderingContext2D,
        maze: Maze,
        stack: [number, number][]
    ) {
        canvas.width = maze.width * 8 + 1;
        canvas.height = maze.height * 8 + 1;

        ctx.imageSmoothingEnabled = false;

        ctx.resetTransform();
        ctx.translate(0.5, 0.5);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(maze.width * 8, 0);
        ctx.moveTo(0, 0);
        ctx.lineTo(0, maze.height * 8);
        for (let x = 0; x < maze.width; x++) {
            for (let y = 0; y < maze.height; y++) {
                const cell = maze.getCell(x, y);
                const stackIdx = stack.findIndex(
                    ([sx, sy]) => sx === x && sy === y
                );
                if (stackIdx !== -1) {
                    let hue = Math.round(
                        ((stackIdx / Math.max(stack.length, 20)) * 360) % 360
                    );
                    ctx.fillStyle = `hsl(${hue}deg, 80%, 50%)`;
                    ctx.fillRect(x * 8, y * 8, 8, 8);
                } else if (cell === 0) {
                    ctx.fillStyle = `#000000`;
                    ctx.fillRect(x * 8, y * 8, 8, 8);
                } else {
                    if ((cell & Directions.East) === 0) {
                        ctx.moveTo((x + 1) * 8, y * 8);
                        ctx.lineTo((x + 1) * 8, (y + 1) * 8);
                    }
                    if ((cell & Directions.South) === 0) {
                        ctx.moveTo(x * 8, (y + 1) * 8);
                        ctx.lineTo((x + 1) * 8, (y + 1) * 8);
                    }
                }
            }
        }

        ctx.stroke();
    }

    let ctx: CanvasRenderingContext2D;

    onMount(() => {
        ctx = canvas.getContext("2d")!;
        requestAnimationFrame(frame);
    });
    let lastTime: number = 0;

    let accum: number = 0;

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
            onfinish();
        }
        requestAnimationFrame(frame);
    }
</script>

<canvas bind:this={canvas} style="image-rendering: pixelated; margin: 0 auto;"
></canvas>
{gen}
