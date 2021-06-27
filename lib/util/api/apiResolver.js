const apiExchanges = require('./apiExchanges');
const { bittrexParser, polinexParser, binanceParser } = require('./parsers');

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

const resolveParser = function(api) {
    if (api.name === 'bittrex') {
        return bittrexParser(api);
    }
    if (api.name === 'polinex') {
        return polinexParser(api);
    }
    if (api.name === 'binance') {
        return binanceParser(api);
    }
    return [];
}

module.exports = { resolveUrl, resolveParser }