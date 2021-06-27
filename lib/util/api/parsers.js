const { parse } = require('commander');
const fetch = require('node-fetch');
const printError = require('../util');

const bittrexParser = function(api) {
    const parsedArray = [];
    return fetch(api.url)
        .then(res => res.json())
        .then(data => {
            const jsonData = Object.values(data);
            jsonData.forEach((obj) => {
                let ticker = {};
                ticker.symbol = obj.symbol;
                ticker.baseAsset = obj.symbol.substr(0, obj.symbol.indexOf('-'));
                ticker.quoteAsset = obj.symbol.substr(obj.symbol.indexOf('-') + 1);
                ticker.price = obj.lastTradeRate;
                parsedArray.push(ticker);
            });
            return parsedArray;
        })
        .catch(error => {
            printError(error);
        });
}

const polinexParser = function(api) {
    const parsedArray = [];
    return fetch(api.url)
        .then(res => res.json())
        .then(data => {
            for (let obj in data) {
                let ticker = {};
                ticker.symbol = obj;
                ticker.baseAsset = obj.substr(obj.indexOf('_') + 1);
                ticker.quoteAsset = obj.substr(0, obj.indexOf('_'));
                ticker.price = data[obj].last;
                parsedArray.push(ticker);
            }
            return parsedArray;
        })
        .catch(error => {
            printError(error);
        });
}

const binanceParser = function(api) {
    const fetchSymbols = fetch(api.baseAsset)
        .then(res => res.json())
        .catch(error => {
            printError(error);
        });
    const fetchPrices = fetch(api.url)
        .then(res => res.json())
        .catch(error => {
            printError(error);
        });
    return Promise.all([fetchSymbols, fetchPrices])
        .then((values) => {
            const parsedArray = [];
            const symbolList = values[0];
            const priceList = values[1];
            //console.table(priceList); FOR EASY TEST OF PRICES IN PARSEDARRAY
            for (let obj of symbolList.symbols) {
                let ticker = {};
                ticker.symbol = obj.symbol;
                ticker.baseAsset = obj.baseAsset;
                ticker.quoteAsset = obj.quoteAsset;
                parsedArray.push(ticker);
            }
            for (let priceObj of priceList) {
                for (let symbolObj of parsedArray)
                    if (priceObj.symbol === symbolObj.symbol) {
                        symbolObj.price = priceObj.price;
                    }
            }
            //console.table(parsedArray);
            return parsedArray;
        })
        .catch(error => {
            printError(error);
        });
}



module.exports = { bittrexParser, polinexParser, binanceParser };