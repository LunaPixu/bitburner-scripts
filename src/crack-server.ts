import {NS} from "../index";
import { color } from "/lib/lunLib.js";
import printExit from "/lib/printExit.js";

export function autocomplete(data:any, args:any) {
	return [...data.servers];
};

/** @param {import("../.").NS} ns */
export async function main(ns:NS) {
	let server = ns.args[0];
	
	if (!server) printExit(ns,`${color.red}Error: Target not specified.`,true);

	if (typeof server === "string") {
		if (!ns.serverExists(server))  printExit(ns,`${color.red}Error: Target server is not a valid server.`,true);

		if (server == "home") printExit(ns,`${color.orange}Alert: This is your server... Please run this script on another server.`,true);
		
		if (ns.hasRootAccess(server)) printExit(ns,`${color.white}Info: You already have access to this server.`,true);
		
		let ports = ns.getServerNumPortsRequired(server);
		if (ns.fileExists("SQLInject.exe")) {
			ns.sqlinject(server);
		} else if (ports == 5) {
			printExit(ns,`${color.orange}Alert: ${server} requires injecting SQL. Please obtain the required .exe file.`,true);
		}
		if (ns.fileExists("HTTPWorm.exe")) {
			ns.httpworm(server);
		} else if (ports >= 4) {
			printExit(ns,`${color.orange}Alert: ${server} requires HTTP worm. Please obtain the required .exe file.`,true);
		}
		if (ns.fileExists("RelaySMTP.exe")) {
			ns.relaysmtp(server);
		} else if (ports >= 3) {
			printExit(ns,`${color.orange}Alert: ${server} requires SMTP relay. Please obtain the required .exe file.`,true);
		}
		if (ns.fileExists("FTPCrack.exe")) {
			ns.ftpcrack(server);
		} else if (ports >= 2) {
			printExit(ns,`${color.orange}Alert: ${server} requires FTP cracking. Please obtain the required .exe file.`,true);
		}
		if (ns.fileExists("BruteSSH.exe")) {
			ns.brutessh(server);
		} else if (ports >= 1) {
			printExit(ns,`${color.orange}Alert: ${server} requires brute forcing SSH. Please obtain the required .exe file.`,true);
		}
		ns.nuke(server);
		ns.tprint(color.green + server + " has been breached.");
	} else {
		printExit(ns,`${color.red}Error: Server must be specified as a string!`,true);
	}
}