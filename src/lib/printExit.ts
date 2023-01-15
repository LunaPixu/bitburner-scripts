import {NS} from "../../index";

/** 
 * Kill script and print error message.
 * @param {NS} ns 
 * @param {string} message Error message to print
 * @param {boolean} terminal If true, print message to terminal.
*/
export default function(ns:NS, message:string, terminal:boolean=false):void {
  ns.print(message);
  if (terminal) ns.tprint(message);
  ns.exit();
}