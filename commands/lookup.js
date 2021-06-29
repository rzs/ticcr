const fetch = require('node-fetch');
const apiResolver = require('../lib/util/api/apiResolver');
const tableStyle = require('../lib/util/table/tableStyle');
const printError = require('../');
const apiExchanges = require('../lib/util/api/apiExchanges');

const doLookup = async function(tickers, currencies, exchanges, list) {
    if (list) {
        listSupportedExchanges();
    }
    if (Array.isArray(exchanges) && exchanges.length) {
        exchanges.forEach(exchange => {
            getDataFromExchange(exchange, tickers, currencies);
        });
    } else {
        getDataFromExchange(exchanges, tickers, currencies);
    }
}

function listSupportedExchanges() {
    console.log('List of supported exchanges:');
    for (let obj of apiExchanges.exchanges) {
        console.log(obj.name);
    }
}

function getDataFromExchange(exchange, tickers, currencies) {
    const api = apiResolver.resolveUrl(exchange);

    // data here could be from any exchange
    const parserPromise = apiResolver.resolveParser(api);
    parserPromise.then(transformedData => {
        filterAndBuild(tickers, transformedData, currencies, api);
    }).catch(error => {
        printError(error);
    });
}

function filterAndBuild(tickers, transformedData, currencies, api) {
    if (Array.isArray(tickers) && tickers.length) {
        const filteredList = filterOnTickers(tickers, transformedData);
        const tickerList = mapAndSort(filteredList);
        const tickerCurrencyList = filterOnCurrency(currencies, tickerList);
        sortAndBuild(api, tickerCurrencyList);
    } else {
        const tickerList = mapAndSort(transformedData);
        const tickerCurrencyList = filterOnCurrency(currencies, tickerList);
        sortAndBuild(api, tickerCurrencyList);
    }
}

function filterOnTickers(tickers, transformedData) {
    let filteredList = [];
    tickers.forEach((ticker) => {
        const tempArray = transformedData.filter((obj) => {
            return obj.baseAsset.toLowerCase() === ticker.toLowerCase();
        });
        tempArray.forEach(item => {
            filteredList.push(item);
        });
    });
    return filteredList;
}

function mapAndSort(tickerList) {
    const mappedList = tickerList.map(filteredObj => {
        return {
            symbol: filteredObj.baseAsset,
            currency: filteredObj.quoteAsset,
            price: filteredObj.price
        };
    });
    mappedList.sort((a, b) => (a.currency > b.currency) ? 1 : ((b.currency > a.currency) ? -1 : 0));
    return mappedList;
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