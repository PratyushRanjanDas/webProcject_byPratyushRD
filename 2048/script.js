const gridDisplay = document.querySelector('.grid');
const scoreDisplay = document.getElementById('score');
const result = document.getElementById('result'); 
const width = 4;
let squares = [];
let score = 0;

// Create the playing board
function createBoard() {
    for (let i = 0; i < width * width; i++) {
        const square = document.createElement('div');
        gridDisplay.appendChild(square);
        square.innerHTML = 0;
        squares.push(square);
    }
    generate();
    generate();
}
createBoard();

function generate() {
    let emptySquares = squares.filter(square => square.innerHTML == 0);
    if (emptySquares.length > 0) {
        let randomIndex = Math.floor(Math.random() * emptySquares.length);
        emptySquares[randomIndex].innerHTML = 2;
    }
}

// Shift row to the right
function moveRight() {
    for (let i = 0; i < 16; i += 4) {
        let row = [
            parseInt(squares[i].innerHTML),
            parseInt(squares[i + 1].innerHTML),
            parseInt(squares[i + 2].innerHTML),
            parseInt(squares[i + 3].innerHTML)
        ];

        let filteredRow = row.filter(num => num !== 0);
        let missing = 4 - filteredRow.length;
        let zeros = Array(missing).fill(0);
        let newRow = zeros.concat(filteredRow);

        squares[i].innerHTML = newRow[0];
        squares[i + 1].innerHTML = newRow[1];
        squares[i + 2].innerHTML = newRow[2];
        squares[i + 3].innerHTML = newRow[3];
    }
}

// Shift row to the left
function moveLeft() {
    for (let i = 0; i < 16; i += 4) {
        let row = [
            parseInt(squares[i].innerHTML),
            parseInt(squares[i + 1].innerHTML),
            parseInt(squares[i + 2].innerHTML),
            parseInt(squares[i + 3].innerHTML)
        ];

        let filteredRow = row.filter(num => num !== 0);
        let missing = 4 - filteredRow.length;
        let zeros = Array(missing).fill(0);
        let newRow = filteredRow.concat(zeros);

        squares[i].innerHTML = newRow[0];
        squares[i + 1].innerHTML = newRow[1];
        squares[i + 2].innerHTML = newRow[2];
        squares[i + 3].innerHTML = newRow[3];
    }
}

// Shift column up
function moveUp() {
    for (let i = 0; i < 4; i++) {
        let column = [
            parseInt(squares[i].innerHTML),
            parseInt(squares[i + width].innerHTML),
            parseInt(squares[i + width * 2].innerHTML),
            parseInt(squares[i + width * 3].innerHTML)
        ];

        let filteredColumn = column.filter(num => num !== 0);
        let missing = 4 - filteredColumn.length;
        let zeros = Array(missing).fill(0);
        let newColumn = filteredColumn.concat(zeros);

        squares[i].innerHTML = newColumn[0];
        squares[i + width].innerHTML = newColumn[1];
        squares[i + width * 2].innerHTML = newColumn[2];
        squares[i + width * 3].innerHTML = newColumn[3];
    }
}

// Shift column down
function moveDown() {
    for (let i = 0; i < 4; i++) {
        let column = [
            parseInt(squares[i].innerHTML),
            parseInt(squares[i + width].innerHTML),
            parseInt(squares[i + width * 2].innerHTML),
            parseInt(squares[i + width * 3].innerHTML)
        ];

        let filteredColumn = column.filter(num => num !== 0);
        let missing = 4 - filteredColumn.length;
        let zeros = Array(missing).fill(0);
        let newColumn = zeros.concat(filteredColumn);

        squares[i].innerHTML = newColumn[0];
        squares[i + width].innerHTML = newColumn[1];
        squares[i + width * 2].innerHTML = newColumn[2];
        squares[i + width * 3].innerHTML = newColumn[3];
    }
}

// Combine row numbers
function combineRow() {
    for (let i = 0; i < 15; i++) {
        if ((i + 1) % 4 !== 0 && squares[i].innerHTML === squares[i + 1].innerHTML && squares[i].innerHTML != 0) {
            let combinedTotal = parseInt(squares[i].innerHTML) * 2;
            squares[i].innerHTML = combinedTotal;
            squares[i + 1].innerHTML = 0;
            score += combinedTotal;
            scoreDisplay.innerHTML = score;
        }
    }
}

// Combine column numbers
function combineColumn() {
    for (let i = 0; i < 12; i++) {
        if (squares[i].innerHTML === squares[i + width].innerHTML && squares[i].innerHTML != 0) {
            let combinedTotal = parseInt(squares[i].innerHTML) * 2;
            squares[i].innerHTML = combinedTotal;
            squares[i + width].innerHTML = 0;
            score += combinedTotal;
            scoreDisplay.innerHTML = score;
        }
    }
}

// Key controls
function control(e) {
    if (e.key === 'ArrowLeft') {
        keyLeft();
    } else if (e.key === 'ArrowRight') {
        keyRight();
    } else if (e.key === 'ArrowUp') {
        keyUp();
    } else if (e.key === 'ArrowDown') {
        keyDown();
    }
}
document.addEventListener('keydown', control);

function addColors() {
    squares.forEach(square => {
        let value = parseInt(square.innerHTML);
        square.style.backgroundColor = getTileColor(value);
        square.style.color = value > 4 ? '#ffffff' : '#776e65';
    });
}

function getTileColor(value) {
    switch (value) {
        case 2: return '#eee4da';
        case 4: return '#ede0c8';
        case 8: return '#f2b179';
        case 16: return '#f59563';
        case 32: return '#f67c5f';
        case 64: return '#f65e3b';
        case 128: return '#edcf72';
        case 256: return '#edcc61';
        case 512: return '#edc850';
        case 1024: return '#edc53f';
        case 2048: return '#edc22e';
        default: return '#cdc1b4';
    }
}

// Call this function after every move to update colors
function updateGame() {
    addColors();
    checkForWin();
    checkGameOver();
}

// Modify movement functions to include color updates
function keyLeft() {
    moveLeft();
    combineRow();
    moveLeft();
    generate();
    updateGame();
}

function keyRight() {
    moveRight();
    combineRow();
    moveRight();
    generate();
    updateGame();
}

function keyUp() {
    moveUp();
    combineColumn();
    moveUp();
    generate();
    updateGame();
}

function keyDown() {
    moveDown();
    combineColumn();
    moveDown();
    generate();
    updateGame();
}

// Initialize colors on board creation
addColors();


//check for the no 2048 to win 
function checkForWin() {
    for (let i = 0; i < squares.length; i++) {
        if (squares[i].innerHTML == 2048) {
            result.innerHTML = 'YOU WIN^_^'
            document.removeEventListener('keydown', control)
        }
    }
}

//if no 0 left 
function checkGameOver() {
    let zeroes = 0;
    for (let i = 0; i < squares.length; i++) {
        if (squares[i].innerHTML == 0) {
            zeroes++;
        }
    }
    if (zeroes === 0) {
        result.innerHTML = 'YOU LOSE>_<'
        document.removeEventListener('keydown' , control);
    }
}
