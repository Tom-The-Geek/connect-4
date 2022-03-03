import { checkDraw, checkWin, Colour, Grid, otherColour } from "./main";

export async function evaluteMoves(grid: Grid, colour: Colour): Promise<number> {
    if (checkDraw(grid)) throw new Error('ohno');

    let bestMoves: number[] = [];
    let bestScore = -2000;

    for (let col = 0; col < grid.length; col++) {
        const promise = new Promise<void>((resolve) => {
            setTimeout(async () => {
                if (grid[col].length >= 6) {
                    return resolve();
                }
                const newGrid = makeMove(grid, colour, col);
                const score = -(await minimaxSearch(newGrid, otherColour(colour), 10, -2000, 2000));
                if (score > bestScore) {
                    console.log('new best score', score, col);
                    bestScore = score;
                    bestMoves = [col];
                } else if (score === bestScore) {
                    console.log('new equal score', score, col);
                    bestMoves.push(col);
                }
                resolve();
            }, 0);
        });
        await promise;
    }

    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}

async function minimaxSearch(grid: Grid, side: Colour, depth: number, alpha: number, beta: number): Promise<number> {
    if (depth === 0) {
        return 0;
    }

    const win = checkWin(grid);
    if (win) {
        return win === side ? 1000 : -1000;
    }

    if (checkDraw(grid)) {
        return 0;
    }

    for (let move = 0; move < 7; move++) {
        if (grid[move].length >= 6) {
            continue;
        } // skip full rows
        const newGrid = makeMove(grid, side, move);
        const score = -(await minimaxSearch(newGrid, otherColour(side), depth - 1, -beta, -alpha));
        if (score >= beta) {
            return beta;
        }
        alpha = Math.max(alpha, score);
    }
    return alpha;
}

function makeMove(grid: Grid, colour: Colour, move: number): Grid {
    return grid.map((col, idx) => {
        const newCol = col.slice();
        if (idx === move) {
            newCol.push(colour);
        }
        return newCol;
    }) as Grid;
}
