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
