//npm install readline-sync --save

let args = process.argv;
let fileBoard = args[2];
let fileFind = args[3];

const fs = require("fs");
const readlineSync = require("readline-sync");

const fileContent = fs.readFileSync(fileBoard, "utf-8");
const boardlines = fileContent.split("\n");
const fileContent2 = fs.readFileSync(fileFind, "utf-8");
const findlines = fileContent2.split("\n");
const fileContent3 = fs.readFileSync(fileBoard, "utf-8");
let result = fileContent3.split("\n");
let isfound = false;

let resultx;
let resulty;

for (let i = 0; i < boardlines.length - findlines.length + 1; i++) {
  for (let j = 0; j < boardlines[i].length - findlines[i].length + 1; j++) {
    
    if (boardlines[i][j] == findlines[0][0] && isfound == false) {
      isfound = true;
      for (let k = 0; k < findlines.length; k++) {
        for (let l = 0; l < findlines[k].length; l++) {
          if (
            boardlines[i + k][j + l] != findlines[k][l] &&
            findlines[k][l] != " " && findlines[k][l] != "\r"
          ) {
            isfound = false;
          }
        }
      }
      if (isfound == true) {
        console.log("Trouvé !");
        console.log("Coordonnées : " + j + "," + i);
        resultx = i;
        resulty = j;
      }
    }
  }
}

if (isfound == true) {
  
  for (let i = 0; i < result.length; i++) {
    for (let j = 0; j < result[i].length; j++) {
      if (result[i][j] != "\r") result[i] = replaceAt(result[i], j, "-");
    }
  }

  for (let k = 0; k < findlines.length; k++) {
    for (let l = 0; l < findlines[k].length; l++) {
      let ind = resulty + l;
      if (findlines[k][l] != " ") result[resultx + k] = replaceAt(result[resultx + k], ind, boardlines[resultx + k][resulty + l]);
    }
  }

  for (let line of result) {
  console.log(line);
  }
  return;
  
}

function replaceAt(str,index, char) {
  let a = str.split("");
  a[index] = char;
  return a.join("");
}

console.log("Introuvable");
