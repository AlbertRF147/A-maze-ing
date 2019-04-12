import style from "./main.scss";

class Cell {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.visited = false;
		this.visited_from = undefined;
	}

	set visited(visited) {
		this._visited = visited;
	}

	set visited_from(visited_from) {
		this._visited_from = visited_from;
	}

}

const cells = [];
const stack = [];
const visited = [];

const maze = document.getElementById("maze");

var create_cells = (number_cells) => {

	// Cell coordinates
	let x = 0;
	let y = 0;

	// Get number of columns/rows
	const columns = Math.sqrt(number_cells);
	const rows = columns;

	// Define size of maze based on number of cells
	maze.style.width = (40 * columns) + "px";
	maze.style.height = (40 * rows) + "px";

	// Create cells
	for (let i = 1; i <= number_cells; i++) {
		let cell = document.createElement("div");
		cell.classList.add("cell");

		// Set cell coordinates
		cell.setAttribute("x", x);
		cell.setAttribute("y", y);

		// Add new cell object to array
		cells.push(new Cell(x, y));

		// Move coordinates forward
		if (x < columns - 1) {
			x++;
		}
		else {
			x = 0;
			y++;
		}

		maze.appendChild(cell);
	}

}

create_cells(64);


let currentCell = cells[0];
currentCell.visited = true;
// Add first cell to the stack
stack.push(currentCell);
// Add first cell to visited stack
visited.push(currentCell);


while (stack.length > 0) {

	// Add current cell to the visited stack
	visited.push(currentCell);

	//Add paint current cell
	let DOMCell = document.querySelector('.cell[x="' + currentCell.x + '"][y="' + currentCell.y + '"]');
	DOMCell.style.background = "lightgreen";

	// Get cell neighbours
	let currentCellNeighbours = getCellNeighbours(currentCell);

	// There are non visited neighbours
	if (currentCellNeighbours.length > 0) {

		// Shuffle non visited neighbours randomly
		let shuffledNeighbours = shuffle(currentCellNeighbours);

		for (let i = 0; i < shuffledNeighbours.length; i++) {
			if (!shuffledNeighbours[i]._visited) {
				// Visited from
				let x = shuffledNeighbours[i].x - currentCell.x;
				let y = shuffledNeighbours[i].y - currentCell.y;

				currentCell = shuffledNeighbours[i];
				currentCell._visited = true;				

				// Add current cell to the stack
				stack.push(currentCell);
				break;
			}
		}

		document.querySelector('.cell[x="' + currentCell.x + '"][y="' + currentCell.y + '"]');
		DOMCell.style.background = "blue";

	}

	// No non visited neighbours are available
	else {
		stack.pop();
		currentCell = stack[stack.length - 1];
	}

	if(stack.length == 1) debugger;

}


function getCellNeighbours(currentCell) {
	/* Possible neighbours
	  N-> x=0, y=1
	  E-> x=1, y=0
	  S-> x=0, y=-1
	  W-> x=-1, y=0
	*/
	let neighbours = [];
	let directions = [
		[0, 1],
		[1, 0],
		[0, -1],
		[-1, 0]
	];

	for (let i = 0; i < directions.length; i++) {
		let neighbour = cells.find((e) => {
			return e.x == currentCell.x + directions[i][0] && e.y == currentCell.y + directions[i][1]
		});
		if (typeof (neighbour) !== 'undefined' && !neighbour._visited) neighbours.push(neighbour);
	}
	return neighbours;
}

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}