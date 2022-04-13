let startButton = document.getElementById("start");
let stopButton = document.getElementById("stop");
let randomButton = document.getElementById("random");
let gridContainer = document.getElementById("gridContainer");
let table = document.createElement("table");
let rows = 20,
  cols = 60;
let grid = new Array(rows),
  newGrid = new Array(rows);
let playing = false;
let timer;

function createTable() {
  for (let i = 0; i < rows; i++) {
    let row = document.createElement("tr");
    for (let j = 0; j < cols; j++) {
      let cell = document.createElement("td");
      cell.setAttribute("id", i + " " + j);
      cell.setAttribute("class", "dead");
      cell.onmousedown = cellClickHandler;
      row.appendChild(cell);
    }
    table.appendChild(row);
  }
  gridContainer.appendChild(table);
}

function initializeGrid() {
  for (let i = 0; i < rows; i++) {
    grid[i] = new Array(cols);
    newGrid[i] = new Array(cols);
  }
}

function copyAndResetGrid() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j] = newGrid[i][j];
      newGrid[i][j] = 0;
    }
  }
}

function resetGrids() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j] = 0;
      newGrid[i][j] = 0;
    }
  }
}

function setupControlButtons() {
  startButton.onclick = start;
  stopButton.onclick = stop;
  randomButton.onclick = random;
}

function initialize() {
  createTable();
  initializeGrid();
  resetGrids();
  setupControlButtons();
}

function cellClickHandler() {
  let rowcol = this.id.split(" "),
    row = rowcol[0],
    col = rowcol[1];

  let classes = this.getAttribute("class");
  if (classes.indexOf("live") !== -1) {
    this.setAttribute("class", "dead");
    grid[row][col] = 0;
  } else {
    this.setAttribute("class", "live");
    grid[row][col] = 1;
  }
}

function updateView() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let cell = document.getElementById(i + " " + j);
      if (grid[i][j] == 0) cell.setAttribute("class", "dead");
      else cell.setAttribute("class", "live");
    }
  }
}

function random() {
  if (playing) return;
  stop();
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let isLive = Math.round(Math.random());
      if (isLive == 1) {
        let cell = document.getElementById(i + " " + j);
        cell.setAttribute("class", "live");
        grid[i][j] = 1;
      }
    }
  }
}

// clear the grid
function stop() {
  playing = false;
  startButton.innerHTML = "Start";
  clearTimeout(timer);

  let cellsList = document.getElementsByClassName("live");
  let cells = [];
  for (let i = 0; i < cellsList.length; i++) cells.push(cellsList[i]);
  for (let i = 0; i < cells.length; i++) cells[i].setAttribute("class", "dead");
  resetGrids;
}

function start() {
  if (playing) {
    playing = false;
    this.innerHTML = "Continue";
    clearTimeout(timer);
  } else {
    playing = true;
    this.innerHTML = "Pause";
    play();
  }
}

function play() {
  computeNextGen();
  if (playing) timer = setTimeout(play, 100);
}

function computeNextGen() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      gameOfLife(i, j);
    }
  }
  copyAndResetGrid();
  updateView();
}

function gameOfLife(row, col) {
  let numNeighbors = countNeighbors(row, col);
  if (grid[row][col] == 1) {
    if (numNeighbors < 2) newGrid[row][col] = 0;
    else if (numNeighbors == 2 || numNeighbors == 3) newGrid[row][col] = 1;
    else if (numNeighbors > 3) newGrid[row][col] = 0;
  } else if (grid[row][col] == 0) {
    if (numNeighbors == 3) newGrid[row][col] = 1;
  }
}

function countNeighbors(row, col) {
  let count = 0;
  if (row - 1 >= 0) {
    if (grid[row - 1][col] == 1) count++;
  }
  if (row - 1 >= 0 && col - 1 >= 0) {
    if (grid[row - 1][col - 1] == 1) count++;
  }
  if (row - 1 >= 0 && col + 1 < cols) {
    if (grid[row - 1][col + 1] == 1) count++;
  }
  if (col - 1 >= 0) {
    if (grid[row][col - 1] == 1) count++;
  }
  if (col + 1 < cols) {
    if (grid[row][col + 1] == 1) count++;
  }
  if (row + 1 < rows) {
    if (grid[row + 1][col] == 1) count++;
  }
  if (row + 1 < rows && col - 1 >= 0) {
    if (grid[row + 1][col - 1] == 1) count++;
  }
  if (row + 1 < rows && col + 1 < cols) {
    if (grid[row + 1][col + 1] == 1) count++;
  }
  return count;
}

window.onload = initialize;

// Script for the popup
var popup = document.getElementById("popup");
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];
btn.onclick = function () {
  popup.style.display = "block";
};
span.onclick = function () {
  popup.style.display = "none";
};
window.onclick = function (event) {
  if (event.target == popup) popup.style.display = "none";
};
