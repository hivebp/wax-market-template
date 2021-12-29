import axios from "axios";

import config from "../../config.json";
import Long from 'long';

export const atomic_api = config.atomic_api;

export const api_endpoint = config.api_endpoint;

export const get = (path) =>
    fetch(`${api_endpoint}/api/${path}`).then(
        res => res.json());

export const getCollections = (collections) => {
    const escaped = [];
    collections.map(collection => escaped.push(escape(collection)));

    return fetch(
        atomic_api +
        `/atomicassets/v1/collections?page=1&limit=10&order=desc&sort=created&collection_whitelist=${escaped.join(',')}`
    ).then(
        res => res.json());
};

export const GetPrices = (asset_id) => {
    return fetch(atomic_api + `/atomicmarket/v1/prices/assets?ids=${asset_id}`).then(
        res => res.json());
}

const getFilterParams = (filters) => {
    let filterStr = '';

    const {
        collections, page, bundles, user, schema, name, limit, orderDir, sortBy, asset_id, rarity, variant, seller, ids,
        bidder, winner, template_ids, template_id
    } = filters;

    if (collections)
        filterStr += `&collection_whitelist=${collections.join(',')}`;

    if (ids)
        filterStr += `&ids=${ids.join(',')}`;

    if (template_ids)
        filterStr += `&template_whitelist=${template_ids.join(',')}`;

    if (template_id)
        filterStr += `&template_id=${template_id}`;

    if (page)
        filterStr += `&page=${page}`;

    if (schema)
        filterStr += `&schema_name=${schema}`;

    if (user)
        filterStr += `&owner=${user}`;

    if (seller)
        filterStr += `&seller=${seller}`;

    if (bidder)
        filterStr += `&bidder=${bidder}`;

    if (winner)
        filterStr += `&participant=${winner}`;

    if (name)
        filterStr += `&match=${escape(name)}`;

    if (rarity)
        filterStr += `&template_data.rarity=${rarity}`;

    if (variant)
        filterStr += `&template_data.variant=${variant}`;
    
    if (bundles)
        filterStr += `&min_assets=2`;

    if (limit)
        filterStr += `&limit=${limit}`;

    if (orderDir)
        filterStr += `&order=${orderDir}`;

    if (sortBy)
        filterStr += `&sort=${sortBy}`;

    if (asset_id)
        filterStr += `&asset_id=${asset_id}`;

    return filterStr;
};

export const getSchemas = (filters) => {
    return fetch(
        atomic_api + `/atomicassets/v1/schemas?${getFilterParams(filters)}`).then(
        res => res.json());
};

export const getTemplates = (filters) => {
    return fetch(
        atomic_api + `/atomicassets/v1/templates?has_assets=true${getFilterParams(filters)}`
    ).then(res => res.json());
};

export const getListings = (filters) => {
    return fetch(
        atomic_api + `/atomicmarket/v1/sales?state=1${getFilterParams(filters)}`).then(
        res => res.json());
};

export const getListing = (listingId) => {
    return fetch(
        atomic_api + `/atomicmarket/v1/sales/${listingId}`).then(
        res => res.json());
};

export const getAuctions = (filters) => {
    return fetch(
        atomic_api + `/atomicmarket/v1/auctions?state=1&${getFilterParams(filters)}`).then(
        res => res.json());
};

export const getWonAuctions = (filters) => {
    return fetch(
        atomic_api + `/atomicmarket/v1/auctions?state=3&${getFilterParams(filters)}`).then(
        res => res.json());
};

export const getBids = (filters) => {
    return fetch(
        atomic_api + `/atomicmarket/v1/auctions?state=1&${getFilterParams(filters)}`).then(
        res => res.json());
};

export const getSales = (filters) => {
    return fetch(
        atomic_api + `/atomicmarket/v1/sales?state=3${getFilterParams(filters)}`).then(
        res => res.json());
};

export const getListingsById = (asset_id) => {
    return fetch(
        atomic_api + `/atomicmarket/v1/sales?&limit=1&asset_id=${asset_id}`).then(
        res => res.json());
};

export const getAuctionsById = (asset_id) => {
    return fetch(
        atomic_api + `/atomicmarket/v1/auctions?&limit=1&asset_id=${asset_id}`).then(
        res => res.json());
};

export const getAssets = (filters) => {
    return fetch(
        atomic_api + `/atomicmarket/v1/assets?${getFilterParams(filters)}`).then(res => res.json());
};

export const getTemplate = (templateId, collectionName) => {
    return fetch(
        atomic_api + `/atomicassets/v1/templates/${collectionName}/${templateId}`).then(res => res.json());
};

export const getAsset = (assetId) => {
    return fetch(
        atomic_api + `/atomicmarket/v1/assets/${assetId}`).then(res => res.json());
};

