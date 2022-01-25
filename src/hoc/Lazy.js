import React, { useMemo, useRef, useState } from 'react'
import { useIntersection } from '../hooks/intersection'

/**
 * @template Props
 * @param {React.FC<Props>} Component
 * @param {React.FC} Fallback
 * @returns {React.FC<Props>}
 */
export const withLazy = (Component, Fallback) => (props) => {
    const [visible, setVisibility] = useState(false)

    /** @type {React.MutableRefObject<HTMLDivElement | null>} */
    const element = useRef(null)
    useIntersection(element, () => setVisibility(true))

    return useMemo(
        () =>
            visible ? (
                <Component {...props} />
            ) : (
                <div ref={element}>
                    <Fallback />
                </div>
            ),
        [visible],
    )
}
