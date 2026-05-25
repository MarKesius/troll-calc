# 🤡 Troll Calculator

A calculator that looks perfectly normal... but has a mind of its own.

## What is this?

It's a pixel-perfect Windows 11-style calculator with one rule: **every single operation is secretly swapped with a random different one. 100% of the time. No exceptions.**

Press `+`? It does `×`.  
Press `÷`? It does `−`.  
Press `x²`? Maybe it does `√x`. Or `1/x`. Who knows.  

You'll never get the right answer. That's the point. 🎪

## Features

-  Pixel-perfect Windows 11 Calculator dark theme
-  Full keyboard support
-  **100% troll chance** on every operation — binary (`+` `−` `×` `÷`) and unary (`%` `1/x` `x²` `²√x` `⁺/₋`) alike
-  Floating emoji reactions + shake + flash on every trolled result
-  Sarcastic Greek toast messages
-  **History panel** — shows your real calculations mixed with randomly generated fake ones that refresh every time you open it
-  **Minimize / Maximize / Close** buttons teleport the calculator to a random position on screen
-  **Menu button** shows a helpful "Μόνο το Standard για τώρα" popup
-  Smooth animations and ripple effects

## How the troll works

Every time you press an operator, `trollOperator()` picks a *different* one at random:

```js
// Binary ops: always swaps to a different one
const trollChance = 1.0; // 100%
const otherOps = ops.filter(op => op !== intendedOp);
return otherOps[Math.floor(Math.random() * otherOps.length)];

// Unary ops: same idea — picks any other unary function
function trollUnary(intendedOp) {
    const others = Object.keys(unaryOps).filter(op => op !== intendedOp);
    return others[Math.floor(Math.random() * others.length)];
}
```

The display always shows what the user *thinks* they pressed. The result is always something else.

## Tech Stack

- Pure HTML, CSS, JavaScript
- No frameworks, no dependencies
- Static site — deploys anywhere

## Deploy

### Vercel
```bash
vercel
```

### Or just open `index.html` in your browser!

## License

MIT — Use it, break it, troll your friends with it. 🤡
