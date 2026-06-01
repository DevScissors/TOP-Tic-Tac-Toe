function Gameboard() {
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

  const placeSelection = (row, column, player) => {
    if (board[row][column].getValue() !== " ") {
      console.log("Square has already been selected");
      return false;
    } else {
      board[row][column].playerChoice(player);
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

  return { getBoard, placeSelection, printBoard };
}

function Cell() {
  let value = " ";

  const playerChoice = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    playerChoice,
    getValue,
  };
}

function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two",
) {
  const board = Gameboard();

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

  const printWinningRound = () => {
    board.printBoard();
    console.log(
      `Congratulations, ${getActivePlayer().name} wins in the ${winningScenario()}!`,
    );
  };

  const winningScenario = () => {
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

  const playRound = (row, column) => {
    console.log(
      `${getActivePlayer().name}'s chooses to play ${getActivePlayer().token} into [${row}, ${column}]`,
    );

    const isValidMove = board.placeSelection(
      row,
      column,
      getActivePlayer().token,
    );

    if (!isValidMove) {
      return;
    } else {
      if (winningScenario()) {
        printWinningRound();
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
