let args = process.argv;
let coorY = parseInt(args[2]);
let coorX = parseInt(args[3]);

if (Number.isNaN(coorX) || Number.isNaN(coorY)) {
  console.log("error.");
  return;
}

let rect = "";
for (let i = 0; i < coorX; i++) {
  for (let j = 0; j < coorY; j++) {
    if (i == 0 || i == coorX - 1) {
      if (
        (i == 0 && j == 0) ||
        (i == 0 && j == coorY - 1) ||
        (i == coorX - 1 && j == 0) ||
        (i == coorX - 1 && j == coorY - 1)
      ) {
        rect = rect + "o";
      } else {
        rect = rect + "-";
      }
    } else {
      if (j == 0 || j == coorY - 1 /*&& i != 0 && i != -coorX*/) {
        rect = rect + "|";
      } else {
        rect = rect + " ";
      }
    }
  }
  rect = rect + "\n";
}

console.log(rect);
