import {NS} from "../../index"
import {quickSortObj,randomInt} from "/lib/lunLib.js"

/** @param {NS} ns */
export async function main(ns:NS) {
    class Person {
        name:string;
        mon:number;
        constructor(name:string, mon:number) {
            this.name = name;
            this.mon = mon;
        }
    }
	let joe = new Person("Joe",randomInt(1, 100));
	let maria = new Person("Maria",randomInt(1, 100));
	let francis = new Person("Francis",randomInt(1, 100));
	let limmy = new Person("Limmy",randomInt(1, 100));
	let edmund = new Person("Edmund",randomInt(1, 100));
	let duke = new Person("Duke",randomInt(1, 100));
    
    let tierlist = [joe, maria, francis, edmund, limmy, duke];

	tierlist.map(obj => ns.tprint(`${obj.name} - ${obj.mon}`));
	quickSortObj(tierlist, "mon", 0, tierlist.length - 1);
	ns.tprint(`------------`)
	tierlist.map(obj => ns.tprint(`${obj.name} - ${obj.mon}`));
}