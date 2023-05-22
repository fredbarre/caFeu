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
let wallchar = parsegetwallchar(rawgrid);
let roadchar = parsegetroadchar(rawgrid);
let goalchar = parsegetgoalchar(rawgrid);
let startchar = parsegetstartchar(rawgrid);

let entry = getEntry(grid, startchar);
let exits = getExits(grid, goalchar);

findShortestPathLength(grid, entry[0], entry[1]);

function loggrid(grid) {
  for (let i = 0; i < grid.length; i++) {
    let log = "";
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] != "\n") log = log + grid[i][j];
    }
    if (log != "") console.log(log);
  }
}

function parsegetgoalchar(rawgrid) {
  return rawgrid[0][rawgrid[0].length - 2];
}

function parsegetstartchar(rawgrid) {
  return rawgrid[0][rawgrid[0].length - 3];
}

function parsegetroadchar(rawgrid) {
  return rawgrid[0][rawgrid[0].length - 4];
}

function parsegetemptychar(rawgrid) {
  return rawgrid[0][rawgrid[0].length - 5];
}

function parsegetwallchar(rawgrid) {
  return rawgrid[0][rawgrid[0].length - 6];
}

function parsegetgrid(rawgrid) {
  //tests

  let stringGsize = "";
  for (let i = 0; i <= rawgrid[0].length - 7; i++) {
    stringGsize = stringGsize + rawgrid[0][i];
  }
  let splitString = stringGsize.split("x");
  let x = parseInt(splitString[0]);
  let y = parseInt(splitString[1]);

  if (rawgrid.length != x + 1) {
    console.log("Erreur!");
    return;
  }

  let maxlength = rawgrid[1].length;
  if (maxlength != y + 1) {
    console.log("Erreur!");
    return;
  }

  for (let i = 1; i < rawgrid.length - 2; i++) {
    if (rawgrid[i].length != maxlength) {
      console.log(rawgrid);
      console.log("r=" + rawgrid[4].length + "max=" + maxlength);
      console.log("Erreur!");
      return;
    }
  }

  if (rawgrid[rawgrid.length - 1].length + 1 != maxlength) {
    console.log("Erreur!");
    return;
  }

  if (rawgrid[0].length - 6 < 3) {
    console.log("Erreur!");
    return;
  }

  let emptychar = parsegetemptychar(rawgrid);
  let wallchar = parsegetwallchar(rawgrid);
  let roadchar = parsegetroadchar(rawgrid);
  let goalchar = parsegetgoalchar(rawgrid);
  let startchar = parsegetstartchar(rawgrid);

  for (let i = 1; i < rawgrid.length; i++) {
    for (let j = 0; j < rawgrid[i].length; j++) {
      if (
        rawgrid[i][j] != emptychar &&
        rawgrid[i][j] != wallchar &&
        rawgrid[i][j] != roadchar &&
        rawgrid[i][j] != goalchar &&
        rawgrid[i][j] != startchar &&
        rawgrid[i][j] != "\r"
      ) {
        console.log("Erreur!");
        return;
      }
    }
  }

  //fin tests
  let grid = [];
  for (let i = 1; i < rawgrid.length; i++) {
    let tab = [];
    for (let j = 0; j < rawgrid[i].length; j++) {
      if (rawgrid[i][j] != "\r") tab.push(rawgrid[i][j]);
    }
    grid.push(tab);
  }
  return grid;
}

function isCaseCorrect(grid, path, x, y, emptychar, goalchar) {
  if (grid.length > x && x >= 0) {
    if (grid[x].length > y && y >= 0) {
      return (
        (grid[x][y] == emptychar ||
          grid[x][y] == goalchar ||
          grid[x][y] == startchar) &&
        path[x][y].dist == -1
      );
    }
  }
  return false;
}

function getEntry(grid, startchar) {
  let entrypoint = [];
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      if (grid[i][j] == startchar) {
        entrypoint.push(i);
        entrypoint.push(j);
      }
    }
  }
  return entrypoint;
}

