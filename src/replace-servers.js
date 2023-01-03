import { color } from "./lib/lunLib.js";

/** @param {import("../.").NS} ns */
export async function main(ns) {
	var i = 0;
	var ram = ns.args[0];
	var skipprompt = ns.args[1];
	var serverlimit = ns.getPurchasedServerLimit();
	var fcost = ns.nFormat((ns.getPurchasedServerCost(ram) * serverlimit), "$0.000a");

	if (!ram) {
		ns.tprint(`${color.red}Error: No RAM value specified.`);
		ns.exit();
	}

	if (!Number.isInteger(Math.log2(ram))) {
		ns.tprint(`${color.red}Error: Invalid RAM value specified.`);
		ns.exit();
	}

	if (ram > ns.getPurchasedServerMaxRam()) {
		ns.tprint(`${color.orange}Alert: Specified RAM is too large to be purchased.`)
		ns.exit();
	}
	if (!ns.serverExists("pserv-0")) {
		if (!skipprompt) {
			if (!await ns.prompt(`Purchasing ${serverlimit} servers with ${ram}GB will cost ${fcost}. Are you sure?`)) {
				ns.tprint("Purchase cancelled.");
				ns.exit();
			}
		}
		ns.run("purchase-servers.js", 1, ram, true);
		ns.exit();
	}


	if (ram <= ns.getServerMaxRam("pserv-0")) {
		ns.tprint(`${color.white}Info: The RAM specified is not higher than what is currently being used.`)
		ns.tprint(`${color.white}Server array is currently running on ${ns.getServerMaxRam("pserv-0")}GB per server.`)
		ns.exit();
	}
	if (!skipprompt) {
		if (!await ns.prompt(`Replacing ${serverlimit} servers for ${ram}GB will cost ${fcost}. Are you sure?`)) {
			ns.tprint("Purchase cancelled.");
			ns.exit();
		}
	}

	for (i = 0; i < serverlimit; i++) {
		ns.killall("pserv-" + i);
		ns.deleteServer("pserv-" + i);
		await ns.sleep(50);
	}

	ns.run("purchase-servers.js", 1, ram, true);
}