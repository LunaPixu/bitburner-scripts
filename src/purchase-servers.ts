import {NS} from "../index";
import { color, quickSortObj } from "/lib/lunLib.js";
import { getIncomeArray } from "/lib/calcServers.js";

/** @param {NS} ns */
export async function main(ns:NS) {
	let ram:any;
	ram = ns.args[0];
	let hackscript = "hack2.js";
	let serverlimit = ns.getPurchasedServerLimit();
	let skipprompt = ns.args[1];

	if (!ram) {
		ns.tprint(`${color.red}Error: No RAM specified.`);
		ns.exit();
	} else if (ram > ns.getPurchasedServerMaxRam()) {
		ns.tprint(`${color.red}Error: Specified RAM is too large to be purchased.`);
		ns.exit();
	}

	if (!Number.isInteger(Math.log2(ram))) {
		ns.tprint(`${color.red}Error: Invalid RAM entered.`);
		ns.exit();
	}

	if (ns.serverExists("pserv-" + (serverlimit - 1))) {
		ns.tprint(`${color.orange}Alert: We already have servers. Please run the replace server script instead.`);
		ns.exit();
	}
	if (!skipprompt) {
		if (!await ns.prompt(`Purchasing ${serverlimit} servers with ${ram}GB of RAM will cost \$${ns.nFormat(ns.getPurchasedServerCost(ram) * serverlimit, "0,0")}. Do you wish to proceed?`)) {
			ns.tprint("Purchase cancelled.");
			ns.exit();
		}
	}

	let tierlist = getIncomeArray(ns);
	quickSortObj(tierlist, "rate", 0, tierlist.length - 1);
	let hitlist = [];
	let target;

	let i;
	let j = 1;
	if (tierlist.length >= 5) {
		for (i = tierlist.length - 1; i > tierlist.length - 6; i--) { // Get our 5 targets
			hitlist.push(tierlist[i].name);
			ns.print("Target " + j + ": " + tierlist[i].name);
			j++;
		}
	} else {
		for (i = tierlist.length - 1; i >= 0; i--) { // Get what targets we can
			hitlist.push(tierlist[i].name);
			ns.print("Target " + j + ": " + tierlist[i].name);
			j++;
		}
	}

	i = 0;
	var threads = Math.floor(ram / ns.getScriptRam(hackscript));

	while (i < serverlimit) {
		target = hitlist[i % hitlist.length];
		if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
			var hostname = ns.purchaseServer("pserv-" + i, ram);
			await ns.scp(hackscript, hostname);
			ns.exec(hackscript, hostname, threads, target);
			++i;
		}
		await ns.sleep(50);
	}
	ns.tprint(`${color.green}Purchased ${serverlimit} servers with ${ram}GB of RAM for ${ns.nFormat(ns.getPurchasedServerCost(ram) * serverlimit, "$0.000a")}`)
}