import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { checkForWin, Colour, Grid } from '../src/game';

function makeGrid(callback: (place: (colour: Colour, col: number) => void) => void): Grid {
    const grid: Grid = [[], [], [], [], [], [], []];
    callback((colour, col) => placeTokenInColumn(grid, colour, col));
    return grid;
}

function placeTokenInColumn(grid: Grid, colour: Colour, col: number) {
    grid[col].push(colour);
}

test('vertical win', () => {
    const grid = makeGrid(place => {
        place('yellow', 3);
        place('yellow', 3);
        place('red', 3);
        place('red', 3);
        place('red', 3);
        place('red', 3);
    });

    assert.is(checkForWin(grid), 'red', 'red should win');
});

test.run();
