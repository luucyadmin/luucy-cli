const path = require('path');

export class Constants {
    static distFile = 'dist.lps';
    static packageFile = 'package.json';
    static assetsDirectory = 'assets';
    static iconFile = path.join(this.assetsDirectory, 'icon.svg');

    static bundlesDirectory = 'bundles/';
    static bundleName = (name, version) => `${name.toLowerCase().trim().replace(/[^a-z0-9]/, '-').replace(/\-+/, '-')}-${version}.lpb`;

    static typesPackage = 'luucy-types';
    static typesRepository = branch => `luucyadmin/luucy-types.git#next/${branch}`;
    static typesRoot = path.join('node_modules', this.typesPackage);
    static scopes = path.join(this.typesRoot, 'scopes');

    static managed = '.luucy';
    static managedTypes = path.join(this.managed, 'types.d.ts');

    static environments = {
        test: 'http://localhost:4200',
        staging: 'https://staging.luucy.ch',
        productive: 'https://luucy.ch'
    };
}