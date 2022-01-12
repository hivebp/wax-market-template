import { filter } from './filter'

describe('filter', () => {
    it.each([['', {}]])('should generate "%s" correctly', (result, params) => {
        expect(filter(params)).toEqual(result)
    })
})
