import { useEffect } from 'react'

/**
 * @type {WeakMap<Element, VoidFunction>}
 */
let listenerCallbacks = new WeakMap()

/** @type {IntersectionObserver | undefined} */
let observer

/** @type {IntersectionObserverInit} */
let observerInit = {
    rootMargin: '200px 0px 100px 0px',
    threshold: 0,
}

/** @type {IntersectionObserverCallback} */
const handleIntersections = (entries) => {
    entries.forEach((entry) => {
        if (listenerCallbacks.has(entry.target)) {
            let cb = listenerCallbacks.get(entry.target)
            if (cb && (entry.isIntersecting || entry.intersectionRatio > 0)) {
                // @ts-ignore - observer is available, as it just called this function
                observer.unobserve(entry.target)
                listenerCallbacks.delete(entry.target)
                cb()
            }
        }
    })
}

/**
 * @param {IntersectionObserverInit} newInit
 */
export const updateIntersectionObserverInit = (newInit) => {
    observerInit = newInit
    // here should be a method to replace the old observer
}

const getIntersectionObserver = () => {
    if (observer === undefined) observer = new IntersectionObserver(handleIntersections, observerInit)
    return observer
}

/**
 *
 * @param {React.MutableRefObject<Element | null>} elem
 * @param {VoidFunction} callback
 */
export const useIntersection = (elem, callback) => {
    useEffect(() => {
        const target = elem.current
        if (!target) return

        const observer = getIntersectionObserver()
        listenerCallbacks.set(target, callback)
        observer.observe(target)

        return () => {
            listenerCallbacks.delete(target)
            observer.unobserve(target)
        }
    }, [])
}
