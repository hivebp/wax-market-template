import config from "../../config.json";

export const purchaseDropAction = async (drop, quantity, delphiMedian, amount, activeUser) => {
    const userName = activeUser['accountName'];

    await activeUser.signTransaction({
        actions: [{
            account: 'eosio.token',
            name: 'transfer',
            authorization: [{
                actor: userName,
                permission: activeUser['requestPermission'],
            }],
            data: {
                from: userName,
                to: config.drops_contract,
                quantity: `${quantity.toFixed(8)} WAX`,
                memo: 'deposit'
            },
        }, {
            account: config.drops_contract,
            name: 'claimdrop',
            authorization: [{
                actor: userName,
                permission: activeUser['requestPermission'],
            }],
            data: {
                referrer: config.market_name,
                drop_id: drop.dropId,
                country: 'none',
                intended_delphi_median: delphiMedian ? delphiMedian : 0,
                amount: amount,
                claimer: userName
            }
        }]
    }, {
        expireSeconds: 300, blocksBehind: 0,
    });
};

export const claimDropAction = async (drop, amount, activeUser) => {
    const userName = activeUser['accountName'];

    await activeUser.signTransaction({
        actions: [{
            account: config.drops_contract,
            name: 'claimdrop',
            authorization: [{
                actor: userName,
                permission: activeUser['requestPermission'],
            }],
            data: {
                referrer: config.market_name,
                drop_id: drop.dropId,
                country: 'none',
                intended_delphi_median: 0,
                amount: amount,
                claimer: userName
            }
        }]
    }, {
        expireSeconds: 300, blocksBehind: 0,
    });
};

export const cancelSaleAction = async (saleId, activeUser) => {
    const userName = activeUser['accountName'];

    await activeUser.signTransaction({
        actions: [{
            account: 'atomicmarket',
            name: 'cancelsale',
            authorization: [{
                actor: userName,
                permission: activeUser['requestPermission'],
            }],
            data: {
                sale_id: saleId
            },
        }]
    }, {
        expireSeconds: 300, blocksBehind: 0,
    });
};

export const cancelAuctionAction = async (auctionId, activeUser) => {
    const userName = activeUser['accountName'];

    await activeUser.signTransaction({
        actions: [{
            account: 'atomicmarket',
            name: 'cancelauct',
            authorization: [{
                actor: userName,
                permission: activeUser['requestPermission'],
            }],
            data: {
                auction_id: auctionId
            },
        }]
    }, {
        expireSeconds: 300, blocksBehind: 0,
    });
};

export const withdrawAction = async (quantity, activeUser) => {
    const userName = activeUser['accountName'];

    await activeUser.signTransaction({
        actions: [
            {
                account: 'atomicmarket',
                name: 'withdraw',
                authorization: [{
                    actor: userName,
                    permission: activeUser['requestPermission'],
                }],
                data: {
                    owner: userName,
                    token_to_withdraw: `${quantity.toFixed(8)} WAX`
                },
            }]
    }, {
        expireSeconds: 300, blocksBehind: 0,
    });
};

export const announceAuctionAction = async (assetId, days, hours, minutes, quantity, activeUser) => {
    const userName = activeUser['accountName'];

    await activeUser.signTransaction({
        actions: [{
            account: 'atomicmarket',
            name: 'announceauct',
            authorization: [{
                actor: userName,
                permission: activeUser['requestPermission'],
            }],
            data: {
                duration: (days ? parseInt(days) * 24 * 60 * 60 : 0) + (hours ? parseInt(hours) * 60 * 60 : 0) + (minutes ? parseInt(minutes) * 60 : 0),
                starting_bid: quantity.toFixed(8)+' WAX',
                seller: userName,
                maker_marketplace: 'nft.hive',
                asset_ids: [assetId]
            },
        }, {
            account: 'atomicassets',
            name: 'transfer',
            authorization: [{
                actor: userName,
                permission: activeUser['requestPermission'],
            }],
            data: {
                from: userName,
                memo: 'auction',
                asset_ids: [assetId],
                to: 'atomicmarket'
            },
        }]
    }, {
        expireSeconds: 300, blocksBehind: 0,
    });
};

export const bidAction = async (auctionId, quantity, activeUser) => {
    const userName = activeUser['accountName'];

    await activeUser.signTransaction({
        actions: [{
            account: 'eosio.token',
            name: 'transfer',
            authorization: [{
                actor: userName,
                permission: activeUser['requestPermission'],
            }],
            data: {
                from: userName,
                to: 'atomicmarket',
                memo: 'deposit',
                quantity: `${quantity.toFixed(8)} WAX`,
            },
        }, {
            account: 'atomicmarket',
            name: 'auctionbid',
            authorization: [{
                actor: userName,
                permission: activeUser['requestPermission'],
            }],
            data: {
                auction_id: auctionId,
                bid: `${quantity.toFixed(8)} WAX`,
                bidder: userName,
                taker_marketplace: config.market_name
            },
        }]
    }, {
        expireSeconds: 300, blocksBehind: 0,
    });
};

export const purchaseSaleAction = async (saleId, tokenSymbol, median, quantity, activeUser) => {
    const userName = activeUser['accountName'];

    await activeUser.signTransaction({
        actions: [{
            account: 'eosio.token',
            name: 'transfer',
            authorization: [{
                actor: userName,
                permission: activeUser['requestPermission'],
            }],
            data: {
                from: userName,
                to: 'atomicmarket',
                quantity: `${quantity.toFixed(8)} WAX`,
                memo: 'deposit'
            },
        }, {
            account: 'atomicmarket',
            name: 'purchasesale',
            authorization: [{
                actor: userName,
                permission: activeUser['requestPermission'],
            }],
            data: {
                buyer: userName,
                sale_id: saleId,
                taker_marketplace: config.market_name,
                intended_delphi_median: tokenSymbol === 'USD' && median ? median : 0
            }
        }]
    }, {
        expireSeconds: 300, blocksBehind: 0,
    });
};

export const announceSaleAction = async (assetId, quantity, activeUser) => {
    const userName = activeUser['accountName'];

    await activeUser.signTransaction({
        actions: [{
            account: 'atomicmarket',
            name: 'announcesale',
            authorization: [{
                actor: userName,
                permission: activeUser['requestPermission'],
            }],
            data: {
                seller: userName,
                maker_marketplace: config.market_name,
                settlement_symbol: '8,WAX',
                asset_ids: [assetId],
                listing_price: quantity.toFixed(8)+' WAX'
            },
        }, {
            account: 'atomicassets',
            name: 'createoffer',
            authorization: [{
                actor: userName,
                permission: activeUser['requestPermission'],
            }],
            data: {
                sender: userName,
                recipient: 'atomicmarket',
                sender_asset_ids: [assetId],
                recipient_asset_ids: [],
                memo: 'sale'
            },
        }]
    }, {
        expireSeconds: 300, blocksBehind: 0,
    });
};

export const transferAction = async (assetId, memo, receiver, activeUser) => {
    const userName = activeUser['accountName'];

    await activeUser.signTransaction({
        actions: [{
            account: 'atomicassets',
            name: 'transfer',
            authorization: [{
                actor: userName,
                permission: activeUser['requestPermission'],
            }],
            data: {
                from: userName,
                memo: memo,
                asset_ids: [assetId],
                to: receiver
            },
        }]
    }, {
        expireSeconds: 300, blocksBehind: 0,
    });
};