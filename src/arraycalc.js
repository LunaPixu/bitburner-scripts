import {quickSortObj,randomInt} from "./lib/lunLib.js"

/** @param {import("../.").NS} ns */
export async function main(ns) {
	let tierlist = [];
	let joe = new Object();
	let mario = new Object();
	let francis = new Object();
	let limmy = new Object();
	let edmund = new Object();
	let duke = new Object();

	joe.mon = randomInt(1, 100);
	joe.name = "Joe";
	mario.mon = randomInt(1, 100);
	mario.name = "Mario";
	francis.mon = randomInt(1, 100);
	francis.name = "Francis";
	limmy.mon = randomInt(1, 100);
	limmy.name = "Limmy";
	edmund.mon = randomInt(1, 100);
	edmund.name = "Edmund";
	duke.mon = randomInt(1, 100);
	duke.name = "Duke";
	tierlist.push(joe);
	tierlist.push(mario);
	tierlist.push(francis);
	tierlist.push(edmund);
	tierlist.push(limmy);
	tierlist.push(duke);

	for (let i = 0; i < tierlist.length; i++) {
		ns.tprintf(`${tierlist[i].name} - ${tierlist[i].mon}`);
	}

/**	function qsSwap(arr, i, j) {
		let temp = arr[i];
		arr[i] = arr[j];
		arr[j] = temp;
	}

	function qsPartition(arr, low, high) {

		let pivot = arr[high].mon;

		let i = (low - 1);

		for (let j = low; j <= high - 1; j++) {

			if (arr[j].mon < pivot) {

				i++;
				qsSwap(arr, i, j);
			}
		}
		qsSwap(arr, i + 1, high);
		return (i + 1);
	}

	function quickSort(arr, low, high) {
		if (low < high) {

			let pi = qsPartition(arr, low, high);

			quickSort(arr, low, pi - 1);
			quickSort(arr, pi + 1, high);
		}
	} **/
	quickSortObj(tierlist, "mon", 0, tierlist.length - 1);

	ns.tprintf(`------------`)
	for (let i = 0; i < tierlist.length; i++) {
		ns.tprintf(`${tierlist[i].name} - ${tierlist[i].mon}`);
	}
}