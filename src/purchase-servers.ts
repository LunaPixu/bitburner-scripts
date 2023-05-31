import {NS} from "../index";
import { color, quickSortObj } from "/lib/lunLib.js";
import { getServObjArray } from "/lib/serverArray.js";
import printExit from "/lib/printExit.js";

/** @param {NS} ns */
export async function main(ns:NS) {
	let ram = ns.args[0];
	let hackscript = "hack2.js";
	let serverLimit = ns.getPurchasedServerLimit();
	let skipPrompt = ns.args[1];

	if (!ram) printExit(ns, `${color.red}Error: No RAM specified.`, true);

	
	if (ns.serverExists("pserv-" + (serverLimit - 1))) printExit(ns, `${color.orange}Alert: We already have servers. Please run the replace server script instead.`, true);
	
	if (typeof ram === "number") {
		if (ram > ns.getPurchasedServerMaxRam()) printExit(ns, `${color.red}Error: Specified RAM is too large to be purchased.`, true);
		if (!Number.isInteger(Math.log2(ram))) printExit(ns, `${color.red}Error: Invalid RAM entered.`, true);

		if (!skipPrompt) {
			let promptMsg = `Purchasing ${serverLimit} servers with ${ram}GB of RAM will cost \$${ns.formatNumber(ns.getPurchasedServerCost(ram) * serverLimit)}. Do you wish to proceed?`
			if (!await ns.prompt(promptMsg)) printExit(ns, color.white + "Purchase cancelled.", true);
		}
		
		let i = 0;
		var threads = Math.floor(ram / ns.getScriptRam(hackscript));
		let hitlist = calcOrderedServers();
		let target:string;

		while (i < serverLimit) {
			target = hitlist[i % hitlist.length];
			if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
				var hostname = ns.purchaseServer("pserv-" + i, ram);
				await ns.scp(hackscript, hostname);
				ns.exec(hackscript, hostname, threads, target);
				++i;
			}
			await ns.sleep(50);
		}
		ns.tprint(`${color.green}Purchased ${serverLimit} servers with ${ram}GB of RAM for $${ns.formatNumber(ns.getPurchasedServerCost(ram) * serverLimit)}`)
	} else {
		printExit(ns, `${color.red}Error: RAM must be entered as a number.`, true);
	}

	function calcOrderedServers() {
		let tierlist = getServObjArray(ns);
		quickSortObj(tierlist, "rate", 0, tierlist.length - 1);
		let out = [];
	
		let i;
		let j = 1;
		if (tierlist.length >= 5) {
			for (i = tierlist.length - 1; i > tierlist.length - 6; i--) { // Get our 5 targets
				out.push(tierlist[i].name);
				ns.print("Target " + j + ": " + tierlist[i].name);
				j++;
			}
		} else {
			for (i = tierlist.length - 1; i >= 0; i--) { // Get what targets we can
				out.push(tierlist[i].name);
				ns.print("Target " + j + ": " + tierlist[i].name);
				j++;
			}
		}
		return out;
	}
}