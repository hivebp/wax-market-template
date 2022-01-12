import { query } from './query'

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

export const getFilterParams = filter
