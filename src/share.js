import { color } from "./lib/lunLib.js";

/** @param {import("../.").NS} ns */
export async function main(ns) {
	ns.tprint(color.white + "Sharing computional power with allied factions.");
	while (true) {
		await ns.share();
	}
}