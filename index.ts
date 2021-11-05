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
        const serve = new Serve(process.argv.includes("--test") ? "http://localhost:4200" : "https://luucy.ch");
        serve.start();

        break;
    }

    case "publish": {
        const publisher = new Publisher();
        publisher.publish();

        process.exit(0);
    }
}