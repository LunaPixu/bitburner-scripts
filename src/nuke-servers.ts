import {NS} from "../index";
import { color } from "/lib/lunLib.js";
import printExit from "/lib/printExit.js"

/** @param {NS} ns */
export async function main(ns:NS) {
	if (!(await ns.prompt("Confirm deletion of servers?"))) printExit(ns, color.white + "Server deletion cancelled.", true);

	if (ns.serverExists("pserv-0-0")) {
		ns.killall("pserv-0-0");
		ns.deleteServer("pserv-0-0");
	}

	if (!ns.serverExists("pserv-0"))  printExit(ns, color.white + "Info: There's no server to nuke from orbit, sir.", true);

	for (let i = 0; i < ns.getPurchasedServerLimit(); i++) {
		if (ns.serverExists("pserv-" + i)) {
			ns.killall("pserv-" + i);
			ns.deleteServer("pserv-" + i);
		}
		await ns.sleep(50);
	}
	ns.tprint(color.green + "Bye-bye, servers...");
}