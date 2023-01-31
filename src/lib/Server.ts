import {NS} from "../../index";
import {calcChance, calcPercent, calcTime} from "/lib/calcServers";

export class Server {
	name:string;
  ns:NS;

	constructor(ns:NS, name:string) {
		this.name = name;
    this.ns = ns;
	}

  get income() {
    return Math.floor(this.ns.getServerMaxMoney(this.name) * 0.75 * calcPercent(this.ns, this.name) * calcChance(this.ns, this.name));
  }

  get rate() {
    return Math.floor(this.income / calcTime(this.ns, this.name));
  }

  get isRooted() {
    return this.ns.hasRootAccess(this.name);
  }
}
