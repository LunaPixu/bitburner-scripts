/** @param {import("../../.").NS} ns */
export function calcPercent(server, ns) {
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

/** @param {NS} ns */
export function calcTime(server, ns) {
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

/** @param {NS} ns */
export function calcChance(server, ns) {
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

/** @param {NS} ns */
export function getIncomeArray(ns) {
	let listServers = [];
	let host;
	class Server {
		constructor(name, income, rate) {
			this.name = name;
			this.income = income;
			this.rate = rate;
		}
	}

	function rcalc(target) { // Define our recursive scan and income calc
		let children = ns.scan(target);
		let i;
		for (i = 1; i < children.length; i++) {
			if (children.length == 1) {
				break;
			} else {
				let focus = children[i];

				let income = Math.floor(ns.getServerMaxMoney(focus) * 0.75 * calcPercent(focus, ns) * calcChance(focus, ns));
				let monpersec = Math.floor(income / calcTime(focus, ns));
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

		let income = Math.floor(ns.getServerMaxMoney(focus) * 0.75 * calcPercent(focus, ns) * calcChance(focus, ns));
		let monpersec = Math.floor(income / calcTime(focus, ns));
		if (income > 0) {
			let server = new Server(focus, income, monpersec);
			listServers.push(server);
		}
		ns.print(focus + " - Income: $" + income);
		rcalc(focus);
	}
	return listServers;
}

/** @param {NS} ns */
export function getServerArray(ns) {
	let arr = [];

	function rscan(ns, target) {
		let children = ns.scan(target);
		let i;
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
	let i;
	for (i = 0; i < children.length; i++) {
		let focus = children[i];

		arr.push(focus);
		rscan(ns, focus);
	}
	return arr;
}
