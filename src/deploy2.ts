import {NS} from "../index";
import { quickSortObj, color } from "./lib/lunLib.js";
import { getServObjArray, getServerArray } from "./lib/serverArray.js";

const f = [
	["verbose", false],
	["silent", false]
];
export function autocomplete(data:any, args:any[]) {
	return [data.flags(f)];
};

/** @param {NS} ns */
export async function main(ns:NS) {
	let servers = getServerArray(ns);
	let tierlist = getServObjArray(ns);
	let hitlist = [];
	let target;
	let input = ns.flags([
		["verbose", false],
		["silent", false]
	]);
	let verbose = input.verbose;
	let silent = input.silent;
	if (silent) {
		verbose = false;
	}
	const hackscript = "hack2.js";

	quickSortObj(tierlist, "rate", 0, tierlist.length - 1);

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

	j = 0;
	let host;
	let ports;
	let threads;
	for (i = 0; i < servers.length; i++) {
		target = hitlist[j % hitlist.length];
		host = servers[i];

		ns.print("Working on " + host);
		if (!ns.getServerMaxRam(host)) {
			ns.print(host + " has no RAM. Skipping...");
			continue;
		}
		if (ns.getServerMaxRam(host) < ns.getScriptRam(hackscript)) {
			ns.print(host + " cannot run script. Skipping...");
			continue;
		}
		ports = ns.getServerNumPortsRequired(host);
		threads = Math.floor(ns.getServerMaxRam(host) / ns.getScriptRam(hackscript));

		if (!ns.hasRootAccess(host)) {
			if (ns.fileExists("SQLInject.exe")) {
				ns.sqlinject(host);
			} else if (ports == 5) {
				ns.print(host + " requires injecting SQL. Skipping...");
				continue;
			}
			if (ns.fileExists("HTTPWorm.exe")) {
				ns.httpworm(host);
			} else if (ports >= 4) {
				ns.print(host + " requires HTTP worm. Skipping...");
				continue;
			}
			if (ns.fileExists("RelaySMTP.exe")) {
				ns.relaysmtp(host);
			} else if (ports >= 3) {
				ns.print(host + " requires SMTP relay. Skipping...");
				continue;
			}
			if (ns.fileExists("FTPCrack.exe")) {
				ns.ftpcrack(host);
			} else if (ports >= 2) {
				ns.print(host + " requires FTP cracking. Skipping...");
				continue;
			}
			if (ns.fileExists("BruteSSH.exe")) {
				ns.brutessh(host);
			} else if (ports >= 1) {
				ns.print(host + " requires brute forcing SSH. Skipping...");
				continue;
			}
			ns.nuke(host);
			ns.print(host + " has been breached.");
		}
		await ns.sleep(500);

		if (ns.scriptRunning(hackscript, host)) {
			ns.scriptKill(hackscript, host);
			await ns.scp(hackscript, host, "home");
			ns.exec(hackscript, host, threads, target);
			if (verbose) {
				ns.tprint(`Updated hack script on ${host}, running on ${threads} threads at ${target}.`)
			} else {
				ns.print(`Updated hack script on ${host}, running on ${threads} threads at ${target}.`);
			}
		} else {
			await ns.scp(hackscript, host, "home");
			ns.exec(hackscript, host, threads, target);
			if (verbose) {
				ns.tprint(`Running hack script on ${host} with ${threads} threads at ${target}.`)
			} else {
				ns.print(`Running hack script on ${host} with ${threads} threads at ${target}.`);
			}
		}
		j++;
	}
	if (!silent) {
		ns.tprint(`${color.green}Upload to servers complete!`);
	}
	ns.print(`${color.green}Upload to servers complete!`);
}