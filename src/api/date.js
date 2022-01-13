export const msToDuration = (ms) => {
    let seconds = Math.floor(ms / 1000) % 60
    let minutes = Math.floor(ms / (1000 * 60)) % 60
    let hours = Math.floor(ms / (1000 * 60 * 60)) % 24
    let days = Math.floor(ms / (1000 * 60 * 60 * 24))

    return { seconds, minutes, hours, days }
}

export const millisecondsToString = (ms) => {
    const duration = msToDuration(ms)
    return `${duration.days}d ${duration.hours}h ${duration.minutes}m ${duration.seconds}s`
}

export const isValidDate = (date) => date instanceof Date && !isNaN(date)
