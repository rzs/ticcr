const fetch = require('node-fetch');
const apiResolver = require('../lib/util/api/apiResolver');
const tableStyle = require('../lib/util/table/tableStyle');

const doLookup = async function(tickers, currency, exchange) {
    const api = apiResolver.resolveUrl(exchange);
    fetch(api.url)
        .then(res => res.json())
        .then(data => {
            // data here could be from any exchange
            const transformedData = apiResolver.resolveParser(data, api.name);
            if (Array.isArray(tickers) && tickers.length) {
                const tickerList = filterOnTickers(tickers, transformedData);
                const tickerCurrencyList = filterOnCurrency(currency, tickerList);
                sortAndBuild(api, tickerCurrencyList);
            } else {
                const tickerCurrencyList = filterOnCurrency(currency, transformedData);
                sortAndBuild(api, tickerCurrencyList);
            }
        })
        .catch(error => {
            console.error('Oh shoot. Something went wrong with the promise code:');
            console.error(error.message);
        });
};

function filterOnTickers(tickers, transformedData) {
    const tickerList = [];
    tickers.forEach((ticker) => {
        let filteredList = transformedData.filter((obj) => {
            return obj.symbol.toLowerCase() === ticker.toLowerCase();
        });
        filteredList.map(filteredObj => {
            return {
                symbol: filteredObj.symbol,
                currency: filteredObj.currency,
                price: filteredObj.price
            };
        });
        filteredList.forEach(item => {
            tickerList.push(item);
        });
    });
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
        t.addRow({ symbol: obj.symbol, currency: obj.currency, price: obj.price }, { color: "green" });
    });
    t.printTable();
}

const lookup = {
    async tickers(...args) {
        await doLookup(...args);
    }
};

module.exports = lookup;