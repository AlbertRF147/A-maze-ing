import style from "./main.scss";

class Cell {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.visited = false;
	}

	set visited(visited) {
		this._visited = visited;
	}

}

const cells = [];

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

create_cells(625);

const main = new Promise((resolve, reject) => {

	const stack = [];
	let solution = [];
	let currentCell = cells[0];

	// Initialize maze
	currentCell.visited = true;
	stack.push(currentCell);

	while (stack.length > 0) {

		// Find current cell in DOM
		let DOMCurrentCell = document.querySelector('.cell[x="' + currentCell.x + '"][y="' + currentCell.y + '"]');

		// Maze entry
		if (currentCell.x == 0 && currentCell.y == 0) {
			DOMCurrentCell.classList.add('no-wall-west');
		}

		// Maze exit
		if (currentCell.x == cells[cells.length - 1].x && currentCell.y == cells[cells.length - 1].y) {
			DOMCurrentCell.classList.add('no-wall-east');
			// When exit cell is reached copy solution
			solution = [...stack];
		}

		// Get cell neighbours
		let currentCellNeighbours = getCellNeighbours(currentCell);


		if (currentCellNeighbours.length > 0) {
			// Shuffle non visited neighbours randomly
			let shuffledNeighbours = shuffle(currentCellNeighbours);

			for (let i = 0; i < shuffledNeighbours.length; i++) {
				// Get a random non visited neighbour
				if (!shuffledNeighbours[i]._visited) {
					let cellToVisit = shuffledNeighbours[i];
					let DOMCellToVisit = document.querySelector('.cell[x="' + cellToVisit.x + '"][y="' + cellToVisit.y + '"]');

					// Visited from
					let x = cellToVisit.x - currentCell.x;
					let y = cellToVisit.y - currentCell.y;

					// Make cell walls
					if (x !== 0) {
						// Either East or West
						if (x > 0) {
							DOMCurrentCell.classList.add('no-wall-east');
							DOMCellToVisit.classList.add('no-wall-west');
						} else {
							DOMCurrentCell.classList.add('no-wall-west');
							DOMCellToVisit.classList.add('no-wall-east');
						}
					} else if (y !== 0) {
						// Either North or South
						if (y > 0) {
							DOMCurrentCell.classList.add('no-wall-south');
							DOMCellToVisit.classList.add('no-wall-north')
						} else {
							DOMCurrentCell.classList.add('no-wall-north');
							DOMCellToVisit.classList.add('no-wall-south');
						}
					}

					currentCell = cellToVisit;
					currentCell._visited = true;

					// Add current cell to the stack
					stack.push(currentCell);
					break;
				}
			}

		}

		// No non visited neighbours are available
		// Start backtracking
		else {
			stack.pop();
			currentCell = stack[stack.length - 1];
		}

	}
	resolve(solution);
});

// Add solution class to the solution cells stack
main.then( (solution) => {
	solution.map((cell, index) => {
		let DOMSolutionCell = document.querySelector('.cell[x="' + cell.x + '"][y="' + cell.y + '"]');
		DOMSolutionCell.classList.add("solution");
	});
})


// Get neighbours around cell
function getCellNeighbours(currentCell) {
	let neighbours = [];
	let directions = [
		[0, 1], // N-> x=0, y=1
		[1, 0], // E-> x=1, y=0
		[0, -1], // S-> x=0, y=-1
		[-1, 0] // W-> x=-1, y=0
	];

	for (let i = 0; i < directions.length; i++) {
		// Find neighbours of current cell
		let neighbour = cells.find((e) => {
			return e.x == currentCell.x + directions[i][0] && e.y == currentCell.y + directions[i][1]
		});
		// Make sure the neighbours exist
		if (typeof (neighbour) !== 'undefined' && !neighbour._visited) neighbours.push(neighbour);
	}
	return neighbours;
}

// Credits to https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
function shuffle(a) {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}


// Control buttons
// Make new maze by refreshing page
const buttonNewMaze = document.getElementById('new')
	,buttonShowSolution = document.getElementById('solution')
	,buttonShowBackground = document.getElementById('background');

buttonNewMaze.onclick = () => {
	location.reload();
}

// Show/Hide solution
buttonShowSolution.onchange = (e) => {
	let cells = document.getElementsByClassName('solution');

	if (e.currentTarget.checked) {
		for (let i=0; i<cells.length; i++) {
			cells[i].classList.add('shown');
		}
	}

	else {
		for (let i=0; i<cells.length; i++) {
			cells[i].classList.remove('shown');
		}
	}
}

// Show/Hide background
buttonShowBackground.onclick = (e) => {
	e.currentTarget.checked ? document.getElementsByClassName('background')[0].style.display = 'none' : document.getElementsByClassName('background')[0].style.display = 'block';
}