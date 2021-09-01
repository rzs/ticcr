#!/usr/bin/env node

const { option } = require('commander');
const program = require('commander');
const pkg = require('../package.json');
const lookup = require('../commands/lookup');

program
    .version(pkg.version)
    .option('-c, --currency [currencies...]', 'Select the denominated value; BTC, USD or USDT') // eventually more
    .option('-k, --compare [assets...]', 'Compare your crypto assets value to other cryptos. How many litecoins can one bitcoin buy you?')
    .option('-e, --exchange [exchanges...]', 'Bittrex is the default')
    .option('-l, --list', 'List exchanges')
    .option('-s, --socket', 'Web socket connection')
    .arguments('[tickers...]')
    .description("Supply tickers as arguments to display their prices")
    .action((tickers) => {
        lookup.tickers(tickers, program.opts().currency, program.opts().compare, program.opts().exchange, program.opts().list, program.opts().socket);
    })
    .parse(process.argv);


program.command('compare', 'compare crypto values');