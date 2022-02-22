import { Constants } from './constants';
import { Scopes } from './scopes';

const express = require('express');
const childProcess = require('child_process');
const ws = require('express-ws');
const fs = require('fs');
const path = require('path');

export class Serve {
    constructor(
        private host: string
    ) {}

    compileStartRegex = /([0-9][0-9]:?){3}\s+-\s+((Starting compilation in watch mode)|(File change detected. Starting incremental compilation))\.\.\./g;
    compileEndRegex = /([0-9][0-9]:?){3}\s+-\s+Found [0-9]+ errors?. Watching for file changes\./g;

    scopeNotFoundRegex = /error TS2304: Cannot find name '([a-zA-Z]+)'\./g;
    complexScopeNotFoundRegex = /error TS2339: Property '([a-zA-Z]+)' does not exist on type 'typeof ([a-zA-Z]+)'\./g;

    start() {
        console.log('creating server...');
        const app = express();
        ws(app);

        const readPackageConfiguration = () => {
            return JSON.parse(fs.readFileSync(Constants.packageFile).toString());
        };

        console.log(`reading ${Constants.packageFile}...`);
        let packageConfiguration = readPackageConfiguration();

        const assetsPath = path.join(process.cwd(), 'assets');

        console.log(`serving assets from '${assetsPath}'...`);
        app.use('/assets', express.static(assetsPath));

        app.ws('/socket', socket => {
            process.stdout.write(`\x1b[2m[${new Date().toLocaleTimeString()}] connected to ${this.host}! sending plugin...\x1b[0m\n`);

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
                        process.stdout.write(`\x1b[2m[${new Date().toLocaleTimeString()}] updating ${packageConfiguration.displayName}...\x1b[0m\n`);

                        source = updatedSource;
                        packageConfiguration = updatedPackageConfiguration;

                        socket.send(this.bundle(source, packageConfiguration));
                    }
                }
            };

            fs.watch(Constants.distFile, () => update());
            fs.watch(Constants.packageFile, () => update());
            
            socket.on('message', data => {
                const message = JSON.parse(data);

                if (message.installed) {
                    process.stdout.write(`\x1b[2m[${new Date().toLocaleTimeString()}] installed ${packageConfiguration.displayName}\x1b[0m\n`);
                } else if (message.installationError) {
                    process.stdout.write(`[${new Date().toLocaleTimeString()}]\x1b[1;31m ${packageConfiguration.displayName} install failed!\n\n${message.installationError}\x1b[0m\n\n`);
                } else if (message.log) {
                    console.log(`\x1b[3m[${packageConfiguration.displayName}]\x1b[0m`, ...message.log);
                } else if (message.warn) {
                    console.warn(`\x1b[3;33m[${packageConfiguration.displayName}]\x1b[0;33m`, ...message.warn, '\x1b[0m');
                } else if (message.error) {
                    console.error(`\x1b[3;31m[${packageConfiguration.displayName}]\x1b[1;31m`, ...message.error, '\x1b[0m');
                } else if (!message.ping) {
                    console.log('Unknown message', message);
                }
            });

            socket.on('close', () => {
                console.warn('debugger detached!');

                this.printOpenLinkMessage(packageConfiguration, server);
            });
        });

        console.log('starting compiler...');

        const compiler = childProcess.spawn(/^win/.test(process.platform) ? 'npx.cmd' : 'npx', [
            'tsc', '--watch', '--locale',  'en-us'
        ], {
            stdio: 'pipe'
        });

        let output = '';
        let compilerStartedAt;

        const scopes = new Scopes().list();

        compiler.stdout.on('data', data => {
            output += data.toString();

            if (output.match(this.compileStartRegex)) {
                if (output.match(this.compileEndRegex)) {
                    // remove ts markers
                    output = output.replace(this.compileStartRegex, '');
                    output = output.replace(this.compileEndRegex, '');

                    // remove clear screen
                    output = output.replace(/\x1bc/g, '');

                    // remove whitespace
                    output = output.trim();

                    if (output) {
                        process.stdout.write(`\n\x1b[3;31m\x1b[1m[${new Date().toLocaleTimeString()}] failed to compile '${packageConfiguration.displayName}'!\x1b[0m\n`);
                        process.stdout.write(`${output}\n\n`);

                        const missingScopeMatches = [
                            ...output.match(this.scopeNotFoundRegex) || [],
                            ...output.match(this.complexScopeNotFoundRegex) || []
                        ];

                        const missingScopes = [];

                        for (let error of missingScopeMatches) {
                            const properties = error.match(/'(typeof\s+)?([a-zA-Z]+)'/g).map(s => s.replace(/'(typeof\s+)?/g, ''));
                            const path = properties.reverse().join('.');

                            for (let scope of scopes) {
                                if (scope == path && !missingScopes.includes(path)) {
                                    missingScopes.push(path);
                                }
                            }
                        }

                        if (missingScopes.length) {
                            for (let scope of missingScopes) {
                                process.stdout.write(` → '${scope}' scope may be missing, use 'luucy add ${scope}' to add the scope.\n`);
                            }

                            process.stdout.write('\n');
                        }
                    } else {
                        process.stdout.write(`\x1b[2m\x1b[2K\r[${new Date().toLocaleTimeString()}] successfully compiled '${packageConfiguration.displayName}' (${+new Date() - compilerStartedAt}ms)\x1b[0m\n`);
                    }

                    output = '';
                    compilerStartedAt = null;
                } else if (!compilerStartedAt) {
                    process.stdout.write(`\x1b[2m[${new Date().toLocaleTimeString()}]compiling '${packageConfiguration.displayName}'...\x1b[0m`);

                    compilerStartedAt = new Date();
                }
            }
        });

        console.log('starting server...');
        
        const server = app.listen(0, () => {
            this.printOpenLinkMessage(packageConfiguration, server);
        });
    }

    printOpenLinkMessage(packageConfiguration, server) {
        console.log(`\nopen the following link to try out '${packageConfiguration.displayName}'\n\x1b[1m\x1b[4m${this.host}/workspaces#${packageConfiguration.name}:${server.address().port}\x1b[0m\n\n\n`);
    }

    bundle(source: string, packageConfiguration) {
        return JSON.stringify({
            name: packageConfiguration.displayName,
            configuration: packageConfiguration,
            source
        });
    }
}