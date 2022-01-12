import React, { useContext, useEffect, useState } from 'react'

import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'

import qs from 'qs'
import { Context } from '../marketwrapper'
import { createCollectionImageOption, createCollectionOption, getValues } from '../helpers/Helpers'
import LoadingIndicator from '../loadingindicator/LoadingIndicator'
import config from '../../config.json'
import cn from 'classnames'

const CollectionDropdown = React.memo((props) => {
    const values = getValues()

    const [collections, setCollections] = useState(null)
    const [allCollections, setAllCollections] = useState([])
    const [state, dispatch] = useContext(Context)

    const pushQueryString = props['pushQueryString']

    const collection = props['collection']

    const getDefaultOption = () => ({ value: '', label: '-', title: '-' })

    const initialized = state.collectionData !== null && state.collectionData !== undefined

    const createCollections = (data, search = '') => {
        const collections = []

        data.map((element) => {
            if (!collections.find((a) => a.value === element))
                if (
                    !search ||
                    element['name'].toLowerCase().includes(search.toLowerCase()) ||
                    element['collection_name'].toLowerCase().includes(search.toLowerCase())
                )
                    collections.push({
                        value: element['collection_name'],
                        title: element['name'],
                        label: element['name'],
                        image: config.ipfs + element['data']['img'],
                    })
        })

        return collections
    }

    const [collectionDropDownOptions, setCollectionDropDownOptions] = useState(
        collections ? createCollections(collections, false, 'All Collections', true) : [getDefaultOption()],
    )

    const onSearchCollection = (e, collections) => {
        setCollectionDropDownOptions(createCollections(collections, e.target.value))
    }

    const onSelectCollection = (e) => {
        const query = values

        const newCollection = e ? e.value : '*'

        delete query['schema']
        delete query['name']
        delete query['rarity']
        delete query['variant']

        query['collection'] = newCollection

        dispatch({ type: 'SET_SELECTED_COLLECTION', payload: newCollection })

        pushQueryString(qs.stringify(query))
    }

    const createCollectionDropDownOptions = (collections) => {
        if (collections && collections['data']) {
            setCollectionDropDownOptions(createCollections(collections['data'], false, 'All Collections', true))
            setCollections(collections['data'])
        }
    }

    useEffect(() => {
        if (process.browser && !collections && initialized) {
            state.collectionData.then((res) => createCollectionDropDownOptions(res))
        }
    }, [collection, state, initialized])

    const getCollectionOption = (options, collection) => {
        return options.map((item) => item.value).indexOf(collection)
    }

    const option = collection && collection !== '*' ? getCollectionOption(collectionDropDownOptions, collection) : -1

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
                        <Autocomplete
                            multiple={false}
                            options={collectionDropDownOptions}
                            getOptionLabel={(option) => (option ? option.title : null)}
                            renderOption={(option) => (
                                <React.Fragment>
                                    {option.image
                                        ? createCollectionImageOption(option.title, option.image)
                                        : createCollectionOption(option.title)}
                                </React.Fragment>
                            )}
                            defaultValue={option > -1 ? collectionDropDownOptions[option] : null}
                            id="collection-box"
                            style={{ width: '100%' }}
                            popupIcon={null}
                            onChange={(event, newValue) => {
                                onSelectCollection(newValue)
                            }}
                            onInput={(e) => onSearchCollection(e, collections)}
                            renderInput={(params) => (
                                <div className={option && option > 0 ? 'flex w-full h-8' : 'text-netural opacity-100'}>
                                    <TextField {...params} variant="standard" placeholder={'Collection'} />
                                </div>
                            )}
                        />
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
