import fetch from "node-fetch";
import { PriceData } from "../prices";
import * as telegram from "../telegram/bot";

export const getFloor = async (collection: string, priceData: PriceData): Promise<number> => {
    try {
        const res = await fetch(`https://api.opensea.io/api/v1/collection/${collection}/stats`);
        const data = await res.json();
        return parseFloat(data.stats.floor_price) * priceData.eth;
    } catch(e) {
        console.log("opensea api error", e);
        telegram.logError("opensea", e);
        return null;
    }
    
}