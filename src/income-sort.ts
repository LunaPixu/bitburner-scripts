import {NS} from "../index";
import { color, quickSortObj } from "/lib/lunLib.js";
import { getServObjArray } from "/lib/serverArray.js";

/** @param {NS} ns */
export async function main(ns:NS) {
	let listServers = getServObjArray(ns);

	quickSortObj(listServers, "rate", 0, listServers.length - 1);
	ns.tprint(color.white + "Displaying all servers in order of $/sec:");
	let i;
	for (i = 0; i < listServers.length; i++) {
		ns.tprint(color.lightgray + "[" + color.aqua + (i + 1) + color.lightgray + "] " + listServers[i].name +
			` - Average cash per second: ${color.green}$${ns.formatNumber(listServers[i].rate)}/sec${color.lightgray};` +
			` Average cash per single-threaded hack: ${color.green}$${ns.formatNumber(listServers[i].income)}`);
	}
}