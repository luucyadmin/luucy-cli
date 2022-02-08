import { Creator } from "./create";
import { Publisher } from "./publisher";
import { Serve } from "./serve";
import { Updater } from "./updater";

const childProcess = require("child_process");
const path = require("path");
const fs = require("fs");
const tar = require("tar");

const action = process.argv.reverse().find(arg => arg[0] != "-");

const environments = {
    test: "http://localhost:4200",
    staging: "https://staging.luucy.ch",
    productive: "https://luucy.ch"
};

const packageConfiguration = require("../package.json");

process.stdout.write("\n\x1b[38;5;122m     · ·        __\n");
process.stdout.write("   · + + ·     / /_  ____  _________  __\n");
process.stdout.write("   + \x1b[1m+ +\x1b[22m +    / / / / / / / / ___/ / / /\n");
process.stdout.write("   + \x1b[1m+ +\x1b[22m +   / / /_/ / /_/ / /__/ /_/ /\n");
process.stdout.write("   · + + ·  /_/\\__,_/\\__,_/\\___/\\__, /\n");
process.stdout.write(`     · ·    \x1b[2mv${packageConfiguration.version.padEnd(17)}\x1b[22m /____/\n\n`);

switch (action) {
    case "create": {
        const creator = new Creator();
        creator.create();
        
        process.exit(0);

        break;
    }

    case "serve": {
        let host = environments.productive;

        for (let environment in environments) {
            if (process.argv.includes(`--${environment}`)) {
                host = environments[environment];
            }
        }

        const serve = new Serve(host);
        serve.start();

        break;
    }

    case "publish": {
        const publisher = new Publisher();
        publisher.publish().then(() => {
            process.exit(0);
        });

        break;
    }

    case "upgrade": {
        const updater = new Updater();
        updater.update(process.argv.includes("--next")).then(() => {
            process.exit(0);
        });

        break;
    }

    default: {
        process.stdout.write(`luucy cli v${packageConfiguration.version}\n\n`);

        const options = [
            { 
                name: "luucy create", 
                purpose: "Creates an empty plugin locally" 
            },
            { 
                name: "luucy serve", 
                purpose: "Debug plugin locally",
                arguments: Object.keys(environments).map(environment => ({
                    name: `--${environment}`,
                    purpose: `Launch debugger for ${environments[environment]} (${environment} environment)`
                }))
            },
            { 
                name: "luucy publish", 
                purpose: "Publish a plugin to the luucy marketplace" 
            },
            {
                name: "luucy upgrade",
                purpose: "Upgrades the luucy type mappings",
                arguments: [
                    {
                        name: "--next",
                        purpose: "Upgrades to next version, for testing only"
                    }
                ]
            }
        ];

        let longest = 0;

        for (let option of options) {
            longest = Math.max(longest, option.name.length);

            for (let argument of option.arguments || []) {
                longest = Math.max(longest, argument.name.length + 4);
            }
        }

        longest += 3;

        for (let option of options) {
            process.stdout.write(`${option.name.padEnd(longest)}${option.purpose}\n`);

            for (let argument of option.arguments || []) {
                process.stdout.write(`    ${argument.name.padEnd(longest - 4)}${argument.purpose}\n`);
            }
        }
    }    
}