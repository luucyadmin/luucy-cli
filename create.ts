import { Constants } from "./constants";

const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");
const readline = require("readline-sync");

export class Creator {
    create() {
        const id = Array(64).fill(0).map(() => Math.random().toString(16)[4]).join("");

        const name = readline.question("Module name (example: Heatwatt Calculator): ");
        const author = readline.question("Author / Company (example: Heatwatt AG): ");

        console.log("creating project files...");
        fs.mkdirSync(name);

        fs.writeFileSync(path.join(name, "tsconfig.json"), JSON.stringify({
            compilerOptions: {
                module: "none",
                moduleResolution: "classic",
                outFile: Constants.distFile,
                target: "es2018",
                noLib: true,
                typeRoots: ["node_modules/luucy-types"]
            },
            include: [
                "plugin.ts",
                "node_modules"
            ]
        }, null, "\t"));

        fs.writeFileSync(path.join(name, "package.json"), JSON.stringify({
            name: id,
            displayName: name,
            author: author,
            version: "1.0.0"
        }));

        fs.writeFileSync(path.join(name, "plugin.ts"), `
        
const section = new ui.Section(${JSON.stringify(name)});
ui.areas.panel.add(section);

const helloWorld = new ui.Label("Hello, World!");
section.add(helloWorld);

        `.trim());

        fs.mkdirSync(path.join(name, Constants.assetsDirectory));
        fs.writeFileSync(path.join(name, Constants.iconFile), this.getIcon());

        console.log("installing luucy-types...");
        childProcess.spawnSync("npm", ["install", "luucy-types"], {
            cwd: name
        });

        console.log(`\ndone! open ${path.join(process.cwd(), name)} in your editor of choice and use 'luucy serve' to try out your plugin`);
    }

    getIcon() {
        return `

        <?xml version="1.0" encoding="UTF-8"?>
        <svg width="512px" height="512px" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <title>Artboard</title>
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <rect id="Rectangle" fill="#${Array(6).fill(0).map(() => (Math.ceil(Math.random() * 10) + 5).toString(16)).join("")}" x="0" y="0" width="512" height="512"></rect>

                <polygon id="Path" fill-opacity="0.6" fill="#000000" fill-rule="nonzero" points="389 405.12766 201.908288 451 59 286.846438 246.091712 241"></polygon>
                <polygon id="Path" fill-opacity="0.77487332" fill="#FFFFFF" fill-rule="nonzero" points="245 242.053 315.041416 63 458 226.947 387.958584 406"></polygon>
                <polygon id="Path" fill-opacity="0.6" fill="#C7C7C7" fill-rule="nonzero" points="315 63 245.436466 241.406223 59 287 127.266236 106.831979"></polygon>
            </g>
        </svg>
        
        `.trim();
    }
}