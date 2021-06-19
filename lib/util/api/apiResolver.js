const apiExchanges = require('./apiExchanges');
const { bittrexParser, polinexParser } = require('./parsers');

const defaultExchange = 'default';

const resolveUrl = function(exchange) {
    return getUrl(exchange);
}

const resolveParser = function(jsonData, exchange) {
    if (exchange === 'bittrex' || exchange === defaultExchange) {
        return bittrexParser(jsonData);
    }
    if (exchange === 'polinex') {
        return polinexParser(jsonData);
    }
    return [];
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
            return ex.name.toLowerCase() === defaultExchange;
        })
    }
    return url;
}

module.exports = { resolveUrl, resolveParser }