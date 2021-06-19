//const express = require("express");
const fetch = require('node-fetch');
const apiResolver = require('../lib/util/api/apiResolver');
const tableStyle = require('../lib/util/table/tableStyle');
//const app = express();

//app.use(express.urlencoded({ extended: true }));
//app.use(express.json());

const doLookup = async function(tickers, currency, exchange) {
    const api = apiResolver.resolveUrl(exchange);
    //const bittrexUrl = 'https://api.bittrex.com/v3/markets/tickers';
    fetch(api.url)
        .then(res => res.json())
        .then(data => {
            // data here could be from any exchange
            const transformedData = apiResolver.resolveParser(data, exchange);
            //const transformedData = splitOnNameAndCurrency(jsonData, divider);

            // parsing of data into a tickerList below requires a uniform transformedData array
            // ...or everything up until buildTable is just different for each exchange? 
            // ...we wish to reuse as much as possible so try to make transformedData shape same for all

            if (Array.isArray(tickers) && tickers.length) {
                const tickerList = filterOnTickers(tickers, transformedData);
                const tickerCurrencyList = filterOnCurrency(currency, tickerList);

                sortOnTickerName(tickerCurrencyList);
                buildTable(exchange, tickerCurrencyList);
            } else {
                buildTable(exchange, transformedData);
            }
        })
        .catch(error => {
            console.error('Oh shoot. Something went wrong with the promise code:');
            console.error(error.message);
        });
};

function findDivider(element) {
    if (element.symbol.includes("-")) {
        return "dash";
    }
    if (element.symbol.includes("_")) {
        return "underscore";
    }
}

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