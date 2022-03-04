import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { makeGrid } from './utils';
import { evaluteMoves } from '../src/computer';

test('block horizontal win', async () => {
    const grid = makeGrid(place => {
        place('red', 0);
        place('red', 1);
        place('red', 2);
    });
    
    const result = await evaluteMoves(grid, 'yellow', false);
    assert.equal(result, 3, 'must play in column 3 to block a loss');
});

test('horizontal win', async () => {
    const grid = makeGrid(place => {
        place('red', 0);
        place('red', 1);
        place('red', 2);
    });
    
    const result = await evaluteMoves(grid, 'red', false);
    assert.equal(result, 3, 'should play in column 3 to win');
});

test('block vertical win', async () => {
    const grid = makeGrid(place => {
        place('red', 0);
        place('red', 0);
        place('red', 0);
    });
    
    const result = await evaluteMoves(grid, 'yellow', false);
    assert.equal(result, 0, 'must play in column 0 to block a loss');
});

test('vertical win', async () => {
    const grid = makeGrid(place => {
        place('red', 0);
        place('red', 0);
        place('red', 0);
    });
    
    const result = await evaluteMoves(grid, 'red', false);
    assert.equal(result, 0, 'should play in column 0 to win');
});

test.run();
