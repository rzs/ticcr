//const opn = require('opn');
const chalk = require('chalk');
const { Table } = require('console-table-printer');

const notEmpty = (input) => (input === '' ? 'This value is required' : true);
//const openBrowser = (url) => opn(url, { wait: false });
const handleError = (message) => {
    console.error(chalk.redBright(message))
    process.exitCode = 1
}
const extractName = (pkgName) => pkgName.substr(pkgName.indexOf('/') + 1)

//Create a styled table
const styledTable = new Table({
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
    columns: [
        { name: "symbol", alignment: "left" },
        { name: "price", alignment: "right" },
    ],
});

module.exports = { notEmpty, handleError, extractName, styledTable }