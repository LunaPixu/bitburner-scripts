import {NS} from "../index";
import {color} from "./lib/lunLib.js";

/** @param {NS} ns */
export async function main(ns:NS) {
	ns.tprint(color.white + "Sharing computional power with allied factions.");
	while (true) {
		await ns.share();
	}
}