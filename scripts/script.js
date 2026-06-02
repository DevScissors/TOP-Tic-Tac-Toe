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
    } else {
      board[row][column].setValue(player);
      return true;
    }
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue()),
    );
    console.log(boardWithCellValues);
    return boardWithCellValues;
  };

  return { getBoard, placeMarker, printBoard };
}

function Cell() {
  let value = " ";

  const setValue = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    setValue,
    getValue,
  };
}

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

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const findWinningLine = () => {
    const winCase = {
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

    // checks if the board value matches every cell coordinate (value)
    // from any winning line (key) in the winCase object
    for (const [key, array] of Object.entries(winCase)) {
      if (
        array.every(
          ([row, col]) =>
            board.getBoard()[row][col].getValue() === getActivePlayer().token,
        )
      ) {
        return key; // Returns "top row", "left column", etc.
      }
    }
    return null; // No winning scenario
  };

  const printWinningRound = () => {
    board.printBoard();
    console.log(
      `Congratulations, ${getActivePlayer().name} wins in the ${findWinningLine()}!`,
    );
  };

  const tieGame = () => {
    const isBoardFull = board
      .getBoard()
      .every((row) => row.every((cell) => cell.getValue() !== " "));

    return isBoardFull;
  };

  const printTieGame = () => {
    board.printBoard();
    console.log("Nobody wins! It's a cats game (tie game)");
  };

  const playRound = (row, column) => {
    console.log(
      `${getActivePlayer().name}'s chooses to play ${getActivePlayer().token} into [${row}, ${column}]`,
    );

    const isValidMove = board.placeMarker(row, column, getActivePlayer().token);

    if (!isValidMove) {
      return;
    } else {
      if (findWinningLine()) {
        printWinningRound();
      } else if (tieGame()) {
        printTieGame();
      } else {
        switchPlayerTurn();
        printNewRound();
      }
    }
  };

  // Initial play game message
  printNewRound();

  // For the console version, we will only use playRound, but we will need
  // getActivePlayer for the UI version, so I'm revealing it now
  return {
    playRound,
    getActivePlayer,
  };
}

const game = GameController();
