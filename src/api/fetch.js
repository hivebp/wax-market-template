import Long from 'long'
import { useEffect, useState } from 'react'
import config from '../config.json'
import { getFilterParams } from './filter'
import { query } from './query'

export const { atomic_api, api_endpoint } = config

function bytesToHex(bytes) {
    let leHex = ''
    for (const b of bytes) {
        const n = Number(b).toString(16)
        leHex += (n.length === 1 ? '0' : '') + n
    }
    return leHex
}

const charidx = (ch) => {
    const idx = '.12345abcdefghijklmnopqrstuvwxyz'.indexOf(ch)
    if (idx === -1) throw new TypeError(`Invalid character: '${ch}'`)

    return idx
}
export const get = (path) => fetch(`${api_endpoint}/api/${path}`).then((res) => res.json())

export const useFetch = (url, method = 'GET', body = undefined, autofetch = false) => {
    const [state, setState] = useState({
        data: undefined,
        error: undefined,
        loading: false,
        controller: undefined,
    })

    const request = async () => {
        if (state.controller) state.controller.abort()

        const controller = new AbortController()
        setState((state) => ({ ...state, loading: true, controller }))

        try {
            const response = await fetch(url, {
                signal: controller.signal,
                method,
                body: body ? JSON.stringify(body) : undefined,
            })

            const data = await response.json()

            setState({
                data,
                error: undefined,
                loading: false,
                controller: undefined,
            })
        } catch (err) {
            if (err.code === 'ECONNABORTED') return
            setState((state) => ({
                data: state.data,
                error: err.code === 'ECONNABORTED' ? undefined : err,
                loading: false,
            }))
        }

        return controller
    }

    useEffect(() => {
        return () => state.controller?.abort()
    }, [state.controller])

    useEffect(() => {
        if (autofetch) request()
    }, [])

    return { data: state.data, error: state.error, loading: state.loading, fetch: request }
}

export const useGet = (url, data) => useFetch(query(url, data), 'GET', undefined, true)
export const usePost = (url, data) => useFetch(url, 'POST', data, true)

export const post = (url, data) =>
    fetch(url, {
        method: 'post',
        body: JSON.stringify(data),
    }).then((res) => res.json())

export const getCollections = (collections) => {
    const escaped = []
    collections.map((collection) => {
        const a = escape(collection)
        console.log({ a, b: encodeURIComponent(collection), c: encodeURI(collection) })
        escaped.push(a)
    })

    return fetch(
        atomic_api +
            `/atomicassets/v1/collections?page=1&limit=10&order=desc&sort=created&collection_whitelist=${escaped.join(
                ',',
            )}`,
    ).then((res) => res.json())
}

export const getAccountStats = async (user, dropID) => {
    const body = {
        json: true,
        code: 'neftyblocksd',
        scope: user,
        table: 'accstats',
        table_key: '',
        lower_bound: dropID,
        upper_bound: dropID,
        index_position: 1,
        key_type: '',
        limit: 1,
        reverse: false,
        show_payer: false,
    }

    const url = config.api_endpoint + '/v1/chain/get_table_rows'

    const res = await post(url, body)

    if (res && res.status === 200 && res.data.rows.length > 0) {
        return res.data.rows[0]
    }

    return null
}

export const getDropKeys = async (dropId) => {
    const body = {
        code: 'neftyblocksd',
        index_position: 'primary',
        json: 'true',
        key_type: 'i64',
        limit: 1,
        lower_bound: '',
        upper_bound: '',
        reverse: 'true',
        scope: dropId,
        show_payer: 'false',
        table: 'authkeys',
        table_key: '',
    }

    const url = config.api_endpoint + '/v1/chain/get_table_rows'
    const res = await post(url, body)

    let result = null

    if (res && res.status === 200 && res.data && res.data.rows && res.data.rows.length > 0) {
        result = res.data.rows[0]
    }

    return result
}

