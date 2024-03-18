import { Constants } from './constants';
import { Creator } from './create';
import { printHelp } from './help';
import { Publisher } from './publisher';
import { Scopes } from './scopes';
import { Serve } from './serve';
import { Updater } from './updater';

const parameters = process.argv.slice(process.argv.findIndex((arg) => arg.includes('luucy')) + 1);
const packageConfiguration = require('../package.json');

process.stdout.write('\n\x1b[38;5;122m     · ·        __\n');
process.stdout.write('   · + + ·     / /_  ____  _________  __\n');
process.stdout.write('   + \x1b[1m+ +\x1b[22m +    / / / / / / / / ___/ / / /\n');
process.stdout.write('   + \x1b[1m+ +\x1b[22m +   / / /_/ / /_/ / /__/ /_/ /\n');
process.stdout.write('   · + + ·  /_/\\__,_/\\__,_/\\___/\\__, /\n');
process.stdout.write(`     · ·    \x1b[2mv${packageConfiguration.version.padEnd(17)}\x1b[22m /____/\x1b[0m\n\n`);

switch (parameters.shift()) {
  case 'create': {
    const creator = new Creator();
    creator.create();

    process.exit(0);

    break;
  }

  case 'serve': {
    new Scopes().build();

    let host = Constants.environments.productive;

    for (const environment in Constants.environments) {
      if (process.argv.includes(`--${environment}`)) {
        host = Constants.environments[environment];
      }
    }

    const serve = new Serve(host);
    serve.start();

    break;
  }

  case 'build': {
    const publisher = new Publisher();
    publisher.build(process.argv.includes('--dry')).then(() => {
      process.exit(0);
    });

    break;
  }

  case 'publish': {
    const publisher = new Publisher();
    publisher.publish(parameters.shift()).then(() => {
      process.exit(0);
    });

    break;
  }

  case 'upgrade': {
    const updater = new Updater();
    updater.update(process.argv.includes('--next'), process.argv[process.argv.indexOf('--next') + 1]).then(() => {
      process.exit(0);
    });

    break;
  }

  case 'add': {
    new Scopes().add(parameters.shift());

    process.exit(0);
  }

  case 'scope': {
    const scopes = new Scopes();

    switch (parameters.shift()) {
      case 'add': {
        scopes.add(parameters.shift());

        break;
      }

      case 'list': {
        process.stdout.write('available scopes:\n');

        for (const item of scopes.list()) {
          const info = scopes.info(item);

          process.stdout.write(`- '${item}' \x1b[1m${info.name}\x1b[22m ${info.description} `);

          if (info.permission) {
            process.stdout.write('\x1b[2m⚠ requires special permissions\x1b[22m');
          }

          process.stdout.write('\n');
        }

        break;
      }

      case 'build': {
        scopes.build();

        break;
      }

      default: {
        printHelp();

        process.exit(1);
      }
    }

    process.exit(0);
  }

  case 'help': {
    printHelp();

    process.exit(0);
  }

  default: {
    printHelp();

    process.exit(1);
  }
}
