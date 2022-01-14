import React, { createContext, useReducer } from 'react'
import Reducer from '../reducer'

const initialState = {
    collections: null,
}

const MarketWrapper = ({ children }) => {
    const [state, dispatch] = useReducer(Reducer, initialState)

    return <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
}

export const Context = createContext(initialState)
export default MarketWrapper
