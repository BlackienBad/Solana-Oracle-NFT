import fetch from "node-fetch";
import { PriceData, LAMPORTS_PER_SOL } from "../prices";
import * as telegram from "../telegram/bot";

export const getFloor = async (collection: string, priceData: PriceData): Promise<number> => {
    try {
        const res = await fetch(`https://api-mainnet.magiceden.dev/v2/collections/${collection}/stats`);
        const data = await res.json();
        return (parseFloat(data.floorPrice) / LAMPORTS_PER_SOL) * priceData.sol;
    } catch(e) {
        console.log("magiceden api error", e);
        telegram.logError("magiceden", e);
        return null;
    }
    
}