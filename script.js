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
  const player = (name, symbol, score) => {
    return { name, symbol, score };
  };

  const getPlayer = (name, symbol, score) => player(name, symbol, score);

  return { getPlayer };
})();

const Game = (() => {
  const gameBoard = GameBoard.getBoard();
  const player1 = Players.getPlayer("", "X", 0);
  const player2 = Players.getPlayer("", "O", 0);
  let turns = false;

  const setPlayers = (name1, name2) => {
    player1.name = name1;
    player2.name = name2;
  };

  const getCurrentPlayer = () => (turns ? player2 : player1);

  const playerTurn = (position) => {
    if (gameBoard[position] !== "") return;
    const current = getCurrentPlayer();
    GameBoard.setCell(position, current.symbol);
    turns = !turns;
    return console.log(checkGameState());
  };

  const resetTurns = () => {
    turns = false;
  };

  const wins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const checkWinner = () => {
    for (const combo of wins) {
      const [a, b, c] = combo;
      if (
        gameBoard[a] &&
        gameBoard[a] === gameBoard[b] &&
        gameBoard[a] === gameBoard[c]
      ) {
        const winner = gameBoard[a] === "X" ? player1 : player2;
        return { winner, combo };
      }
    }
    return null;
  };

  const checkGameState = () => {
    const result = checkWinner();

    if (result) {
      const { winner, combo } = result;
      DisplayController.drawWinLine(combo);
      winner.score++;
      setTimeout(() => {
        modalsDisplay.openWinnerModal(winner.name);
        turns = false;
        GameBoard.reset();
        DisplayController.updateTurnDisplay();
        DisplayController.clearWinLine();
        DisplayController.render();
      }, 700);
      return winner.name;
    }

    if (!gameBoard.includes("")) {
      modalsDisplay.openWinnerModal(null);
      GameBoard.reset();
      turns = false;
      DisplayController.updateTurnDisplay();
      DisplayController.clearWinLine();
      DisplayController.render();
      return;
    }

    return;
  };

  return {
    playerTurn,
    checkWinner,
    checkGameState,
    getCurrentPlayer,
    player1,
    player2,
    setPlayers,
    resetTurns,
  };
})();

const DisplayController = (() => {
  const cells = document.querySelectorAll(".cell");
  const title = document.querySelector("h1");
  const score = document.querySelector("h2");
  const boardElement = document.querySelector(".gameboard");

  const updateTurnDisplay = () => {
    const current = Game.getCurrentPlayer();
    title.textContent = `${current.name}${current.name[current.name.length - 1] === "s" ? `` : `'s` } turn`;
    score.textContent = `${Game.player1.name}: ${Game.player1.score} - ${Game.player2.name}: ${Game.player2.score}`;
  };

  updateTurnDisplay();

  const highlightWinningCells = (combo) => {
    combo.forEach(index => {
        cells[index].classList.add('win-cell');
    });
  };

  const drawWinLine = (combo) => {
    highlightWinningCells(combo);
    boardElement.classList.add("hide-line");
    const positions = {
      "0,1,2": { top: "100px", left: "0", width: "580px", rotate: "0deg" },
      "3,4,5": { top: "300px", left: "0", width: "580px", rotate: "0deg" },
      "6,7,8": { top: "500px", left: "0", width: "580px", rotate: "0deg" },

      "0,3,6": { top: "0", left: "100px", width: "580px", rotate: "90deg" },
      "1,4,7": { top: "0", left: "300px", width: "580px", rotate: "90deg" },
      "2,5,8": { top: "0", left: "500px", width: "580px", rotate: "90deg" },

      "0,4,8": { top: "0", left: "0", width: "820px", rotate: "45deg" },
      "2,4,6": { top: "600px", left: "0px", width: "820px", rotate: "-45deg" },
    };

    const key = combo.join(",");
    const pos = positions[key];

    boardElement.style.setProperty("--line-top", pos.top);
    boardElement.style.setProperty("--line-left", pos.left);
    boardElement.style.setProperty("--line-rotate", pos.rotate);

    requestAnimationFrame(() => {
      boardElement.classList.remove("hide-line");
      requestAnimationFrame(() => {
        boardElement.style.setProperty("--line-width", pos.width);
      });
    });
  };
  const clearWinLine = () => {
    boardElement.classList.add("hide-line");
    cells.forEach(cell => cell.classList.remove("win-cell"));
    boardElement.style.setProperty("--line-top", "0");
    boardElement.style.setProperty("--line-left", "0");
    boardElement.style.setProperty("--line-rotate", "0deg");
    boardElement.style.setProperty("--line-width", "0");
  };

  cells.forEach((cell, index) => {
    cell.addEventListener("click", () => {
      Game.playerTurn(index);
      render();
      updateTurnDisplay();
    });
  });

  const render = () => {
    const board = GameBoard.getBoard();
    cells.forEach((cell, index) => {
      cell.textContent = board[index];
    });
  };

  return { render, drawWinLine, clearWinLine, updateTurnDisplay };
})();

const modalsDisplay = (() => {
  const winnerModalDiv = document.getElementById("winnerModalDiv");
  const winnerModal = document.getElementById("winnerModal");

  const setWinnerModal = (winnerName) => {
    winnerModal.textContent = winnerName ? `${winnerName} won!` : "Tie!";
  };

  const openWinnerModal = (winnerName) => {
    winnerModalDiv.classList.add("active");
    setWinnerModal(winnerName);
    setTimeout(() => {
      winnerModalDiv.classList.remove("active");
    }, 500);
  };

  return { openWinnerModal };
})();

const playersModal = (() => {
  const modal = document.getElementById("playersModalDiv");
  const form = document.getElementById("playersForm");

  const open = () => modal.classList.add("active");
  const close = () => modal.classList.remove("active");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name1 = document.getElementById("player1").value || "Player1";
    const name2 = document.getElementById("player2").value || "Player2";

    Game.setPlayers(name1, name2);
    document.getElementById("player1").value = "";
    document.getElementById("player2").value = '';
    close();
    DisplayController.updateTurnDisplay();
  });

  return { open, close };
})();

const RestartGame = (() => {
  const restartBtn = document.querySelector(".restartBtn");
  restartBtn.addEventListener("click", () => {
    Game.resetTurns();
    GameBoard.reset();
    DisplayController.updateTurnDisplay();
    DisplayController.clearWinLine();
    DisplayController.render();
    Game.player1.score = 0;
    Game.player2.score = 0;
    playersModal.open();
  });
})();

window.addEventListener("DOMContentLoaded", () => {
  playersModal.open();
});
