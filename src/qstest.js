import { quickSort } from "/lib/lunAPI.js"

/** @param {import("../.").NS} ns */
export async function main(ns) {
	let arr = [6, 2, 10, 33, 1, 5];
	let tierlist = quickSort(arr, 0, arr.length - 1);
	let i;

	for (i = 0; i < arr.length; i++) {
		ns.tprint(arr[i]);
	}
	ns.tprint("------")
	for (i = 0; i < tierlist.length; i++) {
		ns.tprint(tierlist[i]);
	}
}