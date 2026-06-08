// ============================================
// CELL FACTORY
// ============================================
function Cell() {
  let value = " ";

  const setValue = (player) => {
    value = player;
  };

  const getValue = () => value;

  const resetValue = () => value === " ";

  return {
    setValue,
    getValue,
    resetValue,
  };
}

// ===========================================
// WINNING LINE PATTERNS
// ===========================================
const WIN_PATTERNS = {
  "top row": [
    [0, 0],
    [0, 1],
    [0, 2],
  ],
  "middle row": [
    [1, 0],
    [1, 1],
    [1, 2],
  ],
  "bottom row": [
    [2, 0],
    [2, 1],
    [2, 2],
  ],
  "left column": [
    [0, 0],
    [1, 0],
    [2, 0],
  ],
  "middle column": [
    [0, 1],
    [1, 1],
    [2, 1],
  ],
  "right column": [
    [0, 2],
    [1, 2],
    [2, 2],
  ],
  "diagonal right": [
    [0, 0],
    [1, 1],
    [2, 2],
  ],
  "diagonal left": [
    [0, 2],
    [1, 1],
    [2, 0],
  ],
};

// ============================================
// GAMEBOARD FACTORY
// ============================================
function GameBoard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const placeMarker = (row, column, player) => {
    if (board[row][column].getValue() !== " ") {
      alert("Square has already been selected");
      return false;
    }
    board[row][column].setValue(player);
    return true;
  };

  const isBoardFull = () =>
    board.every((row) => row.every((cell) => cell.getValue() !== " "));

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue()),
    );
    console.log(boardWithCellValues);
    return boardWithCellValues;
  };

  const resetBoard = () => {
    board.forEach((row) => row.forEach((cell) => cell.resetValue()));
  };

  return { getBoard, isBoardFull, placeMarker, printBoard, resetBoard };
}

// ============================================
// GAME CONTROLLER FACTORY
// ============================================
function GameController() {
  const board = GameBoard();

  const playerNamesArr = [
    {
      name: "Player One",
      token: "X",
    },
    {
      name: "Player Two",
      token: "O",
    },
  ];

  const playerNames = (playerOneName, playerTwoName) => {
    if (playerOneName !== undefined || playerTwoName !== undefined) {
      playerNamesArr[0].name =
        playerOneName && playerOneName.trim() !== ""
          ? playerOneName.trim()
          : "Player One";
      playerNamesArr[1].name =
        playerTwoName && playerTwoName.trim() !== ""
          ? playerTwoName.trim()
          : "Player Two";
    }
    return playerNamesArr;
  };

  let activePlayer = playerNamesArr[0];

  let gameOver = false;

  // ---- STATE & GETTERS ----
  const getActivePlayer = () => activePlayer;

  const switchPlayerTurn = () => {
    activePlayer =
      activePlayer === playerNamesArr[0]
        ? playerNamesArr[1]
        : playerNamesArr[0];
  };

  // ---- WIN CONDITION CHECKS ----
  const findWinningLine = () => {
    for (const [key, array] of Object.entries(WIN_PATTERNS)) {
      if (
        array.every(
          ([row, col]) =>
            board.getBoard()[row][col].getValue() === getActivePlayer().token,
        )
      ) {
        return key;
      }
    }
    return null;
  };

  const tieGame = () => board.isBoardFull() && findWinningLine() === null;

  // ---- OUTPUT & DISPLAY ----
  const printWinningRound = () => {
    const winningText = document.querySelector(".players-turn");
    winningText.textContent = `Congratulations, ${getActivePlayer().name} wins in the ${findWinningLine()}!`;
  };

  const printTieGame = () => {
    const tieText = document.querySelector(".players-turn");
    tieText.textContent = "Nobody wins! It's a cats game (tie game)";
  };

  // ---- GAME ACTIONS ----
  const playRound = (row, column) => {
    if (gameOver) {
      return;
    }

    const currentPlayer = getActivePlayer();

    const isValidMove = board.placeMarker(row, column, currentPlayer.token);

    if (!isValidMove) {
      return;
    }

    if (findWinningLine()) {
      gameOver = true;
      printWinningRound();
      return;
    }

    if (tieGame()) {
      gameOver = true;
      printTieGame();
      return;
    }
    switchPlayerTurn();
  };

  const resetRound = () => {
    board.resetBoard();
    activePlayer = playerNamesArr[0];
  };

  return {
    findWinningLine,
    tieGame,
    playRound,
    playerNames,
    printTieGame,
    printWinningRound,
    tieGame,
    resetRound,
    getActivePlayer,
    getBoard: board.getBoard,
  };
}

// ============================================
// GAME DISPLAY
// ============================================

function ScreenController() {
  const game = GameController();
  const boardControl = GameBoard();
  const mainGameWrapper = document.querySelector(".main-game-wrapper");
  const gameBoardDiv = document.querySelector(".board");
  const playersTurnDiv = document.querySelector(".players-turn");
  const playerOneDiv = document.querySelector(".player-one");
  const playerTwoDiv = document.querySelector(".player-two");
  const playerOneInput = document.querySelector("#playerOneInput");
  const playerTwoInput = document.querySelector("#playerTwoInput");
  const startGameWrapper = document.querySelector(".start-game-wrapper");
  const startBtn = document.querySelector(".start-btn");
  const restartBtn = document.querySelector(".restart-btn");

  const startGame = () => {
    startGameWrapper.style.display = "none";
    mainGameWrapper.style.display = "flex";
    gameBoardDiv.style.display = "grid";
    playersTurnDiv.style.display = "block";

    game.playerNames(playerOneInput.value, playerTwoInput.value);
    playerOneDiv.innerText = playerOneInput.value;
    playerTwoDiv.innerText = playerTwoInput.value;
    updateBoard();

    return game;
  };

  const restartGame = () => {
    startGameWrapper.style.display = "flex";
    // mainGameWrapper.style.display = "none";
    game.resetRound();
    updateBoard();

    return game;
  };

  startBtn.addEventListener("click", () => startGame());
  restartBtn.addEventListener("click", () => restartGame());

  const updateBoard = () => {
    gameBoardDiv.textContent = "";

    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    if (!game.findWinningLine() && !game.tieGame()) {
      playersTurnDiv.textContent = `${activePlayer.name}'s turn...`;
    }

    restartBtn.style.display = "block";

    board.forEach((row, index) => {
      let boardRow = index;
      row.forEach((cell, index) => {
        let boardCol = index;
        let boardCell = `(${boardRow}, ${boardCol})`;
        const square = document.createElement("button");
        square.setAttribute("data-row", boardRow);
        square.setAttribute("data-column", boardCol);
        square.classList.add("cell");
        square.textContent = cell.getValue();
        gameBoardDiv.appendChild(square);
      });
    });

    function clickHandlerBoard(e) {
      const selectedRow = e.target.dataset.row;
      const selectedCol = e.target.dataset.column;

      game.playRound(selectedRow, selectedCol, activePlayer.token);
      updateBoard();
    }

    return clickHandlerBoard;
  };

  const clickHandler = updateBoard();

  gameBoardDiv.addEventListener("click", clickHandler);
}

ScreenController();
