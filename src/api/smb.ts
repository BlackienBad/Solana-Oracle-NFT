import fetch from "node-fetch";
import { PriceData, LAMPORTS_PER_SOL } from "../prices";
import * as telegram from "../telegram/bot";

export const getFloor = async (priceData: PriceData): Promise<number> => {
    try {
        const res = await fetch("https://market.solanamonkey.business/api/collection");
        const data = await res.json();
        return (parseFloat(data.floorPrice) / LAMPORTS_PER_SOL) * priceData.sol;
    } catch(e) {
        console.log("smb api error", e);
        telegram.logError("smb", e);
        return null;
    }
}