const { Table } = require('console-table-printer');
const chalk = require('chalk');

const setupTable = function(exchange) {
    return new Table({
        style: {
            /*
                Style:
                ╔══════╦═════╦══════╗
                ║ hob  ║ foo ║ mia  ║
                ╟══════╬═════╬══════╢
                ║ ball ║ fox ║ mama ║
                ╚══════╩═════╩══════╝
                */
            headerTop: {
                left: chalk.blue('╔'),
                mid: chalk.blue('╦'),
                right: chalk.blue('╗'),
                other: chalk.blue('═'),
            },
            headerBottom: {
                left: chalk.blue('╟'),
                mid: chalk.blue('╬'),
                right: chalk.blue('╢'),
                other: chalk.blue('═'),
            },
            tableBottom: {
                left: chalk.blue('╚'),
                mid: chalk.blue('╩'),
                right: chalk.blue('╝'),
                other: chalk.blue('═'),
            },
            vertical: chalk.blue('║'),
        },
        title: exchange,
        columns: [
            { name: "Symbol", alignment: "left" },
            { name: "Price", alignment: "right" },
            { name: "Currency", alignment: "right" },
        ],
    });
}

//Create a styled table


module.exports = { setupTable };