import React, { useEffect, useRef } from 'react'
import { millisecondsToString } from '../../api/date'

/**
 *
 * @param {number} ms
 * @returns
 */
const timeToString = (ms) => (ms ? millisecondsToString(ms) : ' - ')

/**
 * This Component replaces the refresh of the React.Component as it will not change any state. It will silently replace the internal timer.
 * It is the more efficient way to handle clocks and timers
 * @type {React.FC<{ endTime: number | undefined | null }>}
 */
export const AuctionTimer = ({ endTime }) => {
    /** @type {React.MutableRefObject<HTMLDivElement | null>} */
    const element = useRef(null)

    useEffect(() => {
        if (!endTime) return
        const intervalId = setInterval(() => {
            if (element.current) element.current.innerText = timeToString(endTime - Date.now())
        }, 1000)
        return () => clearInterval(intervalId)
    })

    return endTime ? (
        <div className="text-center" ref={element}>
            {timeToString(endTime - Date.now())}
        </div>
    ) : null
}
