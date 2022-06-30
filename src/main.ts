import * as db from './db';
import * as api from './api';
import * as prices from './prices';
import config from './config.json';
import * as utils from './utils';
import * as solana from './solana';
import { PublicKey } from '@solana/web3.js';

const main = async () => {
    
    // Load last eth and sol price in mongo
    const coinPrice = await db.getLastCoinPrice() || {eth_price:0, sol_price:0, timestamp:0};
    // Fetch some price information (eth, sol) we need to convert floors
    let priceData: prices.PriceData = await prices.getPriceData(
        coinPrice.eth_price, coinPrice.sol_price
    );
    // store eth and sol price in mongo
    db.updateCoinPrice(priceData);

    // Iterate each collections that we want to update
    for (let collection of config.collections) {

        let oracle = await db.getLastOraclePrice(collection.name) 
        || {oracle_price:0, timestamp:0};

        // Get the last oracle price, if we don't have one, init an empty one
        // Fetch the floors for this collection
        const floors = {};
        priceData = utils.calculatePriceData(priceData, coinPrice.eth_price, coinPrice.sol_price, coinPrice.timestamp);
        
        // Iterate each provider API we want to use
        for (let apiName of collection.apis) {
            
            // getFloor returns the floor in $USD
            floors[apiName] = await api.getFloor(apiName, collection, priceData);
            // Save the api floor in the DB for later
            if (!utils.isMissing(floors[apiName])) {
                // Save provider price for current API and current Collection
                db.updateProviderPrice(
                    apiName, collection.name, floors[apiName]
                );
            }
 
        }

        // Calculate the real floor
        let floor = utils.calculateFloor(floors, oracle.oracle_price, oracle.timestamp);
        floor = utils.washTradePrevention(floor, oracle.oracle_price);

        console.log(collection.name);
        console.log(floors);
        console.log("floor:", floor);

        // Save oracle price in DB
        db.updateOraclePrice(collection.name, floor);

        // Update oracle on solana
        if ("oracle" in collection) {

            // Solana wallet and lending program
            const payer = solana.utils.getWallet();
            const program = solana.utils.getLendingProgram();
            const floorBN = solana.utils.bn(floor, 6);
            const oraclePublicKey = new PublicKey(collection.oracle);
            solana.utils.safeUpdate(
                 () => solana.lending.updateOracle(program, payer, oraclePublicKey, floorBN),
                collection.name
            );

        }

    }

    console.log("\n\n================= CHECK SAVED DATA =================\n");
    
    // Fetch the last cpom price
    const cp = await db.getLastCoinPrice();
    // Log the price
    console.log(
        "Coin Prices => eth: " + cp['eth_price'] + ", sol: " + cp['sol_price']
    );
    
    // Iterate each collections updated
    for (let collection of config.collections) {
                
        // Iterate each provider API we updated
        for (let apiName of collection.apis) {
            // Fetch the last provider price for current collection and current API
            const price = await db.getLastProviderPrice(
                apiName, collection.name
            );
            // Log the price
            console.log(
                "Collection '" + collection.name 
                + "' for Provider '" + apiName
                + "' has price: " + price.floor
            );
        }

        // Fetch the last oracle price for current collection
        const oracle = await db.getLastOraclePrice(collection.name);
        // Log the price
        console.log(
            "Collection '" + collection.name 
             + "' has oracle: " + oracle.oracle_price
        );
    }
    console.log("\n================= END =================\n\n");
}

main();

