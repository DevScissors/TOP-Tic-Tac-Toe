// ============================================
// CELL FACTORY
// ============================================
function Cell() {
  let value = "";

  const setValue = (player) => {
    value = player;
  };

  const getValue = () => value;

  const resetValue = () => (value = "");

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
    const targetCell = board[row][column];
    if (targetCell.getValue() !== "") {
      return false;
    }
    targetCell.setValue(player);
    return true;
  };

  const isBoardFull = () =>
    board.every((row) => row.every((cell) => cell.getValue() !== ""));

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

  const getActivePlayer = () => activePlayer;

  const switchPlayerTurn = () => {
    activePlayer =
      activePlayer === playerNamesArr[0]
        ? playerNamesArr[1]
        : playerNamesArr[0];
  };

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

  const playRound = (row, column) => {
    if (gameOver) {
      return { status: "gameOver" };
    }

    const currentPlayer = getActivePlayer();
    const isValidMove = board.placeMarker(row, column, currentPlayer.token);

    if (!isValidMove) {
      return { status: "invalid" };
    }

    const winningLine = findWinningLine();
    if (winningLine) {
      gameOver = true;
      return { status: "win", winningLine };
    }

    if (tieGame()) {
      gameOver = true;
      return { status: "tie" };
    }

    switchPlayerTurn();
    return { status: "continue" };
  };

  const resetRound = () => {
    board.resetBoard();
    activePlayer = playerNamesArr[0];
    gameOver = false;
  };

  return {
    findWinningLine,
    tieGame,
    playRound,
    playerNames,
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

  const showStartScreen = () => {
    mainGameWrapper.style.display = "none";
    startGameWrapper.style.display = "flex";
    restartBtn.style.display = "none";
  };

  const showGameScreen = () => {
    startGameWrapper.style.display = "none";
    mainGameWrapper.style.display = "flex";
    gameBoardDiv.style.display = "grid";
    playersTurnDiv.style.display = "block";
  };

  const getPlayerLabel = (value, fallback) =>
    value && value.trim() !== "" ? value.trim() : fallback;

  const startGame = () => {
    showGameScreen();
    game.playerNames(playerOneInput.value, playerTwoInput.value);
    playerOneDiv.innerText = getPlayerLabel(playerOneInput.value, "Player One");
    playerTwoDiv.innerText = getPlayerLabel(playerTwoInput.value, "Player Two");
    updateBoard();
    return game;
  };

  const restartGame = () => {
    showStartScreen();
    game.resetRound();
    playerOneInput.value = "";
    playerTwoInput.value = "";
    playerOneDiv.innerText = "Player One";
    playerTwoDiv.innerText = "Player Two";
    updateBoard();
    return game;
  };

  const handleInvalidMove = () => {
    alert("Square has already been selected");
  };

  const updateBoard = () => {
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();
    const winningLine = game.findWinningLine();
    const isTie = game.tieGame();

    gameBoardDiv.textContent = "";
    gameBoardDiv.style.marginTop = "";
    restartBtn.style.display = "none";

    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const square = document.createElement("button");
        square.type = "button";
        square.setAttribute("data-row", rowIndex);
        square.setAttribute("data-column", columnIndex);
        square.classList.add("cell");
        square.textContent = cell.getValue();
        gameBoardDiv.appendChild(square);
      });
    });

    if (winningLine) {
      playersTurnDiv.textContent = `Congratulations, ${activePlayer.name} wins in the ${winningLine}!`;
      playersTurnDiv.style.marginTop = "-9px";
      restartBtn.style.display = "block";
      return;
    }

    if (isTie) {
      playersTurnDiv.textContent = "Nobody wins! It's a cats game (tie game)";
      playersTurnDiv.style.marginTop = "-9px";
      restartBtn.style.display = "block";
      return;
    }

    playersTurnDiv.textContent = `${activePlayer.name}'s turn...`;
  };

  const clickHandler = (e) => {
    const selectedRow = e.target.dataset.row;
    const selectedCol = e.target.dataset.column;

    if (selectedRow === undefined || selectedCol === undefined) {
      return;
    }

    const result = game.playRound(Number(selectedRow), Number(selectedCol));
    if (result.status === "invalid") {
      handleInvalidMove();
      return;
    }

    updateBoard();
  };

  startBtn.addEventListener("click", () => startGame());
  restartBtn.addEventListener("click", () => restartGame());
  gameBoardDiv.addEventListener("click", clickHandler);

  showStartScreen();
  updateBoard();
}

ScreenController();
