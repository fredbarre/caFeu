let args = process.argv;
let exp = args[2];

function calc(expression) {
  let ext1 = "";
  let ext2 = "";
  let parent = "";
  let frontParCount = 0;
  let backParCount = 0;
  let par1, par2;

  for (let i = 0; i < expression.length; i++) {
    if (expression.charAt(i) == "(") {
      if (frontParCount == 0) par1 = i;
      frontParCount++;
    }
    if (expression.charAt(i) == ")") {
      backParCount++;
      if (frontParCount == backParCount) par2 = i;
    }
  }
  if (frontParCount != 0 && backParCount != 0) {
    if (par1 != 0) ext1 = expression.slice(0, par1);
    parent = expression.slice(par1 + 1, par2);
    if (par2 != expression.length)
      ext2 = expression.slice(par2 + 1, expression.length);

    let calcparent = calc(parent);

    return calc(ext1 + calcparent + ext2);
  }

  let tab = expression.split(" ");
  for (let k = 0; k < tab.length; k++) {
    if (tab[k] == "*" || tab[k] == "/" || tab[k] == "%") {
      let a = parseInt(tab[k - 1]);
      let b = parseInt(tab[k + 1]);

      if (tab[k] == "*") tab[k] = a * b;
      if (tab[k] == "/") tab[k] = a / b;
      if (tab[k] == "%") tab[k] = a % b;
      tab.splice(k + 1, 1);
      tab.splice(k - 1, 1);
      k--;
    }
  }

  for (let k = 0; k < tab.length; k++) {
    if (tab[k] == "+" || tab[k] == "-") {
      let a = parseInt(tab[k - 1]);
      let b = parseInt(tab[k + 1]);

      if (tab[k] == "+") tab[k] = a + b;
      if (tab[k] == "-") tab[k] = a - b;
      tab.splice(k + 1, 1);
      tab.splice(k - 1, 1);
      k--;
    }
  }

  return "" + tab[0];
}

console.log(calc(exp));
