import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { checkForWin } from '../src/game';
import { makeGrid } from './utils';

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
