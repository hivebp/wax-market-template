import cn from 'classnames'
import { useRouter } from 'next/router'
import React from 'react'
import { post } from '../../api/fetch'
import { queryParams } from '../../api/query'
import config from '../../config.json'
import { useStore } from '../../store/Store'

/**
 * @typedef {import('../../api/query').QueryParams} QueryParams
 */

/**
 * @type {() => [QueryParams, (queryparams: QueryParams) => void]}
 */
export const useQuerystring =
    typeof window === 'undefined'
        ? // stub for SSR…
          () => [{}, () => {}]
        : () => {
              const router = useRouter()
              const { query, updateQuery } = useStore((state) => ({
                  query: state.location().query,
                  updateQuery: state.location().updateQuery,
              }))
              /**
               * @param {QueryParams} queryparams
               */
              const updateQueryString = (queryparams) => {
                  console.log(queryparams)
                  const newPath = updateQuery(queryparams)
                  router.push(newPath, undefined, { shallow: true })
              }
              return [query, updateQueryString]
          }

export const getValues = () => queryParams()

/**
 *
 * @param {string} pageName
 * @returns
 */
const getDefaultSortByPageName = (pageName) => {
    switch (pageName) {
        case 'inventory':
            return 'transferred_desc'
        case 'packs':
            return 'transferred_desc'
        case 'market':
            return 'created_desc'
        case 'auctions':
            return 'ending_desc'
        case 'assets':
            return 'created_desc'
    }
    return 'created_desc'
}

/**
 *
 * @param {QueryParams} values
 * @param {string[]} collections
 * @param {string} pageName
 * @param {number=} page
 * @returns {import('../../api/filter').FilterType}
 */
export const getFilters = (values, collections, pageName, page = 1) => {
    console.log(values, collections)
    const collection = values['collection'] ? values['collection'] : '*'
    const schema = pageName === 'packs' ? 'boxes' : values['schema'] ? values['schema'] : ''
    const name = values['name'] ? values['name'] : ''
    const rarity = values['rarity'] ? values['rarity'] : ''
    const variant = values['variant'] ? values['variant'] : ''
    const sortBy = values['sort'] ? values['sort'] : getDefaultSortByPageName(pageName)
    const seller = values['seller'] ? values['seller'] : ''
    const user = values['user'] ? values['user'] : ''
    const bundles = values['bundles'] ? values['bundles'] : ''
    const bidder = values['bidder'] ? values['bidder'] : ''
    const winner = values['winner'] ? values['winner'] : ''

    return {
        limit: config.limit,
        collections: !collection || collection === '*' ? collections : [collection],
        schema,
        page: '' + page,
        orderDir: getOrderDir(sortBy),
        sortBy: getSortBy(sortBy),
        seller,
        user,
        bundles: Boolean(bundles),
        name,
        rarity,
        variant,
        bidder,
        winner,
    }
}

export const parseAssetsToMint = (assetData, templateData) =>
    assetData.reduce((assets, asset) => {
        const templateId = asset.template_id.toString()
        const matchedTemplate = templateData.data.find((template) => template.template_id.toString() === templateId)

        if (matchedTemplate) assets.push(matchedTemplate)

        return assets
    }, [])

export const createCollectionOption = (name) => {
    if (!name) return name

    return <div className={name.length > 15 ? 'text-sm' : 'text-sm flex justify-between font-bold w-36'}>{name}</div>
}

export const createCollectionImageOption = (name, image) => {
    return (
        <div className="text-sm flex justify-between font-bold w-36">
            <div className="w-8 h-8 m-auto">
                <img src={image} className="max-w-img-small max-h-img-small" alt="none" />
            </div>
            <div>{name}</div>
        </div>
    )
}

export const claimPack = async (pack, asset, activeUser) => {
    const userName = activeUser['accountName']

    const body = {
        code: pack.contract,
        index_position: 'primary',
        json: 'true',
        key_type: 'i64',
        limit: 1000,
        lower_bound: '',
        upper_bound: '',
        reverse: 'false',
        scope: asset.asset_id,
        show_payer: 'false',
        table: 'unboxassets',
        table_key: '',
    }

    const url = config.api_endpoint + '/v1/chain/get_table_rows'
    const res = await post(url, body)

    const origin_roll_ids = []
    const result_templates = []

    if (res && res.rows) {
        res.rows.map((item) => {
            origin_roll_ids.push(parseInt(item.origin_roll_id))
            result_templates.push(parseInt(item.template_id))
            return null
        })

        await activeUser.signTransaction(
            {
                actions: [
                    {
                        account: pack.contract,
                        name: 'claimunboxed',
                        authorization: [
                            {
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            },
                        ],
                        data: {
                            origin_roll_ids: origin_roll_ids,
                            pack_asset_id: asset.asset_id,
                        },
                    },
                ],
            },
            {
                expireSeconds: 300,
                blocksBehind: 0,
            },
        )
    }

    return result_templates
}

export const formatMintInfo = (mint) => {
    if (!mint) {
        return false
    }

    return (
        <div
            className={cn(
                'bg-secondary',
                'px-2 py-0 leading-loose',
                'text-xs font-light text-neutral',
                'rounded-md z-20',
            )}
        >
            # {mint}
        </div>
    )
}

export const formatNumber = (value) => {
    const number = parseInt(value)
    if (Math.abs(number) >= 1000000000) return `${parseInt(`${Math.round(number / 10000000.0)}`) / 10.0}B`
    else if (Math.abs(number) >= 1000000) return `${parseInt(`${Math.round(number / 100000.0)}`) / 10.0}M`
    else if (Math.abs(number) >= 10000) return `${parseInt(`${Math.round(number / 100.0)}`) / 10.0}K`
    else return Math.round(value * 100) / 100
}

export const formatPrice = (listing) => {
    const { price, listing_symbol, auction_id } = listing
    let { listing_price } = listing
    if (listing_price && price)
        if (listing_symbol === 'USD') listing_price = listing_price / 100.0
        else listing_price = listing_price / Math.pow(10, price['token_precision'])
    else if (auction_id && price) listing_price = price['amount'] / Math.pow(10, price['token_precision'])
    return `${formatNumber(listing_price)} ${listing_symbol ? listing_symbol : 'WAX'}`
}

export const getOrderDir = (sort) => {
    return sort.split('_')[1]
}

export const getSortBy = (sort) => {
    const order = sort.split('_')[0]
    return order === 'mint' ? 'template_mint' : order
}
