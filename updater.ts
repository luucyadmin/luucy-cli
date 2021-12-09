import { Constants } from "./constants";

const fs = require("fs");
const childProcess = require("child_process");

export class Updater {
    async update() {
        console.log("reading plugin package...");

        const currentVersion = this.getTypeVersion();
        console.log(`current version: '${currentVersion}'`);

        console.log("upgrading package...");
        childProcess.spawnSync("npm", ["install", `${Constants.typesPackage}@latest`]);

        const newVersion = this.getTypeVersion();
        console.log(`upgraded from '\x1b[1m${currentVersion}\x1b[11m' -> '\x1b[1m${newVersion}\x1b[11m'`);
    }

    getTypeVersion() {
        const packageConfiguration = JSON.parse(fs.readFileSync("package.json"));

        if (!packageConfiguration.dependencies) {
            throw new Error("No dependencies in package.json");
        }

        if (!packageConfiguration.dependencies[Constants.typesPackage]) {
            throw new Error(`No '${Constants.typesPackage}' dependency in package.json`);
        }

        return packageConfiguration.dependencies[Constants.typesPackage].replace(/[^0-9\.]/g, "");
    }
}