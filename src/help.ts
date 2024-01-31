import { Constants } from './constants';

export function printHelp() {
  const options = [
    {
      name: 'luucy create',
      purpose: 'Creates an empty plugin locally'
    },
    {
      name: 'luucy serve',
      purpose: 'Debug plugin locally',
      arguments: Object.keys(Constants.environments).map((environment) => ({
        name: `--${environment}`,
        purpose: `Launch debugger for ${Constants.environments[environment]} (${environment} environment)`
      }))
    },
    {
      name: 'luucy publish',
      purpose: 'Publish a plugin to the luucy marketplace',
      arguments: [
        {
          name: '[{version}]',
          purpose: 'New version name. Typically an increment of semantic version (e.g. 1.0.1)'
        }
      ]
    },
    {
      name: 'luucy upgrade',
      purpose: 'Upgrades the luucy type mappings',
      arguments: [
        {
          name: '--next [{branch}]',
          purpose: 'Upgrades to next version, for testing only'
        }
      ]
    },
    {
      name: 'luucy scope',
      purpose: 'Manage luucy scopes',
      arguments: [
        {
          name: 'add {scope}',
          purpose: 'Adds a new scope'
        },
        {
          name: 'list',
          purpose: 'Lists all available scopes'
        },
        {
          name: 'build',
          purpose: 'Rebuilds definitions'
        }
      ]
    },
    {
      name: 'luucy add',
      purpose: 'Add a new scope (shorthand for luucy scope add)',
      arguments: [
        {
          name: '{scope}',
          purpose: 'Scope name. Use luucy scope list to view all available scopes'
        }
      ]
    },
    {
      name: 'luucy help',
      purpose: 'Prints this help page'
    }
  ];

  let longest = 0;

  for (const option of options) {
    longest = Math.max(longest, option.name.length);

    for (const argument of option.arguments || []) {
      longest = Math.max(longest, argument.name.length + 4);
    }
  }

  longest += 3;

  for (const option of options) {
    process.stdout.write(`${option.name.padEnd(longest)}${option.purpose}\n`);

    for (const argument of option.arguments || []) {
      process.stdout.write(`    ${argument.name.padEnd(longest - 4)}${argument.purpose}\n`);
    }
  }
}
