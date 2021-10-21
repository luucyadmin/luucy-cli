const readline = require("readline-sync");
const childProcess = require("child_process");
const path = require("path");
const fs = require("fs");
const express = require("express");
const ws = require("express-ws");

const action = process.argv.reverse().find(arg => arg[0] != "-");

switch (action) {
    case "create": {
        const name = readline.question("Module name (example: Heatwatt Calculator): ");

        if (name.length < 3 || name.length > 30) {
            console.error("Module name must be at least 3 characters long and cannot exceed 30 characters.");

            process.exit(1);
        }

        const id = readline.question("Module ID (example: ch.heatwatt.calculator): ");

        if (!id.match(/^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)+$/)) {
            console.error("Module id must only contain lowercase letters, numbers and dots. A segment must not start with a number.");

            process.exit(1);
        }

        const author = readline.question("Author (example: Heatwatt AG): ");

        console.log("creating project files...");
        fs.mkdirSync(name);

        fs.writeFileSync(path.join(name, "tsconfig.json"), JSON.stringify({
            compilerOptions: {
                module: "none",
                moduleResolution: "classic",
                outFile: "dist.lps",
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
            author: author
        }));

        fs.writeFileSync(path.join(name, "plugin.ts"), `
        
const section = new ui.Section(${JSON.stringify(name)});
ui.areas.panel.add(section);

const helloWorld = new ui.Label("Hello, World!");
section.add(helloWorld);

        `.trim());

        console.log("installing luucy-types...");
        childProcess.spawnSync("npm", ["install", "luucy-types"], {
            cwd: name
        });

        console.log("\ndone! use 'luucy serve' to try out your plugin");
        process.exit(0);
    }

    case "serve": {
        const host = process.argv.includes("--test") ? "http://localhost:4200" : "https://luucy.ch";

        console.log("creating server...");
        const app = express();
        ws(app);

        console.log("reading package.json...");
        const package = JSON.parse(fs.readFileSync("package.json").toString());

        app.ws("/socket", socket => {
            process.stdout.write(`\x1b[2J\x1b[2m[${new Date().toLocaleTimeString()}] sending plugin...\x1b[0m\n`);

            socket.send(fs.readFileSync("dist.lps").toString());

            fs.watch("dist.lps", () => {
                if (fs.existsSync("dist.lps")) {
                    process.stdout.write(`\x1b[2J\x1b[2m[${new Date().toLocaleTimeString()}] updating ${package.name}...\x1b[0m\n`);

                    socket.send(fs.readFileSync("dist.lps").toString());
                }
            });
            
            socket.on("message", data => {
                const message = JSON.parse(data);

                if (message.installed) {
                    process.stdout.write(`\x1b[2m[${new Date().toLocaleTimeString()}] installed ${package.name}\x1b[0m\n`);
                } else if (message.installationError) {
                    process.stdout.write(`[${new Date().toLocaleTimeString()}] ${package.name} install failed!\n\n\x1b[1;31m${message.installationError}\x1b[0m`);
                } else if (message.log) {
                    console.log(`\x1b[3m[${package.name}]\x1b[0m`, ...message.log);
                } else if (message.warn) {
                    console.warn(`\x1b[3m[${package.name}]\x1b[0;33m`, ...message.warn, "\x1b[0m");
                } else if (message.error) {
                    console.error(`\x1b[3m[${package.name}]\x1b[1;31m`, ...message.error, "\x1b[0m");
                } else {
                    console.log("Unknown message", message);
                }
            });
        });

        console.log("starting compiler...");
        childProcess.spawn("tsc", ["-w"], {
            stdout: process.stdout
        });

        console.log("starting server...");
        const server = app.listen(0, () => {
            console.log(`\nopen the following link to try out '${package.displayName}'\n\x1b[1m\x1b[4m${host}/workspaces#${package.name}:${server.address().port}\x1b[0m`);
        });
    }
}