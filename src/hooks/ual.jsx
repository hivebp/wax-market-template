import { UALContext } from 'hive-ual-renderer'
import { useContext } from 'react'

export const useUAL = () => {
    return useContext(UALContext)
}
