import { useEffect, useState } from 'react'
import config from '../config.json'
import { getCollectionHex } from './fetch_utils'
import { filter } from './filter'
import { query } from './query'

export const { atomic_api, api_endpoint, packs_contracts, default_collection } = config

export const get = (url, parms) => fetch(query(url, parms)).then((res) => res.json())

export const post = (url, data) =>
    fetch(url, {
        method: 'post',
        body: JSON.stringify(data),
    }).then((res) => res.json())

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

/**
 * @param {any} result
 * @returns {any}
 */
const firstRow = (result) => result?.rows?.[0] || null
/**
 * @param {any} result
 * @returns {any[]}
 */
const allRows = (result) => result?.rows || []

/**
 * @template T
 * @template Result
 * @param {string} url
 * @param {(...args: T) => any} dataGenerator
 * @param {(result: any) => Result} map
 * @return {(...args: T) => Promise<Result>}
 */
const createTableGetter =
    (dataGenerator, mapFn) =>
    async (...args) =>
        mapFn(await post(`${api_endpoint}/v1/chain/get_table_rows`, dataGenerator(...args)))

/**
 * Creates a function that fetches the resulting path and returns the json data of the response.
 * @template T
 * @param {(...args: T) => string} pathGenerator
 * @return {(...args: T) => Promise<unknown>}
 */
const createGetter =
    (pathGenerator) =>
    async (...args) =>
        get(`${atomic_api}${pathGenerator(...args)}`)

export const getSchemas = createGetter((filters) => `/atomicassets/v1/schemas?${filter(filters)}`)
export const getTemplates = createGetter((filters) => `/atomicassets/v1/templates?has_assets=true${filter(filters)}`)
export const getListings = createGetter((filters) => `/atomicmarket/v1/sales?state=1${filter(filters)}`)
export const getListing = createGetter((listingId) => `/atomicmarket/v1/sales/${listingId}`)
export const getAuctions = createGetter((filters) => `/atomicmarket/v1/auctions?state=1&${filter(filters)}`)
export const getWonAuctions = createGetter((filters) => `/atomicmarket/v1/auctions?state=3&${filter(filters)}`)
export const getBids = createGetter((filters) => `/atomicmarket/v1/auctions?state=1&${filter(filters)}`)
export const getSales = createGetter((filters) => `/atomicmarket/v1/sales?state=3${filter(filters)}`)
export const getListingsById = createGetter((asset_id) => `/atomicmarket/v1/sales?&limit=1&asset_id=${asset_id}`)
export const getAuctionsById = createGetter((asset_id) => `/atomicmarket/v1/auctions?&limit=1&asset_id=${asset_id}`)
export const getAssets = createGetter((filters) => `/atomicmarket/v1/assets?${filter(filters)}`)
export const getTemplate = createGetter(
    (templateId, collectionName) => `/atomicassets/v1/templates/${collectionName}/${templateId}`,
)
export const getAsset = createGetter((assetId) => `/atomicmarket/v1/assets/${assetId}`)
export const getCollection = createGetter((collection_name) => `/atomicassets/v1/collections/${collection_name}`)
export const getSale = createGetter((saleId) => `/atomicmarket/v1/sales/${saleId}`)
export const getAuction = createGetter((auctionId) => `/atomicmarket/v1/auctions/${auctionId}`)
export const getPrices = createGetter((asset_id) => `/atomicmarket/v1/prices/assets?ids=${asset_id}`)

export const getCollections = (collections) =>
    get(`${atomic_api}/atomicassets/v1/collections`, {
        page: '1',
        limit: '10',
        order: 'desc',
        sort: 'created',
        collection_whitelist: collections,
    })

export const getAccountStats = createTableGetter(
    (user, dropID) => ({
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
    }),
    firstRow,
)

export const getDropKeys = createTableGetter(
    (dropId) => ({
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
    }),
    firstRow,
)

export const getWhiteList = createTableGetter(
    (dropId, userName) => ({
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
    }),
    firstRow,
)

export const getProofOwn = createTableGetter(
    (dropId) => ({
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
    }),
    firstRow,
)

export const loadCollections = createTableGetter(
    () => ({
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
    }),
    (result) => firstRow(result)?.collections || [default_collection],
)

const getNeftyblockspCollectionByHex = createTableGetter(
    (collectionHex) => ({
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
    }),
    allRows,
)

