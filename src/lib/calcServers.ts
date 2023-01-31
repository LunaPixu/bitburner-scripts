import {NS} from "../../index";
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
