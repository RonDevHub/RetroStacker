// 1. Initialisierung
const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");
const nextCanvases = [
  document.getElementById("next0").getContext("2d"),
  document.getElementById("next1").getContext("2d"),
  document.getElementById("next2").getContext("2d"),
];

context.scale(20, 20);
nextCanvases.forEach((ctx) => ctx.scale(15, 15));

let paused = true;
let nextPieces = [];
let timers = {};
const repeatDelay = 180;
const repeatSpeed = 50;

// Theme-Initialisierung
const themes = ["theme-gameboy", "theme-neon", "theme-dark"];
let currentTheme = parseInt(localStorage.getItem("tetris_theme")) || 0;
// Theme sofort beim Start anwenden
document.body.classList.add(themes[currentTheme]);

// 2. Kernfunktionen
function createPiece(type) {
  if (type === "T")
    return [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ];
  if (type === "O")
    return [
      [1, 1],
      [1, 1],
    ];
  if (type === "L")
    return [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
    ];
  if (type === "J")
    return [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0],
    ];
  if (type === "I")
    return [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
    ];
  if (type === "S")
    return [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ];
  if (type === "Z")
    return [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ];
}

function draw() {
  const styles = getComputedStyle(document.body);
  const blockColor = styles.getPropertyValue("--block-color").trim();
  const gridColor = styles.getPropertyValue("--grid-color").trim();

  context.fillStyle = gridColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawMatrix(arena, { x: 0, y: 0 }, blockColor, context);
  drawMatrix(player.matrix, player.pos, blockColor, context);

  nextCanvases.forEach((ctx, i) => {
    ctx.fillStyle = gridColor;
    ctx.fillRect(0, 0, 4, 4);
    if (nextPieces[i]) {
      drawMatrix(nextPieces[i], { x: 0.5, y: 0.5 }, blockColor, ctx);
    }
  });
}

function drawMatrix(matrix, offset, color, ctx) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        ctx.fillStyle = color;
        ctx.fillRect(x + offset.x + 0.05, y + offset.y + 0.05, 0.9, 0.9);
      }
    });
  });
}

function playerReset() {
  const pieces = "ILJOTSZ";
  while (nextPieces.length < 4) {
    nextPieces.push(createPiece(pieces[(pieces.length * Math.random()) | 0]));
  }
  player.matrix = nextPieces.shift();
  player.pos.y = 0;
  player.pos.x =
    ((arena[0].length / 2) | 0) - ((player.matrix[0].length / 2) | 0);

  if (collide(arena, player)) {
    arena.forEach((row) => row.fill(0));
    player.score = 0;
    updateScore();
    togglePause(true);
  }
}

function playerDrop() {
  if (paused) return;
  player.pos.y++;
  if (collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    playerReset();
    arenaSweep();
  }
  dropCounter = 0;
}

function playerMove(dir) {
  if (paused) return;
  player.pos.x += dir;
  if (collide(arena, player)) player.pos.x -= dir;
  draw();
}

function playerRotate(dir) {
  if (paused) return;
  const matrix = player.matrix;
  for (let y = 0; y < matrix.length; ++y) {
    for (let x = 0; x < y; ++x)
      [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
  }
  if (dir > 0) matrix.forEach((row) => row.reverse());
  else matrix.reverse();
  if (collide(arena, player)) {
    if (dir > 0) matrix.forEach((row) => row.reverse());
    else matrix.reverse();
  }
  draw();
}

function collide(arena, player) {
  const [m, o] = [player.matrix, player.pos];
  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < m[y].length; ++x) {
      if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0)
        return true;
    }
  }
  return false;
}

function arenaSweep() {
  let rowCount = 1;
  outer: for (let y = arena.length - 1; y > 0; --y) {
    if (arena[y].every((value) => value !== 0)) {
      const row = arena.splice(y, 1)[0].fill(0);
      arena.unshift(row);
      ++y;
      player.score += rowCount * 10;
      rowCount *= 2;
    }
  }
  updateScore();
}

