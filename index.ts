const readline = require("readline-sync");
const childProcess = require("child_process");
const path = require("path");
const fs = require("fs");
const express = require("express");
const ws = require("express-ws");

const action = process.argv.reverse().find(arg => arg[0] != "-");

const distFile = "dist.lps";

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
                outFile: distFile,
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

            let source = fs.readFileSync("dist.lps").toString();

            socket.send(source);

            fs.watch("dist.lps", () => {
                if (fs.existsSync("dist.lps")) {
                    const updatedSource = fs.readFileSync("dist.lps").toString();

                    if (updatedSource != source) {
                        process.stdout.write(`\x1b[2J\x1b[2m[${new Date().toLocaleTimeString()}] updating ${package.name}...\x1b[0m\n`);

                        source = updatedSource;

                        socket.send(source);
                    }
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
                    console.warn(`\x1b[3;33m[${package.name}]\x1b[0;33m`, ...message.warn, "\x1b[0m");
                } else if (message.error) {
                    console.error(`\x1b[3;31m[${package.name}]\x1b[1;31m`, ...message.error, "\x1b[0m");
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

        break;
    }

    case "publish": {
        console.log("reading package.json...");
        const package = JSON.parse(fs.readFileSync("package.json").toString());

        console.log(`building '${package.name}'...`);
        const tsc = childProcess.spawnSync("tsc");

        if (tsc.status) {
            console.error(`building '${package.name}' failed!`);

            console.error(tsc.output.join(""));
            console.error(tsc.error);

            process.exit(1);
        }

        console.log(`reading package '${package.name}'...`);
        const source = fs.readFileSync(distFile);

        console.log(`packing '${package.name}'...`);
        const bundle = {
            id: package.name,
            name: package.displayName,
            author: package.author,
            version: package.version,
            luucy: package.dependencies["luucy-types"].replace(/[^\.0-9]/g, ""),
            source: source
        };

        const buffer = Buffer.from(JSON.stringify(bundle), "utf8");

        for (let i = 0; i < buffer.length; i++) {
            buffer[i] ^= 0x51;
        }

        console.log(`writing bundle '${package.name}'...`);
        fs.writeFileSync("plugin.lpb", buffer.toString("hex").match(/[a-f0-9]{1,64}/g).join("\n"));

        console.log(`'${package.name}' build!\n`);
        console.log(`Go to the following page and upload 'plugin.lpb'`);
        console.log(`\x1b[1m\x1b[4mhttps://luucy.ch/marketplace/upload\x1b[0m`);

        process.exit(0);
    }
}