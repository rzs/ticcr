//const opn = require('opn');

const notEmpty = (input) => (input === '' ? 'This value is required' : true);
//const openBrowser = (url) => opn(url, { wait: false });
const handleError = (message) => {
    console.error(chalk.redBright(message))
    process.exitCode = 1
}

const printError = (error) => {
    console.error('Oh shoot. Something went wrong with the promise code:');
    console.error(error.message);
}
const extractName = (pkgName) => pkgName.substr(pkgName.indexOf('/') + 1)


module.exports = { notEmpty, handleError, extractName, printError }