# Solana_NFT_Oracle
<br/><br/>
An oracle for solana NFTs, it uses magicEden and Opensea to determine the floor prices of NFTs.
<br/><br/>
it also can use other marketplaces like SMB.
<br/><br/>
this is how it works:
<br/>
-the oracle gets the floor prices from the available market places
<br/>
-the oracle gets the prices of solana and ethereum (the price on opensea is denominated in ethereum and on magiceden in solana), there are a few checks to see if the price got from the providers (mostly coingecko and coinmarketcap) is valid and true
<br/>
-after that the floor price is determined and confronted with the old price saved in the db, if the old price in the bd has more than 2 percentage price difference between the old price and the new price, then the price is changed by 2%, this is done to prevent washtrades
<br/>
-if for some reason some part of the oracle stops working then the old price is used, if the price is 20 minutes or more old then there is a telegram bot message to inform that the oracle is not working
<br/><br/>
src/solana and src/db have been added to the gitignore for security reasons
