import {NS} from "../index";
import {color} from "/lib/lunLib.js";
/** @param {NS} ns */
export async function main(ns:NS) {
	let server = ns.args[0]; // Get server
	let hackscript = "hack2.js";

	if (!server) { // Did a server get added?
		ns.tprint(`${color.red}Error: Target server not specified.`);
		ns.exit();
	}
	if (typeof server === "string") {
		if (!ns.serverExists(server)) { // Is server valid?
			ns.tprint(`${color.red}Error: Target server does not exist.`)
			ns.exit();
		}

		let scriptram = ns.getScriptRam(hackscript);
		let serverram = ns.getServerMaxRam(server);
		if (scriptram > serverram) {
			ns.tprint(`${color.orange}Warning: Hack script cannot run on this server.`)
			ns.exit();
		}

		// Calculate max number of threads the hack script can run on
		let threads = Math.floor(serverram / scriptram);
		let ports = ns.getServerNumPortsRequired(server);

		// If server hasn't been breached, try to breach
		if (!ns.hasRootAccess(server)) {
			if (ns.fileExists("SQLInject.exe", "home")) {
				ns.sqlinject(server);
			} else if (ports == 5) {
				ns.tprint("We'll need SQLInject to breach this big boy...")
				ns.exit();
			}
			if (ns.fileExists("HTTPWorm.exe", "home")) {
				ns.httpworm(server);
			} else if (ports >= 4) {
				ns.tprint("We need an HTTPWorm for this one...")
				ns.exit();
			}
			if (ns.fileExists("RelaySMTP.exe", "home")) {
				ns.relaysmtp(server);
			} else if (ports >= 3) {
				ns.tprint("We should've gotten RelaySMTP, sir...")
				ns.exit();
			}
			if (ns.fileExists("FTPCrack.exe", "home")) {
				ns.ftpcrack(server);
			} else if (ports >= 2) {
				ns.tprint("We can't breach this server without FTPCrack...")
				ns.exit();
			}
			if (ns.fileExists("BruteSSH.exe", "home")) {
				ns.brutessh(server);
			} else if (ports >= 1) {
				ns.tprint("We can't breach this server without BruteSSH...")
				ns.exit();
			}
			ns.nuke(server);
			ns.tprint("Server breached for our hack script.");
		}

		if (ns.isRunning(hackscript, server)) { // If we're just updating a server
			ns.scriptKill(hackscript, server);
			await ns.scp(hackscript, server);
			ns.exec(hackscript, server, threads);
			ns.tprint(`${color.green}Running updated hack script on ${server} with ${threads} threads.`);
		} else {
			await ns.scp(hackscript, server);
			ns.exec(hackscript, server, threads);
			ns.tprint(`${color.green}Uploaded hack script to ${server}. Running script with ${threads} threads.`);
		}
	} else {
		ns.tprint(`${color.red}Error: Target server must be specified as a string!`);
		ns.exit();
	}
}