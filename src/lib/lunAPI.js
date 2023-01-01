/** @param {import("../../.").NS} ns */
export { color, style, random, quickSort, quickSortObj };

/**
 * Provides a list of ANSI escape codes to provide color for printing.  
 * To use them, concatenate your code of choice before the text you wish to format.
 *
 * Example: `color.red+"Warning: Bad stuff is happening!"` or `` `${color.green}Operation performed successfully!` ``
 * 
 * *Note: These formatting codes will override color codes and vice versa*
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
 * Provides a list of ANSI escape codes to provide formatting for printing.  
 * To use them, concatenate your code of choice before the text you wish to format.
 *
 * Example: `style.bold+"I must emphasise this text!"` or `` `${style.underline}This is a header` ``
 * 
 * *Note: These formatting codes will override color codes and vice versa*
 */
const style = {
	reset: "\u001b[0m",
	bold: "\u001b[1m",
	underline: "\u001b[4m"
};

/**
 * Returns an integer (inclusively) between the `min` and `mix` numbers
 * 
 * @param {number} [min=1] Minimum number to roll for. Defaults to 1 if absent
 * @param {number} max Maximum number to roll for.
 * @return {number} The random number.
 */
function random(min=1, max) {
	const num = Math.floor(Math.random() * (max - min + 1)) + min;
	return num;
}

function qsSwap(arr, i, j) { //Define a function to swap entries in an array
	let temp = arr[i];
	arr[i] = arr[j];
	arr[j] = temp;
}

function qsPartition(arr, low, high) { //Compare and swap

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
 * 
 * @param {array} arr The array to be sorted
 * @param {number} [low=0] The first index to sort from, usually the 0th.
 * @param {number} high The last index to sort with, ideally should be `arr.length - 1`.
 * @yields The sorted array `arr`
 */
function quickSort(arr, low, high) {
	if (low < high) { //If the algorithm has yet to terminate

		let pi = qsPartition(arr, low, high);

		quickSort(arr, low, pi - 1);
		quickSort(arr, pi + 1, high);
	}
}

function qsPartitionObj(arr, prop, low, high) { //Compare and swap for objects

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
 * 
 * @param {array} arr The array to be sorted
 * @param {string|number} prop The key to sort all objects by. Targetted property must be a number!
 * @param {number} [low=0] The first index to sort from, usually the 0th.
 * @param {number} high The last index to sort with, ideally should be `arr.length - 1`.
 * @yields The sorted array `arr`
 */
function quickSortObj(arr, prop, low=0, high) {
	if (low < high) {

		let pi = qsPartitionObj(arr, prop, low, high);

		quickSortObj(arr, prop, low, pi - 1);
		quickSortObj(arr, prop, pi + 1, high);
	}
}