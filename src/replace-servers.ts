import {NS} from "../index";
import { color } from "/lib/lunLib.js";
import printExit from "/lib/printExit.js";

/** @param {NS} ns */
export async function main(ns:NS) {
	let ram = ns.args[0];
	var skipPrompt = ns.args[1];
	var serverLimit = ns.getPurchasedServerLimit();
	
	if (!ram) printExit(ns, `${color.red}Error: No RAM value specified.`, true);

	if (typeof ram === "number") {
		var fCost = `$${ns.formatNumber((ns.getPurchasedServerCost(ram) * serverLimit))}`;

		if (!Number.isInteger(Math.log2(ram))) printExit(ns, `${color.red}Error: Invalid RAM value specified.`, true);

		if (ram > ns.getPurchasedServerMaxRam()) printExit(ns, `${color.orange}Alert: Specified RAM is too large to be purchased.`, true);

		if (!ns.serverExists("pserv-0")) {
			if (!skipPrompt) {
				if (!await ns.prompt(`Purchasing ${serverLimit} servers with ${ram}GB will cost ${fCost}. Are you sure?`)) printExit(ns, "Purchase cancelled.", true);
			}
			ns.run("purchase-servers.js", 1, ram, true);
			ns.exit();
		}


		if (ram <= ns.getServerMaxRam("pserv-0")) {
			ns.tprint(`${color.white}Info: The RAM specified is not higher than what is currently being used.`);
			printExit(ns, `${color.white}Server array is currently running on ${ns.getServerMaxRam("pserv-0")}GB per server.`, true);
		}
		if (!skipPrompt) {
			if (!await ns.prompt(`Replacing ${serverLimit} servers for ${ram}GB will cost ${fCost}. Are you sure?`)) printExit(ns, "Purchase cancelled.", true);
		}

		for (let i = 0; i < serverLimit; i++) {
			ns.killall("pserv-" + i);
			ns.deleteServer("pserv-" + i);
			await ns.sleep(50);
		}

		ns.run("purchase-servers.js", 1, ram, true);
	} else {
		printExit(ns, `${color.red}Error: RAM must be entered as a number.`, true);
	}
}