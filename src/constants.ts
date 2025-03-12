import path = require('path');

export class Constants {
  static distFile = 'dist.lps';

  static packageFile = 'package.json';

  static assetsDirectory = 'assets';

  static iconFile = path.join(this.assetsDirectory, 'icon.svg');

  static bundlesDirectory = 'bundles/';

  static bundleName = (name: string, version: string) =>
    `${name
      .toLowerCase()
      .trim()
      .replaceAll(/[^a-z0-9]/g, '-')
      .replaceAll(/\-+/g, '-')}-${version}.lpb`;

  static typesPackage = 'luucy-types';

  static typesRepository = (branch: string) => `luucyadmin/luucy-types.git#next/${branch}`;

  static typesRoot = ['node_modules', this.typesPackage];

  static scopes = path.join(...this.typesRoot, 'scopes');

  static managed = '.luucy';

  static managedTypes = path.join(this.managed, 'types.d.ts');

  static environments = {
    local: 'http://localhost:4200',
    dev: 'https://app.dev.dev.luucy.ch',
    test: 'https://app.test.dev.luucy.ch',
    productive: 'https://app.luucy.ch'
  };
}
