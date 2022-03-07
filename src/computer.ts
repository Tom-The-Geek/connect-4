import { checkDraw, checkForLines, checkWin, Colour, Grid, otherColour } from "./game";

let totalEvalulated = 0;
let totalPruned = 0;
let startTime: Date | null = null;

export async function evaluteMoves(grid: Grid, colour: Colour, shouldUpdateStats: boolean = true): Promise<number> {
    if (checkDraw(grid)) throw new Error('ohno');

    startTime = new Date();
    totalEvalulated = 0;
    totalPruned = 0;

    let bestMoves: number[] = [];
    let bestScore = -Infinity;

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

    if (shouldUpdateStats) {
        let timeTaken = (new Date().getTime()) - startTime.getTime();
        updateStats(timeTaken);
    }

    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}

async function minimaxSearch(grid: Grid, side: Colour, depth: number, alpha: number, beta: number): Promise<number> {
    if (depth === 0) {
        totalEvalulated += 1;
        return rankPosition(grid, side);
    }

    const win = checkWin(grid);
    if (win) {
        return win === side ? 100000 : -100000;
    }

    if (checkDraw(grid)) {
        return 0;
    }

    for (const [_, newGrid] of possibleMovesSorted(grid, side)) {
        const score = -(await minimaxSearch(newGrid, otherColour(side), depth - 1, -beta, -alpha));
        if (score >= beta) {
            totalPruned += 1;
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
        moveScores.push([move, rankPosition(newGrid, colour, true), newGrid]);
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

function rankPosition(grid: Grid, side: Colour, twos: boolean = false): number {
    const win = checkWin(grid);
    if (win) {
        return win === side ? 100000 : -100000;
    }

    if (checkDraw(grid)) {
        return 0;
    }

    // Now compute a score based on lines of 3 pieces
    const lines = checkForLines(grid, 3);
    let score = (lines.get(side)! * 10) - (lines.get(otherColour(side))! * 10);
    if (twos) {
        // Also include number of 2-piece lines in calculation
        const lines2 = checkForLines(grid, 2);
        score += (lines2.get(side)! * 2) - (lines2.get(otherColour(side))! * 2);
    }

    return score;
}

function updateStats(timeTaken: number) {
    document.getElementById('time-taken')!.innerText = timeTaken.toString() + 'ms';
    document.getElementById('evaluated')!.innerText = totalEvalulated.toString();
    document.getElementById('pruned')!.innerText = totalPruned.toString();
}
