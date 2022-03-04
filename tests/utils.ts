import { Colour, Grid } from "../src/game";

export function makeGrid(callback: (place: (colour: Colour, col: number) => void) => void): Grid {
    const grid: Grid = [[], [], [], [], [], [], []];
    callback((colour, col) => placeTokenInColumn(grid, colour, col));
    return grid;
}

function placeTokenInColumn(grid: Grid, colour: Colour, col: number) {
    grid[col].push(colour);
}
