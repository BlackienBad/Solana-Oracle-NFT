import * as cg from './coingecko';
import * as cm from './coinmarketcap';
import * as cc from './cryptocompare';
import * as utils from '../utils';
import * as telegram from "../telegram/bot";

export const LAMPORTS_PER_SOL = 1_000_000_000;

export interface PriceData {
    eth: number;
    sol: number;
}

export const getPriceData = async (ethPrice: number, solPrice: number): Promise<PriceData> => {
    cc.getEthPrice();
    cc.getSolPrice();
    let prices = await Promise.all([eth(ethPrice), sol(solPrice)]);
    return { eth: prices[0], sol: prices[1] };
}

export const eth = async (oraclePrice: number): Promise<number> => {

    // Call apis in parallel
    let ethPrices = await Promise.all([
        cm.getEthPrice(),
        cg.getEthPrice()
    ]);

    // Remove not-number values
    let filtered = ethPrices.filter(Number);
    let average = filtered.reduce((a, b) => a + b, 0) / filtered.length;

    if(utils.percentageDifference(average, oraclePrice) > 5 && oraclePrice !== 0){
        telegram.logError("Too much eth price difference", "The new eth price average is: " + average + " the old eth price average is: " + oraclePrice);
        return oraclePrice >= average ? oraclePrice - (oraclePrice * 0.01) : oraclePrice + (oraclePrice * 0.01);
    }
    return average;

}

export const sol = async (oraclePrice: number ): Promise<number> => {
    let ethPrices = await Promise.all([
        cm.getSolPrice(),
        cg.getSolPrice()
    ]);
    let filtered = ethPrices.filter(Number);
    let average = filtered.reduce((a, b) => a + b, 0) / filtered.length;

    if(utils.percentageDifference(average, oraclePrice) > 5 && oraclePrice !== 0){
        telegram.logError("Too much sol price difference", "The new eth price average is: " + average + " the old eth price average is: " + oraclePrice);
        return oraclePrice >= average ? oraclePrice - (oraclePrice * 0.01) : oraclePrice + (oraclePrice * 0.01);
    }
    return average;
}