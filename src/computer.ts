import { checkForLines, Colour, Grid } from "./game";
import { checkDraw, checkWin, otherColour } from "./main";

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
                const score = (await minimaxSearch(newGrid, otherColour(colour), 8, -2000, 2000)) * (colour === 'yellow' ? -1 : 1);
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
        return rankPosition(grid, side);
    }

    const win = checkWin(grid);
    if (win) {
        return win === side ? 1000 : -1000;
    }

    if (checkDraw(grid)) {
        return 0;
    }

    for (const [_, newGrid] of possibleMovesSorted(grid, side)) {
        const score = -(await minimaxSearch(newGrid, otherColour(side), depth - 1, -beta, -alpha));
        if (score >= beta) {
            return beta;
        }
        alpha = Math.max(alpha, score);
    }
    return alpha;
}

function possibleMovesSorted(grid: Grid, colour: Colour): [number, Grid][] {
    const moveScores: [number, number, Grid][] = [];
    for (let move = 0; move < 7; move++) {
        if (grid[move].length >= 6) continue; // skip full rows
        const newGrid = makeMove(grid, colour, move);
        moveScores.push([move, rankPosition(newGrid, colour), newGrid]);
    }
    moveScores.sort((a, b) => b[1] - a[1]);
    return moveScores.map((([move, _, grid]) => [move, grid]));
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

function rankPosition(grid: Grid, side: Colour): number {
    const win = checkWin(grid);
    if (win) {
        return win === side ? 1000 : -1000;
    }

    if (checkDraw(grid)) {
        return 0;
    }

    // Now compute a score based on lines of 3 pieces
    const lines = checkForLines(grid, 3);
    let score = (lines.get(side)! * 10) - (lines.get(otherColour(side))! * 10);
    // Also include number of 2-piece lines in calculation
    const lines2 = checkForLines(grid, 2);
    score += (lines2.get(side)! * 2) - (lines2.get(otherColour(side))! * 2);

    return score;
}
