import { useContext } from 'react'
import { Context } from './Store'

export const useState = () => useContext(Context)[0]

/**
 *
 * @param {import("./state").Resources} loader
 * @returns
 */
export const useLoader = (loader) => useState().loaders[loader]
