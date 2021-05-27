//const express = require("express");
const fetch = require('node-fetch');
//const app = express();

//app.use(express.urlencoded({ extended: true }));
//app.use(express.json());

const doLookup = async function(tickers, currency) {
    console.log('Arguments: ' + tickers, currency);

    //const polinexUrl 'https://poloniex.com/public?command=returnTicker';
    const bittrexUrl = 'https://api.bittrex.com/v3/markets/tickers';
    fetch(bittrexUrl)
        .then(res => res.json())
        .then(data => {
            const myData = Object.values(data);
            //console.table(myData);
            if (Array.isArray(tickers) && tickers.length) {
                tickers.forEach((ticker) => {
                    const priceData = myData.filter((obj) => {
                        return obj.symbol.toLowerCase() === ticker.toLowerCase();
                    }).map(filteredObj => {
                        return {
                            symbol: filteredObj.symbol,
                            price: filteredObj.lastTradeRate
                        }
                    });
                    console.table(priceData);
                });
                // console.log('log');
                // console.log(priceData);
                // console.log('table');

                // console.log('object.entries');
                // Object.entries(priceData).forEach(keyValuePair => { console.dir(...keyValuePair) });
                // console.log('dir');
                // console.dir(priceData);
                // console.log('stringify');
                // console.log(JSON.stringify(priceData));
            } else {
                const priceData = myData.map((obj) => {
                    return {
                        symbol: obj.symbol,
                        price: obj.lastTradeRate
                    }
                });
                console.table(priceData);
            }
        })
        .catch(error => {
            console.error('Oh shoot. Something went wrong with the promise code:');
            console.error(error.message);
        });
};

const lookup = {
    async tickers(...args) {
        await doLookup(...args);
    }
};

module.exports = lookup;