const getAtomicpacksxCollectionByKey = createTableGetter(
    (lower_bound) => ({
        code: 'atomicpacksx',
        index_position: 'primary',
        json: 'true',
        key_type: 'i64',
        limit: 2000,
        lower_bound: lower_bound,
        upper_bound: lower_bound + 10000,
        reverse: 'false',
        scope: 'atomicpacksx',
        show_payer: 'false',
        table: 'packs',
        table_key: '',
    }),
    (result) => ({
        rows: result?.rows || [],
        more: result?.more || false,
        nextIndex: result?.next_key ? parseInt(result?.next_key, 10) : null,
    }),
)

/**
 *
 * @param {{ collections: string [] }} filters
 * @returns {any[]}
 */
export const getPacks = async ({ collections = [] } = {}) => {
    const packs = []

    await Promise.all(
        packs_contracts.map(async (contract) => {
            switch (contract) {
                case 'neftyblocksp':
                    collections.forEach(async (collection) => {
                        const collectionHex = getCollectionHex(collection)

                        const rows = await getNeftyblockspCollectionByHex(collectionHex)
                        rows.forEach((pack) => {
                            packs.push({
                                packId: pack.pack_id,
                                unlockTime: pack.unlock_time,
                                templateId: pack.pack_template_id,
                                rollCounter: pack.rollCounter,
                                displayData: JSON.parse(pack.display_data),
                                contract: 'neftyblocksp',
                            })
                        })
                    })
                    break

                case 'atomicpacksx':
                    let lower_bound = 0

                    while (lower_bound !== null) {
                        const { rows, nextIndex, more } = await getAtomicpacksxCollectionByKey(lower_bound)
                        rows.filter((pack) => collections.includes(pack.collection_name)).forEach((pack) => {
                            packs.push({
                                packId: pack.pack_id,
                                unlockTime: pack.unlock_time,
                                templateId: pack.pack_template_id,
                                rollCounter: pack.rollCounter,
                                displayData: JSON.parse(pack.display_data),
                                contract: 'atomicpacksx',
                            })
                        })
                        lower_bound = more ? nextIndex : null
                    }
                    break

                default:
                    console.warn(`Unknown contract "${contract}" to fetch packs`)
            }
        }),
    )

    return packs
}

const waxValueToFloat = (waxValue) => parseFloat(waxValue.replace(' WAX', ''))

export const getRefundBalance = createTableGetter(
    (name) => ({
        code: 'atomicmarket',
        index_position: 'primary',
        json: 'true',
        key_type: 'i64',
        limit: 1000,
        lower_bound: name,
        upper_bound: name,
        reverse: 'false',
        scope: 'atomicmarket',
        show_payer: 'false',
        table: 'balances',
        table_key: '',
    }),
    (result) =>
        allRows(result).reduce(
            (wax, { quantities }) =>
                quantities.reduce((wax, quantity) => (wax + quantity ? waxValueToFloat(quantity) : 0), wax),
            0,
        ),
)

export const getWaxBalance = createTableGetter(
    (name) => ({
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
    }),
    (result) =>
        allRows(result).reduce((wax, { balance }) => {
            return wax + waxValueToFloat(balance)
        }, 0),
)

export const getDelphiMedian = createTableGetter(
    () => ({
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
    }),
    (result) => firstRow(result)?.median || null,
)

const getDropByCollectionHex = createTableGetter(
    (collectionHex) => ({
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
    }),
    allRows,
)

const parseDropData = (drop) => {
    const displayData = JSON.parse(drop.display_data)
    return {
        accountLimit: drop.account_limit,
        accountLimitCooldown: drop.account_limit_cooldown,
        assetsToMint: drop.assets_to_mint,
        authRequired: drop.auth_required,
        collectionName: drop.collection_name,
        currentClaimed: drop.current_claimed,
        description: displayData.description,
        dropId: drop.drop_id,
        endTime: drop.end_time,
        listingPrice: drop.listing_price,
        maxClaimable: drop.max_claimable,
        name: displayData.name,
        startTime: drop.start_time,
    }
}

export const getDrop = createTableGetter(
    (dropId) => ({
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
    }),
    (result) => {
        const drop = firstRow(result)
        return drop ? parseDropData(drop) : null
    },
)

export const getDrops = async (filters) => {
    if (!filters.collections) return []
    const rows = await getDropByCollectionHex(getCollectionHex(filters.collections[0]))
    return rows.map((drop) => parseDropData(drop))
}
