import Long from 'long'

const bytesToHex = (bytes) => {
    let leHex = ''
    for (const b of bytes) {
        const n = Number(b).toString(16)
        leHex += (n.length === 1 ? '0' : '') + n
    }
    return leHex
}

const charidx = (ch) => {
    const idx = '.12345abcdefghijklmnopqrstuvwxyz'.indexOf(ch)
    if (idx === -1) throw new TypeError(`Invalid character: '${ch}'`)

    return idx
}

/**
 *
 * @param {string} collection
 * @returns {string}
 */
export const getCollectionHex = (collection) => {
    if (typeof collection !== 'string') throw new TypeError('name parameter is a required string')

    if (collection.length > 12) throw new TypeError('A name can be up to 12 characters long')

    let bitstr = ''
    for (let i = 0; i <= 12; i++) {
        // process all 64 bits (even if name is short)
        const c = i < collection.length ? charidx(collection[i]) : 0
        const bitlen = i < 12 ? 5 : 4
        let bits = Number(c).toString(2)
        if (bits.length > bitlen) {
            throw new TypeError('Invalid name ' + collection)
        }
        bits = '0'.repeat(bitlen - bits.length) + bits
        bitstr += bits
    }

    const longVal = Long.fromString(bitstr, true, 2)

    return bytesToHex(longVal.toBytes())
}
