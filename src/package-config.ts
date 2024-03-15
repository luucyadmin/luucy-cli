import { Constants } from './constants';

const fs = require('fs');

export type PackageConfiguration = {
  name: string;
  displayName: string;
  icon: string;
  author: string;
  version: string;
  scopes: string[];
  dependencies?: { [key: string]: string };
};

export const readPackageConfiguration = (): PackageConfiguration => {
  console.log(`reading ${Constants.packageFile}...`);
  return JSON.parse(fs.readFileSync(Constants.packageFile).toString());
};

export const writePackageConfiguration = (packageConfiguration: PackageConfiguration) => {
  fs.writeFileSync(Constants.packageFile, JSON.stringify(packageConfiguration, null, '\t'));
};
