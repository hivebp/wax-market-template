import { initialState } from './state'

/**
 * @typedef {'START_LOADING' | 'FINISH_LOADING' | 'SET_ASSET' | 'SET_AMOUNT' | 'SET_ACTION' | 'SET_TRIGGERED' | 'SET_SWITCHED_TAB' | 'SET_CALLBACK' | 'SET_COLLECTIONS' | 'SET_COLLECTION_DATA' | 'SET_TEMPLATE_DATA' | 'SET_SCHEMA_DATA' | 'SET_UNBOXED' | 'SET_PACK_DATA'} ActionType
 */

/**
 *
 * @param {import("./state").State | undefined} state
 * @param {{ type: ActionType, payload: any }} action
 * @returns
 */
const Reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'START_LOADING':
            return { ...state, loaders: { ...state.loaders, [action.payload]: true } }
        case 'FINISH_LOADING':
            return { ...state, loaders: { ...state.loaders, [action.payload]: false } }
        case 'SET_ASSET':
            return {
                ...state,
                asset: action.payload,
            }
        case 'SET_AMOUNT':
            return {
                ...state,
                amount: action.payload,
            }
        case 'SET_ACTION':
            return {
                ...state,
                action: action.payload,
            }
        case 'SET_TRIGGERED':
            return {
                ...state,
                triggered: action.payload,
            }
        case 'SET_SWITCHED_TAB':
            return {
                ...state,
                switchedTab: action.payload,
            }
        case 'SET_CALLBACK':
            return {
                ...state,
                callBack: action.payload,
            }
        case 'SET_COLLECTIONS':
            return {
                ...state,
                collections: action.payload,
            }
        case 'SET_COLLECTION_DATA':
            return {
                ...state,
                collectionData: action.payload,
            }
        case 'SET_TEMPLATE_DATA':
            return {
                ...state,
                templateData: action.payload,
            }
        case 'SET_SCHEMA_DATA':
            return {
                ...state,
                schemaData: action.payload,
            }
        case 'SET_UNBOXED':
            return {
                ...state,
                unboxed: action.payload,
            }
        case 'SET_PACK_DATA':
            return {
                ...state,
                packData: action.payload,
            }
        default:
            return state
    }
}

export default Reducer
