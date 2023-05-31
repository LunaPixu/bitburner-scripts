import {NS} from "../../index";
import {DynamicServer} from "/lib/DynamicServer.js";

/** 
 * Returns an array of Server objects with income and rate properties.
 * @param {import("../../.").NS} ns
 * @returns {Array} An array of Server objects.
*/
export function getServObjArray(ns:NS): DynamicServer[] {
	let listServers = [];
	let host;

	function rcalc(target:string) { // Define our recursive scan and income calc
		let children = ns.scan(target);
		let i:number;
		for (i = 1; i < children.length; i++) {
			if (children.length == 1) {
				break;
			} else {
				let focus = children[i];

				let server = new DynamicServer(ns, focus);
				if (server.income > 0) {
					listServers.push(server);
				}
				ns.print(focus + " - Income: $" + ns.formatNumber(server.income));
				rcalc(focus);
			}
		}
	}

	let children = ns.scan("home");
	if (ns.serverExists("darkweb")) { // Cut the first scan's results to omit darkweb (if present) and purchased servers
		children.length = 7;
	} else {
		children.length = 6;
	}
	for (host = 0; host < children.length; host++) {
		let focus = children[host];

		let server = new DynamicServer(ns, focus);
		if (server.income > 0) {
			listServers.push(server);
		}
		ns.print(focus + " - Income: $" + ns.formatNumber(server.income));
		rcalc(focus);
	}
	return listServers;
}

/**
 * Returns an array of the names of all reachable servers.
 * @param {import("../../.").NS} ns
 * @returns {array} An array of the names of all reachable servers.
*/
export function getServerArray(ns:NS): string[] {
	let arr = [];

	function rscan(ns:NS, target:string) {
		let children = ns.scan(target);
		let i:number;
		for (i = 1; i < children.length; i++) {
			if (children.length == 1) {
				break;
			} else {
				let focus = children[i];

				arr.push(focus);
				rscan(ns,focus);
			}
		}
	}

	let children = ns.scan("home");
	let i:number;
	for (i = 0; i < children.length; i++) {
		let focus = children[i];

		arr.push(focus);
		rscan(ns, focus);
	}
	return arr;
}