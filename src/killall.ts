import {NS} from "../index";
import { getServerArray } from "/lib/calcServers.js";
import { color } from "/lib/lunLib.js";

/** @param {NS} ns */
export async function main(ns:NS) {
	if (!(await ns.prompt("You are about to kill all scripts on every server. Are you sure?"))) {
		ns.tprint(color.aqua + "Cancelled.")
		ns.exit();
	}
	let servers = getServerArray(ns);
	servers.forEach(server => ns.killall(server));
	ns.tprint(color.yellow+"All scripts on all other servers killed.")
}