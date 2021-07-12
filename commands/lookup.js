const fetch = require('node-fetch');
const apiResolver = require('../lib/util/api/apiResolver');
const tableStyle = require('../lib/util/table/tableStyle');
const printError = require('../');
const { dateFromTimeStamp } = require('../lib/util/util');
const apiExchanges = require('../lib/util/api/apiExchanges');
const WebSocket = require('ws');

const doLookup = async function(tickers, currencies, exchanges, list, socket) {
    if (socket) {
        getWebSocketData(tickers, currencies);
    } else {
        if (Array.isArray(exchanges) && exchanges.length) {
            exchanges.forEach(exchange => {
                getDataFromExchange(exchange, tickers, currencies);
            });
        } else {
            getDataFromExchange(exchanges, tickers, currencies);
        }
    }
    if (list) {
        listSupportedExchanges();
    }
}

function getWebSocketData(tickers, currencies) {
    if ((Array.isArray(tickers) && tickers.length) && (Array.isArray(currencies) && currencies.length)) {
        const arrayOfSymbols = createArrayOfSymbols(tickers, currencies);
        arrayOfSymbols.sort((a, b) => (a.symbol > b.symbol) ? 1 : ((b.symbol > a.symbol) ? -1 : 0));
        const tableBorders = 7;
        const tableHeight = (tickers.length * currencies.length) + tableBorders;
        const webSock = new WebSocket("wss://stream.binance.com:9443/ws/!bookTicker");
        webSock.on('message', function incoming(data) {
            const jsonData = JSON.parse(data);
            arrayOfSymbols.forEach(ticker => {
                if (jsonData.s.toLowerCase() === ticker.symbolName.toLowerCase()) {
                    ticker.price = jsonData.a;
                    sortAndBuild("binance", arrayOfSymbols);
                    process.stdout.write("\u001b[" + tableHeight + "A");
                };
            });
        });
    } else {
        console.log('Both ticker and currency must be provided for socket connection to work');
    }
}

function createArrayOfSymbols(tickers, currencies) {
    let arrayOfSymbols = [];
    tickers.forEach(baseAsset => {
        currencies.forEach(quoteAsset => {
            const name = baseAsset.concat(quoteAsset);
            arrayOfSymbols.push({
                symbolName: `${name}`,
                symbol: baseAsset,
                currency: quoteAsset,
                price: ''
            });
        })
    });
    return arrayOfSymbols;
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
        sortAndBuild(api.name, tickerCurrencyList);
    } else {
        const tickerList = mapAndSort(transformedData);
        const tickerCurrencyList = filterOnCurrency(currencies, tickerList);
        sortAndBuild(api.name, tickerCurrencyList);
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

function sortAndBuild(exchange, tickerCurrencyList) {
    sortOnTickerName(tickerCurrencyList);
    buildTable(exchange, tickerCurrencyList);
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
    console.log('\n');
}

const lookup = {
    async tickers(...args) {
        await doLookup(...args);
    }
};

module.exports = lookup;