import { Creator } from "./create";
import { Publisher } from "./publisher";
import { Serve } from "./serve";

const childProcess = require("child_process");
const path = require("path");
const fs = require("fs");
const tar = require("tar");

const action = process.argv.reverse().find(arg => arg[0] != "-");

switch (action) {
    case "create": {
        const creator = new Creator();
        creator.create();

        process.exit(0);
    }

    case "serve": {
        const environments = {
            test: "http://localhost:4200",
            staging: "https://staging.luucy.ch",
            productive: "https://luucy.ch"
        };

        let host = environments.productive;

        for (let environment in environments) {
            if (process.argv.includes(`--${environment}`)) {
                host = environments[environment];
            }
        }

        const serve = new Serve(host);
        serve.start();

        break;
    }

    case "publish": {
        const publisher = new Publisher();
        publisher.publish().then(() => {
            process.exit(0);
        });
    }
}