[![npm version](http://badge.acryps.com/npm/luucy-cli)](http://badge.acryps.com/go/npm/luucy-cli)

# luucy command line interface
Developer tool for luucy plugin development

## Installing the develoepr tools / cli
You need [nodejs and npm](https://nodejs.dev/learn/how-to-install-nodejs) installed.

Type the following command in your terminal to install luucy cli on your system.

```
$ npm install -g luucy-cli
```

You can use the command line interface by typing `luucy` in a terminal.

## Create Project
Open a terminal and type the following command to create a new plugin.
```
$ luucy create
```

Luucy CLI will create all required files after asking you for a name and a id.

## Serve Project
Use the following command to open the plugin in luucy locally.
```
$ luucy serve
```

This will automatically start a live server. Open the link provided by luucy serve to see your plugin in action!
Console output and errors of your application will appear in the terminal.