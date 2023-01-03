import { color } from "./lib/lunLib.js";

export function autocomplete(data, args) {
	return [...data.servers];
};

/** @param {import("../.").NS} ns */
export async function main(ns) {
	let server = ns.args[0];
	let ports = ns.getServerNumPortsRequired(server);

	if (!server) {
		ns.tprint(`${color.red}Error: Target not specified.`);
		ns.exit();
	}
	if (!ns.serverExists(server)) {
		ns.tprint(`${color.red}Error: Target is not valid.`);
		ns.exit();
	}
	if (server == "home") {
		ns.tprint(`${color.orange}Alert: This is your server... Please run this script on another server.`);
		ns.exit();
	}
	if (ns.hasRootAccess(server)) {
		ns.tprint(`${color.white}Info: You already have access to this server.`);
		ns.exit();
	}
	
	if (ns.fileExists("SQLInject.exe")) {
		ns.sqlinject(server);
	} else if (ports == 5) {
		ns.tprint(`${color.orange}Alert: ${server} requires injecting SQL. Please obtain the required .exe file.`);
		ns.exit();
	}
	if (ns.fileExists("HTTPWorm.exe")) {
		ns.httpworm(server);
	} else if (ports >= 4) {
		ns.tprint(`${color.orange}Alert: ${server} requires HTTP worm. Please obtain the required .exe file.`);
		ns.exit();
	}
	if (ns.fileExists("RelaySMTP.exe")) {
		ns.relaysmtp(server);
	} else if (ports >= 3) {
		ns.tprint(`${color.orange}Alert: ${server} requires SMTP relay. Please obtain the required .exe file.`);
		ns.exit();
	}
	if (ns.fileExists("FTPCrack.exe")) {
		ns.ftpcrack(server);
	} else if (ports >= 2) {
		ns.tprint(`${color.orange}Alert: ${server} requires FTP cracking. Please obtain the required .exe file.`);
		ns.exit();
	}
	if (ns.fileExists("BruteSSH.exe")) {
		ns.brutessh(server);
	} else if (ports >= 1) {
		ns.tprint(`${color.orange}Alert: ${server} requires brute forcing SSH. Please obtain the required .exe file.`);
		ns.exit();
	}
	ns.nuke(server);
	ns.tprint(color.green + server + " has been breached.");
}