import { msToDuration } from './date'

describe('msToDuration', () => {
    const base = { seconds: 0, minutes: 0, hours: 0, days: 0 }

    it.each([
        [0, {}],
        [1000, { seconds: 1 }],
        [60000, { minutes: 1 }],
        [3600000, { hours: 1 }],
        [86400000, { days: 1 }],
        [90061000, { days: 1, hours: 1, minutes: 1, seconds: 1 }],
        [4628560435, { days: 53, hours: 13, minutes: 42, seconds: 40 }],
    ])('should return times for %d correctly', (ms, output) => {
        expect(msToDuration(ms)).toEqual({
            ...base,
            ...output,
        })
    })
})
