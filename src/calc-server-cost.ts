import {NS} from "../index";
import { color } from "./lib/lunLib.js";

/** @param {NS} ns */
export async function main(ns:NS) {
	let ram = ns.args[0];
	const ignorepurchase = ns.args[1];
	let referencedram = false;
	let serverlimit = ns.getPurchasedServerLimit();

	if (!ram) {
		if (ns.serverExists("pserv-0")) {
			ram = 2 * ns.getServerMaxRam("pserv-0");
			ns.tprint(color.yellow + "Alert: RAM not defined. Attempting to use pre-existing server as reference instead...");
			if (ram > ns.getPurchasedServerMaxRam()) {
				ns.tprint(color.orange + "Warning: Referenced RAM is already at maximum. Upgrading is impossible at this time.");
				ns.exit();
			}
			referencedram = true;
		} else {
			ns.tprint(color.red + "Error: RAM not defined. No pre-existing servers exist for a reference.");
			ns.exit();
		}
	}
	if (typeof ram === "number") {
		if (Number.isInteger(Math.log2(ram)) == false) {
			ns.tprint(color.red + "Error: Invalid RAM value entered.");
			ns.exit();
		}
		if (ram > ns.getPurchasedServerMaxRam()) {
			ns.tprint(`${color.red}Error: Specified RAM too large for calculations. Max RAM purchasable is ${ns.getPurchasedServerMaxRam()}GB`);
			ns.exit();
		}

		let tcost = serverlimit * ns.getPurchasedServerCost(ram);

		if (referencedram) {
			ns.tprint(`${color.white}The next server upgrade is at ${ram}GB. Replacing ${ns.getPurchasedServerLimit()} servers will cost: ${color.green}${ns.nFormat(tcost, "$0.000a")}`)
		} else {
			ns.tprint(`${color.white}Purchasing ${ns.getPurchasedServerLimit()} servers with ${ram}GB of RAM will cost: ${color.green}${ns.nFormat(tcost, "$0.000a")}`);
		}

		if (ns.getServerMoneyAvailable("home") > tcost) {
			await ns.sleep(3 * 1000);
			if (!ignorepurchase) {
				if (ns.serverExists("pserv-0") && (ram > ns.getServerMaxRam("pserv-0"))) { // Are we able to replace servers and should we?
					if (await ns.prompt(`You have enough money to replace ${ns.getPurchasedServerLimit()} servers for servers running ${ram}GB of RAM. Do you wish to replace them?`)) {
						ns.run("replace-servers.js", 1, ram, true);
					} else {
						ns.print(color.yellow + "Server replacement cancelled.");
						ns.exit();
					}
				} else if (!ns.serverExists("pserv-0")) { // Can we buy new servers? Should we?
					if (await ns.prompt(`You have enough money to purchase ${ns.getPurchasedServerLimit()} servers with ${ram}GB of RAM. Do you wish to purchase them?`)) {
						ns.run("purchase-servers.js", 1, ram, true);
					} else {
						ns.print(color.yellow + "Server purchase cancelled.")
						ns.exit();
					}
				}
			} else {
				ns.print(color.aqua + "Purchase attempt suppressed.");
			}
		} else if (ns.serverExists("pserv-0") && (ram > ns.getServerMaxRam("pserv-0"))) {
			ns.print(color.yellow + "Upgrade possible with specified RAM value but was too expensive.");
		}
	}
}