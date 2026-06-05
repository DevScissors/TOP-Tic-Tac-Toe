// ============================================
// CELL FACTORY
// ============================================
function Cell() {
  let value = " ";

  const setValue = (player) => {
    value = player;
  };

  const getValue = () => value;

  const isEmpty = () => value === " ";

  return {
    setValue,
    getValue,
    isEmpty,
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
      console.log("Square has already been selected");
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

  return { getBoard, isBoardFull, placeMarker, printBoard };
}

// ============================================
// GAME CONTROLLER FACTORY
// ============================================
function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two",
) {
  const board = GameBoard();

  const players = [
    {
      name: playerOneName,
      token: "X",
    },
    {
      name: playerTwoName,
      token: "O",
    },
  ];

  let activePlayer = players[0];
  let gameOver = false;

  // ---- STATE & GETTERS ----
  const getActivePlayer = () => activePlayer;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
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
  // const printNewRound = () => {
  //   board.printBoard();
  //   console.log(`${getActivePlayer().name}'s turn.`);
  // };

  const printWinningRound = () => {
    board.printBoard();
    console.log(
      `Congratulations, ${getActivePlayer().name} wins in the ${findWinningLine()}!`,
    );
  };

  const printTieGame = () => {
    board.printBoard();
    console.log("Nobody wins! It's a cats game (tie game)");
  };

  // ---- GAME ACTIONS ----
  const playRound = (row, column) => {
    if (gameOver) {
      return;
    }

    const currentPlayer = getActivePlayer();

    console.log(
      `${currentPlayer.name}'s chooses to play ${currentPlayer.token} into [${row}, ${column}]`,
    );

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
    printNewRound();

    // ---- INITIALIZATION ----
    printNewRound();
  };

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
  };
}

// ============================================
// GAME DISPLAY
// ============================================

function ScreenController() {
  const game = GameController();
  const gameBoardDiv = document.querySelector(".board");
  const playerNamesDiv = document.querySelector(".player-names");

  const updateBoard = () => {
    gameBoardDiv.textContent = "";

    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    playerNamesDiv.textContent = `${activePlayer.name}'s turn...`;

    board.forEach((row) => {
      row.forEach((column) => {
        const square = document.createElement("button");
        square.setAttribute("data-index", crypto.randomUUID());
        square.classList.add("cell");
        gameBoardDiv.appendChild(square);

        function clickHandlerBoard(e) {
          const selectedSquare = e.target.dataset.square;
          if (game.placeMarker(selectedSquare, activePlayer.token)) {
            return alert("Square is already selected!");
          }

          game.playRound(selectedSquare, activePlayer.token);
          updateBoard();
        }

        return clickHandlerBoard;
      });
    });
  };

  const clickHandler = updateBoard();

  gameBoardDiv.addEventListener("click", clickHandler);

  updateBoard();
}

ScreenController();
