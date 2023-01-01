import { color } from "/lib/lunAPI.js";

const f = [
	["layers", 5],
	["numericheader", false]
];
export function autocomplete(data, args) {
	return [data.flags(f)];
};

/** @param {import("../.").NS} ns */
export async function main(ns) {
	const input = ns.flags(f);
	
	let layers = input.layers; // How deep are we going?
	let host;
	let fill = 1;
	if (!layers) { // If we don't specify, go 5 deep.
		layers = 5;
	}
	if (!Number.isInteger(layers)) {
		ns.tprint(`${color.red}Error: Invalid input. Please specify an integer value.`);
		ns.exit();
	}
	var numericheader = input.numericheader;

	function rscan(target, z, fill) { // Algorithm to scan a target and recursively scan its results "z" more times
		let servers = ns.scan(target); // Scan and get results
		let i;
		for (i = 1; i < servers.length; i++) {
			/* For each scanned result (ignoring the parent server)...
			 If there's only the parent server, this automatically terminates. */
			if (servers.length == 1) {
				break;
			} else if (!z) { // If we're at the bottom (the countdown "z" has expired), print what we can and terminate
				if (numericheader) {
					ns.tprint(color.lightgray + "[" + color.aqua + `${fill}` + color.lightgray + `] ${servers[i]}`);
				} else {
					ns.tprint(color.lightgray + `-`.repeat(fill) + ` ${servers[i]}`);
				}
				break;
			} else { // Otherwise, print results and keep going.
				if (numericheader) {
					ns.tprint(color.lightgray + "[" + color.aqua + `${fill}` + color.lightgray + `] ${servers[i]}`);
				} else {
					ns.tprint(color.lightgray + `-`.repeat(fill) + ` ${servers[i]}`);
				}
				z--; // Countdown as we go deeper
				fill++; // Increase text padding/layer number to show depth
				rscan(servers[i], z, fill); // Go deeper
			}
		}
	}

	if (layers == 1) {
		ns.tprint(`${color.pink}Pointlessly scanning servers for 1 layer.`);
	} else {
		ns.tprint(`${color.white}Recursively scanning servers for a max of ${layers} layers.`);
	}

	let servers = ns.scan("home");
	if (ns.serverExists("darkweb")) { // Cut the first scan's results to omit purchased servers depending on if we have TOR access
		servers.length = 8;
	} else {
		servers.length = 7;
	}
	for (host = 0; host < servers.length; host++) {
		ns.print(servers[host]);
		if (numericheader) {
			ns.tprint(color.lightgray + "[" + color.aqua + `${fill}` + color.lightgray + `] ` + servers[host]);
		} else {
			ns.tprint(`${color.lightgray}- ` + servers[host]);
		}
		if (layers > 1) {
			rscan(servers[host], layers - 2, 2);
		}
	}
	if (layers == 1) {
		ns.tprint(`${color.pink}Next time, just type "scan"...`)
	}
}