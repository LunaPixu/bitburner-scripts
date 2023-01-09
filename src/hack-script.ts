import {NS} from "../index";
/** @param {NS} ns */
export async function main(ns:NS) {
	var target;
	var hackskill = ns.getHackingLevel();

	while (true) {
		if ((hackskill > ns.getServerRequiredHackingLevel("clarkinc")) && ns.hasRootAccess("clarkinc")) {
			target = "clarkinc";
		} else if ((hackskill > ns.getServerRequiredHackingLevel("the-hub")) && ns.hasRootAccess("the-hub")) {
			target = "the-hub";
		} else if ((hackskill > ns.getServerRequiredHackingLevel("omega-net")) && ns.hasRootAccess("omega-net")) {
			target = "omega-net";
		} else if ((hackskill > ns.getServerRequiredHackingLevel("zer0")) && ns.hasRootAccess("zer0")) {
			target = "zer0";
		} else {
			target = "foodnstuff";
			ns.nuke(target);
		}

		var moneyThresh = ns.getServerMaxMoney(target) * 0.75;
		var securityThresh = ns.getServerMinSecurityLevel(target) + 5;
		if (ns.getServerSecurityLevel(target) > securityThresh) {
			await ns.weaken(target);
		} else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
			await ns.grow(target);
		} else {
			await ns.hack(target);
		}
	}
}