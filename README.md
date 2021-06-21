# ticcr

CLI command that currently allow you to fetch crypto currency prices from Polinex and Bittrex. 

Use with flag -c (--currency) to select the currency you wish the crypto displayed in. Use with flag -e (--exchange) to select from which exchange you want the price. 

```bash
$ ticcr btc -c usdt -e bittrex
```

Multiple coins can be looked up at once in multiple currencies. 

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


NOTE: This package is still VERY buggy. 