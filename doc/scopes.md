# Scopes
```
luucy add map
```

will add `types/map/index.d.ts` to `index.d.ts`
`types/map/index.d.ts` will reference or contain all typings.

will add `'map'` to `package.json` → `'scopes'`

scopes:
```
code (default)

map
map.camera
data.read
data.write
ui
ui.html
```

a scope may contain a `scope.json`.
package.json may contain `permission` which will be displayd when adding a scope.
example: `injecting custom HTML requires special permissions when submitting. You may not be able to publish your plugin.`
will prompt

`scope.json` may contain `dependencies`, an array containing all the dependencies of the scope.
permission prompts will be shown for all dependencies
circular dependencies must be handled

all scopes can be installed in development
scopes will be validated when uploading

this upgrade requires a new debugger.