import {NS} from "../index";
/** @param {NS} ns */
export async function main(ns:NS) {
	let server:any;
	server = ns.args[0]; // Get server
	var hackscript = "hack-script.js";

	if (!server) { // Did a server get added?
		ns.tprint("Error: Server not defined.");
		ns.exit();
	}
	if (!ns.serverExists(server)) { // Is server valid?
		ns.tprint("Error: No such server exists.")
		ns.exit();
	}

	var scriptram = ns.getScriptRam(hackscript);
	var serverram = ns.getServerMaxRam(server);
	if (scriptram > serverram) {
		ns.tprint("Hack script cannot run on this server.")
		ns.exit();
	}

	// Calculate max number of threads the hack script can run on
	var threads = Math.floor(serverram / scriptram);
	var ports = ns.getServerNumPortsRequired(server);

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
		ns.tprint(`Running updated hack script on ${server} with ${threads} threads.`);
	} else {
		await ns.scp(hackscript, server);
		ns.exec(hackscript, server, threads);
		ns.tprint(`Uploaded hack script to ${server}. Running script with ${threads} threads.`);
	}
}