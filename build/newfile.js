const fs = require('node:fs');
const process = require("node:process");

let args = process.argv.slice(2);
let template = `import {NS} from "../index";

/** @param {NS} ns */
export async function main(ns:NS) {
  //Implement something
};`;

let fileName = (typeof args[0] === "string") ? args[0] : "new";
console.log("Attempting to write .ts file");
let path = `src/${fileName}.ts`;

fs.writeFile(path, template, (err) => {
  if (err) {
    throw new Error(err);
  } else {
    console.log(`${fileName}.ts file write successful!`);
  }
});