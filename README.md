[![NPM Version](https://img.shields.io/npm/v/luucy-cli?style=flat-square&color=00894D&logo=npm&label=luucy-cli&labelColor=white)](https://www.npmjs.com/package/luucy-cli)

# LUUCY Command Line Interface

Developer tools for [LUUCY](https://luucy.ch) app development.

## Installing

To install luucy-cli, make sure you have [nodejs and npm](https://nodejs.org/en/download/package-manager) installed on your system.

Then type the following command in your terminal to install luucy-cli:

```bash
npm install -g luucy-cli
```

From here you can use the command line interface by typing `luucy` in a terminal.

## Starting a project

Open a terminal and type the following command to create a new app:

```bash
luucy create
```

Luucy CLI will create all required files after asking you for a name and an author. Now open up the project in your favorite text editor and start exploring.

### App anatomy

A LUUCY app contains the following files by default:

```
my-app
|-- plugin.ts           start here (main app source file)
|-- assets              media assets, e.g. icon
|   `-- icon.svg        icon for your plugin
|-- package.json        package configuration
`-- tsconfig.json       TypeScript configuration (don't touch)
```

## Run your app locally

To run your LUUCY app use:

```bash
luucy serve
```

This will automatically start a debugging session. Open the link provided in the terminal output to see your app in action.

Console output like errors will appear in the terminal where you started the app as well the browser console.

Any changes to your code will automatically hot reload the app.

## Resources

For documentation on the SDK itself, see [sdk.luucy.ch](https://sdk.luucy.ch).

To see available luucy-cli commands use

```bash
luucy help
```

```

     · ·        __
   · + + ·     / /_  ____  _________  __
   + + + +    / / / / / / / / ___/ / / /
   + + + +   / / /_/ / /_/ / /__/ /_/ /
   · + + ·  /_/\__,_/\__,_/\___/\__, /
     · ·    v6.3.0             /____/

luucy create            Creates an empty plugin locally
luucy serve             Debug plugin locally
    --test              Launch debugger for http://localhost:4200 (test environment)
    --staging           Launch debugger for https://staging.luucy.ch (staging environment)
    --productive        Launch debugger for https://app.luucy.ch (productive environment)
luucy publish           Publish a plugin to the luucy marketplace
    [{version}]         New version name. Typically an increment of semantic version (e.g. 1.0.1)
luucy upgrade           Upgrades the luucy type mappings
    --next [{branch}]   Upgrades to next version, for testing only
luucy scope             Manage luucy scopes
    add {scope}         Adds a new scope
    list                Lists all available scopes
    build               Rebuilds definitions
luucy add               Add a new scope (shorthand for luucy scope add)
    {scope}             Scope name. Use luucy scope list to view all available scopes
luucy help              Prints this help page
```

## Feature Requests

Got an idea? Feel free to [open an issue](https://github.com/luucyadmin/luucy-cli/issues/new?assignees=&labels=&template=feature_request.md) and get in touch.
