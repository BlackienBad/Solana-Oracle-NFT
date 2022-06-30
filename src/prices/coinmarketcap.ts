const CoinMarketCap = require('coinmarketcap-api');
require("dotenv").config();
const apiKey = process.env.COINMARKETCAP_KEY;
const client = new CoinMarketCap(apiKey);

export const getEthPrice = async () => {
    try {
        let data = await client.getQuotes({symbol: 'ETH'});
        return data.data.ETH.quote.USD.price;
    } catch(e) {
        console.log(e);
        return null;
    }
}

export const getSolPrice = async () => {
    try {
        let data = await client.getQuotes({symbol: 'SOL'});
        return data.data.SOL.quote.USD.price;
    } catch(e) {
        console.log(e);
        return null;
    }
    
}