export const getCollection = (collection_name) => {
    return fetch(
        atomic_api + `/atomicassets/v1/collections/${collection_name}`).then(res => res.json());
};

export const getSale = (saleId) => {
    return fetch(
        atomic_api + `/atomicmarket/v1/sales/${saleId}`).then(res => res.json());
};

export const getAuction = (auctionId) => {
    return fetch(
        atomic_api + `/atomicmarket/v1/auctions/${auctionId}`).then(res => res.json());
};

const post = (url, data) =>
    axios({
        method: 'post',
        url: url,
        data: data
    }).then(res => res);

export const loadCollections = async () => {
    const body = {
        'code': 'marketmapper',
        'index_position': 'primary',
        'json': 'true',
        'key_type': 'i64',
        'limit': 1,
        'reverse': 'false',
        'scope': 'marketmapper',
        'show_payer': 'false',
        'table': 'mappings',
        'lower_bound': config.market_name,
        'upper_bound': config.market_name,
        'table_key': ''
    };

    const url = config.api_endpoint + '/v1/chain/get_table_rows';

    return post(url, body);
}

function bytesToHex(bytes) {
    let leHex = '';
    for (const b of bytes) {
        const n = Number(b).toString(16);
        leHex += (n.length === 1 ? '0' : '') + n;
    }
    return leHex;
}

const charidx = ch => {
    const idx = '.12345abcdefghijklmnopqrstuvwxyz'.indexOf(ch);
    if (idx === -1) throw new TypeError(`Invalid character: '${ch}'`);

    return idx;
};

function getCollectionHex(collection) {
    if (typeof collection !== 'string')
        throw new TypeError('name parameter is a required string');

    if (collection.length > 12)
        throw new TypeError('A name can be up to 12 characters long');

    let bitstr = '';
    for (let i = 0; i <= 12; i++) {
        // process all 64 bits (even if name is short)
        const c = i < collection.length ? charidx(collection[i]) : 0;
        const bitlen = i < 12 ? 5 : 4;
        let bits = Number(c).toString(2);
        if (bits.length > bitlen) {
            throw new TypeError('Invalid name ' + collection);
        }
        bits = '0'.repeat(bitlen - bits.length) + bits;
        bitstr += bits;
    }

    const longVal = Long.fromString(bitstr, true, 2);

    return bytesToHex(longVal.toBytes());
}

export const getPacks = async (filters) => {
    const packs = [];

    for (let i = 0; i < config.packs_contracts.length; i++) {
        if (config.packs_contracts[i] === 'neftyblocksp') {
            filters.collections.map(async (collection) => {
                const collectionHex = getCollectionHex(collection);

                const body = {
                    'code': 'neftyblocksp',
                    'index_position': 2,
                    'json': 'true',
                    'key_type': 'sha256',
                    'limit': 2000,
                    'lower_bound': `0000000000000000${collectionHex}00000000000000000000000000000000`,
                    'upper_bound': `0000000000000000${collectionHex}ffffffffffffffffffffffffffffffff`,
                    'reverse': 'true',
                    'scope': 'neftyblocksp',
                    'show_payer': 'false',
                    'table': 'packs',
                    'table_key': ''
                };

                const url = config.api_endpoint + '/v1/chain/get_table_rows';
                const res = await post(url, body);

                if (res && res.status === 200 && res.data && res.data.rows) {
                    res.data.rows.map(pack => {
                        packs.push({
                            'packId': pack.pack_id,
                            'unlockTime': pack.unlock_time,
                            'templateId': pack.pack_template_id,
                            'rollCounter': pack.rollCounter,
                            'displayData': JSON.parse(pack.display_data),
                            'contract': 'neftyblocksp'
                        });
                        return null;
                    });
                }
            })
        }

        if (config.packs_contracts[i] === 'atomicpacksx') {
            let nextKey = "0";

            while (nextKey) {
                const body = {
                    'code': 'atomicpacksx',
                    'index_position': 'primary',
                    'json': 'true',
                    'key_type': 'i64',
                    'limit': 2000,
                    'lower_bound': parseInt(nextKey),
                    'upper_bound': parseInt(nextKey) + 10000,
                    'reverse': 'false',
                    'scope': 'atomicpacksx',
                    'show_payer': 'false',
                    'table': 'packs',
                    'table_key': ''
                };

                const url = config.api_endpoint + '/v1/chain/get_table_rows';
                const res = await post(url, body);

                if (res && res.status === 200 && res.data && res.data.rows) {
                    res.data.rows.filter(pack => filters.collections.includes(pack.collection_name)).map(pack => {
                        packs.push({
                            'packId': pack.pack_id,
                            'unlockTime': pack.unlock_time,
                            'templateId': pack.pack_template_id,
                            'rollCounter': pack.rollCounter,
                            'displayData': JSON.parse(pack.display_data),
                            'contract': 'atomicpacksx'
                        });
                        return null;
                    });
                    nextKey = res.data.next_key;
                } else {
                    nextKey = null;
                }
            }
        }
    }

    return packs;
};