export const getWhiteList = async (dropId, userName) => {
    const body = {
        code: 'neftyblocksd',
        index_position: 'primary',
        json: 'true',
        key_type: 'i64',
        limit: 1,
        lower_bound: userName,
        upper_bound: userName,
        reverse: 'true',
        scope: dropId,
        show_payer: 'false',
        table: 'whitelists',
        table_key: '',
    }

    const url = config.api_endpoint + '/v1/chain/get_table_rows'
    const res = await post(url, body)

    let result = null

    if (res && res.status === 200 && res.data && res.data.rows && res.data.rows.length > 0) {
        result = res.data.rows[0]
    }

    return result
}

export const getProofOwn = async (dropId) => {
    const body = {
        code: 'neftyblocksd',
        index_position: 'primary',
        json: 'true',
        key_type: 'i64',
        limit: 1,
        lower_bound: dropId,
        upper_bound: dropId,
        reverse: 'true',
        scope: 'neftyblocksd',
        show_payer: 'false',
        table: 'proofown',
        table_key: '',
    }

    const url = config.api_endpoint + '/v1/chain/get_table_rows'
    const res = await post(url, body)

    let result = null

    if (res && res.status === 200 && res.data && res.data.rows && res.data.rows.length > 0) {
        result = res.data.rows[0]
    }

    return result
}

/**
 * Creates a function that fetches the resulting path and returns the json data of the response.
 * @template T
 * @param {(...args: T) => string} pathGenerator
 * @return {(...args: T) => Promise<unknown>}
 */
const createGetter =
    (pathGenerator) =>
    async (...args) => {
        const response = await fetch(`${atomic_api}${pathGenerator(...args)}`)
        return response.json()
    }

export const getSchemas = createGetter((filters) => `/atomicassets/v1/schemas?${getFilterParams(filters)}`)
export const getTemplates = createGetter(
    (filters) => `/atomicassets/v1/templates?has_assets=true${getFilterParams(filters)}`,
)
export const getListings = createGetter((filters) => `/atomicmarket/v1/sales?state=1${getFilterParams(filters)}`)
export const getListing = createGetter((listingId) => `/atomicmarket/v1/sales/${listingId}`)
export const getAuctions = createGetter((filters) => `/atomicmarket/v1/auctions?state=1&${getFilterParams(filters)}`)
export const getWonAuctions = createGetter((filters) => `/atomicmarket/v1/auctions?state=3&${getFilterParams(filters)}`)
export const getBids = createGetter((filters) => `/atomicmarket/v1/auctions?state=1&${getFilterParams(filters)}`)
export const getSales = createGetter((filters) => `/atomicmarket/v1/sales?state=3${getFilterParams(filters)}`)
export const getListingsById = createGetter((asset_id) => `/atomicmarket/v1/sales?&limit=1&asset_id=${asset_id}`)
export const getAuctionsById = createGetter((asset_id) => `/atomicmarket/v1/auctions?&limit=1&asset_id=${asset_id}`)
export const getAssets = createGetter((filters) => `/atomicmarket/v1/assets?${getFilterParams(filters)}`)
export const getTemplate = createGetter(
    (templateId, collectionName) => `/atomicassets/v1/templates/${collectionName}/${templateId}`,
)
export const getAsset = createGetter((assetId) => `/atomicmarket/v1/assets/${assetId}`)
export const getCollection = createGetter((collection_name) => `/atomicassets/v1/collections/${collection_name}`)
export const getSale = createGetter((saleId) => `/atomicmarket/v1/sales/${saleId}`)
export const getAuction = createGetter((auctionId) => `/atomicmarket/v1/auctions/${auctionId}`)

export const useCollections = () => {
    const { data, error, loading, fetch } = usePost(`${api_endpoint}/v1/chain/get_table_rows`, {
        code: 'marketmapper',
        index_position: 'primary',
        json: 'true',
        key_type: 'i64',
        limit: 1,
        reverse: 'false',
        scope: 'marketmapper',
        show_payer: 'false',
        table: 'mappings',
        lower_bound: config.market_name,
        upper_bound: config.market_name,
        table_key: '',
    })
    return { data, error, loading, fetch }
}

