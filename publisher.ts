import { Constants } from "./constants";

const fs = require("fs");
const tar = require("tar");
const childProcess = require("child_process");

export class Publisher {
    constructor() {}

    publish() {
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

        console.log(`reading package '${packageConfiguration.displayName}'...`);
        const source = fs.readFileSync(Constants.distFile);

        console.log(`packing '${packageConfiguration.displayName}'...`);
        const bundle = {
            id: packageConfiguration.name,
            name: packageConfiguration.displayName,
            author: packageConfiguration.author,
            version: packageConfiguration.version,
            luucy: packageConfiguration.dependencies["luucy-types"].replace(/[^\.0-9]/g, ""),
            source: source
        };

        console.log(`writing bundle '${packageConfiguration.displayName}'...`);
        
        tar.create([
            Constants.distFile, 
            "package.json", 
            Constants.assetsDirectory
        ]).pipe(fs.createWriteStream("plugin.lpb")).on("finish", () => {
            console.log(`'${packageConfiguration.displayName}' build!\n`);
            console.log(`Go to the following page and upload 'plugin.lpb'`);
            console.log(`\x1b[1m\x1b[4mhttps://luucy.ch/marketplace/upload\x1b[0m`);
        });
    }
}