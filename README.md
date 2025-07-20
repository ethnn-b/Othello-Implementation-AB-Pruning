


# Othello Game

A classic Othello (Reversi) game implemented in JavaScript, playable in a web browser. This project features both a player vs. player mode and a player vs. AI mode, where the AI uses the Alpha-Beta Pruning algorithm for decision-making.

## Table of Contents

- [Othello Game](#othello-game)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [How to Play](#how-to-play)
    - [Player vs. Player](#player-vs-player)
    - [Player vs. AI](#player-vs-ai)
  - [Technical Details](#technical-details)
    - [Game Logic](#game-logic)
    - [AI Implementation](#ai-implementation)
  - [Setup and Installation](#setup-and-installation)


## Features

* **Player vs. Player Mode:** Play against another human player on the same board.
* **Player vs. AI Mode:** Challenge an AI opponent that uses the Alpha-Beta Pruning algorithm to make its moves.
* **Interactive Board:** A visual representation of the Othello board with piece placement and flipping animations (visual feedback for flips is implied by the redrawing of the board after a move).
* **Valid Move Highlighting (Implicit):** While not explicitly highlighted, illegal moves are prevented by the `isValidMove` function.
* **Game Over Detection & Score Display:** The game detects when no more valid moves are possible for either player and declares the winner or a tie, displaying the final score.
* **Restart Game:** Easily restart a new game at any time.

## How to Play

### Player vs. Player

1.  Open the `index.html` file in your web browser.
2.  Ensure the "Mode" dropdown is set to "Human".
3.  Black (player 1) starts the game.
4.  Click on an empty square where you can make a valid move. Valid moves are those that result in at least one opponent's piece being flipped.
5.  Pieces will flip, and the turn will pass to the other player.
6.  The game ends when neither player can make a valid move. The player with the most pieces on the board wins.

### Player vs. AI

1.  Open the `index.html` file in your web browser.
2.  Select "AI" from the "Mode" dropdown.
3.  Black (human player) starts the game.
4.  Make your move by clicking on a valid square.
5.  After your move, the AI will automatically make its move after a short delay.
6.  Continue playing until the game ends.

## Technical Details

### Game Logic

The core game logic is implemented in `othello.js`. Key functions include:

* `board`: A 2D array representing the 8x8 Othello board, where `0` is empty, `1` is a black piece, and `-1` is a white piece.
* `restartGame()`: Initializes the board to its starting configuration.
* `draw()`: Renders the current state of the board on the HTML canvas.
* `isValidMove(row, col, player)`: Checks if a move at a given `(row, col)` is valid for the `player`, ensuring it outflanks at least one opponent piece.
* `makeMove(row, col, player)`: Places a piece for the `player` at `(row, col)` and flips all outflanked opponent pieces.
* `getValidMoves(player)`: Returns an array of all possible valid moves for the given `player`.
* `countScore()`: Calculates the current number of black and white pieces on the board.

### AI Implementation

The AI opponent leverages the **Alpha-Beta Pruning** algorithm to choose its moves.

* `aiMove()`: Orchestrates the AI's turn, finding the best move using `alphabeta` and then executing it.
* `alphabeta(state, depth, alpha, beta, maximizing)`: This is the core of the AI. It recursively searches through possible game states to find the optimal move.
    * `state`: A deep copy of the current board being evaluated.
    * `depth`: The maximum depth the algorithm will search into the future game states. (Currently set to `3` in `aiMove` for the AI player).
    * `alpha`: The best (highest) score that the maximizing player can guarantee so far.
    * `beta`: The best (lowest) score that the minimizing player can guarantee so far.
    * `maximizing`: A boolean indicating whether the current turn is for the maximizing player (AI) or the minimizing player (human).
    * The algorithm prunes branches where `beta <= alpha`, significantly reducing the number of states to evaluate.
* `evaluate(state)`: A simple heuristic function that calculates the score of a given board `state` by summing the values of all pieces (1 for black, -1 for white).

## Setup and Installation

1.  **Clone the repository (if applicable):**
    ```bash
    git clone [repository_url]
    cd othello-game
    ```
    (Replace `[repository_url]` with the actual URL if this is hosted on GitHub or similar.)
2.  **Open `index.html`:** Simply open the `index.html` file in your preferred web browser (e.g., Chrome, Firefox, Edge). All necessary assets (JavaScript, CSS if any) are linked directly.

