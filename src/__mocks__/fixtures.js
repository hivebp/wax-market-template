/**
 * @typedef {import("../api/fetch").Auction} Auction
 */

/**
 * @typedef {import("../api/fetch").CollectionData} CollectionData
 */

/**
 * @typedef {import("../api/fetch").Schema} Schema
 */

/**
 * @typedef {import("../api/fetch").Template} Template
 */

/**
 * @typedef {import("../api/fetch").Asset} Asset
 */

/**
 * @param {Partial<CollectionData>} [partial]
 * @returns {CollectionData}
 */
export const collection = (partial = {}) => ({
    allow_notify: false,
    author: 'test-author.wam',
    authorized_accounts: ['test-author.wam'],
    collection_name: 'test-collection',
    contract: 'test-contract',
    created_at_block: '1',
    created_at_time: '1',
    data: {},
    img: 'test-image.svg',
    market_fee: 1001,
    name: 'test-collection',
    notify_accounts: [],
    ...partial,
})

/**
 * @param {Partial<Schema>} [partial]
 * @returns {Schema}
 */
export const schema = (partial = {}) => ({
    contract: 'test-contract',
    created_at_block: '1',
    created_at_time: '1',
    format: [],
    schema_name: 'test-schema',
    ...partial,
    collection: collection(partial.collection),
})

/**
 * @param {Partial<Template>} [partial]
 * @returns {Template}
 */
export const template = (partial = {}) => ({
    contract: 'test-contract',
    created_at_block: '1',
    created_at_time: '1',
    immutable_data: {},
    is_burnable: false,
    is_transferable: false,
    issued_supply: '2',
    max_supply: '3',
    name: 'test-template',
    template_id: 'test-template-id',
    ...partial,
    collection: collection(partial.collection),
    schema: schema(partial.schema),
})

/**
 * @param {Partial<Asset>} [partial]
 * @returns {Asset}
 */
export const asset = (partial = {}) => ({
    asset_id: 'test-id',
    auctions: [],
    backed_tokens: [],
    burned_at_block: '1',
    burned_at_time: '1',
    burned_by_account: 'test.wam',
    contract: 'test-contract',
    data: {},
    immutable_data: null,
    is_burnable: false,
    is_transferable: false,
    minted_at_block: '2',
    minted_at_time: '2',
    mutable_data: null,
    name: 'Test-Asset',
    owner: 'test-owner.wam',
    prices: [],
    sales: [],
    template_mint: '3',
    transferred_at_block: '4',
    transferred_at_time: '4',
    updated_at_block: '5',
    updated_at_time: '5',
    ...partial,
    collection: collection(partial.collection),
    schema: schema(partial.schema),
    template: template(partial.template),
})

/**
 * @param {Partial<Auction>} [partial]
 * @returns {Auction}
 */
export const auction = (partial = {}) => ({
    assets: partial.assets ?? [asset()],
    assets_contract: 'test-asset-contract',
    auction_id: 'test-auction-id',
    bids: [],
    buyer: 'test-buyer',
    claimed_by_buyer: false,
    claimed_by_seller: false,
    collection: collection(partial.collection),
    created_at_block: '1',
    created_at_time: '1',
    end_time: '666',
    is_seller_contract: false,
    maker_marketplace: 'test-maker',
    market_contract: 'test-maker-contract',
    price: {
        amount: '999',
        token_contract: 'test-contract',
        token_precision: 1001,
        token_symbol: 'WAX',
    },
    seller: 'test-seller',
    state: 2,
    taker_marketplace: 'test-marketplace',
    updated_at_block: '2',
    updated_at_time: '2',
})

/**
 * @typedef {import("../api/fetch").NeftyBlend} NeftyBlend
 */

/**
 * @param {Partial<NeftyBlend>} [partial]
 * @returns {NeftyBlend}
 */
export const neftyBlend = (partial = {}) => ({
    blend_id: 'test-blend-id',
    collection_name: 'test-collection',
    display_data: '{}',
    ingredients: [],
    name: 'test-blend',
})

/**
 * @typedef {import("../api/fetch").BlenderizerBlend} BlenderizerBlend
 */

/**
 * @param {Partial<BlenderizerBlend>} [partial]
 * @returns {BlenderizerBlend}
 */
export const blenderizerBlend = (partial = {}) => ({
    collection: 'test-collection',
    mixture: [1, 2, 3, 4, 5],
    owner: 'test-owner',
    target: 1234567890,
})
