import { color } from "/lib/lunAPI.js";

/** @param {import("../.").NS} ns */
export async function main(ns) {
	ns.tprint(color.white + "Sharing computional power with allied factions.");
	while (true) {
		await ns.share();
	}
}