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
		"typeRoots": ["node_modules/luucy-types"]
	},
	"include": [
		"**/*.ts",
		"plugin.ts",
		"node_modules/luucy-types"
	]
}
```

3. Paste the following code in `package.json`
```
{
	"name": "compare-variants",
	"displayName": "Eckdaten Varianten",
	"author": "Luucy AG",
	"version": "1.0.0",
	"dependencies": {
		"luucy-types": "^8.14.1"
	},
	"devDependencies": {
		"typescript": "^4.6.3"
	}
}
```

4. Run the following commands in a terminal
```
npm install
luucy upgrade
luucy serve
```