import * as opensea from './opensea';
import * as magiceden from './magiceden';
import * as smb from './smb';
import { PriceData } from '../prices';

export const getFloor = (api: string, collection: any, priceData: PriceData): Promise<number | null> =>  {
    if (api === "magiceden") return magiceden.getFloor(collection.magiceden_id, priceData);
    if (api === "opensea") return opensea.getFloor(collection.opensea_id, priceData);
    if (api === "smb") return smb.getFloor(priceData);
    return null;
}