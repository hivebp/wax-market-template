import { query } from './query'

describe('query', () => {
    it.each([
        ['u', undefined],
        ['u?a=1', { a: 1 }],
        ['u?a=1%2C2', { a: [1, 2] }],
        [
            `/a/v1/collections?page=1&limit=10&order=desc&sort=created&collection_whitelist=a%2Cb`,
            {
                page: 1,
                limit: 10,
                order: 'desc',
                sort: 'created',
                collection_whitelist: ['a', 'b'],
            },
            '/a/v1/collections',
        ],
    ])('should generate %s', (result, params, path = 'u') => {
        expect(query(path, params)).toEqual(result)
    })
})
