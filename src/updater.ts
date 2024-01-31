import { Constants } from './constants';

const fs = require('fs');
const childProcess = require('child_process');

export class Updater {
  async update(useNext: boolean, branch: string) {
    console.log('reading plugin package...');

    const currentVersion = this.getTypeVersion();
    console.log(`current version: '${currentVersion}'`);

    console.log('upgrading package...');
    childProcess.spawnSync(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', [
      'install',
      useNext && branch ? Constants.typesRepository(branch) : `${Constants.typesPackage}@${useNext ? 'next' : 'latest'}`
    ]);

    const newVersion = this.getTypeVersion();

    if (useNext && branch) {
      console.log(`\x1b[1mupdated to '${Constants.typesRepository(branch)}'\x1b[11m`);
    } else if (newVersion != currentVersion) {
      console.log(`upgraded from '\x1b[1m${currentVersion}\x1b[11m' -> '\x1b[1m${newVersion}\x1b[11m'`);
    } else {
      console.log(`\x1b[1malready up to date!\x1b[11m`);
    }
  }

  getTypeVersion() {
    const packageConfiguration = JSON.parse(fs.readFileSync(Constants.packageFile));

    if (!packageConfiguration.dependencies) {
      throw new Error(`No dependencies in ${Constants.packageFile}`);
    }

    if (!packageConfiguration.dependencies[Constants.typesPackage]) {
      throw new Error(`No '${Constants.typesPackage}' dependency in ${Constants.packageFile}`);
    }

    return packageConfiguration.dependencies[Constants.typesPackage].replace(/[^0-9\.]/g, '');
  }
}
