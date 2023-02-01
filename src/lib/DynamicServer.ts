import {NS} from "../../index";
import {calcChance, calcPercent, calcTime} from "/lib/calcServers";

/**
 * Create a server object similar to Bitburner's built-in Server class.  
 * This avoids the built-in class limitation where values are constant and never updated post-creation.
 * 
 * Unique getters and methods are added for calculations and data processing.
 * As a consequence of this, recklessly using this class might sharply increase script RAM usage. 
 */
export class DynamicServer {
	name:string;
  ns:NS;

	constructor(ns:NS, name:string) {
		this.name = name;
    this.ns = ns;
	}

  /**
   * The base amount of money one may receive from a single hack() on this server.
   */
  get income(): number {
    return Math.floor(this.ns.getServerMaxMoney(this.name) * 0.75 * calcPercent(this.ns, this.name) * calcChance(this.ns, this.name));
  }

  /**
   * A very rough rate of income from hacking this server. 
   */
  get rate(): number {
    return Math.floor(this.income / calcTime(this.ns, this.name));
  }

  /**
   * An alias for ns.hasRootAccess(this.name)
   */
  get isNuked(): boolean {
    return this.ns.hasRootAccess(this.name);
  }
}
