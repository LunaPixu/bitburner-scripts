import { color } from "/lib/lunAPI.js";

export function autocomplete(data, args) {
	return [...data.servers];
}

/** @param {import("../.").NS} ns */
export async function main(ns) {
	var dest = ns.args[0];
	var numericalheader = ns.args[1];

	let errorStr = "€Rror.$3r/veRc4NnoTe<rOrb3_Error%f0un#d"
	let errorText = "";
	const errorLength = errorStr.length;
	let c;
	for (c = 0; c < errorLength; c++) {
		if ((c % 4) == 1) {
			errorText = errorText + color.orange + errorStr[c];
			continue;
		}
		errorText = errorText + color.red + errorStr[c];
	}
	errorText = color.red + "Error: " + errorText;

	if (!dest) {
		ns.tprint(`${color.red}Error: Destination not specified.`);
		ns.exit();
	}
	if (!ns.serverExists(dest)) {
		ns.tprint(`${color.red}Error: Destination is not valid.`);
		ns.exit();
	}
	var parent = dest;
	var route = [];
	var i;
	var fill = 1;

	ns.tprint(`${color.white}Route to this server is:`);

	while (parent != "home") {
		var servers = ns.scan(parent);
		parent = servers[0];
		if (!parent) {
			ns.tprint(color.lightgray + "- home");
			ns.tprint(errorText);
			ns.toast("You shouldn't have done that...", "error", 10000);
			ns.alert(`The server ${dest} does not exist. Do not pursue it.\nThe consequences are far too great.`)
			ns.exit();
		}
		route.unshift(parent);
	}
	for (i of route) {
		if (numericalheader) {
			ns.tprint(`${color.lightgray}[${fill}] ${i}`)
		} else {
			ns.tprint(color.lightgray + `-`.repeat(fill) + ` ${i}`)
		}
		fill++;
	}
	if (numericalheader) {
		ns.tprint(`${color.lightgray}[${fill}] ${dest}`)
	} else {
		ns.tprint(color.lightgray + `-`.repeat(fill) + ` ${dest}`)
	}
}