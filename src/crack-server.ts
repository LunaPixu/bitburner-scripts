import {NS} from "../index";
import { color } from "./lib/lunLib.js";

export function autocomplete(data:any, args:any) {
	return [...data.servers];
};

/** @param {import("../.").NS} ns */
export async function main(ns:NS) {
	let server = ns.args[0];
	
	if (!server) {
		ns.tprint(`${color.red}Error: Target not specified.`);
		ns.exit();
	}
	if (typeof server === "string") {
		if (!ns.serverExists(server)) {
			ns.tprint(`${color.red}Error: Target server is not a valid server.`);
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
		
		let ports = ns.getServerNumPortsRequired(server);
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
	} else {
		ns.tprint(`${color.red}Error: Server must be specified as a string!`);
		ns.exit();
	}
}