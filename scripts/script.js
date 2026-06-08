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

  return { getBoard, isBoardFull, placeMarker, printBoard };
}

// ============================================
// GAME CONTROLLER FACTORY
// ============================================
function GameController() {
  const board = GameBoard();

  //   const playerNamesDiv = document.querySelector("player-names");
  //   const playerOneText = document.querySelector("#playerOne");
  //   const editPlayerOne = document.querySelector("player-one-edit");
  //   const playerTwoText = document.querySelector("#playerTwo");
  //   const editPlayerTwo = document.querySelector("player-two-edit");

  //   editPlayerOne.addEventListener("click", () => {
  //     const playerOneInput = document.createElement("input");
  //     playerOneInput.type = "text";
  //     playerOneInput.value = playerOneText.innerText;

  //     playerNamesDiv.replaceChild(playerOneInput, playerOneText);
  //     playerOneInput.focus();

  //     const saveContent = () => {
  //       playerOneText.innerText = playerOneInput.value;
  //       playerNamesDiv.replaceChild(playerOneText, playerOneInput);
  //     };

  //     playerOneInput.addEventListener("blur", saveContent);
  //     playerOneInput.addEventListener("keypress", (e) => {
  //       if (e.key === "Enter") {
  //         saveContent();
  //       }
  //     });
  //   });

  //   editPlayerTwo.addEventListener("click", () => {
  //     const playerTwoInput = document.createElement("input");
  //     playerTwoInput.type = "text";
  //     playerTwoInput.value = playerOneText.innerText;

  //     playerNamesDiv.replaceChild(playerTwoInput, playerOneText);
  //     playerTwoInput.focus();

  //     const saveContent = () => {
  //       playerOneText.innerText = playerInput.value;
  //       playerNamesDiv.replaceChild(playerOneText, playerTwoInput);
  //     };

  //     playerTwoInput.addEventListener("blur", saveContent);
  //     playerTwoInput.addEventListener("keypress", (e) => {
  //       if (e.key === "Enter") {
  //         saveContent();
  //       }
  //     });
  //   });
  // };

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

  // const playerNames = () =>

  const printWinningRound = () =>
    `Congratulations, ${getActivePlayer().name} wins in the ${findWinningLine()}!`;

  const printTieGame = () => "Nobody wins! It's a cats game (tie game)";

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
    // printNewRound();

    // ---- INITIALIZATION ----
    // printNewRound();
  };

  return {
    playRound,
    playerNames,
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
  const gameBoardDiv = document.querySelector(".board");
  const playersTurnDiv = document.querySelector(".players-turn");

  const updateBoard = () => {
    gameBoardDiv.textContent = "";

    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    playersTurnDiv.textContent = `${activePlayer.name}'s turn...`;

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

  // const editPlayerNames = () => {
  const playerOneText = document.querySelector("#playerOne");
  const editPlayerOne = document.querySelector(".player-one-edit");
  const playerTwoText = document.querySelector("#playerTwo");
  const editPlayerTwo = document.querySelector(".player-two-edit");

  editPlayerOne.addEventListener("click", () => {
    const playerOneInput = document.createElement("input");
    playerOneInput.type = "text";
    playerOneInput.value = playerOneText.innerText;

    playerOneText.replaceWith(playerOneInput);
    playerOneInput.focus();

    const saveContent = () => {
      playerOneInput.value !== ""
        ? (playerOneText.innerText = playerOneInput.value)
        : (playerOneText.innerText = "Player One");
      playerOneInput.replaceWith(playerOneText);
      game.playerNames(playerOneText.innerText, playerTwoText.innerText);
      updateBoard();
    };

    playerOneInput.addEventListener("blur", saveContent);
    playerOneInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        saveContent();
      }
    });
  });

  editPlayerTwo.addEventListener("click", () => {
    const playerTwoInput = document.createElement("input");
    playerTwoInput.type = "text";
    playerTwoInput.value = playerTwoText.innerText;

    playerTwoText.replaceWith(playerTwoInput);
    playerTwoInput.focus();

    const saveContent = () => {
      playerTwoInput.value !== ""
        ? (playerTwoText.innerText = playerTwoInput.value)
        : (playerTwoText.innerText = "Player Two");
      playerTwoInput.replaceWith(playerTwoText);
      game.playerNames(playerOneText.innerText, playerTwoText.innerText);
      updateBoard();
    };

    playerTwoInput.addEventListener("blur", saveContent);
    playerTwoInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        saveContent();
      }
    });
  });

  if (playerOneText.innerText.trim() === "") {
    playerOneText.innerText = "Player One";
  }

  if (playerTwoText.innerText.trim() === "") {
    playerTwoText.innerText = "Player Two";
  }

  game.playerNames(playerOneText.innerText, playerTwoText.innerText);
  updateBoard();
}

ScreenController();
