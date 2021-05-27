#!/usr/bin/env node

const { option } = require('commander');
const program = require('commander');
const pkg = require('../package.json');
const lookup = require('../commands/lookup');

program
    .version(pkg.version)
    .option('-d, --debug', 'Output options')
    .option('-c, --currency <type>', 'Select the denominated value; BTC, USD or USDT')
    .arguments('[tickers...]')
    .description("Supply tickers as arguments to display their prices")
    .action((tickers) => {
        if (program.opts().debug) console.log(program.opts());
        if (program.opts().currency) console.log('Get value in ' + program.opts().currency + '\n');
        lookup.tickers(tickers, program.opts().currency);
    })
    .parse(process.argv);


program.command('compare', 'compare crypto values');