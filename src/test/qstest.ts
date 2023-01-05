import {NS} from "../../index"
import { quickSort } from "/lib/lunLib.js"

/** @param {NS} ns */
export async function main(ns:NS) {
	let arr = [6, 2, 10, 33, 1, 5];
	let tierlist = [...arr];
	
	ns.tprint(arr.join(", "))
	ns.tprint("------")
	quickSort(tierlist, 0, tierlist.length - 1);
		ns.tprint(tierlist.join(", "));
}