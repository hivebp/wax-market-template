export const filter = (filters) => {
    let filterStr = ''

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

    if (collections) filterStr += `&collection_whitelist=${collections.join(',')}`

    if (ids) filterStr += `&ids=${ids.join(',')}`

    if (template_ids) filterStr += `&template_whitelist=${template_ids.join(',')}`

    if (template_id) filterStr += `&template_id=${template_id}`

    if (page) filterStr += `&page=${page}`

    if (schema) filterStr += `&schema_name=${schema}`

    if (user) filterStr += `&owner=${user}`

    if (seller) filterStr += `&seller=${seller}`

    if (bidder) filterStr += `&bidder=${bidder}`

    if (winner) filterStr += `&participant=${winner}`

    if (name) filterStr += `&match=${escape(name)}`

    if (rarity) filterStr += `&template_data.rarity=${rarity}`

    if (variant) filterStr += `&template_data.variant=${variant}`

    if (bundles) filterStr += `&min_assets=2`

    if (limit) filterStr += `&limit=${limit}`

    if (orderDir) filterStr += `&order=${orderDir}`

    if (sortBy) filterStr += `&sort=${sortBy}`

    if (asset_id) filterStr += `&asset_id=${asset_id}`

    return filterStr
}

export const getFilterParams = filter
