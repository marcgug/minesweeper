// mine sweeper
var readline = require('readline-sync');

var boardContents = [];
var boardVisible = [];
const width = 9;
var command;
const numberOfBombs = 10;

function initializeBoards() {

  // each box can either be:
  // empty: _
  // bomb: b
  // number: one of: 1,2,3,4
  // rules: 
  // * numbered square must indicate the number of bombs that it touches (adjacent or diagonal)
  // * empty squares do not touch any bombs

  for (let i = 0; i < width; i++) {
    boardContents[i] = [];
    boardVisible[i] = [];
    for (let j = 0; j < width; j++) {
      boardContents[i][j] = '-';
      boardVisible[i][j] = 'x';
    }
  }

  for (let i = 0; i < numberOfBombs; i++) {
    // place the bomb anywhere that a bomb doesn't already exist

    // get random coords
    let x = Math.floor(Math.random() * width);
    let y = Math.floor(Math.random() * width);

    while (boardContents[x][y] === 'b') {
      // keep generating
      x = Math.floor(Math.random() * width);
      y = Math.floor(Math.random() * width);
    }
    boardContents[x][y] = 'b';

  }

  // now fill in spaces or number around bombs
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < width; j++) {
      // check how many bombs surround this space
      if (boardContents[i][j] !== 'b') {
        let surrounding = numberOfSurroundingBombs(i,j);
        if (surrounding > 0) boardContents[i][j] = surrounding;
        else boardContents[i][j] = '_';
      }
    }
  }

}

function numberOfSurroundingBombs(row, col) {
  // check every surrounding space - every space can have up to 8 neighbors
  var b = 0;

  // check previous row
  if (row - 1 in boardContents[0]) {
    let r = row - 1;
    // check previous col
    if (col - 1 in boardContents[r]) {
      if (boardContents[r][col - 1] === 'b') b++;
    }
    // check this col
    if (boardContents[r][col] === 'b') b++;
    // check next col
    if (col + 1 in boardContents[r]) {
      if (boardContents[r][col + 1] === 'b') b++;
    }
  }

  // check this row - previous col
  if (col - 1 in boardContents[row]) {
    if (boardContents[row][col - 1] === 'b') b++;
  }
  // check this row - next col
  if (col + 1 in boardContents[row]) {
    if (boardContents[row][col + 1] === 'b') b++;
  }

  // check next row
  if (row + 1 in boardContents[0]) {
    let r = row + 1;
    // check previous col
    if (col - 1 in boardContents[r]) {
      if (boardContents[r][col - 1] === 'b') b++;
    }
    // check this col
    if (boardContents[r][col] === 'b') b++;
    // check next col
    if (col + 1 in boardContents[r]) {
      if (boardContents[r][col + 1] === 'b') b++;
    }
  }

  return b;
}


function displayBoardContents() {
  for (let x = 0; x < boardContents.length; x++) {
    console.log(boardContents[x].join('|'));
  }
}

function displayBoardVisible() {
  for (let x = 0; x < boardVisible.length; x++) {
    console.log(boardVisible[x].join('|'));
  }
}

function printInstructions() {
  console.log('============');
  console.log('Commands: ');
  console.log('print: print board (visible)');
  console.log('contents: print board (contents)');
  console.log('p: play space at coordinates row,col (row 0 is top row, col 0 is first col) (eg: p 0,0)');
  console.log('q: quit');
  console.log('h: print intructions');
  console.log('============');
}

// validate input
// play coordinate
// return: true to endGame, false to continue playing
function play(command) {
  let coords;
  try {
    coords = command.split(' ')[1].split(',');
  } catch (err) {
    console.log(`Invalid input - must be in format "play x,y"`);
    return false;
  }

  if (coords.length !== 2) {
    console.log(`Invalid input - must be in format "play x,y"`);
    return false;
    // TODO: additional input checking - it is a positive number not greather than width
  } else {
    // now we know coords is [x,y]
    const row = coords[0];
    const col = coords[1];

    // first make sure it's not already been played
    const visibleAtCoord = boardVisible[row][col];

    console.log(`visibleAtCoord: ${visibleAtCoord}`);
    
    if (visibleAtCoord !== 'x') {
      console.log(`❌ You already played that coordinate`);
      return false;
    }

    // check what is on the boardContent at the space the user clicked:
    const contentsAtCoord = boardContents[row][col];
    if (contentsAtCoord === 'b') {
      console.log(`💥 You played a bomb, you lose.`)
      return true;
    } else if (contentsAtCoord === '_') {
      // clicked an empty space, update visibleBoard
      boardVisible[row][col] = contentsAtCoord;
      // todo: also reveal some surrounding square on the board (but not bombs)
      console.log(`👌 you played an empty space, this is the board: `);
      displayBoardVisible();

    } else {
      // it must be a number, update visibleBoard
      boardVisible[row][col] = contentsAtCoord;
      console.log(`👌 you revealed a number, this is the board: `);
      displayBoardVisible();

    }

    return false;
  }

}

initializeBoards();
printInstructions();

while (command != 'q') {
  command = readline.question(">> Enter your command: ");

  if (command === 'print') {
    displayBoardVisible();
  } else if (command === 'contents') {
    displayBoardContents();
  } else if (command.indexOf('p') > -1) {
    console.log(`command: ${command}`);
    let endGame = play(command);
    if (endGame) {
      break;
    }
  } else if (command === 'h') {
    printInstructions();
  }

}