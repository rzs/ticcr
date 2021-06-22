// List the supported exchanges

const exchanges = [{
        name: "polinex",
        url: "https://poloniex.com/public?command=returnTicker"
    },
    {
        name: "bittrex",
        url: "https://api.bittrex.com/v3/markets/tickers"
    }
];

module.exports = { exchanges }