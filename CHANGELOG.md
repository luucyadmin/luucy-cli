# [6.5.0](https://github.com/luucyadmin/luucy-cli/releases/tag/v6.5.0)

[Detailed changes](https://github.com/luucyadmin/luucy-cli/compare/v6.4.0...v6.5.0)

## New

- Added `luucy build` command with `--dry` option to test build without publishing

## Changed

- Improved project typing (change `require` to `import`, add missing typings)
- Fix `luucy publish` command when run without `version` argument

# [6.4.0](https://github.com/luucyadmin/luucy-cli/releases/tag/v6.4.0)

[Detailed changes](https://github.com/luucyadmin/luucy-cli/compare/v6.3.0...v6.4.0)

## New

- Added an optional `{version}` parameter for `luucy publish`, intended to simplify use in CI pipelines, see `luucy help` for usage details

## Changed

- Improved project structure (added and moved files to `/src` folder)
- Improved project readme and documentation
- Added [Changelog](./CHANGELOG.md)
- Added CI pipeline
- Added MIT license
- Added linter rules and fix reported issues
- Added unit test foundations and coverage reporting
