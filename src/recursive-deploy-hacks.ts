import {NS} from "../index";
import {color} from "./lib/lunLib.js";

const f = [
	["verbose", false]
];
export function autocomplete(data:any, args:any) {
	return [data.flags(f)];
};

/** @param {NS} ns */
export async function main(ns:NS) {
	let input = ns.flags([
		["verbose", false]
	]);
	const hackscript = "hack-script.js";
	let verbose = input.verbose;

	async function rdeploy(host:string) {
		let servers = ns.scan(host);
		let i;
		let server;
		let ports;
		let threads;
		if (host == "home") {
			i = 0;
		} else {
			i = 1;
		}

		for (i; i < servers.length; i++) {
			if (servers.length === 1) {
				break;
			}
			server = servers[i];
			ns.print("Working on " + server);
			if (!ns.getServerMaxRam(server)) {
				ns.print(server + " has no RAM. Skipping...");
				await rdeploy(server);
				continue;
			}
			if (ns.getServerMaxRam(server) < ns.getScriptRam(hackscript)) {
				ns.print(server + " cannot run script. Skipping...");
				await rdeploy(server);
				continue;
			}
			ports = ns.getServerNumPortsRequired(server);
			threads = Math.floor(ns.getServerMaxRam(server) / ns.getScriptRam(hackscript));

			if (!ns.hasRootAccess(server)) {
				if (ns.fileExists("SQLInject.exe")) {
					ns.sqlinject(server);
				} else if (ports == 5) {
					ns.print(server + " requires injecting SQL. Skipping...");
					await rdeploy(server);
					continue;
				}
				if (ns.fileExists("HTTPWorm.exe")) {
					ns.httpworm(server);
				} else if (ports >= 4) {
					ns.print(server + " requires HTTP worm. Skipping...");
					await rdeploy(server);
					continue;
				}
				if (ns.fileExists("RelaySMTP.exe")) {
					ns.relaysmtp(server);
				} else if (ports >= 3) {
					ns.print(server + " requires SMTP relay. Skipping...");
					await rdeploy(server);
					continue;
				}
				if (ns.fileExists("FTPCrack.exe")) {
					ns.ftpcrack(server);
				} else if (ports >= 2) {
					ns.print(server + " requires FTP cracking. Skipping...");
					await rdeploy(server);
					continue;
				}
				if (ns.fileExists("BruteSSH.exe")) {
					ns.brutessh(server);
				} else if (ports >= 1) {
					ns.print(server + " requires brute forcing SSH. Skipping...");
					await rdeploy(server);
					continue;
				}
				ns.nuke(server);
				ns.print(server + " has been breached.");
			}
			await ns.sleep(500);

			if (ns.scriptRunning(hackscript, server)) {
				ns.scriptKill(hackscript, server);
				await ns.scp(hackscript, server, "home");
				ns.exec(hackscript, server, threads);
				if (verbose) {
					ns.tprint(`Updated hack script on ${server}, running on ${threads} threads.`)
				} else {
					ns.print(`Updated hack script on ${server}, running on ${threads} threads.`);
				}
			} else {
				await ns.scp(hackscript, server, "home");
				ns.exec(hackscript, server, threads);
				if (verbose) {
					ns.tprint(`Running hack script on ${server} with ${threads} threads.`)
				} else {
					ns.print(`Running hack script on ${server} with ${threads} threads.`);
				}
			}
			await rdeploy(server);
		}
	}
	await rdeploy("home");
	ns.tprint(`${color.green}Upload to servers complete!`);
}