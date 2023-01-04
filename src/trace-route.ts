import {NS} from "../index"
import { color } from "./lib/lunLib.js";

export function autocomplete(data:any, args:any) {
	return [...data.servers];
}

/** @param {NS} ns */
export async function main(ns:NS) {
	let dest:any = ns.args[0];
	let numericalheader:any = ns.args[1];
	
	if (!dest) {
		ns.tprint(`${color.red}Error: Destination not specified.`);
		ns.exit();
	}
	if (!ns.serverExists(dest)) {
		ns.tprint(`${color.red}Error: Destination is not valid.`);
		ns.exit();
	}
	
	let errorStr = "€Rror.$3r/veRc4NnoTe<rOrb3_Error%f0un#d"
	let errorText = "";
	const errorLength = errorStr.length;
	let c:number;
	for (c = 0; c < errorLength; c++) {
		errorText += ((c % 4) == 1) ? color.orange : color.red;
		errorText += errorStr[c];
	}
	errorText = color.red + "Error: " + errorText;
	
	ns.tprint(`${color.white}Route to this server is:`);
	
	let parent = dest;
	let route = [];
	while (parent != "home") {
		let servers = ns.scan(parent);
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
	
	let fill = 1;
	let i:number;
	for (i of route) {
		if (numericalheader) {
			ns.tprint(`${color.lightgray}[${fill}] ${i}`);
		} else {
			ns.tprint(color.lightgray + `-`.repeat(fill) + ` ${i}`);
		}
		fill++;
	}

	if (numericalheader) {
		ns.tprint(`${color.lightgray}[${fill}] ${dest}`)
	} else {
		ns.tprint(`${color.lightgray}${`-`.repeat(fill)} ${dest}`)
	}
}