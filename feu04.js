//npm install readline-sync --save

let args = process.argv;
let fileGrid = args[2];

const fs = require("fs");
const { parse } = require("path");
const readlineSync = require("readline-sync");

const fileContent = fs.readFileSync(fileGrid, "utf-8");
const rawgrid = fileContent.split("\n");

let grid = parsegetgrid(rawgrid);
if (grid == undefined) return;
let emptychar = parsegetemptychar(rawgrid);
let fullchar = parsegetfullchar(rawgrid);

solver(grid, emptychar, fullchar);

function parsegetgrid(nonparsed) {
  let stringNum = "";
  for (let i = 0; i <= nonparsed[0].length - 5; i++) {
    stringNum = stringNum + nonparsed[0][i];
  }
  let num = parseInt(stringNum);
  //tests
  if (nonparsed.length - 1 != num) {
    console.log("Erreur!");
    return;
  }
  let maxlength = nonparsed[1].length;
  for (let i = 1; i < nonparsed.length - 1; i++) {
    if (nonparsed[i].length != maxlength) {
      console.log("Erreur!");
      return;
    }
  }

  if (nonparsed[nonparsed.length - 1].length + 1 != maxlength) {
    console.log("Erreur!");
    return;
  }

  let emptychar = parsegetemptychar(rawgrid);
  let fullchar = parsegetfullchar(rawgrid);
  let hurdlechar = parsegethurdle(rawgrid);

  for (let i = 1; i < nonparsed.length; i++) {
    for (let j = 0; j < nonparsed[i].length; j++) {
      if (
        nonparsed[i][j] != emptychar &&
        nonparsed[i][j] != fullchar &&
        nonparsed[i][j] != hurdlechar &&
        nonparsed[i][j] != "\r"
      ) {
        console.log("Erreur!");
        return;
      }
    }
  }

  //fin tests
  let grid = [];
  for (let i = 1; i < nonparsed.length; i++) {
    let tab = [];
    for (let j = 0; j < nonparsed[i].length; j++) {
      tab.push(nonparsed[i][j]);
    }
    grid.push(tab);
  }
  return grid;
}

function parsegethurdle(nonparsed) {
  return nonparsed[0][nonparsed[0].length - 3];
}

function parsegetemptychar(nonparsed) {
  return nonparsed[0][nonparsed[0].length - 4];
}

function parsegetfullchar(nonparsed) {
  return nonparsed[0][nonparsed[0].length - 2];
}
function solver(grid, emptychar, fullchar) {
  let maxSize = 0;
  let x, y;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      for (let k = 0; k < grid.length; k++) {
        if (isSquareCorrect(grid, i, j, k, emptychar)) {
          if (k > maxSize) {
            x = i;
            y = j;
            maxSize = k;
          }
        }
      }
    }
  }
  setSquare(grid, x, y, maxSize, fullchar);
}

function isSquareCorrect(grid, x, y, size, emptychar) {
  for (let i = 0; i <= size; i++) {
    for (let j = 0; j < i; j++) {
      for (let k = 0; k < i; k++) {
        if (grid.length <= x + j) {
          return false;
        }
        if (grid[x + j].length <= y + k) {
          return false;
        }
        if (grid[x + j][y + k] != emptychar) {
          return false;
        }
      }
    }
  }
  return true;
}

function setSquare(grid, x, y, size, fullchar) {
  grid[x][y] = fullchar;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      grid[x + i][y + j] = fullchar;
    }
  }
  for (let i = 0; i < grid.length; i++) {
    let log = "";
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] != "\n") log = log + grid[i][j];
    }
    console.log(log);
  }
}
