// List the supported exchanges

const exchanges = [{
        name: "polinex",
        url: "https://poloniex.com/public?command=returnTicker"
    },
    {
        name: "bittrex",
        url: "https://api.bittrex.com/v3/markets/tickers"
    },
    {
        name: "binance",
        url: "https://api.binance.com/api/v3/ticker/price",
        baseAsset: "https://api.binance.com/api/v3/exchangeInfo"
    }
];

module.exports = { exchanges }