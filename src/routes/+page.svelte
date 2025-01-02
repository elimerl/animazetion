<script lang="ts">
    import { Maze, MazeRecursiveBacktracker } from "$lib";
    import MazeCanvas from "$lib/MazeCanvas.svelte";
    import "$lib/reset.css";
    import { min, range } from "lodash-es";
    import { onMount } from "svelte";
    let maze = new Maze(8, 8);
    let rback = new MazeRecursiveBacktracker(
        maze,
        Math.floor(Math.random() * maze.width),
        Math.floor(Math.random() * maze.height)
    );

    let gen = 0;

    function growMaze(): { maze: Maze; rback: MazeRecursiveBacktracker } {
        const newWidth = maze.width + 1;
        const newHeight = maze.height + 1;
        const newCells = new Uint8Array(newWidth * newHeight);
        for (let x = 0; x < newWidth; x++) {
            for (let y = 0; y < newHeight; y++) {
                newCells[y * newWidth + x] = maze.cells[y * maze.width + x];
            }
        }
        maze.cells = newCells;
        maze.width = newWidth;
        maze.height = newHeight;
        maze = maze;
        rback = new MazeRecursiveBacktracker(
            maze,
            maze.width - 1,
            maze.height - 1
        );
        return { maze, rback };
    }
</script>

<div style="display: flex; flex-direction: column;">
    <MazeCanvas
        stepDt={0.02}
        {maze}
        {rback}
        {gen}
        onfinish={() => {
            const res = growMaze();
            maze = res.maze;
            rback = res.rback;
            gen++;
        }}
    />
</div>
