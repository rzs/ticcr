//const express = require("express");
const fetch = require('node-fetch');
const util = require('../lib/util');
//const app = express();

//app.use(express.urlencoded({ extended: true }));
//app.use(express.json());

const doLookup = async function(tickers, currency) {
    //console.log('Arguments: ' + tickers, currency);

    //const polinexUrl 'https://poloniex.com/public?command=returnTicker';
    const bittrexUrl = 'https://api.bittrex.com/v3/markets/tickers';
    fetch(bittrexUrl)
        .then(res => res.json())
        .then(data => {
            const jsonData = Object.values(data);
            const transformedData = splitOnNameAndCurrency(jsonData);

            if (Array.isArray(tickers) && tickers.length) {
                const tickerList = filterOnTickers(tickers, transformedData);
                const tickerCurrencyList = filterOnCurrency(currency, tickerList);

                sortOnTickerName(tickerCurrencyList);
                buildTable(tickerCurrencyList);
            } else {
                const priceData = mapJsonData(jsonData);
                buildTable(priceData);
            }
        })
        .catch(error => {
            console.error('Oh shoot. Something went wrong with the promise code:');
            console.error(error.message);
        });
};

function splitOnNameAndCurrency(jsonData) {
    const parsedArray = [];
    jsonData.forEach((obj) => {
        let tickerSubstring = {};
        tickerSubstring.symbol = obj.symbol.substr(0, obj.symbol.indexOf('-'));
        tickerSubstring.currency = obj.symbol.substr(obj.symbol.indexOf('-') + 1);
        tickerSubstring.price = obj.lastTradeRate;
        parsedArray.push(tickerSubstring);
    });
    return parsedArray;
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

function mapJsonData(jsonData) {
    return jsonData.map((obj) => {
        return {
            symbol: obj.symbol,
            price: obj.lastTradeRate
        };
    });
}

function buildTable(tickerCurrencyList) {
    const t = util.styledTable;
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