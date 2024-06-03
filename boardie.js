const boardElement = document.getElementById('board');
const player1TimeElement = document.getElementById('player1-time');
const player2TimeElement = document.getElementById('player2-time');
const historyListElement = document.getElementById('history-list');
const pauseButton = document.getElementById('pause-button');
const resumeButton = document.getElementById('resume-button');
const resetButton = document.getElementById('reset-button');

let board = [];
let currentPlayer = 1;
let player1Time = 300;
let player2Time = 300;
let timer;
let paused = false;
let selectedPiece = null;
let history = [];

const pieces = {
    'T': 'Titan',
    'A': 'Tank',
    'R': 'Ricochet',
    'S': 'Semi Ricochet',
    'C': 'Cannon'
};

function createBoard() {
    board = [];
    boardElement.innerHTML = ''; // Clear previous board if any
    for (let row = 0; row < 8; row++) {
        const rowArr = [];
        for (let col = 0; col < 8; col++) {
            rowArr.push(null);
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.id = `${row}-${col}`;
            cell.addEventListener('click', () => handleCellClick(row, col));
            boardElement.appendChild(cell);
        }
        board.push(rowArr);
    }
    initializePieces();
    startTimer();
}

function initializePieces() {
    // Initialize pieces for Player 1
    placePiece(0, 0, 'T1'); // Titan
    placePiece(0, 1, 'A1'); // Tank
    placePiece(0, 2, 'R1'); // Ricochet
    placePiece(0, 3, 'S1'); // Semi Ricochet
    placePiece(0, 4, 'C1'); // Cannon

    // Initialize pieces for Player 2
    placePiece(7, 7, 'T2'); // Titan
    placePiece(7, 6, 'A2'); // Tank
    placePiece(7, 5, 'R2'); // Ricochet
    placePiece(7, 4, 'S2'); // Semi Ricochet
    placePiece(7, 3, 'C2'); // Cannon
}

function placePiece(row, col, piece) {
    board[row][col] = piece;
    const cell = document.getElementById(`${row}-${col}`);
    cell.innerHTML = ''; // Clear any previous content
    cell.className = 'cell'; // Reset any previous classes
    cell.classList.add(getPieceClass(piece[0]));
    if (piece[0] !== 'R' && piece[0] !== 'S' && piece[0] !== 'C') {
        cell.innerText = piece[0];
    }
}

function getPieceClass(pieceType) {
    switch (pieceType) {
        case 'T':
            return 'titan';
        case 'A':
            return 'tank';
        case 'R':
            return 'ricochet';
        case 'S':
            return 'semi-ricochet';
        case 'C':
            return 'cannon';
        default:
            return '';
    }
}

function handleCellClick(row, col) {
    if (paused) return;
    const piece = board[row][col];
    if (piece && piece[1] == currentPlayer) {
        selectPiece(row, col);
    } else if (selectedPiece) {
        movePiece(row, col);
    }
}

function selectPiece(row, col) {
    if (selectedPiece) {
        const [prevRow, prevCol] = selectedPiece;
        document.getElementById(`${prevRow}-${prevCol}`).classList.remove('selected');
    }
    selectedPiece = [row, col];
    document.getElementById(`${row}-${col}`).classList.add('selected');
}

function movePiece(row, col) {
    const [prevRow, prevCol] = selectedPiece;
    const piece = board[prevRow][prevCol];
    board[prevRow][prevCol] = null;
    board[row][col] = piece;
    document.getElementById(`${prevRow}-${prevCol}`).innerText = '';
    document.getElementById(`${prevRow}-${prevCol}`).classList.remove(getPieceClass(piece[0]), 'selected');
    placePiece(row, col, piece);
    selectedPiece = null;
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updateHistory(piece, prevRow, prevCol, row, col);
}

function updateHistory(piece, fromRow, fromCol, toRow, toCol) {
    const move = `Player ${piece[1]}: ${pieces[piece[0]]} from (${fromRow}, ${fromCol}) to (${toRow}, ${toCol})`;
    history.push(move);
    const listItem = document.createElement('li');
    listItem.innerText = move;
    historyListElement.appendChild(listItem);
}

function startTimer() {
    timer = setInterval(() => {
        if (!paused) {
            if (currentPlayer === 1) {
                player1Time--;
                player1TimeElement.innerText = player1Time;
                if (player1Time === 0) endGame(2);
            } else {
                player2Time--;
                player2TimeElement.innerText = player2Time;
                if (player2Time === 0) endGame(1);
            }
        }
    }, 1000);
}

function endGame(winner) {
    clearInterval(timer);
    alert(`Player ${winner} wins!`);
}

pauseButton.addEventListener('click', () => {
    paused = true;
    pauseButton.classList.add('hidden');
    resumeButton.classList.remove('hidden');
});

resumeButton.addEventListener('click', () => {
    paused = false;
    resumeButton.classList.add('hidden');
    pauseButton.classList.remove('hidden');
});

resetButton.addEventListener('click', () => {
    clearInterval(timer);
    player1Time = 300;
    player2Time = 300;
    currentPlayer = 1;
    history = [];
    historyListElement.innerHTML = '';
    createBoard();
});

function saveHistory() {
    localStorage.setItem('gameHistory', JSON.stringify(history));
}

window.addEventListener('beforeunload', saveHistory);

createBoard();


