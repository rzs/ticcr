#!/usr/bin/env node

const { option } = require('commander');
const program = require('commander');
const pkg = require('../package.json');
const lookup = require('../commands/lookup');

program
    .version(pkg.version)
    .option('-d, --debug', 'Output options')
    .option('-c, --currency [currencies...]', 'Select the denominated value; BTC, USD or USDT') // eventually more
    .option('-e, --exchange [exchanges...]', 'Bittrex is the default')
    .arguments('[tickers...]')
    .description("Supply tickers as arguments to display their prices")
    .action((tickers) => {
        lookup.tickers(tickers, program.opts().currency, program.opts().exchange);
    })
    .parse(process.argv);


program.command('compare', 'compare crypto values');