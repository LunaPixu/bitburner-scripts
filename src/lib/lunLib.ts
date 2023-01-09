export { color, style, randomInt, quickSort, quickSortObj };

/**
 * Provides a list of ANSI escape codes (https://en.wikipedia.org/wiki/ANSI_escape_code#Colors) to provide color for printing.  
 * To use them, concatenate your code of choice before the text you wish to format.
 *
 * *Note: These formatting codes will override style codes and vice versa.*
 * @example color.red+"Warning: Bad stuff is happening!"
 * @example `${color.green}Operation performed successfully!`
 */
const color = {
	reset: "\u001b[0m",
	gray: "\u001b[30m",
	red: "\u001b[31m",
	green: "\u001b[32m",
	yellow: "\u001b[33m",
	blue: "\u001b[34m",
	magenta: "\u001b[35m",
	cyan: "\u001b[36m",
	white: "\u001b[37m",
	darkred: "\u001b[38;5;9m",
	darkgreen: "\u001b[38;5;10m",
	gold: "\u001b[38;5;11m",
	darkblue: "\u001b[38;5;12m",
	purple: "\u001b[38;5;13m",
	teal: "\u001b[38;5;14m",
	lightgray: "\u001b[38;5;15m",
	pink: "\u001b[38;5;218m",
	orange: "\u001b[38;5;202m",
	aqua: "\u001b[38;5;33m",
	lime: "\u001b[38;5;190m"
};

/**
 * Provides a list of ANSI escape codes (https://en.wikipedia.org/wiki/ANSI_escape_code#SGR_(Select_Graphic_Rendition)_parameters) to provide formatting for printing.  
 * To use them, concatenate your code of choice before the text you wish to format.
 *
 * *Note: These formatting codes will override color codes and vice versa*
 * @example style.bold+"I must emphasise this text!" 
 * @example `${style.underline}This is a header`
 */
const style = {
	reset: "\u001b[0m",
	bold: "\u001b[1m",
	underline: "\u001b[4m"
};

/**
 * Returns an integer (inclusively) between the `min` and `mix` numbers
 * 
 * @param {number} [min=1] Minimum number to roll for. Defaults to 1 if absent.
 * @param {number} max Maximum number to roll for.
 * @return {number} The random number.
 */
function randomInt(min:number=1, max:number):number {
	const num = Math.floor(Math.random() * (max - min + 1)) + min;
	return num;
}

function qsSwap(arr:any[], i:number, j:number) { //Define a function to swap entries in an array
	let temp = arr[i];
	arr[i] = arr[j];
	arr[j] = temp;
}

function qsPartition(arr:number[], low:number, high:number) { //Compare and swap

	let pivot = arr[high];

	let i = (low - 1);

	for (let j = low; j <= high - 1; j++) {

		if (arr[j] < pivot) { //If out of order, then swap

			i++;
			qsSwap(arr, i, j);
		}
	}
	qsSwap(arr, i + 1, high);
	return (i + 1);
}

/**
 * Sorts an array of numbers.  
 * *Code lifted from {@link https://www.geeksforgeeks.org/quick-sort/ GeeksforGeeks}. Edited to have low default to 0.*
 * 
 * @param {array} arr The array to be sorted
 * @param {number} [low=0] The first index to sort from, usually 0. Defaults to 0- if absent.
 * @param {number} high The last index to sort with; ideally should be `arr.length - 1`.
 * @yields The sorted array `arr`
 */
function quickSort(arr:number[], low:number=0, high:number) {
	if (low < high) { //If the algorithm has yet to terminate

		let pi = qsPartition(arr, low, high);

		quickSort(arr, low, pi - 1);
		quickSort(arr, pi + 1, high);
	}
}

function qsPartitionObj(arr:any[], prop:string|number, low:number, high:number) { //Compare and swap for objects

	let pivot = arr[high][prop];

	let i = (low - 1);

	for (let j = low; j <= high - 1; j++) {

		if (arr[j][prop] < pivot) {

			i++;
			qsSwap(arr, i, j);
		}
	}
	qsSwap(arr, i + 1, high);
	return (i + 1);
}
/**
 * Sorts an array of objects by a given property.  
 * *Underlying Quick Sort code from {@link https://www.geeksforgeeks.org/quick-sort/ GeeksforGeeks}.
 * Edited to have the partition function compare index properties (because the indices are objects) instead of the indices themselves.*
 * 
 * @param {array} arr The array to be sorted
 * @param {string|number} prop The key to sort all objects by. Targetted property must have a number value!
 * @param {number} [low=0] The first index to sort from, usually 0. Defaults to 0 if absent.
 * @param {number} high The last index to sort with; ideally should be `arr.length - 1`.
 * @yields The sorted array `arr`
 */
function quickSortObj(arr:any[], prop:string|number, low:number=0, high:number) {
	if (low < high) {

		let pi = qsPartitionObj(arr, prop, low, high);

		quickSortObj(arr, prop, low, pi - 1);
		quickSortObj(arr, prop, pi + 1, high);
	}
}