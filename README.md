# WAX Market Template

The WAX Market Template is an open source, full market demo application based on the [Atomic API](https://wax.api.atomicassets.io/docs/#)  and WAX APIs. It covers market listings and auctions on the [atomicmarket](https://wax.bloks.io/account/atomicmarket) contract and drops on the [neftyblocksd](https://wax.bloks.io/account/neftyblocksd) contract. It's designed to pre-filer one or multiple collections.

## Prerequisites
- Register your market name at the atomicmarket contract by executing the [regmarket](https://wax.bloks.io/account/atomicmarket?loadContract=true&tab=Actions&account=atomicmarket&scope=atomicmarket&limit=100&action=regmarket) action. The wallet with which your register the name, will be the one you can use to [withdraw](https://wax.bloks.io/account/atomicmarket?loadContract=true&tab=Actions&account=atomicmarket&scope=atomicmarket&limit=100&action=withdraw) market fees later. Choose a name that is exactly 12 characters long or the name of the account you're using to register the market.
- After you registerd the market, use the [marketmapper](https://wax.bloks.io/account/marketmapper) contract to add collections. Execute the [addcol](https://wax.bloks.io/account/marketmapper?loadContract=true&tab=Actions&account=marketmapper&scope=marketmapper&limit=100&action=addcol) action with the name of your market and the collection that you want to support. Execute this command multiple times, if you want to add more than one collection.

## Getting started
- Set up a webserver and install [Node](https://nodejs.org/en/download/) and [Yarn](https://classic.yarnpkg.com/en/docs/install/#debian-stable).
- Get this repository by running `git@github.com:hivebp/wax-market-template.git`
- Go into the directory: `cd wax-market-template`
- Run `yarn install`
- Run `yarn build`
- Assuming everything worked correctly, you can start a development server by executing `yarn dev`. Start the webserver in production by running `node server.js`

## Configuring your market

Out of the box, the market uses a default WAX layout with default WAX collections. Edit /src/config.json to customize your market first.
- **ipfs**: Choose the IPFS server for your media files
- **atomic_api**: Choose an Atomic API endpoint to use: [Source](https://tools.ledgerwise.io/) -> atomic.
- **market_name**: Enter the market name that you have registered above
- **market_url**: Enter the domain that you have registered or are planning to use for your market
- **default_collection**: Enter a fallback collection, for API outages. This would be one of the collections that you have added to the marketmapper contract. 
- **api_endpoint**:  Choose a WAX API to sign transactions and get contract information:  [Source](https://tools.ledgerwise.io/) -> api.
**limit**: Setup a limit of results per page (depending on your layout and the performance that works for you).  
**drops_contract**: If your collection has drops, enter the drop contract to load from. Eg neftyblocksd
**packs_contract**: If your collection has packs, enter the pack contract to load from. Eg atomicpacksx
**telegram_link**: Enter a Telegram Link for the Footer
**discord_link**: Enter a Discord Link for the Footer
**twitter_link**: Enter a Twitter Link for the Footer
**instagram_link**: Enter an Instagram Link for the Footer
**market_title**: Enter a Title for your Market that is displayed in the Browser
**market_description**: Enter a Description for your Market
**market_image**: Paste an image into the /public folder and link it here using /filename.png. This image will be the default image used when you share your market links.

## Styling
The main Styling options can be found in /tailwind.config.js. Edit this file to change the font, colors, basic dimensions etc. The rest of the application uses [Tailwindcss](https://tailwindcss.com/) inside the class files and can be edited there.

## Demo
Visit [waxdummymarket.com](https://waxdummymarket.com)