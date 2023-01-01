import { getServerArray } from "/lib/CalcServers.js";
import { color } from "/lib/lunAPI.js";

/** @param {import("../.").NS} ns */
export async function main(ns) {
	if (!(await ns.prompt("You are about to kill all scripts on every server. Are you sure?"))) {
		ns.tprint(color.aqua + "Cancelled.")
		ns.exit();
	}
	let servers = getServerArray(ns);
	let i;
	for (i = 0; i < servers.length; i++) {
		ns.killall(servers[i]);
	}
	ns.tprint(color.yellow+"All scripts on all other servers killed.")
}