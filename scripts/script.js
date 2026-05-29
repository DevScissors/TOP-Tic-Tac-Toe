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
        if (board[row][column].getValue() !== 0) {
            console.log("Square has already been selected");
        } else {
            board[row][column].playerChoice(player);
        }
    };

    const printBoard = () => {
        const boardWithCellValues = board.map((row) =>
            row.map((cell) => cell.getValue())
        );
        console.log(boardWithCellValues);
    };

    return { getBoard, placeSelection, printBoard };
}

function Cell() {
    let value = 0;

    const playerChoice = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {
        playerChoice,
        getValue
    };
}

function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
    const board = Gameboard();

    const players = [
        {
            name: playerOneName,
            token: 'X',
        },
        {
            name: playerTwoName,
            token: 'O',
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

    const playRound = (row, column) => {
        console.log(
            `${getActivePlayer().name}'s chooses to play ${getActivePlayer().token} into [${row}, ${column}]`
        );
        board.placeSelection(row, column, getActivePlayer().token);

        /*  This is where we would check for a winner and handle that logic,
              such as a win message. */

        // Switch player turn if cell was empty when selected
        if (board.getBoard()[row][column].getValue() !== 0) {
            return;
        } else {
            switchPlayerTurn();
            printNewRound();
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
