const bittrexParser = function(data) {
    const parsedArray = [];
    const jsonData = Object.values(data);
    jsonData.forEach((obj) => {
        let tickerSubstring = {};
        tickerSubstring.symbol = obj.symbol.substr(0, obj.symbol.indexOf('-'));
        tickerSubstring.currency = obj.symbol.substr(obj.symbol.indexOf('-') + 1);
        tickerSubstring.price = obj.lastTradeRate;
        parsedArray.push(tickerSubstring);
    });
    return parsedArray;
}

const polinexParser = function(data) {
    const parsedArray = [];
    for (let obj in data) {
        let tickerSubstring = {};
        tickerSubstring.symbol = obj.substr(obj.indexOf('_') + 1);
        tickerSubstring.currency = obj.substr(0, obj.indexOf('_'));
        tickerSubstring.price = data[obj].last;
        parsedArray.push(tickerSubstring);
    }
    return parsedArray;
}

module.exports = { bittrexParser, polinexParser };