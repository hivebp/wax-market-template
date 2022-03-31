import { UALContext } from 'ual-reactjs-renderer'
import { useContext } from 'react'

export const useUAL = () => {
    return useContext(UALContext)
}
