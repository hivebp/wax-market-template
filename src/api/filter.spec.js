import { filter } from './filter'

describe('filter', () => {
    it.each([
        ['', {}],
        ['&collection_whitelist=a%2Cb', { collections: ['a', 'b'] }],
        ['&page=a', { page: 'a' }],
        ['&min_assets=2', { bundles: true }],
        ['&owner=a', { user: 'a' }],
        ['&schema_name=a', { schema: 'a' }],
        ['&match=a', { name: 'a' }],
        ['&limit=a', { limit: 'a' }],
        ['&order=a', { orderDir: 'a' }],
        ['&sort=a', { sortBy: 'a' }],
        ['&asset_id=a', { asset_id: 'a' }],
        ['&template_data.rarity=a', { rarity: 'a' }],
        ['&template_data.variant=a', { variant: 'a' }],
        ['&seller=a', { seller: 'a' }],
        ['&ids=a%2Cb', { ids: ['a', 'b'] }],
        ['&bidder=a', { bidder: 'a' }],
        ['&participant=a', { winner: 'a' }],
        ['&template_whitelist=a%2Cb', { template_ids: ['a', 'b'] }],
        ['&template_id=a', { template_id: 'a' }],
    ])('should generate "%s" correctly', (result, params) => {
        expect(filter(params)).toEqual(result)
    })
})
