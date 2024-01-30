[![NPM Version](https://img.shields.io/npm/v/luucy-cli?style=flat-square&color=00894D&logo=npm&label=luucy-cli&labelColor=white)](https://www.npmjs.com/package/luucy-cli)


# LUUCY Command Line Interface
Developer tools for luucy app development.

## Installing the developer tools / cli
To install luucy-cli, make sure you have [nodejs and npm](https://nodejs.dev/en/learn/how-to-install-nodejs/) installed on your system.

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

Luucy CLI will create all required files after asking you for a name and an author.

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

This will automatically start a debugging session. Open the link provided in the terminal output to see your plugin in action!

Console output and errors of your application will appear in the terminal where you started the plugin from.

Any changes to your code will automatically reload the plugin.

## Issues / Feature Requests
Feel free to [open an issue](https://github.com/luucyadmin/luucy-cli/issues/new?assignees=&labels=&template=feature_request.md) if a feature is missing.