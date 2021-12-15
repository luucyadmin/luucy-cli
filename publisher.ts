import { Constants } from "./constants";

const fs = require("fs");
const path = require("path");
const tar = require("tar");
const childProcess = require("child_process");
const readline = require("readline-sync");

export class Publisher {
    constructor() {}

    async publish() {
        console.log("reading package.json...");
        const packageConfiguration = JSON.parse(fs.readFileSync("package.json").toString());

        console.log(`building '${packageConfiguration.displayName}'...`);
        const tsc = childProcess.spawnSync("tsc");

        if (tsc.status) {
            console.error(`building '${packageConfiguration.displayName}' failed!`);

            console.error(tsc.output.join(""));
            console.error(tsc.error);

            process.exit(1);
        }

        console.log(`\n'${packageConfiguration.displayName}' is currently on version '${packageConfiguration.version}'. How should the new version be called?`);
        const version = readline.question("Next version: ");

        console.log(`upgrading to '${version}'...`);
        const versionUpgrade = childProcess.spawnSync("npm", ["version", version]);

        if (versionUpgrade.status) {
            console.error(`upgrading to '${version}' failed!`);

            console.error(versionUpgrade.output.join(""));
            console.error(versionUpgrade.error);

            process.exit(1);
        }

        const fileName = path.join(Constants.bundlesDirectory, Constants.bundleName(packageConfiguration.displayName, version));

        if (!fs.existsSync(Constants.bundlesDirectory)) {
            fs.mkdirSync(Constants.bundlesDirectory);
        }

        console.log(`packing '${packageConfiguration.displayName}' into '${fileName}'...`);
        
        await tar.create({
            file: fileName
        }, [
            Constants.distFile, 
            "package.json", 
            Constants.assetsDirectory
        ])
            
        console.log(`'${packageConfiguration.displayName}' (v${version}) built and packaged!\n`);
        console.log(`Go to the following page and upload '${fileName}'`);
        console.log(`\x1b[1m\x1b[4mhttps://luucy.ch/marketplace/upload\x1b[0m`);
    }
}