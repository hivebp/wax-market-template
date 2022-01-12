import { query } from './query'

export const filter = (filters) => {
    // console.log('filter', filters)
    let filterStr = ''

    const data = {}

    const {
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
    } = filters

    if (collections) data['collection_whitelist'] = collections //  filterStr += `&collection_whitelist=${collections.join(',')}`

    if (ids) data['ids'] = ids //  filterStr += `&ids=${ids.join(',')}`

    if (template_ids) data['template_whitelist'] = template_ids //  filterStr += `&template_whitelist=${template_ids.join(',')}`

    if (template_id) data['template_id'] = template_id //  filterStr += `&template_id=${template_id}`

    if (page) data['page'] = page //  filterStr += `&page=${page}`

    if (schema) data['schema_name'] = schema //  filterStr += `&schema_name=${schema}`

    if (user) data['owner'] = user //  filterStr += `&owner=${user}`

    if (seller) data['seller'] = seller //  filterStr += `&seller=${seller}`

    if (bidder) data['bidder'] = bidder //  filterStr += `&bidder=${bidder}`

    if (winner) data['participant'] = winner //  filterStr += `&participant=${winner}`

    if (name) data['match'] = name //  filterStr += `&match=${escape(name)}`

    if (rarity) data['template_data.rarity'] = rarity //  filterStr += `&template_data.rarity=${rarity}`

    if (variant) data['template_data.variant'] = variant //  filterStr += `&template_data.variant=${variant}`

    if (bundles) data['min_assets'] = 2 //  filterStr += `&min_assets=2`

    if (limit) data['limit'] = limit //  filterStr += `&limit=${limit}`

    if (orderDir) data['order'] = orderDir //  filterStr += `&order=${orderDir}`

    if (sortBy) data['sort'] = sortBy //  filterStr += `&sort=${sortBy}`

    if (asset_id) data['asset_id'] = asset_id //  filterStr += `&asset_id=${asset_id}`

    const result = query('', data).slice(1)
    if (!result) return ''
    return '&' + result
}

export const getFilterParams = filter
