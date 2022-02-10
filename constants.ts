export class Constants {
    static distFile = "dist.lps";
    static packageFile = "package.json";
    static assetsDirectory = "assets";
    static iconFile = "assets/icon.svg";

    static bundlesDirectory = "bundles/";
    static bundleName = (name, version) => `${name.toLowerCase().trim().replace(/[^a-z0-9]/, "-").replace(/\-+/, "-")}-${version}.lpb`;

    static typesPackage = "luucy-types";

    static environments = {
        test: 'http://localhost:4200',
        staging: 'https://staging.luucy.ch',
        productive: 'https://luucy.ch'
    };
}