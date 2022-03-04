import './style.css';
import '@fontsource/poppins';
import { evaluteMoves } from './computer';
import { checkDraw, checkWin, Colour, Grid, otherColour } from './game';

function getColumnElement(idx: number): HTMLDivElement {
  return document.querySelector<HTMLDivElement>(`#col-${idx}`)!;
}

const gridContainer = document.querySelector<HTMLDivElement>('.grid-container')!;
const gridEle = document.querySelector<HTMLDivElement>('.grid')!;

function createCircleElement(colour: Colour): HTMLDivElement {
  const ele = document.createElement('div');
  ele.classList.add('token');
  ele.classList.add(`token-${colour}`);
  return ele;
}

function createWinMessage(colour: string) {
  const ele = document.createElement('h2');
  ele.classList.add('win-message');
  ele.innerText = `${colour} won!`;
  gridContainer.appendChild(ele);

  sideToPlayEle.remove();
}

function addColourToColumn(idx: number, colour: Colour): boolean {
  if (grid[idx].length >= 6) {
    return false;
  }

  const col = getColumnElement(idx);
  col.appendChild(createCircleElement(colour));
  grid[idx].push(colour);
  if (grid[idx].length >= 6) {
    col.classList.add('full');
  }

  return true;
}

function availableColumns(): number[] {
  const available: number[] = [];
  for (let i = 0; i < grid.length; i++) {
    const col = grid[i];
    if (col.length < 6) {
      available.push(i);
    }
  }
  return available;
}

function checkForWinHorizontal(grid: Grid): Colour | null {
  for (let row = 0; row < 6; row++) {
    for (let startCol = 0; startCol < 4; startCol++) {
      const startColumn = grid[startCol];
      if (startColumn.length < (row+1)) {
        continue;
      }
      const initialColour = grid[startCol][row];
      let ok = true;
      for (let i = 1; i <= 3; i++) {
        const c = grid[startCol+i];
        if (c.length < (row+1)) {
          ok = false;
          break;
        }
        if (c[row] != initialColour) {
          ok = false;
          break;
        }
      }
      if (ok) {
        return initialColour;
      }
    }
  }

  return null;
}

function checkForWinVertical(grid: Grid): Colour | null {
  outer:for (let col = 0; col < 7; col++) {
    const column = grid[col];
    for (let startRow = 0; startRow < 6; startRow++) {
      if (column.length < (startRow + 4)) {
        continue outer;
      }
      const window = column.slice(startRow, startRow + 4 + 1);
      const firstCol = window[0];
      for (const col of window) {
        if (col !== firstCol) {
          continue outer;
        }
      }
      return firstCol;
    }
  }
  return null;
}

function checkForWinDiagonalPositive(grid: Grid): Colour | null {
  outer:for (let startCol = 0; startCol < 4; startCol++) {
    const column = grid[startCol];
    for (let startRow = 0; startRow < 3; startRow++) {
      if (column.length < startRow) {
        continue outer;
      }
      const initial = column[startRow];
      for (let i = 1; i < 4; i++) {
        const newColumn = grid[startCol + i];
        if (newColumn.length < startRow + i) {
          continue outer;
        }
        if (newColumn[startRow + i] !== initial) {
          continue outer;
        }
      }
      return initial;
    }
  }
  return null;
}

function checkForWinDiagonalNegative(grid: Grid): Colour | null {
  outer:for (let startCol = 0; startCol < 4; startCol++) {
    const column = grid[grid.length - 1 - startCol];
    for (let startRow = 0; startRow < 3; startRow++) {
      if (column.length < startRow) {
        continue outer;
      }
      const initial = column[startRow];
      for (let i = 1; i < 4; i++) {
        const newColumn = grid[grid.length - 1 - (startCol + i)];
        if (newColumn.length < startRow + i) {
          continue outer;
        }
        if (newColumn[startRow + i] !== initial) {
          continue outer;
        }
      }
      return initial;
    }
  }
  return null;
}

let grid: Grid = [[], [], [], [], [], [], []];
let sideToPlay: Colour = 'red';
const sideToPlayEle = document.querySelector<HTMLHeadingElement>('#to-move')!;
let hasWon = false;
let hasDraw = false;
const ENABLE_AI = true;
const AI_BATTLE = false;

function updateToPlay() {
  gridEle.classList.remove(sideToPlay);
  sideToPlay = otherColour(sideToPlay);
  gridEle.classList.add(sideToPlay);
  sideToPlayEle.innerText = `${sideToPlay} to play`;
}

function detatchEventListeners() {
  for (let i = 0; i < 7; i++) {
    const col = getColumnElement(i);
    col.onclick = null;
  }
}

function triggerAI(side: Colour, first: boolean = false) {
  setTimeout(async () => {
    if (!ENABLE_AI || hasWon || hasDraw) return;
    let col: number = 0;
    if (first) {
    // if (side === 'red') {
      const available = availableColumns();
      col = available[Math.floor(Math.random() * available.length)];
    } else {
      console.log('thinking')
      col = await evaluteMoves(grid, side);
      console.log('thunk');
    }
    placeTokenInColumn(col);
  }, 0);
}

function gameEnd() {
  if (AI_BATTLE) {
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }
}

function placeTokenInColumn(column: number) {
  if (addColourToColumn(column, sideToPlay)) {
    const won = checkWin(grid);
    if (won) {
      createWinMessage(won);
      detatchEventListeners();
      hasWon = true;
      gameEnd();
    } else if (checkDraw(grid)) {
      createWinMessage('nobody');
      detatchEventListeners();
      hasDraw = true;
      gameEnd();
    } else {
      updateToPlay();
      if (AI_BATTLE || (ENABLE_AI && sideToPlay == 'yellow')) {
        triggerAI(sideToPlay);
      }
    }
  }
}

function attachEventListeners() {
  for (let i = 0; i < 7; i++) {
    const col = getColumnElement(i);
    col.onclick = () => {
      placeTokenInColumn(i);
    };
  }
}

function init() {
  updateToPlay();
  updateToPlay();
  if (AI_BATTLE) {
    triggerAI('red', true);
  } else {
    attachEventListeners();
  }
}

init();
