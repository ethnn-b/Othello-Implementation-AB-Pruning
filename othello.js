const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const size = 8;
const tileSize = canvas.width / size;
let board = Array.from({ length: size }, () => Array(size).fill(0));
let currentPlayer = 1; // 1 = Black, -1 = White
let gameMode = document.getElementById("mode").value;

document.getElementById("mode").addEventListener("change", (e) => {
  gameMode = e.target.value;
  restartGame();
});

canvas.addEventListener("click", handleClick);
restartGame();

function restartGame() {
  board = Array.from({ length: size }, () => Array(size).fill(0));
  board[3][3] = 1;
  board[3][4] = -1;
  board[4][3] = -1;
  board[4][4] = 1;
  currentPlayer = 1;
  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      ctx.strokeStyle = "black";
      ctx.strokeRect(col * tileSize, row * tileSize, tileSize, tileSize);

      if (board[row][col] !== 0) {
        ctx.beginPath();
        ctx.arc(
          col * tileSize + tileSize / 2,
          row * tileSize + tileSize / 2,
          tileSize / 2.5,
          0, Math.PI * 2
        );
        ctx.fillStyle = board[row][col] === 1 ? "black" : "white";
        ctx.fill();
      }
    }
  }

  // Check for game over
  const hasBlack = getValidMoves(1).length > 0;
  const hasWhite = getValidMoves(-1).length > 0;

  if (!hasBlack && !hasWhite) {
    const result = countScore();
    let msg = "Game Over! ";
    if (result.black > result.white) msg += "Black wins!";
    else if (result.white > result.black) msg += "White wins!";
    else msg += "It's a tie!";
    document.getElementById("status").textContent = msg;
    canvas.removeEventListener("click", handleClick); // stop input
  }
}

function countScore() {
  let black = 0, white = 0;
  for (let row of board)
    for (let cell of row)
      if (cell === 1) black++;
      else if (cell === -1) white++;
  return { black, white };
}



function handleClick(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const row = Math.floor(y / tileSize);
  const col = Math.floor(x / tileSize);
  if (!isValidMove(row, col, currentPlayer)) return;

  makeMove(row, col, currentPlayer);
  currentPlayer *= -1;
  draw();

  if (gameMode === "ai" && currentPlayer === -1) {
    setTimeout(aiMove, 300);
  }
}

function aiMove() {
  const moves = getValidMoves(currentPlayer);
  if (moves.length === 0) {
    currentPlayer *= -1;
    return;
  }
  const best = alphabeta(board, 3, -Infinity, Infinity, true).move;
  if (best) {
    makeMove(best[0], best[1], currentPlayer);
    currentPlayer *= -1;
    draw();
  }
}

function getValidMoves(player) {
  const moves = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (isValidMove(r, c, player)) moves.push([r, c]);
    }
  }
  return moves;
}

function isValidMove(row, col, player) {
  if (board[row][col] !== 0) return false;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      let r = row + dr, c = col + dc, found = false;
      while (r >= 0 && r < 8 && c >= 0 && c < 8 && board[r][c] === -player) {
        r += dr; c += dc; found = true;
      }
      if (found && r >= 0 && r < 8 && c >= 0 && c < 8 && board[r][c] === player) return true;
    }
  }
  return false;
}

function makeMove(row, col, player) {
  board[row][col] = player;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      let r = row + dr, c = col + dc, flip = [];
      while (r >= 0 && r < 8 && c >= 0 && c < 8 && board[r][c] === -player) {
        flip.push([r, c]);
        r += dr; c += dc;
      }
      if (r >= 0 && r < 8 && c >= 0 && c < 8 && board[r][c] === player) {
        for (let [fr, fc] of flip) board[fr][fc] = player;
      }
    }
  }
}

function alphabeta(state, depth, alpha, beta, maximizing) {
  if (depth === 0) return { score: evaluate(state), move: null };
  const player = maximizing ? -1 : 1;
  const moves = getValidMoves(player);
  if (moves.length === 0) return { score: evaluate(state), move: null };
  let bestMove = null;

  for (let move of moves) {
    const [row, col] = move;
    const next = state.map(r => r.slice());
    makeMoveFor(next, row, col, player);
    const result = alphabeta(next, depth - 1, alpha, beta, !maximizing);
    if (maximizing) {
      if (result.score > alpha) {
        alpha = result.score;
        bestMove = move;
      }
    } else {
      if (result.score < beta) {
        beta = result.score;
        bestMove = move;
      }
    }
    if (beta <= alpha) break;
  }

  return { score: maximizing ? alpha : beta, move: bestMove };
}

function makeMoveFor(state, row, col, player) {
  state[row][col] = player;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      let r = row + dr, c = col + dc, flip = [];
      while (r >= 0 && r < 8 && c >= 0 && c < 8 && state[r][c] === -player) {
        flip.push([r, c]);
        r += dr; c += dc;
      }
      if (r >= 0 && r < 8 && c >= 0 && c < 8 && state[r][c] === player) {
        for (let [fr, fc] of flip) state[fr][fc] = player;
      }
    }
  }
}

function evaluate(state) {
  let score = 0;
  for (let row of state)
    for (let cell of row) score += cell;
  return score;
}