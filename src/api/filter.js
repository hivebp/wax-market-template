import { query } from './query'

/**
 * @typedef {Object} FilterType
 * @property {string[]=} collections
 * @property {string=} page
 * @property {boolean=} bundles
 * @property {string=} user
 * @property {string=} schema
 * @property {string=} name
 * @property {string=} limit
 * @property {string=} orderDir
 * @property {string=} sortBy
 * @property {string=} asset_id
 * @property {string=} rarity
 * @property {string=} variant
 * @property {string=} seller
 * @property {string[]=} ids
 * @property {string=} bidder
 * @property {string=} winner
 * @property {string[]=} template_ids
 * @property {string=} template_id
 */

/**
 * @param {FilterType} filter
 * @returns {string}
 */
export const filter = ({
    collections,
    page,
    bundles,
    user,
    schema,
    name,
    limit,
    orderDir,
    sortBy,
    asset_id,
    rarity,
    variant,
    seller,
    ids,
    bidder,
    winner,
    template_ids,
    template_id,
} = {}) =>
    '&' +
    query('', {
        ...(collections && { collection_whitelist: collections }),
        ...(ids && { ids: ids }),
        ...(template_ids && { template_whitelist: template_ids }),
        ...(template_id && { template_id: template_id }),
        ...(page && { page: page }),
        ...(schema && { schema_name: schema }),
        ...(user && { owner: user }),
        ...(seller && { seller: seller }),
        ...(bidder && { bidder: bidder }),
        ...(winner && { participant: winner }),
        ...(name && { match: name }),
        ...(rarity && { 'template_data.rarity': rarity }),
        ...(variant && { 'template_data.variant': variant }),
        ...(bundles && { min_assets: 2 }),
        ...(limit && { limit: limit }),
        ...(orderDir && { order: orderDir }),
        ...(sortBy && { sort: sortBy }),
        ...(asset_id && { asset_id: asset_id }),
    }).slice(1)