export const getDrop = async (dropId) => {
    const body = {
        'code': config.drops_contract,
        'index_position': 'primary',
        'json': 'true',
        'key_type': 'i64',
        'limit': 1,
        'lower_bound': dropId,
        'upper_bound': dropId,
        'reverse': 'true',
        'scope': config.drops_contract,
        'show_payer': 'false',
        'table': 'drops',
        'table_key': ''
    };

    const url = config.api_endpoint + '/v1/chain/get_table_rows';
    const res = await post(url, body);

    let result = null;

    if (res && res.status === 200 && res.data && res.data.rows) {
        res.data.rows.map(drop => {
            const displayData = JSON.parse(drop.display_data);

            result = {
                'collectionName': drop.collection_name,
                'dropId': drop.drop_id,
                'accountLimit': drop.account_limit,
                'accountLimitCooldown': drop.account_limit_cooldown,
                'currentClaimed': drop.current_claimed,
                'maxClaimable': drop.max_claimable,
                'name': displayData.name,
                'listingPrice': drop.listing_price,
                'description': displayData.description,
                'assetsToMint': drop.assets_to_mint,
                'endTime': drop.end_time,
                'startTime': drop.start_time
            };

            return null;
        });
    }

    return result;
};

export const getDelphiMedian = async () => {
    const body = {
        'code': 'delphioracle',
        'index_position': 'primary',
        'json': 'true',
        'key_type': 'i64',
        'limit': 1,
        'lower_bound': '',
        'reverse': 'true',
        'scope': 'waxpusd',
        'show_payer': 'false',
        'table': 'datapoints',
        'table_key': '',
        'upper_bound': ''
    };

    const url = config.api_endpoint + '/v1/chain/get_table_rows';
    const res = await post(url, body);

    if (res && res.status === 200 && res.data && res.data.rows) {
        const row = res.data.rows[0];

        if (row.median)
            return row.median;
    }

    return null;
};

export const getDrops = async (filters) => {
    if (!filters.collections)
        return [];

    const collectionHex = getCollectionHex(filters.collections[0]);

    const body = {
        'code': config.drops_contract,
        'index_position': 2,
        'json': 'true',
        'key_type': 'sha256',
        'limit': 100,
        'lower_bound': `0000000000000000${collectionHex}00000000000000000000000000000000`,
        'upper_bound': `0000000000000000${collectionHex}ffffffffffffffffffffffffffffffff`,
        'reverse': 'true',
        'scope': config.drops_contract,
        'show_payer': 'false',
        'table': 'drops',
        'table_key': ''
    };

    const url = config.api_endpoint + '/v1/chain/get_table_rows';
    const res = await post(url, body);

    const drops = [];

    if (res && res.status === 200 && res.data && res.data.rows) {
        res.data.rows.map(drop => {
            const displayData = JSON.parse(drop.display_data);

            drops.push({
                'collectionName': drop.collection_name,
                'dropId': drop.drop_id,
                'accountLimit': drop.account_limit,
                'accountLimitCooldown': drop.account_limit_cooldown,
                'currentClaimed': drop.current_claimed,
                'maxClaimable': drop.max_claimable,
                'name': displayData.name,
                'listingPrice': drop.listing_price,
                'description': displayData.description,
                'assetsToMint': drop.assets_to_mint,
                'endTime': drop.end_time,
                'startTime': drop.start_time
            });
            return null;
        });
    }

    return drops;
};

export const getRefundBalance = async (name) => {
    const body = {
        'code': 'atomicmarket',
        'index_position': 'primary',
        'json': 'true',
        'key_type': 'i64',
        'limit': 1,
        'lower_bound': name,
        'upper_bound': name,
        'reverse': 'false',
        'scope': 'atomicmarket',
        'show_payer': 'false',
        'table': 'balances',
        'table_key': ''
    };

    const url = config.api_endpoint + '/v1/chain/get_table_rows';
    return post(url, body);
};

export const getWaxBalance = async (name) => {
    const body = {
        'code': 'eosio.token',
        'index_position': 'primary',
        'json': 'true',
        'key_type': 'i64',
        'limit': 1,
        'reverse': 'false',
        'scope': name,
        'show_payer': 'false',
        'table': 'accounts',
        'table_key': ''
    };

    const url = config.api_endpoint + '/v1/chain/get_table_rows';

    return post(url, body);
};
