import {NS} from "../index";
import {color} from "/lib/lunLib.js";
import printExit from "/lib/printExit.js";

/** @param {NS} ns */
export async function main(ns:NS) {
	let server = ns.args[0]; // Get server
	let hackscript = "hack2.js";

	if (!server) printExit(ns, `${color.red}Error: Target server not specified.`, true);

	if (typeof server === "string") {
		if (!ns.serverExists(server)) printExit(ns, `${color.red}Error: Target server does not exist.`, true);

		let scriptram = ns.getScriptRam(hackscript);
		let serverram = ns.getServerMaxRam(server);
		if (scriptram > serverram) printExit(ns, `${color.orange}Warning: Hack script cannot run on this server.`, true);

		// Calculate max number of threads the hack script can run on
		let threads = Math.floor(serverram / scriptram);
		let ports = ns.getServerNumPortsRequired(server);

		// If server hasn't been breached, try to breach
		if (!ns.hasRootAccess(server)) {
			if (ns.fileExists("SQLInject.exe", "home")) {
				ns.sqlinject(server);
			} else if (ports == 5) {
				printExit(ns, "We'll need SQLInject to breach this big boy...", true);
			}
			if (ns.fileExists("HTTPWorm.exe", "home")) {
				ns.httpworm(server);
			} else if (ports >= 4) {
				printExit(ns, "We need an HTTPWorm for this one...", true);
			}
			if (ns.fileExists("RelaySMTP.exe", "home")) {
				ns.relaysmtp(server);
			} else if (ports >= 3) {
				printExit(ns, "We should've gotten RelaySMTP, sir...", true);
			}
			if (ns.fileExists("FTPCrack.exe", "home")) {
				ns.ftpcrack(server);
			} else if (ports >= 2) {
				printExit(ns, "We can't breach this server without FTPCrack...", true);
			}
			if (ns.fileExists("BruteSSH.exe", "home")) {
				ns.brutessh(server);
			} else if (ports >= 1) {
				printExit(ns, "We can't breach this server without BruteSSH...", true);
			}
			ns.nuke(server);
			ns.tprint("Server breached for our hack script.");
		}

		if (ns.isRunning(hackscript, server)) { // If we're just updating a server
			ns.scriptKill(hackscript, server);
			ns.scp(hackscript, server);
			ns.exec(hackscript, server, threads);
			ns.tprint(`${color.green}Running updated hack script on ${server} with ${threads} threads.`);
		} else {
			ns.scp(hackscript, server);
			ns.exec(hackscript, server, threads);
			ns.tprint(`${color.green}Uploaded hack script to ${server}. Running script with ${threads} threads.`);
		}
	} else {
		printExit(ns, `${color.red}Error: Target server must be specified as a string!`, true);
	}
}