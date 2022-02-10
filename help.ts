import { Constants } from "./constants";

export function printHelp() {
    const options = [
        { 
            name: 'luucy create', 
            purpose: 'Creates an empty plugin locally' 
        },
        { 
            name: 'luucy serve', 
            purpose: 'Debug plugin locally',
            arguments: Object.keys(Constants.environments).map(environment => ({
                name: `--${environment}`,
                purpose: `Launch debugger for ${Constants.environments[environment]} (${environment} environment)`
            }))
        },
        { 
            name: 'luucy publish', 
            purpose: 'Publish a plugin to the luucy marketplace' 
        },
        {
            name: 'luucy upgrade',
            purpose: 'Upgrades the luucy type mappings',
            arguments: [
                {
                    name: '--next',
                    purpose: 'Upgrades to next version, for testing only'
                }
            ]
        },
        {
            name: 'luucy scope',
            purpose: 'Manage luucy scopes',
            arguments: [
                {
                    name: 'add',
                    purpose: 'Adds a new scope'
                },
                {
                    name: 'list',
                    purpose: 'Lists all available scopes'
                },
                {
                    name: 'build',
                    purpose: 'Rebuilds definitions'
                }
            ]
        },
        {
            name: 'luucy help',
            purpose: 'Prints this help page'
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