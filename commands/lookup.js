const fetch = require('node-fetch');
const apiResolver = require('../lib/util/api/apiResolver');
const tableStyle = require('../lib/util/table/tableStyle');
const printError = require('../');

const doLookup = async function(tickers, currency, exchange) {
    const api = apiResolver.resolveUrl(exchange);

    // data here could be from any exchange
    const parserPromise = apiResolver.resolveParser(api);
    parserPromise.then(transformedData => {
        filterAndBuild(tickers, transformedData, currency, api);
    }).catch(error => {
        printError(error);
    });
}

function filterAndBuild(tickers, transformedData, currency, api) {
    if (Array.isArray(tickers) && tickers.length) {
        const tickerList = filterOnTickers(tickers, transformedData);
        const tickerCurrencyList = filterOnCurrency(currency, tickerList);
        sortAndBuild(api, tickerCurrencyList);
    } else {
        const tickerCurrencyList = filterOnCurrency(currency, transformedData);
        sortAndBuild(api, tickerCurrencyList);
    }
}

function filterOnTickers(tickers, transformedData) {
    const tickerList = [];
    tickers.forEach((ticker) => {
        let filteredList = transformedData.filter((obj) => {
            return obj.baseAsset.toLowerCase() === ticker.toLowerCase();
        });
        const tempArray = filteredList.map(filteredObj => {
            return {
                symbol: filteredObj.baseAsset,
                currency: filteredObj.quoteAsset,
                price: filteredObj.price
            };
        });
        tempArray.forEach(item => {
            tickerList.push(item);
        });
    });
    tickerList.sort((a, b) => (a.currency > b.currency) ? 1 : ((b.currency > a.currency) ? -1 : 0));
    return tickerList;
}

function filterOnCurrency(currency, tickerList) {
    const filteredTickerList = [];
    if (typeof(currency) !== 'undefined' && currency !== null) {
        if (Array.isArray(currency) && currency.length) {
            currency.forEach(curr => {
                const currencyFilteredArray = tickerList.filter((obj) => {
                    return obj.currency.toLowerCase() === curr.toLowerCase();
                });
                currencyFilteredArray.forEach(item => {
                    filteredTickerList.push(item);
                });
            });
        };
        filteredTickerList.sort((a, b) => (a.currency > b.currency) ? 1 : ((b.currency > a.currency) ? -1 : 0));
        return filteredTickerList;
    } else {
        return tickerList;
    }
}

function sortAndBuild(api, tickerCurrencyList) {
    sortOnTickerName(tickerCurrencyList);
    buildTable(api.name, tickerCurrencyList);
}

function sortOnTickerName(tickerCurrencyList) {
    tickerCurrencyList.sort((a, b) => (a.symbol > b.symbol) ? 1 : ((b.symbol > a.symbol) ? -1 : 0));
}

function buildTable(exchange, tickerCurrencyList) {
    const t = tableStyle.setupTable(exchange);
    tickerCurrencyList.forEach(obj => {
        t.addRow({ Symbol: obj.symbol, Currency: obj.currency, Price: obj.price }, { color: "green" });
    });
    t.printTable();
}

const lookup = {
    async tickers(...args) {
        await doLookup(...args);
    }
};

module.exports = lookup;