export const loadCollections = async () => {
    const body = {
        code: 'marketmapper',
        index_position: 'primary',
        json: 'true',
        key_type: 'i64',
        limit: 1,
        reverse: 'false',
        scope: 'marketmapper',
        show_payer: 'false',
        table: 'mappings',
        lower_bound: config.market_name,
        upper_bound: config.market_name,
        table_key: '',
    }

    const url = config.api_endpoint + '/v1/chain/get_table_rows'

    return post(url, body)
}

export const getCollectionHex = (collection) => {
    if (typeof collection !== 'string') throw new TypeError('name parameter is a required string')

    if (collection.length > 12) throw new TypeError('A name can be up to 12 characters long')

    let bitstr = ''
    for (let i = 0; i <= 12; i++) {
        // process all 64 bits (even if name is short)
        const c = i < collection.length ? charidx(collection[i]) : 0
        const bitlen = i < 12 ? 5 : 4
        let bits = Number(c).toString(2)
        if (bits.length > bitlen) {
            throw new TypeError('Invalid name ' + collection)
        }
        bits = '0'.repeat(bitlen - bits.length) + bits
        bitstr += bits
    }

    const longVal = Long.fromString(bitstr, true, 2)

    return bytesToHex(longVal.toBytes())
}

export const getPacks = async (filters) => {
    console.log(new Error().stack)
    const packs = []

    for (let i = 0; i < config.packs_contracts.length; i++) {
        if (config.packs_contracts[i] === 'neftyblocksp') {
            filters.collections.map(async (collection) => {
                const collectionHex = getCollectionHex(collection)

                const body = {
                    code: 'neftyblocksp',
                    index_position: 2,
                    json: 'true',
                    key_type: 'sha256',
                    limit: 2000,
                    lower_bound: `0000000000000000${collectionHex}00000000000000000000000000000000`,
                    upper_bound: `0000000000000000${collectionHex}ffffffffffffffffffffffffffffffff`,
                    reverse: 'true',
                    scope: 'neftyblocksp',
                    show_payer: 'false',
                    table: 'packs',
                    table_key: '',
                }

                const url = config.api_endpoint + '/v1/chain/get_table_rows'
                const res = await post(url, body)

                if (res && res.status === 200 && res.data && res.data.rows) {
                    res.data.rows.map((pack) => {
                        packs.push({
                            packId: pack.pack_id,
                            unlockTime: pack.unlock_time,
                            templateId: pack.pack_template_id,
                            rollCounter: pack.rollCounter,
                            displayData: JSON.parse(pack.display_data),
                            contract: 'neftyblocksp',
                        })
                        return null
                    })
                }
            })
        }

        if (config.packs_contracts[i] === 'atomicpacksx') {
            let nextKey = '0'

            while (nextKey) {
                const body = {
                    code: 'atomicpacksx',
                    index_position: 'primary',
                    json: 'true',
                    key_type: 'i64',
                    limit: 2000,
                    lower_bound: parseInt(nextKey),
                    upper_bound: parseInt(nextKey) + 10000,
                    reverse: 'false',
                    scope: 'atomicpacksx',
                    show_payer: 'false',
                    table: 'packs',
                    table_key: '',
                }

                const url = config.api_endpoint + '/v1/chain/get_table_rows'
                const res = await post(url, body)

                if (res && res.status === 200 && res.data && res.data.rows) {
                    res.data.rows
                        .filter((pack) => filters.collections.includes(pack.collection_name))
                        .map((pack) => {
                            packs.push({
                                packId: pack.pack_id,
                                unlockTime: pack.unlock_time,
                                templateId: pack.pack_template_id,
                                rollCounter: pack.rollCounter,
                                displayData: JSON.parse(pack.display_data),
                                contract: 'atomicpacksx',
                            })
                            return null
                        })
                    nextKey = res.data.next_key
                } else {
                    nextKey = null
                }
            }
        }
    }

    return packs
}

