import { Constants } from "./constants";

const fs = require("fs");
const path = require("path");
const readline = require("readline-sync");
const childProcess = require("child_process");

export class Creator {
	create() {
		process.stdout.write("welcome to luucy!\n\n");

		const name = readline.question("Module name (example: Heatwatt Calculator): ");
		const author = readline.question("Author / Company (example: Heatwatt AG): ");

		const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^\-+/, '').replace(/\-+$/, '') || 'plugin';

		console.log("creating project files...");
		fs.mkdirSync(name);

		fs.writeFileSync(path.join(name, "tsconfig.json"), `
{
	// settings managed by luucy
	// do not edit
	//
	"compilerOptions": {
		"outFile": "dist.lps",
		"target": "es2018",
		"noLib": true,
		"noEmitHelpers": true,
		"module": "AMD",
		"moduleResolution": "classic",
		"typeRoots": [ ".luucy" ]
	},
	"include": [
		"**/*.ts",
		"plugin.ts",
		".luucy/types.d.ts"
	]
}
`.trim());

		fs.writeFileSync(path.join(name, Constants.packageFile), JSON.stringify({
			name: id,
			displayName: name,
			icon: "icon.svg",
			author: author,
			version: "1.0.0"
		}, null, "\t"));

		fs.writeFileSync(path.join(name, "plugin.ts"), `
		
const section = ui.createProjectPanelSection();
section.add(new ui.Label(${JSON.stringify(`Hello World, ${name}!`)}));

		`.trim());

		fs.mkdirSync(path.join(name, Constants.assetsDirectory));
		fs.writeFileSync(path.join(name, Constants.iconFile), this.getIcon());

		console.log("installing luucy-types...");
		childProcess.spawnSync(/^win/.test(process.platform) ? "npm.cmd" : "npm", ["install", Constants.typesPackage], {
			cwd: name
		});

		console.log(`\ndone! open ${path.join(process.cwd(), name)} in your editor of choice and use 'luucy serve' to try out your plugin`);
	}

	getIcon() {
		return `

<?xml version="1.0" encoding="UTF-8"?>
<svg width="512px" height="512px" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
	<rect fill="#${Array(6).fill(0).map(() => (Math.ceil(Math.random() * 10) + 5).toString(16)).join("")}" x="0" y="0" width="512" height="512" rx="102.4"></rect>

	<polygon fill-opacity="0.60" fill="#000000" points="389 405.12766 201.908288 451 59 286.846438 246.091712 241"></polygon>
	<polygon fill-opacity="0.77" fill="#FFFFFF" points="245 242.053 315.041416 63 458 226.947 387.958584 406"></polygon>
	<polygon fill-opacity="0.60" fill="#C7C7C7" points="315 63 245.436466 241.406223 59 287 127.266236 106.831979"></polygon>
</svg>
		
		`.trim();
	}
}