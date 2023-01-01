import { color } from "/lib/lunAPI.js";

/** @param {import("../.").NS} ns */
export async function main(ns) {
	if (!(await ns.prompt("Confirm deletion of servers?"))) {
		ns.tprint(color.white + "Server deletion cancelled.");
		ns.exit();
	}
	if (ns.serverExists("pserv-0-0")) {
		ns.killall("pserv-0-0");
		ns.deleteServer("pserv-0-0");
	}
	if (!ns.serverExists("pserv-0")) {
		ns.tprint(color.white + "Info: There's no server to nuke from orbit, sir.");
		ns.exit();
	}
	var i;
	for (i = 0; i < ns.getPurchasedServerLimit(); i++) {
		if (ns.serverExists("pserv-" + i)) {
			ns.killall("pserv-" + i);
			ns.deleteServer("pserv-" + i);
		}
		await ns.sleep(50);
	}
	ns.tprint(color.green + "Bye-bye, servers...");
}