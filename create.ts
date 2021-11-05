const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");
const readline = require("readline-sync");

const icon = require("./icon");
const Constants = require("./constants");

module.exports = class Creator {
    create() {
        const id = Array(64).fill(0).map(() => Math.random().toString(16)[4]).join("");

        const name = readline.question("Module name (example: Heatwatt Calculator): ");
        const author = readline.question("Author (example: Heatwatt AG): ");

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

        fs.mkdirSync(Constants.assetsDirectory);
        fs.writeFileSync(Constants.iconFile, icon);

        console.log("installing luucy-types...");
        childProcess.spawnSync("npm", ["install", "luucy-types"], {
            cwd: name
        });

        console.log("\ndone! use 'luucy serve' to try out your plugin");
    }
}