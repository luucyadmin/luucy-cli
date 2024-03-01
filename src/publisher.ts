import { Constants } from './constants';

const fs = require('fs');
const path = require('path');
const tar = require('tar');
const childProcess = require('child_process');
const readline = require('readline-sync');

export class Publisher {
  constructor() {}

  async build(dry: boolean) {
    const packageConfiguration = this.readPackageConfig();
    this._build(packageConfiguration);
    if (!dry) {
      await this.bundle(packageConfiguration, packageConfiguration.version);
    } else {
      console.log(`'${packageConfiguration.name}' built!\n`);
    }
  }

  async publish(version: string | undefined) {
    const packageConfiguration = this.readPackageConfig();
    this._build(packageConfiguration);
    this.changeVersion(packageConfiguration, version);
    await this.bundle(packageConfiguration, version);
  }

  private readPackageConfig() {
    console.log(`reading ${Constants.packageFile}...`);
    return JSON.parse(fs.readFileSync(Constants.packageFile).toString());
  }

  private _build(packageConfiguration) {
    console.log(`building '${packageConfiguration.name}'...`);
    const tsc = childProcess.spawnSync(/^win/.test(process.platform) ? 'npx.cmd' : 'npx', ['tsc']);

    if (tsc.status) {
      console.error(`building '${packageConfiguration.name}' failed!`);

      console.error(tsc.output.join(''));
      console.error(tsc.error);

      process.exit(1);
    }
  }

  private changeVersion(packageConfiguration, version) {
    if (!version) {
      console.log(
        `\n'${packageConfiguration.name}' is currently on version '${packageConfiguration.version}'. How should the new version be called?`
      );
      version = readline.question('Next version: ');
    }

    console.log(`upgrading to '${version}'...`);
    const versionUpgrade = childProcess.spawnSync('npm', ['version', version]);

    if (versionUpgrade.status) {
      console.error(`upgrading to '${version}' failed!`);

      console.error(versionUpgrade.output.join(''));
      console.error(versionUpgrade.error);

      process.exit(1);
    }
  }

  private async bundle(packageConfiguration, version) {
    const fileName = path.join(Constants.bundlesDirectory, Constants.bundleName(packageConfiguration.name, version));

    if (!fs.existsSync(Constants.bundlesDirectory)) {
      fs.mkdirSync(Constants.bundlesDirectory);
    }

    console.log(`packing '${packageConfiguration.name}' into '${fileName}'...`);

    await tar.create(
      {
        file: fileName
      },
      [Constants.distFile, 'package.json', Constants.assetsDirectory]
    );

    console.log(`'${packageConfiguration.name}' (v${version}) built and packaged!\n`);
    console.log(`Go to the following page and upload '${fileName}'`);
    console.log(`\x1b[1m\x1b[4mhttps://app.luucy.ch/developer\x1b[0m`);
  }
}
