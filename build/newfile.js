const fs = require('node:fs');

let template = `import {NS} from "../index";

/** @param {NS} ns */
export async function main(ns:NS) {
  //Implement something
};`;

console.log("Attempting to create new .ts file");
fs.writeFile("src/new.ts", template, (err) => {
  if (err) {
    throw new Error(err);
  } else {
    console.log("Template new.ts file write successful!");
  }
});