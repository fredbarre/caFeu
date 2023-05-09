//npm install readline-sync --save

let args = process.argv;
let fileSudoku = args[2];

const fs = require("fs");
const { parse } = require("path");
const readlineSync = require("readline-sync");

const fileContent = fs.readFileSync(fileSudoku, "utf-8");
const sudoku = fileContent.split("\n");

function parseSudoku(sudoku) {
  let sudo = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (sudoku[i][j] != ".") {
        sudo[i][j] = parseInt(sudoku[i][j]);
      } else {
        sudo[i][j] = ".";
      }
    }
  }
  return sudo;
}
let s = parseSudoku(sudoku);
solver(s);

//console.log(s);

for (line of s) {
  let txt = "";
  for (let i = 0; i < 9; i++) {
    txt = txt + line[i];
  }
  console.log(txt);
}

function newcaseisCorrect(sudoku, row, col, k) {
  for (let i = 0; i < 9; i++) {
    const m = 3 * Math.floor(row / 3) + Math.floor(i / 3);
    const n = 3 * Math.floor(col / 3) + (i % 3);
    if (sudoku[row][i] == k || sudoku[i][col] == k || sudoku[m][n] == k) {
      return false;
    }
  }
  return true;
}

function solver(sudoku) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (sudoku[i][j] == ".") {
        for (let k = 1; k <= 9; k++) {
          if (newcaseisCorrect(sudoku, i, j, k)) {
            sudoku[i][j] = k;
            if (solver(sudoku)) {
              return true;
            } else {
              sudoku[i][j] = ".";
            }
          }
        }
        return false;
      }
    }
  }
  return true;
}
