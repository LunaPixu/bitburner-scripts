import {NS} from "../../index"
/** 
 * Returns the base percentage of a given server's money obtained from hacking, as a float.
 * @param {NS} ns 
 * @param {string} server The server you're evaluating.
 * @returns The base percentage of a server's money obtained from hacking, as a float.
*/
export function calcPercent(ns:NS, server:string):number {
	let player = ns.getPlayer();
	const balanceFactor = 240;

	const difficultyMult = (100 - (ns.getServerMinSecurityLevel(server) + 5)) / 100;
	const skillMult = (player.skills.hacking - (ns.getServerRequiredHackingLevel(server) - 1)) / player.skills.hacking;
	const percentMoneyHacked =
		(difficultyMult * skillMult * player.mults.hacking_money) / balanceFactor;
	if (percentMoneyHacked < 0) {
		return 0;
	}
	if (percentMoneyHacked > 1) {
		return 1;
	}

	return percentMoneyHacked;
}

/** 
 * Returns the base time to hack a given server, in seconds.
 * @param {import("../../.").NS} ns
 * @param {string} server The server you're evaluating.
 * @returns The base time to hack a given server, in seconds.
*/
export function calcTime(ns:NS, server:string):number {
	let player = ns.getPlayer();
	const difficultyMult = ns.getServerRequiredHackingLevel(server) * (ns.getServerMinSecurityLevel(server) + 5);
	const baseDiff = 500;
	const baseSkill = 50;
	const diffFactor = 2.5;
	let skillFactor = diffFactor * difficultyMult + baseDiff;
	skillFactor /= player.skills.hacking + baseSkill;
	const hackTimeMultiplier = 5;
	const hackingTime =
		(hackTimeMultiplier * skillFactor) /
		(player.mults.hacking_speed * (1 + (Math.pow(player.skills.intelligence, 0.8)) / 600));

	return hackingTime;
}

/**
 * Returns the base percent chance of successfully hacking a given server, as a float.
 * @param {import("../../.").NS} ns 
 * @param {string} server The server you're evaluating
 * @returns The base percent chance of successfully hacking a given server, as a float.
*/
export function calcChance(ns:NS, server:string):number {
	let player = ns.getPlayer();
	const hackFactor = 1.75;
	const difficultyMult = (100 - (ns.getServerMinSecurityLevel(server) + 5)) / 100;
	const skillMult = hackFactor * player.skills.hacking;
	const skillChance = (skillMult - ns.getServerRequiredHackingLevel(server)) / skillMult;
	const chance =
		skillChance *
		difficultyMult *
		player.mults.hacking_chance *
		(1 + (Math.pow(player.skills.intelligence, 0.8)) / 600);
	if (chance > 1) {
		return 1;
	}
	if (chance < 0) {
		return 0;
	}

	return chance;
}

/** 
 * Returns an array of server objects with income properties.
 * @param {import("../../.").NS} ns
 * @returns {array} An array of server objects with `name`, `income`, and `rate` properties. `name` is a string; the rest are numbers.
*/
export function getIncomeArray(ns:NS) {
	let listServers = [];
	let host;
	class Server {
		name:string;
		income:number;
		rate:number;

		constructor(name:string, income:number, rate:number) {
			this.name = name;
			this.income = income;
			this.rate = rate;
		}
	}

	function rcalc(target:string) { // Define our recursive scan and income calc
		let children = ns.scan(target);
		let i:number;
		for (i = 1; i < children.length; i++) {
			if (children.length == 1) {
				break;
			} else {
				let focus = children[i];

				let income = Math.floor(ns.getServerMaxMoney(focus) * 0.75 * calcPercent(ns, focus) * calcChance(ns, focus));
				let monpersec = Math.floor(income / calcTime(ns, focus));
				if (income > 0) {
					let server = new Server(focus, income, monpersec);
					listServers.push(server);
				}
				ns.print(focus + " - Income: $" + income);
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

		let income = Math.floor(ns.getServerMaxMoney(focus) * 0.75 * calcPercent(ns, focus) * calcChance(ns, focus));
		let monpersec = Math.floor(income / calcTime(ns, focus));
		if (income > 0) {
			let server = new Server(focus, income, monpersec);
			listServers.push(server);
		}
		ns.print(focus + " - Income: $" + income);
		rcalc(focus);
	}
	return listServers;
}

/**
 * Returns an array of the names of all reachable servers.
 * @param {import("../../.").NS} ns
 * @returns {array} An array of the names of all reachable servers.
*/
export function getServerArray(ns:NS) {
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
