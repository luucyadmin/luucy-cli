export class Constants {
    static distFile = "dist.lps";
    static assetsDirectory = "assets";
    static iconFile = "assets/icon.svg";

    static bundlesDirectory = "bundles/";
    static bundleName = (name, version) => `${name.toLowerCase().trim().replace(/[^a-z0-9]/, "-").replace(/\-+/, "-")}-${version}.lpb`;

    static typesPackage = "luucy-types";
}