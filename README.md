# ticcr

CLI command that currently allow you to fetch crypto currency prices from Binance, Polinex and Bittrex. 

## Installation
In order to ensure global access to command install using the -g (global) flag: 
```bash
$ npm i -g ticcr
```

### Usage
The command below gives list of all cryptos from the default exchange. Currently Bittrex. 

```bash
$ ticcr
```

Use with flag -c (--currency) to select the currency you wish the crypto displayed in. 
The following command give a list of all cryptos from the default exchange in usdt. 

```bash
$ ticcr -c usdt
```

Use with flag -e (--exchange) to select from which exchange you want the price. 

```bash
$ ticcr dcr ltc eth -c usdt -e polinex
```

Multiple coins can also be looked up simultaniously in multiple currencies. 

```bash
$ ticcr btc dcr doge dash -c btc usdt -e polinex 
```

The above command should result in a table similar to the one below: 

symbol | price | currency
------ | ----- | --------
BTC | 32152.94876227 | USDT
DASH | 0.00403872 | BTC
DASH | 130.31983853 | USDT
DCR | 0.00326248 | BTC
DOGE | 0.00000678 | BTC
DOGE | 0.21695474 | USDT

It is also possible to lookup multiple prices from multiple exchanges simultaniously.

```bash
$ ticcr dcr ltc eth -c usdt -e binance polinex bittrex
```

Used with the -l (--list) option will provide a log of the supported exchanges.This will be logged prior to the price output. 

```bash
$ ticcr dcr -l
```

NOTE: This package is still VERY buggy. 