import { Constants } from './constants';
import { PackageConfiguration, readPackageConfiguration } from './package-config';
import { Scopes } from './scopes';

import express = require('express');
import childProcess = require('child_process');
import WebSocket = require('ws');
import fs = require('fs');
import path = require('path');
import { Server } from 'http';
import { AddressInfo } from 'net';

export class Serve {
  constructor(private readonly host: string) {}

  compileStartRegex =
    /([0-9][0-9]:?){3}\s+-\s+((Starting compilation in watch mode)|(File change detected. Starting incremental compilation))\.\.\./g;

  compileEndRegex = /([0-9][0-9]:?){3}\s+-\s+Found [0-9]+ errors?. Watching for file changes\./g;

  scopeNotFoundRegex = /error TS2304: Cannot find name '([a-zA-Z]+)'\./g;

  complexScopeNotFoundRegex = /error TS2339: Property '([a-zA-Z]+)' does not exist on type 'typeof ([a-zA-Z]+)'\./g;

  start() {
    console.log('creating server...');
    const app = express();

    let compilerOutput = '';
    let compilerStartedAt: Date | null = null;

    let packageConfiguration = readPackageConfiguration();

    const assetsPath = path.join(process.cwd(), 'assets');

    console.log(`serving assets from '${assetsPath}'...`);

    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      next();
    });

    app.use('/assets', express.static(assetsPath));

    const server = app.listen(0, () => {
      this.printOpenLinkMessage(packageConfiguration, server);
    });

    const wss = new WebSocket.Server({ server });

    const sockets: WebSocket[] = [];

    wss.on('connection', (socket) => {
      sockets.push(socket);

      process.stdout.write(`\x1b[2m[${new Date().toLocaleTimeString()}] ↔ connected to ${this.host}! sending plugin...\x1b[0m\n`);

      let source: string;

      if (fs.existsSync(Constants.distFile)) {
        source = fs.readFileSync(Constants.distFile).toString();

        socket.send(this.bundle(source, packageConfiguration));

        if (compilerOutput) {
          socket.send(JSON.stringify({ compilerOutput }));
        }
      }

      const update = () => {
        if (fs.existsSync(Constants.distFile)) {
          const updatedSource = fs.readFileSync(Constants.distFile).toString();
          const updatedPackageConfiguration = readPackageConfiguration();

          if (updatedSource != source || JSON.stringify(packageConfiguration) != JSON.stringify(updatedPackageConfiguration)) {
            process.stdout.write(`\x1b[2m[${new Date().toLocaleTimeString()}] ⇅ updating ${packageConfiguration.name}...\x1b[0m\n`);

            source = updatedSource;
            packageConfiguration = updatedPackageConfiguration;

            socket.send(this.bundle(source, packageConfiguration));
          }
        }
      };

      fs.watch(Constants.distFile, () => update());
      fs.watch(Constants.packageFile, () => update());

      socket.on('message', (data) => {
        const message = JSON.parse(data.toString());

        if (message.installed) {
          process.stdout.write(`\x1b[2m[${new Date().toLocaleTimeString()}] ✓ installed ${packageConfiguration.name}\x1b[0m\n`);
        } else if (message.installationError) {
          process.stdout.write(
            `[${new Date().toLocaleTimeString()}]\x1b[1;31m ${packageConfiguration.name} ✗ install failed!\n\n${message.installationError}\x1b[0m\n\n`
          );
        } else if (message.log) {
          console.log(`\x1b[3m[${packageConfiguration.name}]\x1b[0m ›`, ...message.log);
        } else if (message.warn) {
          console.warn(`\x1b[3;33m[${packageConfiguration.name}]\x1b[0;33m ›`, ...message.warn, '\x1b[0m');
        } else if (message.error) {
          console.error(`\x1b[3;31m[${packageConfiguration.name}]\x1b[1;31m ›`, ...message.error, '\x1b[0m');
        } else if (!message.ping) {
          console.log('⚠ unknown message', message);
        }
      });

      socket.on('close', () => {
        console.warn('⚠ debugger detached!');

        this.printOpenLinkMessage(packageConfiguration, server);
      });
    });

    console.log('⇊ starting compiler...');

    const compiler = childProcess.spawn(
      /^win/.test(process.platform) ? 'npx.cmd' : 'npx',
      ['tsc', '--watch', '--locale', 'en-us', '--noEmitOnError'],
      {
        stdio: 'pipe'
      }
    );

    const scopes = new Scopes().list();
    let output = '';

    compiler.stdout.on('data', (data) => {
      output += data.toString();

      if (output.match(this.compileStartRegex)) {
        if (output.match(this.compileEndRegex)) {
          compilerOutput = output;

          // remove ts markers
          compilerOutput = compilerOutput.replace(this.compileStartRegex, '');
          compilerOutput = compilerOutput.replace(this.compileEndRegex, '');

          // remove clear screen
          compilerOutput = compilerOutput.replace(/\x1bc/g, '');

          // remove whitespace
          compilerOutput = compilerOutput.trim();

          if (compilerOutput) {
            process.stdout.write(
              `\n\x1b[3;31m\x1b[1m[${new Date().toLocaleTimeString()}] ✗ failed to compile '${packageConfiguration.name}'!\x1b[0m\n`
            );
            process.stdout.write(`${compilerOutput}\n\n`);

            const missingScopeMatches = [
              ...(compilerOutput.match(this.scopeNotFoundRegex) || []),
              ...(compilerOutput.match(this.complexScopeNotFoundRegex) || [])
            ];

            const missingScopes = [];

            for (const error of missingScopeMatches) {
              const properties = error.match(/'(typeof\s+)?([a-zA-Z]+)'/g).map((s) => s.replace(/'(typeof\s+)?/g, ''));
              const path = properties.reverse().join('.');

              for (const scope of scopes) {
                if (scope == path && !missingScopes.includes(path)) {
                  missingScopes.push(path);
                }
              }
            }

            if (missingScopes.length) {
              for (const scope of missingScopes) {
                process.stdout.write(` → '${scope}' scope may be missing, use 'luucy add ${scope}' to add the scope.\n`);
              }

              process.stdout.write('\n');
            }
          } else {
            const time = new Date().getTime() - compilerStartedAt.getTime();
            process.stdout.write(
              `\x1b[2m\x1b[2K\r[${new Date().toLocaleTimeString()}] ✓ successfully compiled '${packageConfiguration.name}' (${time}ms)\x1b[0m\n`
            );
          }

          for (const socket of sockets) {
            try {
              socket.send(JSON.stringify({ compilerOutput }));
            } catch {}
          }

          output = '';
          compilerStartedAt = null;
        } else if (!compilerStartedAt) {
          process.stdout.write(`\x1b[2m[${new Date().toLocaleTimeString()}] ⇊ compiling '${packageConfiguration.name}'...\x1b[0m`);

          compilerStartedAt = new Date();
        }
      }
    });

    console.log('starting server...');
  }

  printOpenLinkMessage(packageConfiguration: PackageConfiguration, server: Server) {
    console.log(
      `\nopen the following link to try out '${packageConfiguration.name}'\n→ \x1b[1m\x1b[4m${this.host}/workspaces#${packageConfiguration.name}:${(server.address() as AddressInfo).port}\x1b[0m\n\n\n`
    );
  }

  bundle(source: string, packageConfiguration: PackageConfiguration) {
    return JSON.stringify({
      name: packageConfiguration.name,
      configuration: packageConfiguration,
      source
    });
  }
}
