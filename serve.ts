import { Constants } from "./constants";

const express = require("express");
const childProcess = require("child_process");
const ws = require("express-ws");
const fs = require("fs");
const path = require("path");

export class Serve {
    constructor(
        private host: string
    ) {}

    start() {
        console.log("creating server...");
        const app = express();
        ws(app);

        const readPackageConfiguration = () => {
            return JSON.parse(fs.readFileSync(Constants.packageFile).toString());
        };

        console.log(`reading ${Constants.packageFile}...`);
        let packageConfiguration = readPackageConfiguration();

        const assetsPath = path.join(process.cwd(), "assets");

        console.log(`serving assets from '${assetsPath}'...`);
        app.use("/assets", express.static(assetsPath));

        app.ws("/socket", socket => {
            process.stdout.write(`\x1b[2J\x1b[2m[${new Date().toLocaleTimeString()}] sending plugin...\x1b[0m\n`);

            let source;
            
            if (fs.existsSync(Constants.distFile)) {
                source = fs.readFileSync(Constants.distFile).toString();

                socket.send(this.bundle(source, packageConfiguration));
            }

            const update = () => {
                if (fs.existsSync(Constants.distFile)) {
                    const updatedSource = fs.readFileSync(Constants.distFile).toString();
                    const updatedPackageConfiguration = readPackageConfiguration();

                    if (updatedSource != source || JSON.stringify(packageConfiguration) != JSON.stringify(updatedPackageConfiguration)) {
                        process.stdout.write(`\x1b[2J\x1b[2m[${new Date().toLocaleTimeString()}] updating ${packageConfiguration.displayName}...\x1b[0m\n`);

                        source = updatedSource;
                        packageConfiguration = updatedPackageConfiguration;

                        socket.send(this.bundle(source, packageConfiguration));
                    }
                }
            };

            fs.watch(Constants.distFile, () => update());
            fs.watch(Constants.packageFile, () => update());
            
            socket.on("message", data => {
                const message = JSON.parse(data);

                if (message.installed) {
                    process.stdout.write(`\x1b[2m[${new Date().toLocaleTimeString()}] installed ${packageConfiguration.displayName}\x1b[0m\n`);
                } else if (message.installationError) {
                    process.stdout.write(`[${new Date().toLocaleTimeString()}]\x1b[1;31m ${packageConfiguration.displayName} install failed!\n\n${message.installationError}\x1b[0m\n\n`);
                } else if (message.log) {
                    console.log(`\x1b[3m[${packageConfiguration.displayName}]\x1b[0m`, ...message.log);
                } else if (message.warn) {
                    console.warn(`\x1b[3;33m[${packageConfiguration.displayName}]\x1b[0;33m`, ...message.warn, "\x1b[0m");
                } else if (message.error) {
                    console.error(`\x1b[3;31m[${packageConfiguration.displayName}]\x1b[1;31m`, ...message.error, "\x1b[0m");
                } else {
                    console.log("Unknown message", message);
                }
            });

            socket.on("close", () => {
                console.warn("debugger detached!");

                this.printOpenLinkMessage(packageConfiguration, server);
            });
        });

        console.log("starting compiler...");
        childProcess.spawn("tsc", ["-w"], {
            stdout: process.stdout
        });

        console.log("starting server...");
        
        const server = app.listen(0, () => {
            this.printOpenLinkMessage(packageConfiguration, server);
        });
    }

    printOpenLinkMessage(packageConfiguration, server) {
        console.log(`\nopen the following link to try out '${packageConfiguration.displayName}'\n\x1b[1m\x1b[4m${this.host}/workspaces#${packageConfiguration.name}:${server.address().port}\x1b[0m`);
    }

    bundle(source: string, packageConfiguration) {
        return JSON.stringify({
            name: packageConfiguration.displayName,
            configuration: packageConfiguration,
            source
        });
    }
}