function getExits(grid, goalchar) {
  let exits = [];

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      if (grid[i][j] == goalchar) {
        let coor = [];
        coor.push(i);
        coor.push(j);
        exits.push(coor);
      }
    }
  }

  return exits;
}

function setClosePoint(grid, path, x, y, dist) {
  let min = grid.length * grid[0].length;
  let a, b;
  if (x + 1 < grid.length) {
    if (min >= path[x + 1][y].dist && path[x + 1][y].dist != -1) {
      min = path[x + 1][y].dist;
      a = x + 1;
      b = y;
    }
  }
  if (x - 1 >= 0) {
    if (min >= path[x - 1][y].dist && path[x - 1][y].dist != -1) {
      min = path[x - 1][y].dist;
      a = x - 1;
      b = y;
    }
  }
  if (y + 1 < grid[0].length) {
    if (min >= path[x][y + 1].dist && path[x][y + 1].dist != -1) {
      min = path[x][y + 1].dist;
      a = x;
      b = y + 1;
    }
  }
  if (y - 1 >= 0) {
    if (min >= path[x][y - 1].dist && path[x][y - 1].dist != -1) {
      min = path[x][y - 1].dist;
      a = x;
      b = y - 1;
    }
  }
  if (!isNaN(a)) {
    path[x][y].dist = min + 1;
    path[x][y].back = [a, b];
  } else {
    path[x][y].dist = dist;
    path[x][y].back = null;
  }
}

function setallOngrid(grid, path, x, y) {
  for (let i = 0; i < path.length; i++) {
    for (let j = 0; j < path[i].length; j++) {
      if (path[i][j].dist != -1) {
        grid[i][j] = roadchar;
      }
    }
  }
}

function setpathOngrid(grid, path, x, y) {
  if (grid[x][y] != goalchar && grid[x][y] != startchar) grid[x][y] = roadchar;
  if (path[x][y].back == null) return;
  setpathOngrid(grid, path, path[x][y].back[0], path[x][y].back[1]);
}

function findShortestPath(grid, path, i, j, dist) {
  setClosePoint(grid, path, i, j, dist);

  // va dans la cellule du bas
  if (isCaseCorrect(grid, path, i + 1, j, emptychar, goalchar)) {
    findShortestPath(grid, path, i + 1, j, dist + 1);
  }

  // va à la cellule du haut
  if (isCaseCorrect(grid, path, i - 1, j, emptychar, goalchar)) {
    findShortestPath(grid, path, i - 1, j, dist + 1);
  }

  // va dans la cellule de droite
  if (isCaseCorrect(grid, path, i, j + 1, emptychar, goalchar)) {
    findShortestPath(grid, path, i, j + 1, dist + 1);
  }

  // va dans la cellule de gauche
  if (isCaseCorrect(grid, path, i, j - 1, emptychar, goalchar)) {
    findShortestPath(grid, path, i, j - 1, dist + 1);
  }

  return;
}

function findShortestPathLength(grid, i, j) {
  let M = grid.length;
  let N = grid[0].length;

  let path = [];
  for (let i = 0; i < M; i++) {
    let l = [];
    for (let j = 0; j < N; j++) {
      let p = { back: null, dist: -1 };
      l.push(p);
    }
    path.push(l);
  }
  path[i][j].dist = 0;

  findShortestPath(grid, path, i, j, 0);
  let dist = M * N;
  let x, y, xx, yy;
  for (let a = 0; a < exits.length; a++) {
    xx = exits[a][0];
    yy = exits[a][1];

    if (path[xx][yy].dist < dist) {
      dist = path[xx][yy].dist;
      x = xx;
      y = yy;
    }
  }
  if (path[x][y].back != null) {
    setpathOngrid(grid, path, x, y);
    loggrid(grid);

    console.log(
      "=> SORTIE ATTEINTE EN " +
        path[path[x][y].back[0]][path[x][y].back[1]].dist +
        " COUPS !"
    );
  } else {
    loggrid(grid);
    console.log("=> SORTIE NON ATTEINTE");
  }
}
