import { Constants } from "./constants";

const fs = require("fs");
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

        console.log(`reading package '${packageConfiguration.displayName}'...`);
        const source = fs.readFileSync(Constants.distFile);

        console.log(`packing '${packageConfiguration.displayName}'...`);
        const bundle = {
            id: packageConfiguration.name,
            name: packageConfiguration.displayName,
            author: packageConfiguration.author,
            version: version,
            luucy: packageConfiguration.dependencies["luucy-types"].replace(/[^\.0-9]/g, ""),
            source: source
        };

        console.log(`writing bundle '${packageConfiguration.displayName}'...`);
        
        await tar.create({
            file: "plugin.lpb"
        }, [
            Constants.distFile, 
            "package.json", 
            Constants.assetsDirectory
        ])
            
        console.log(`'${packageConfiguration.displayName}' (v${version}) built!\n`);
        console.log(`Go to the following page and upload 'plugin.lpb'`);
        console.log(`\x1b[1m\x1b[4mhttps://luucy.ch/marketplace/upload\x1b[0m`);
    }
}