function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) arena[y + player.pos.y][x + player.pos.x] = value;
    });
  });
}

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  if (!paused) {
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) playerDrop();
    draw();
  }
  requestAnimationFrame(update);
}

function updateScore() {
  document.getElementById("score").innerText = player.score;
  document.getElementById("level").innerText = ((player.score / 100) | 0) + 1;
  dropInterval = Math.max(100, 1000 - ((player.score / 100) | 0) * 100);
  if (player.score > player.highscore) {
    player.highscore = player.score;
    localStorage.setItem("tetris_highscore", player.highscore);
    document.getElementById("highscore").innerText = player.highscore;
  }
}

function togglePause(p = null) {
  paused = p !== null ? p : !paused;
  document.getElementById("pause-overlay").style.display = paused
    ? "flex"
    : "none";
}

// 3. Steuerungs-Logik
function startAction(id, action) {
  if (paused) return;
  action();
  if (timers[id]) return;
  timers[id] = setTimeout(() => {
    timers[id] = setInterval(action, repeatSpeed);
  }, repeatDelay);
}

function stopAction(id) {
  clearTimeout(timers[id]);
  clearInterval(timers[id]);
  delete timers[id];
}

const arena = (function (w, h) {
  const matrix = [];
  while (h--) matrix.push(new Array(w).fill(0));
  return matrix;
})(12, 20);

const player = {
  pos: { x: 0, y: 0 },
  matrix: null,
  score: 0,
  highscore: parseInt(localStorage.getItem("tetris_highscore")) || 0,
};

// 4. Event Listener
document.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("contextmenu", (e) => e.preventDefault());
});

document.addEventListener("keydown", (e) => {
  if (e.repeat) return;
  if (e.keyCode === 80) togglePause();
  if (e.keyCode === 37) startAction("left", () => playerMove(-1));
  if (e.keyCode === 39) startAction("right", () => playerMove(1));
  if (e.keyCode === 40) startAction("down", () => playerDrop());
  if (e.keyCode === 38) playerRotate(1);
});

document.addEventListener("keyup", (e) => {
  if (e.keyCode === 37) stopAction("left");
  if (e.keyCode === 39) stopAction("right");
  if (e.keyCode === 40) stopAction("down");
});

const startBtn = document.getElementById("start-btn");
if (startBtn) {
  startBtn.addEventListener("click", () => togglePause(false));
}

const mobileMap = [
  { id: "btn-left", key: "left", act: () => playerMove(-1) },
  { id: "btn-right", key: "right", act: () => playerMove(1) },
  { id: "btn-down", key: "down", act: () => playerDrop() },
];

mobileMap.forEach((c) => {
  const el = document.getElementById(c.id);
  if (!el) return;
  el.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    startAction(c.key, c.act);
  });
  el.addEventListener("pointerup", (e) => {
    e.preventDefault();
    stopAction(c.key);
  });
  el.addEventListener("pointerleave", (e) => {
    e.preventDefault();
    stopAction(c.key);
  });
});

document.getElementById("btn-rotate").addEventListener("pointerdown", (e) => {
  e.preventDefault();
  playerRotate(1);
});

document
  .getElementById("pause-btn")
  .addEventListener("click", () => togglePause());

document.getElementById("theme-toggle").addEventListener("click", () => {
  document.body.classList.remove(themes[currentTheme]);
  currentTheme = (currentTheme + 1) % themes.length;
  document.body.classList.add(themes[currentTheme]);
  // Speichere das gewählte Theme
  localStorage.setItem("tetris_theme", currentTheme);
});

document.getElementById("reset-highscore").addEventListener("click", () => {
  if (confirm("Highscore wirklich zurücksetzen?")) {
    localStorage.removeItem("tetris_highscore");
    player.highscore = 0;
    updateScore();
  }
});

// 5. Spielstart
document.getElementById("highscore").innerText = player.highscore;
playerReset();
updateScore();
update();
