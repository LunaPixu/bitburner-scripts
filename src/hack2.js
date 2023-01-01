/** @param {import("../.").NS} ns */
export async function main(ns) {
	let target = ns.args[0];

	if (!ns.serverExists(target)) {
		ns.print("Error: Server does not exist.");
		ns.exit();
	}
	while (true) {
		let moneyThresh = ns.getServerMaxMoney(target) * 0.75;
		let securityThresh = ns.getServerMinSecurityLevel(target) + 5;
		if (ns.getServerSecurityLevel(target) > securityThresh) {
			await ns.weaken(target);
		} else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
			await ns.grow(target);
		} else {
			await ns.hack(target);
		}
	}
}