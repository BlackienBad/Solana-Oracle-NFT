global.fetch = require('node-fetch')
const cc = require('cryptocompare')
require("dotenv").config();
cc.setApiKey(process.env.COINCOMPARE_KEY);

export const getEthPrice = async () =>{
    cc.price('ETH', ['USD']).then(prices =>{
        console.log("eth:", prices.USD)
    })
}

export const getSolPrice = async () =>{
    cc.price('SOL', ['USD']).then(prices =>{
        console.log("sol:", prices.USD)
    })
}
