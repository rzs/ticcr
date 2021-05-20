const program = require('commander');
const pkg = require('../package.json');
const lookup = require('../commands/lookup');
const util = require('../lib/util');

program
    .version(pkg.version);

//program.option('')
// .command('tickers [cryto names]')
// .description('Find crypto by ticker')
// .action((tickers) => lookup
//     .tickers(tickers)
//     .catch(util.handleError)
// );