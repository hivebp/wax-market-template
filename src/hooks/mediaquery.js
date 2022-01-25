import { useEffect, useMemo, useState } from 'react'

const matchMedia = typeof window === 'undefined' || !('matchMedia' in window) ? false : window.matchMedia

/**
 * @param {string} mediaquery - Like '(max-width: 600px)'
 * @returns {boolean}
 */
export const useMediaQuery = (mediaquery, serverValue = false) => {
    const [result, setResult] = useState(matchMedia ? matchMedia(mediaquery).matches : serverValue)
    const mql = useMemo(() => {
        if (!matchMedia) return undefined
        return matchMedia(mediaquery)
    }, [mediaquery])

    /** @type {(event: MediaQueryListEvent) => void} */
    const handleChange = (event) => setResult(event.matches)

    useEffect(() => {
        if (!mql) return

        mql.addEventListener('change', handleChange)
        return () => mql.removeEventListener('change', handleChange)
    }, [mql])

    return result
}
