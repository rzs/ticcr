//const express = require("express");
const fetch = require('node-fetch');
//const app = express();

//app.use(express.urlencoded({ extended: true }));
//app.use(express.json());

const doLookup = async function(tickers) {
    console.log(tickers);

    const baseUrl = 'https://fapi.binance.com/fapi/v1/exchangeInfo';
    fetch(baseUrl)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            const priceData = Object.values(data);
            console.log(priceData);
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