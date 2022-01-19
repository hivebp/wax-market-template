import { useEffect, useState } from 'react'
import config from '../config.json'
import { getCollectionHex } from './fetch_utils'
import { filter } from './filter'
import { query } from './query'

export const { atomic_api, api_endpoint, packs_contracts, default_collection } = config

/**
 *
 * @param {string} url
 * @param {any=} data
 * @param {RequestInit=} init
 * @returns {Promise<unknown>}
 */
export const get = (url, data, init) => fetch(query(url, data), init).then((res) => res.json())

/**
 *
 * @param {string} url
 * @param {any=} data
 * @returns {Promise<unknown>}
 */
export const post = (url, data) =>
    fetch(url, {
        method: 'post',
        body: JSON.stringify(data),
    }).then((res) => res.json())

/**
 *
 * @param {any} val
 * @returns {val is { code: any }}
 */
const hasCode = (val) => 'code' in val

/**
 * @typedef {{ data: unknown, error: any, loading: boolean, fetch: () => Promise<unknown> }} UseFetchResult
 */

/**
 *
 * @param {string} url
 * @param {'GET' | 'POST'=} method
 * @param {any=} bodyData
 * @param {boolean=} autofetch
 * @returns {UseFetchResult}
 */
export const useFetch = (url, method = 'GET', bodyData = undefined, autofetch = false) => {
    /**
     * @typedef {Object} FetchState
     * @property {unknown | undefined} data
     * @property {boolean} loading
     * @property {any | undefined} error
     * @property {AbortController | undefined} controller
     */

    /** @type {FetchState} */
    const initialState = {
        data: undefined,
        error: undefined,
        loading: false,
        controller: undefined,
    }
    const [state, setState] = useState(initialState)

    const request = async () => {
        if (state.controller) state.controller.abort()

        const controller = new AbortController()
        setState((state) => ({ ...state, loading: true, controller }))

        try {
            /** @type {Response} */
            const response = await fetch(url, {
                signal: controller.signal,
                method,
                body: bodyData ? JSON.stringify(bodyData) : undefined,
            })

            const data = await response.json()

            setState({
                data,
                error: undefined,
                loading: false,
                controller: undefined,
            })
        } catch (err) {
            if (hasCode(err) && err.code === 'ECONNABORTED') return
            setState((state) => ({
                data: state.data,
                error: hasCode(err) && err.code === 'ECONNABORTED' ? undefined : err,
                loading: false,
                controller: undefined,
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

/**
 * @param {string} url
 * @param {any} data
 * @returns {UseFetchResult}
 */
export const useGet = (url, data) => useFetch(query(url, data), 'GET', undefined, true)
/**
 * @param {string} url
 * @param {any} data
 * @returns {UseFetchResult}
 */
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
 *
 * @typedef {Object} TableGetterResponseData
 * @property {any[]} rows
 * @property {boolean} more
 * @property {string} next_key
 */

/**
 * @template DataGenerator - Function that generates the query data
 * @template Result
 * @param {DataGenerator} dataGenerator
 * @param {(result: TableGetterResponseData) => Result} mapFn
 * @return {(...args: Parameters<DataGenerator>) => Promise<Result>}
 */
const createTableGetter =
    (dataGenerator, mapFn) =>
    async (...args) =>
        // @ts-ignore
        mapFn(await post(`${api_endpoint}/v1/chain/get_table_rows`, dataGenerator(...args)))

/**
 * Creates a function that fetches the resulting path and returns the json data of the response.
 * @template PathGenerator - Function that generates the path to fetch data from
 * @param {PathGenerator} pathGenerator
 * @return {(param: Parameters<PathGenerator>[0], controller?: AbortController) => Promise<unknown>}
 */
const createGetter =
    (pathGenerator) =>
    async (param, controller = new AbortController()) =>
        // @ts-ignore
        get(`${atomic_api}${pathGenerator(param)}`, undefined, { signal: controller.signal })

export const getSchemas = createGetter(
    (/** @type {import("./filter").FilterType=} */ filters) => `/atomicassets/v1/schemas?${filter(filters)}`,
)

/**
 * @template Data
 * @typedef {Object} APIResponse
 * @property {Data[]} data
 * @property {number} query_time
 * @property {boolean} success
 */

/**
 *
 * @typedef {Object} CollectionData
 * @property {boolean} allow_notify
 * @property {string} author
 * @property {string[]} authorized_accounts
 * @property {string} collection_name
 * @property {string} contract
 * @property {string} created_at_block
 * @property {string} created_at_time
 * @property {any} data
 * @property {string} img
 * @property {number} market_fee
 * @property {string} name
 * @property {any[]} notify_accounts
 */

/**
 * @typedef {Object} Template
 * @property {CollectionData} collection
 * @property {string} contract
 * @property {string} created_at_block
 * @property {string} created_at_time
 * @property {any} immutable_data
 * @property {boolean} is_burnable
 * @property {boolean} is_transferable
 * @property {string} issued_supply
 * @property {string} max_supply
 * @property {string} name
 * @property {any} schema
 * @property {string} template_id
 */

/**
 * @typedef {Object} Schema
 * @property {CollectionData} collection
 * @property {string} contract
 * @property {string} created_at_block
 * @property {string} created_at_time
 * @property {any[]} format
 * @property {string} schema_name
 */

/**
 * @typedef {Object} Pack
 * @property {string} packId
 * @property {string} unlockTime
 * @property {string} templateId
 * @property {string} rollCounter
 * @property {string} displayData
 * @property {string} contract
 */

/**
 * @typedef {Object} Asset
 * @property {string} asset_id
 * @property {any[]} auctions
 * @property {any[]} backed_tokens
 * @property {any} burned_at_block
 * @property {any} burned_at_time
 * @property {any} burned_by_account
 * @property {CollectionData} collection
 * @property {string} contract
 * @property {any} data
 * @property {any} immutable_data
 * @property {true} is_burnable
 * @property {true} is_transferable
 * @property {string} minted_at_block
 * @property {string} minted_at_time
 * @property {any} mutable_data
 * @property {string} name
 * @property {string} owner
 * @property {any[]} prices
 * @property {any[]} sales
 * @property {Schema} schema
 * @property {Template} template
 * @property {string} template_mint
 * @property {string} transferred_at_block
 * @property {string} transferred_at_time
 * @property {string} updated_at_block
 * @property {string} updated_at_time
 */

/** @type {(filters: import("./filter").FilterType) => Promise<APIResponse<Template>>}  */
// @ts-ignore
export const getTemplates = createGetter(
    (/** @type {import("./filter").FilterType=} */ filters) =>
        `/atomicassets/v1/templates?has_assets=true${filter(filters)}`,
)
export const getListings = createGetter(
    (/** @type {import("./filter").FilterType=} */ filters) => `/atomicmarket/v1/sales?state=1${filter(filters)}`,
)
export const getAuctions = createGetter(
    (/** @type {import("./filter").FilterType=} */ filters) => `/atomicmarket/v1/auctions?state=1&${filter(filters)}`,
)
export const getWonAuctions = createGetter(
    (/** @type {import("./filter").FilterType=} */ filters) => `/atomicmarket/v1/auctions?state=3&${filter(filters)}`,
)
export const getBids = createGetter(
    (/** @type {import("./filter").FilterType=} */ filters) => `/atomicmarket/v1/auctions?state=1&${filter(filters)}`,
)
export const getSales = createGetter(
    (/** @type {import("./filter").FilterType=} */ filters) => `/atomicmarket/v1/sales?state=3${filter(filters)}`,
)
export const getAssets = createGetter(
    (/** @type {import("./filter").FilterType=} */ filters) => `/atomicmarket/v1/assets?${filter(filters)}`,
)
export const getListing = createGetter((/** @type {string} */ listingId) => `/atomicmarket/v1/sales/${listingId}`)
export const getListingsById = createGetter(
    (/** @type {string} */ assetId) => `/atomicmarket/v1/sales?&limit=1&asset_id=${assetId}`,
)
export const getAuctionsById = createGetter(
    (/** @type {string} */ assetId) => `/atomicmarket/v1/auctions?&limit=1&asset_id=${assetId}`,
)

// @TODO this needs to be fixed, move from (string, string) to ({ templateId, collectionName })
export const getTemplate = createGetter(
    /** @param {{templateId: string, collectionName: string }} */
    ({ collectionName, templateId }) => `/atomicassets/v1/templates/${collectionName}/${templateId}`,
)
export const getAsset = createGetter((/** @type {string} */ assetId) => `/atomicmarket/v1/assets/${assetId}`)
export const getCollection = createGetter(
    (/** @type {string} */ collectionName) => `/atomicassets/v1/collections/${collectionName}`,
)
export const getSale = createGetter((/** @type {string} */ saleId) => `/atomicmarket/v1/sales/${saleId}`)
export const getAuction = createGetter((/** @type {string} */ auctionId) => `/atomicmarket/v1/auctions/${auctionId}`)
export const getPrices = createGetter(
    (/** @type {string} */ assetId) => `/atomicmarket/v1/prices/assets?ids=${assetId}`,
)

/**
 * @param {string[]} collections
 * @returns {Promise<APIResponse<CollectionData>>}
 */
export const getCollections = (collections) =>
    // @ts-ignore
    get(`${atomic_api}/atomicassets/v1/collections`, {
        page: '1',
        limit: '10',
        order: 'desc',
        sort: 'created',
        collection_whitelist: collections,
    })

export const getAccountStats = createTableGetter(
    (/** @type {string} */ user, /** @type {string} */ dropID) => ({
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
    (/** @type {string} */ dropId) => ({
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
    (/** @type {string} */ dropId, /** @type {string} */ userName) => ({
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
    (/** @type {string} */ dropId) => ({
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
    (/** @type {string} */ collectionHex) => ({
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
    (/** @type {number} */ lower_bound) => ({
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
 * @param {import('./filter').FilterType} filters
 * @returns {Promise<Pack[]>}
 */
export const getPacks = async ({ collections = [] } = {}) => {
    /**
     * @type {Pack[]}
     */
    const packs = []

    await Promise.all(
        packs_contracts.map(async (contract) => {
            switch (contract) {
                case 'neftyblocksp':
                    await Promise.all(
                        collections.map(async (collection) => {
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
                        }),
                    )
                    break

                case 'atomicpacksx':
                    /**
                     * @type {number | null}
                     **/
                    let lower_bound
                    lower_bound = 0

                    while (lower_bound !== null) {
                        /**
                         * @type {{
                         *  rows: any[]
                         *  nextIndex: number | null
                         *  more: boolean
                         * }}
                         **/
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

/**
 *
 * @param {string} waxValue
 * @returns {number}
 */
const waxValueToFloat = (waxValue) => parseFloat(waxValue.replace(' WAX', ''))

export const getRefundBalance = createTableGetter(
    (/** @type {string} */ name) => ({
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
    (result) => {
        /** @type {number} */
        const refundBalance = allRows(result).reduce(
            (/** @type {number} */ wax, /** @type {{ quantities?: string[]}} */ { quantities = [] }) =>
                quantities.reduce((wax, quantity) => (wax + quantity ? waxValueToFloat(quantity) : 0), wax),
            0,
        )
        return refundBalance
    },
)

export const getWaxBalance = createTableGetter(
    (/** @type {string} */ name) => ({
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
        allRows(result).reduce((/** @type {number} */ wax, { balance }) => {
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

export const getBlend = createTableGetter(
    (/** @type {string} */ blendId) => ({
        json: true,
        code: 'blend.nefty',
        scope: 'blend.nefty',
        table: 'blends',
        table_key: '',
        lower_bound: blendId,
        upper_bound: blendId,
        index_position: 1,
        key_type: '',
        limit: 1,
        reverse: false,
        show_payer: false,
    }),
    firstRow,
)

export const getBlenderizer = createTableGetter(
    (/** @type {string} */ templateId) => ({
        json: true,
        code: 'blenderizerx',
        scope: 'blenderizerx',
        table: 'blenders',
        table_key: '',
        lower_bound: templateId,
        upper_bound: templateId,
        index_position: 1,
        key_type: '',
        limit: 1,
        reverse: false,
        show_payer: false,
    }),
    firstRow,
)
const getDropByCollectionHex = createTableGetter(
    (/** @type {string} */ collectionHex) => ({
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

// @TODO
const parseDropData = (/** @type {any} */ drop) => {
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
    (/** @type {string} */ dropId) => ({
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

/**
 *
 * @param {import('./filter').FilterType} filters
 */
export const getDrops = async (filters) => {
    if (!filters.collections) return []
    const rows = await getDropByCollectionHex(getCollectionHex(filters.collections[0]))
    return rows.map((drop) => parseDropData(drop))
}
