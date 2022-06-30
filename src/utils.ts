import * as telegram from "./telegram/bot";
import * as prices from './prices';

export const isMissing = (value: any): boolean => {
    return value === null || value === undefined || value === 0 || Number.isNaN(value);
} 

export const calculatePriceData = (priceData: prices.PriceData, price_eth: number, price_sol: number, timestamp: string): prices.PriceData => {
    for(let price of Object.values(priceData)){
        if(isMissing(price)){
            if((new Date().getTime() - new Date(timestamp).getTime()) > 3600000){
                telegram.logError("The price of eth and sol are too old", "The old price is: eth =" + price_eth + " and sol =" + price_sol + " and has not been updated for atleast 60 minutes.");
            }
            return {eth: price_eth, sol: price_sol};
        }
    }
    return priceData;
}

export const calculateFloor = (floors: any, lowestFloorOld: number, timestamp: string): number => {
    for(let price of Object.values(floors)){
        if(isMissing(price)){
            if((new Date().getTime() - new Date(timestamp).getTime()) > 1200000){
                telegram.logError("Price too old", "The old price is " + lowestFloorOld + " and has not been updated for atleast 20 minutes.");
            } 
            return lowestFloorOld;
        }
    }
    return Math.min(...Object.values(floors) as Array<number>);
}

export const washTradePrevention = (lowestFloor: number, lowestFloorOld: number):number => {
    if (Math.round(percentageDifference(lowestFloor, lowestFloorOld)) <= 2 || lowestFloorOld === 0) {
        return lowestFloor;
    } else if (lowestFloor <= lowestFloorOld) {
        return lowestFloorOld * 0.98;
    } else {
        return lowestFloorOld * 1.02;
    }
}

export const percentageDifference = (a: number, b: number): number => {
    return 100 * Math.abs(b - a) / a;
}
