import React, { createContext, useReducer } from 'react'
import Reducer from './reducer'
import { initialState } from './state'

/**
 * @type {React.FC}
 */
const Store = ({ children }) => {
    const [state, dispatch] = useReducer(Reducer, initialState)

    return <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
}

/**
 * @type {[import('./state').State, React.Dispatch<any>]}
 */
const initialContext = [initialState, () => {}]

export const Context = createContext(initialContext)
export default Store
