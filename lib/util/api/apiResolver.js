const apiExchanges = require('./apiExchanges');
const { bittrexParser, polinexParser } = require('./parsers');

const resolveUrl = function(exchange) {
    return getUrl(exchange);
}

function getUrl(exchange) {
    const exchangeList = apiExchanges.exchanges;
    let url;
    if (typeof(exchange) !== 'undefined' && exchange !== null) {
        url = exchangeList.find(ex => {
            return ex.name.toLowerCase() === exchange.toLowerCase();
        });
    } else {
        url = exchangeList.find(ex => {
            return ex.name.toLowerCase() === 'bittrex';
        })
    }
    return url;
}

const resolveParser = function(jsonData, exchange) {
    if (exchange === 'bittrex') {
        return bittrexParser(jsonData);
    }
    if (exchange === 'polinex') {
        return polinexParser(jsonData);
    }
    return [];
}

module.exports = { resolveUrl, resolveParser }