export const getDrop = async (dropId) => {
    const body = {
        code: config.drops_contract,
        index_position: 'primary',
        json: 'true',
        key_type: 'i64',
        limit: 1,
        lower_bound: dropId,
        upper_bound: dropId,
        reverse: 'true',
        scope: config.drops_contract,
        show_payer: 'false',
        table: 'drops',
        table_key: '',
    }

    const url = config.api_endpoint + '/v1/chain/get_table_rows'
    const res = await post(url, body)

    let result = null

    if (res && res.status === 200 && res.data && res.data.rows) {
        res.data.rows.map((drop) => {
            const displayData = JSON.parse(drop.display_data)

            result = {
                collectionName: drop.collection_name,
                dropId: drop.drop_id,
                accountLimit: drop.account_limit,
                accountLimitCooldown: drop.account_limit_cooldown,
                currentClaimed: drop.current_claimed,
                maxClaimable: drop.max_claimable,
                name: displayData.name,
                listingPrice: drop.listing_price,
                description: displayData.description,
                assetsToMint: drop.assets_to_mint,
                endTime: drop.end_time,
                startTime: drop.start_time,
            }

            return null
        })
    }

    return result
}

export const getDelphiMedian = async () => {
    const body = {
        code: 'delphioracle',
        index_position: 'primary',
        json: 'true',
        key_type: 'i64',
        limit: 1,
        lower_bound: '',
        reverse: 'true',
        scope: 'waxpusd',
        show_payer: 'false',
        table: 'datapoints',
        table_key: '',
        upper_bound: '',
    }

    const url = config.api_endpoint + '/v1/chain/get_table_rows'
    const res = await post(url, body)

    if (res && res.status === 200 && res.data && res.data.rows) {
        const row = res.data.rows[0]

        if (row.median) return row.median
    }

    return null
}

export const getDrops = async (filters) => {
    if (!filters.collections) return []

    const collectionHex = getCollectionHex(filters.collections[0])

    const body = {
        code: config.drops_contract,
        index_position: 2,
        json: 'true',
        key_type: 'sha256',
        limit: 100,
        lower_bound: `0000000000000000${collectionHex}00000000000000000000000000000000`,
        upper_bound: `0000000000000000${collectionHex}ffffffffffffffffffffffffffffffff`,
        reverse: 'true',
        scope: config.drops_contract,
        show_payer: 'false',
        table: 'drops',
        table_key: '',
    }

    const url = config.api_endpoint + '/v1/chain/get_table_rows'
    const res = await post(url, body)

    const drops = []

    if (res && res.status === 200 && res.data && res.data.rows) {
        res.data.rows.map((drop) => {
            const displayData = JSON.parse(drop.display_data)

            drops.push({
                collectionName: drop.collection_name,
                dropId: drop.drop_id,
                accountLimit: drop.account_limit,
                accountLimitCooldown: drop.account_limit_cooldown,
                currentClaimed: drop.current_claimed,
                maxClaimable: drop.max_claimable,
                name: displayData.name,
                authRequired: drop.auth_required,
                listingPrice: drop.listing_price,
                description: displayData.description,
                assetsToMint: drop.assets_to_mint,
                endTime: drop.end_time,
                startTime: drop.start_time,
            })
            return null
        })
    }

    return drops
}

export const getRefundBalance = async (name) => {
    const body = {
        code: 'atomicmarket',
        index_position: 'primary',
        json: 'true',
        key_type: 'i64',
        limit: 1,
        lower_bound: name,
        upper_bound: name,
        reverse: 'false',
        scope: 'atomicmarket',
        show_payer: 'false',
        table: 'balances',
        table_key: '',
    }

    const url = config.api_endpoint + '/v1/chain/get_table_rows'
    return post(url, body)
}

export const getWaxBalance = async (name) => {
    const body = {
        code: 'eosio.token',
        index_position: 'primary',
        json: 'true',
        key_type: 'i64',
        limit: 1,
        reverse: 'false',
        scope: name,
        show_payer: 'false',
        table: 'accounts',
        table_key: '',
    }

    const url = config.api_endpoint + '/v1/chain/get_table_rows'

    return post(url, body)
}
