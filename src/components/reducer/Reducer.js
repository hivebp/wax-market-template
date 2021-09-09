const Reducer = (state, action) => {
    switch (action.type) {
        case 'SET_ASSET':
            return {
                ...state,
                asset: action.payload
            };
        case 'SET_ACTION':
            return {
                ...state,
                action: action.payload
            };
        case 'SET_SWITCHED_TAB':
            return {
                ...state,
                switchedTab: action.payload
            };
        case 'SET_CALLBACK':
            return {
                ...state,
                callBack: action.payload
            };
        case 'SET_COLLECTIONS':
            return {
                ...state,
                collections: action.payload
            };
        case 'SET_COLLECTION_DATA':
            return {
                ...state,
                collectionData: action.payload
            };
        case 'SET_TEMPLATE_DATA':
            return {
                ...state,
                templateData: action.payload
            };
        case 'SET_SCHEMA_DATA':
            return {
                ...state,
                schemaData: action.payload
            };
        case 'SET_PACK_DATA':
            return {
                ...state,
                packData: action.payload
            };
        default:
            return state;
    }
};

export default Reducer;
