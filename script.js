const GameBoard = (() => {
    const board = Array(9).fill("");

    const getBoard = () => board;

    const setCell = (index, value) => {
        if (board[index] === "") board[index] = value;
    };

    const reset = () => board.fill("");

    return { getBoard, setCell, reset };
})();

const Players = (() => {
    const player = (name, symbol) => {
        return { name, symbol }
    }

    const getPlayer = (name, symbol) => player(name, symbol)

    return { getPlayer }

})();

const Game = (() => {
    const gameBoard = GameBoard.getBoard();
    const player1 = Players.getPlayer("Player1", "X");
    const player2 = Players.getPlayer('Player2', 'O');
    let turns = false;

    const getCurrentPlayer = () => turns ? player2 : player1;

    const playerTurn = (position) => {
        if (gameBoard[position] !== "") return;
        turns = !turns;
        turns ? GameBoard.setCell(position, player1.symbol) : GameBoard.setCell(position, player2.symbol) 
        return console.log(checkGameState())
    }
    const wins = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

    const checkWinner = () => {
        for(const [a,b,c] of wins) {
            if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
                return gameBoard[a] === "X" ? player1 : player2;
            }
        }
            return null;
    }

    const checkGameState = () => {
        const winner = checkWinner();
        
        if (winner) {
            alert (`${winner.name} won!`)
            return winner.name;
        }

        if (!gameBoard.includes("")) {
            return "Draw!"
        }

        return;
    }

    return { playerTurn, checkWinner, checkGameState, getCurrentPlayer }
})();

const DisplayController = (() => {
    const cells = document.querySelectorAll('.cell');
    const title = document.querySelector('h1');
    const boardElement = document.querySelector('.board')

    
    const updateTurnDisplay = () => { const current = Game.getCurrentPlayer(); title.textContent = `Este rândul lui ${current.name}`; };

    updateTurnDisplay();

    const drawWinLine = (combo) => {
    const positions = {
        "0,1,2": { top: "50px", left: "0", width: "300px", rotate: "0deg" },
        "3,4,5": { top: "150px", left: "0", width: "300px", rotate: "0deg" },
        "6,7,8": { top: "250px", left: "0", width: "300px", rotate: "0deg" },

        "0,3,6": { top: "0", left: "50px", width: "300px", rotate: "90deg" },
        "1,4,7": { top: "0", left: "150px", width: "300px", rotate: "90deg" },
        "2,5,8": { top: "0", left: "250px", width: "300px", rotate: "90deg" },

        "0,4,8": { top: "0", left: "0", width: "420px", rotate: "45deg" },
        "2,4,6": { top: "0", left: "0", width: "420px", rotate: "-45deg" },
        };

    const key = combo.join(",");
    const pos = positions[key];

    boardElement.style.setProperty("--line-top", pos.top);
    boardElement.style.setProperty("--line-left", pos.left);
    boardElement.style.setProperty("--line-rotate", pos.rotate);

    requestAnimationFrame(() => {
        boardElement.style.setProperty("--line-width", pos.width);
        });
    };
    if (result?.winner) {
        drawWinLine(result.combo);
    }

    

    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => {
            Game.playerTurn(index);
            render();
            updateTurnDisplay();
        });
    });

    const render = () => {
        const board = GameBoard.getBoard()
        cells.forEach((cell, index) => {
            cell.textContent = board[index];
        })
    }

    return { render }
})();





