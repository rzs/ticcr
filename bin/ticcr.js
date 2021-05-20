#!/usr/bin/env node

const { option } = require('commander');
const program = require('commander');
const pkg = require('../package.json');
const lookup = require('../commands/lookup');

program
    .version(pkg.version)
    .option('-d, --debug', 'Output options')
    .arguments('[tickers...]')
    .description("Supply tickers as arguments to display their prices")
    .action((tickers) => {
        if (program.opts().debug) console.log(program.opts());
        lookup.tickers(tickers);
    })
    .parse(process.argv);


program.command('compare', 'compare crypto values');