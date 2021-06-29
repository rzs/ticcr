#!/usr/bin/env node

const { option } = require('commander');
const program = require('commander');
const pkg = require('../package.json');
const lookup = require('../commands/lookup');

program
    .version(pkg.version)
    .option('-c, --currency [currencies...]', 'Select the denominated value; BTC, USD or USDT') // eventually more
    .option('-e, --exchange [exchanges...]', 'Bittrex is the default')
    .option('-l, --list', 'List exchanges')
    .arguments('[tickers...]')
    .description("Supply tickers as arguments to display their prices")
    .action((tickers) => {
        lookup.tickers(tickers, program.opts().currency, program.opts().exchange, program.opts().list);
    })
    .parse(process.argv);


program.command('compare', 'compare crypto values');