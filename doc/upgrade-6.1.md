# Upgrade to 6.1
Plugins require small manual modifications for the upgrade to CLI 6.1.

1. Upgrade your luucy CLI to the latest version!
```
npm install -g luucy-cli
```

2. Paste the following code in `tsconfig.json`. 
```
{
	// settings managed by luucy
	// do not edit
	//
	"compilerOptions": {
		"outFile": "dist.lps",
		"target": "es2018",
		"noLib": true,
		"noEmitHelpers": true,
		"module": "AMD",
		"moduleResolution": "classic",
		"typeRoots": [ ".luucy" ]
	},
	"include": [
		"**/*.ts",
		"plugin.ts",
		".luucy/types.d.ts"
	]
}
```

3. Paste the following code in `package.json`. Make sure to use your values at the appropriate locations!
```
{
	"name": < your-plugins-name >,
	"displayName": < Your Plugins Human Readable Name >,
	"icon": "icon.svg",
	"author": < Your companies name >,
	"version": "1.0.0",
	"scopes": [
		"core",
		"ui"
	],
	"dependencies": {
		"luucy-types": "^8.14.1"
	},
	"devDependencies": {
		"typescript": "^4.6.3"
	}
}

```

4. Remove unintended imports: You may have accidentally imported some code from the `typescript` library, 
fix this by removing all `import { ... } from 'typescript'` statements at the start of your plugin.ts 

5. (optional) If your code is getting big, you can now move some parts to other files and import them like in any other typescript project (with `import { ... } from './somefile'`)

6. Run the following commands in a terminal
```
npm install
luucy upgrade
```

7. add missing luucy scopes

we decided to extend our platform to allow more influence of plugins on luucy itself - but we would like to keep some features only available to certain plugins, mostly our own (we are moving parts of luucy to plugins). thus, some features that you are using right now are not available by default and you will need to add those 'scopes' manually. 

a new scope can be added by using: `luucy add <the scopes name>`, if you would like to see all available scopes, use: `luucy scope list` (check it out, we added a LOT!)

- if you used the map (markers, polygons, ...), you'll need to add the 'map' scope, by using `luucy add map`
- if you used data from luucy (project, variants, ...), you'll need 'data', `luucy add data`
- for web requests, use 'web', `luucy add web`

8. keep on beeing great <3