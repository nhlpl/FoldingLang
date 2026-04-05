// FoldingLang Interpreter – runs in any browser
const PHI = (1 + Math.sqrt(5)) / 2;
const PHI2 = PHI * PHI;
const PHI3 = PHI2 * PHI;

function evaluate(program) {
  // Very simple lexer + parser – just for demo
  const lines = program.split('\n');
  let output = [];
  let vars = { phi: PHI, phi2: PHI2, phi3: PHI3 };

  function evalExpr(expr) {
    // replace phi, phi2, phi3 with numbers
    let s = expr.replace(/phi3/g, PHI3).replace(/phi2/g, PHI2).replace(/phi/g, PHI);
    // eval arithmetic safely
    try {
      return Function('"use strict"; return (' + s + ')')();
    } catch(e) { return NaN; }
  }

  for (let line of lines) {
    line = line.trim();
    if (line === '') continue;
    if (line.startsWith('let ')) {
      let [_, varName, rest] = line.match(/let\s+(\w+)\s*=\s*(.*)/);
      let val = evalExpr(rest);
      vars[varName] = val;
    } else if (line.startsWith('print(')) {
      let inner = line.slice(6, -1);
      let val = evalExpr(inner);
      output.push(val);
      console.log(val);
    } else if (line.startsWith('fold')) {
      // fold i from 0 to limit { ... }
      let match = line.match(/fold\s+(\w+)\s+from\s+(\d+)\s+to\s+(\d+)\s*\{/);
      if (match) {
        let varName = match[1];
        let start = parseInt(match[2]);
        let end = parseInt(match[3]);
        // step = phi - 1 (≈0.618) but we iterate integer steps? For simplicity, we do integer loop
        for (let i = start; i <= end; i++) {
          vars[varName] = i;
          // execute body (simplified – not parsing nested braces here)
        }
      }
    } else if (line.startsWith('spiral(')) {
      // spiral(n) returns a Fibonacci‑word array
      let n = parseInt(line.match(/spiral\((\d+)\)/)[1]);
      let arr = [];
      let a = '0', b = '01';
      for (let i = 0; i < n; i++) {
        if (i < a.length) arr.push(a[i]);
        else {
          let c = b + a;
          a = b;
          b = c;
        }
      }
      // store in last variable
      let lastVar = Object.keys(vars).pop();
      vars[lastVar] = arr;
    }
  }
  return output;
}

// Example FoldingLang program
const demo = `
let a = phi
let b = phi2
let sum = a + b
print(sum)
fold i from 0 to 5 {
  print(i * phi)
}
let arr = spiral(10)
print(arr)
`;

evaluate(demo);
