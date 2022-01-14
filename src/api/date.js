/**
 * Extracts the duration values from a millisecond value.
 * @param {number} ms
 * @returns {{ seconds: number, minutes: number, hours: number, days: number }}
 */
export const msToDuration = (ms) => {
    let seconds = Math.floor(ms / 1000) % 60
    let minutes = Math.floor(ms / (1000 * 60)) % 60
    let hours = Math.floor(ms / (1000 * 60 * 60)) % 24
    let days = Math.floor(ms / (1000 * 60 * 60 * 24))

    return { seconds, minutes, hours, days }
}

/**
 * Converts a millisecond value to a human readable string
 *
 * @param {number} ms
 * @returns {string}
 */
export const millisecondsToString = (ms) => {
    const duration = msToDuration(ms)
    return `${duration.days}d ${duration.hours}h ${duration.minutes}m ${duration.seconds}s`
}

/**
 * Checks if a value is a valid date
 * @param {any} date
 * @returns {date is Date}
 */
export const isValidDate = (date) => date instanceof Date && !isNaN(+date)
