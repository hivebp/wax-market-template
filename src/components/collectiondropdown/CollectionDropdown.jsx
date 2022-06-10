import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import cn from 'classnames'
import React, { useContext, useMemo } from 'react'
import { useCollectionData, useCollections } from '../../api/api_hooks'
import config from '../../config.json'
import { createCollectionImageOption, createCollectionOption, useQuerystring } from '../helpers/Helpers'
import LoadingIndicator from '../loadingindicator/LoadingIndicator'
import { Context } from '../marketwrapper'
import { getFilters, getValues } from '../helpers/Helpers'
import { getListings, getCollectionData } from '../../api/fetch'

const { ipfs } = config

/**
 * @typedef {{ value: string, title: string, label: string, image: string }} Option
 */

/**
 * This component selects a collection and updates the querystring with the selected collection.collection_name
 * @type {React.FC<{ collection: string }>}
 */
const CollectionDropdown = React.memo((props) => {
    const page = 1
    const [state, dispatch] = useContext(Context)

    const [values, updateQuerystring] = useQuerystring()
    const { data: collections } = useCollections()
    const { data: collectionData, loading } = useCollectionData()

    const { collection } = props

    const getDefaultOption = () => ({ value: '', label: '-', title: '-', image: '' })

    /**
     *
     * @param {import('../../api/fetch').CollectionData[]} data
     * @returns {Option[]}
     */
    const createCollections = (data) =>
        data.map(({ collection_name, name, data }) => ({
            value: collection_name,
            title: name,
            label: name,
            image: ipfs + data.img,
        }))

    const collectionDropDownOptions = useMemo(
        () => (collections ? createCollections(collectionData) : [getDefaultOption()]),
        [collectionData],
    )

    /**
     * @param {Option | null} option
     */
    const onSelectCollection = async (option) => {
        const query = { ...values }
        const collection = option?.value ?? '*'

        delete query.schema
        delete query.name
        delete query.rarity
        delete query.variant
        query.collection = collection

        debugger;
        // @TODO LEGACY
        let cdata = getCollectionData([collection])
        console.log("cdata", cdata)

        dispatch({ type: 'SET_SELECTED_COLLECTION', payload: collection })

        dispatch({ type: 'SET_COLLECTIONS', payload: [collection] })
        dispatch({ type: 'SET_COLLECTION_DATA', payload: cdata })

        let filters  = await getFilters(values, [collection], '', page)
        let results = await getListings(filters)

        dispatch({ type: 'SET_LISTINGS', payload: results })
        updateQuerystring(query)
    }

    const defaultValue = useMemo(
        () => (collection === '*' ? -1 : collectionDropDownOptions.findIndex((option) => option.value === collection)),
        [collectionData],
    )

    return collections && collections.length > 1 ? (
        <div className="w-full mb-8">
            {collections ? (
                <div>
                    <div className="text-neutral font-normal text-sm mb-2">Collection</div>
                    <div
                        className={cn(
                            'relative flex flex-wrap justify-center px-2 bg-paper',
                            'border-2 border-solid border-paper rounded',
                        )}
                    >
                        {collectionData.length && !loading ? (
                            <Autocomplete
                                multiple={false}
                                options={collectionDropDownOptions}
                                getOptionLabel={(option) => option.title}
                                renderOption={(option) => (
                                    <React.Fragment>
                                        {option.image
                                            ? createCollectionImageOption(option.title, option.image)
                                            : createCollectionOption(option.title)}
                                    </React.Fragment>
                                )}
                                defaultValue={collectionDropDownOptions[defaultValue] || null}
                                getOptionSelected={(option, value) => option.value === value.value}
                                id="collection-box"
                                style={{ width: '100%' }}
                                popupIcon={null}
                                onChange={(_, option) => onSelectCollection(option)}
                                renderInput={(params) => (
                                    <div
                                        className={defaultValue !== -1 ? 'flex w-full h-8' : 'text-netural opacity-100'}
                                    >
                                        <TextField {...params} variant="standard" placeholder={'Collection'} />
                                    </div>
                                )}
                            />
                        ) : null}
                    </div>
                </div>
            ) : (
                <LoadingIndicator />
            )}
        </div>
    ) : (
        <div></div>
    )
})

export default CollectionDropdown
