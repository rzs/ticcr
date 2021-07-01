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

const dateFromTimeStamp = (timestamp) => {
    // let unix_timestamp = 1549312452
    //     // Create a new JavaScript Date object based on the timestamp
    //     // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var date = new Date(timestamp * 1000);
    // // Hours part from the timestamp
    var hours = date.getHours();
    // // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // // Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();

    // // Will display time in 10:30:23 format
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime;
};


module.exports = { notEmpty, handleError, extractName, printError, dateFromTimeStamp }