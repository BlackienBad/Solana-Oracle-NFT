const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

export const getEthPrice = async () => {
    try {
        let data = await CoinGeckoClient.coins.fetch("ethereum");
        for(let ticker of data.data.tickers){
            if(ticker.target === "USD") return ticker.last 
        }
        return null
    } catch(e) {
        console.log(e);
        return null;
    }   
}

export const getSolPrice = async () => {
    try {
        let data = await CoinGeckoClient.coins.fetch("solana");
        for(let ticker of data.data.tickers){
            if(ticker.target === "USD") return ticker.last 
        }
        return null
    } catch(e) {
        console.log(e);
        return null;
    }
}