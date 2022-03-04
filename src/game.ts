export type Colour = 'red' | 'yellow';
export type Grid = [Colour[], Colour[], Colour[], Colour[], Colour[], Colour[], Colour[]];

export function checkForLineInDirection(grid: Grid, [col, row]: [number, number], [dirCol, dirRow]: [number, number], length: number = 4): Colour | null {
    const initial = grid[col][row];
    if (!initial) return null;

    for (let i = 1; i < length; i++) {
        const newCol = col + (dirCol * i);
        const newRow = row + (dirRow * i);
        if (newCol < 0 || newCol >= grid.length || newRow < 0 || newRow >= 6) return null;
        if (grid[newCol][newRow] !== initial) return null;
    }

    return initial;
}

export function checkForLines(grid: Grid, length: number = 4): Map<Colour, number> {
    const lineCounts = new Map<Colour, number>();
    lineCounts.set('red', 0);
    lineCounts.set('yellow', 0);

    for (let col = 0; col < grid.length; col++) {
        for (let row = 0; row < 6; row++) {
            for (let dirX = -1; dirX <= 1; dirX++) {
                for (let dirY = -1; dirY <= 1; dirY++) {
                    if (dirX === 0 && dirY === 0) continue;

                    const line = checkForLineInDirection(grid, [col, row], [dirX, dirY], length);
                    if (line) {
                        lineCounts.set(line, lineCounts.get(line)! + 1);
                    }
                }
            }
        }
    }

    return lineCounts;
}

export function checkForWin(grid: Grid): Colour | null {
    const lineCounts = checkForLines(grid, 4);
    if (lineCounts.get('yellow') !== 0) {
        return 'yellow';
    }
    if (lineCounts.get('red') !== 0) {
        return 'red';
    }
    return null;
}

export function checkWin(grid: Grid): Colour | null {
    // return checkForWinHorizontal(grid) || checkForWinVertical(grid) || checkForWinDiagonalPositive(grid) || checkForWinDiagonalNegative(grid);
    return checkForWin(grid)
}

export function checkDraw(grid: Grid): boolean {
    for (const col of grid) {
        if (col.length < 6) return false;
    }
    return true;
}

export function otherColour(col: Colour): Colour {
    switch (col) {
        case 'red':
            return 'yellow';
        case 'yellow':
            return 'red';
    }
}
