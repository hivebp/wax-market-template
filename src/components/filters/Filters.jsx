import cn from 'classnames'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useCollections, useSchemas, useTemplates } from '../../api/api_hooks'
import { useUAL } from '../../hooks/ual'
import CollectionDropdown from '../collectiondropdown'
import DropdownItem from '../collectiondropdown/DropdownItem'
import Input from '../common/util/input/Input'
import { useQuerystring } from '../helpers/Helpers'
import { Context } from '../marketwrapper'

/**
 *
 * @typedef {Record<'value' | 'label', string>} SortOptions
 */

/**
 * @typedef {Object} FilterProps
 * @property {string} [className]
 * @property {string} [searchPage]
 * @property {string} [defaultSort]
 * @property {string} [winner]
 * @property {string} [bidder]
 * @property {SortOptions[]} sortOptions
 **/

/**
 * @type {React.FC<FilterProps>}
 */
const Filters = (props) => {
    const [values, updateQuerystring] = useQuerystring()

    const collection = values['collection'] ? values['collection'] : '*'
    const schema = values['schema'] ? values['schema'] : ''
    const name = values['name'] ? values['name'] : ''
    const rarity = values['rarity'] ? values['rarity'] : ''
    const variant = values['variant'] ? values['variant'] : ''
    const seller = values['seller'] ? values['seller'] : ''
    const bundles = values['bundles'] ? values['bundles'] === 'true' : false
    const searchPage = values['searchPage'] ? values['searchPage'] : ''
    const winner = props['winner']
    const bidder = props['bidder']

    const ual = useUAL()
    const activeUser = ual?.['activeUser']
    const userName = activeUser ? activeUser['accountName'] : null

    const sortBy = values['sort'] ?? props.defaultSort ?? 'name_asc'

    const [state] = useContext(Context)

    // const [schemaDropdownOptions, setSchemaDropdownOptions] = useState(null)
    const [nameDropdownOptions, setNameDropdownOptions] = useState(null)
    const [rarityDropdownOptions, setRarityDropdownOptions] = useState(null)
    const [variantDropdownOptions, setVariantDropdownOptions] = useState(null)

    const sortDropdownOptions = [
        ...props.sortOptions,
        {
            value: 'mint_asc',
            label: 'Mint (Lowest)',
        },
        {
            value: 'mint_desc',
            label: 'Mint (Highest)',
        },
    ]

    const { data: collections } = useCollections()
    const { data: schemaData, loading: schemasLoading } = useSchemas()
    const { data: templateData, loading: templatesLoading } = useTemplates()

    // const getSchemasResult = (collection) => {
    //     if (schemaData['success']) {
    //         const schemaOptions = [{ value: '', label: '-' }]
    //         schemaData['data']
    //             .filter((item) => item['collection']['collection_name'] === collection)
    //             .sort((a, b) => compareValues(a['schema_name'], b['schema_name']))
    //             .map((item) =>
    //                 schemaOptions.push({
    //                     value: item['schema_name'],
    //                     label: item['schema_name'],
    //                 }),
    //             )

    //         setSchemaDropdownOptions(schemaOptions)
    //     }
    // }

    const filteredCollectionList = useMemo(
        () => (!collection || collection === '*' ? collections : [collection]),
        [collection, collections],
    )
    const schemaDropdownOptions = useMemo(() => {
        console.log(schemaData)
        return [
            { value: '', label: '-' },
            ...schemaData
                .filter((item) => item.collection.collection_name === collection)
                .sort((a, b) => a.schema_name.localeCompare(b.schema_name))
                .map((item) => ({
                    value: item.schema_name,
                    label: item.schema_name,
                })),
        ]
    }, [schemaData, filteredCollectionList])

    const compareValues = (a, b) => {
        if (a.toUpperCase() > b.toUpperCase()) {
            return 1
        } else if (a.toUpperCase() < b.toUpperCase()) {
            return -1
        } else {
            return 0
        }
    }

    // const getTemplatesResult = (collection) => {
    //     const names = []
    //     const rarities = []
    //     const variants = []
    //     if (templateData['success']) {
    //         templateData['data']
    //             .filter((item) => item['collection']['collection_name'] === collection)
    //             .map((item) => {
    //                 const data = item['immutable_data']
    //                 const itemSchema = item['schema']
    //                 if (
    //                     data['name'] &&
    //                     !names.includes(data['name']) &&
    //                     (!schema || (itemSchema && itemSchema['schema_name'] === schema)) &&
    //                     (!rarity || (data['rarity'] && data['rarity'] === rarity)) &&
    //                     (!variant || (data['variant'] && data['variant'] === variant))
    //                 ) {
    //                     names.push(data['name'])
    //                 }
    //                 if (
    //                     data['rarity'] &&
    //                     !rarities.includes(data['rarity']) &&
    //                     (!schema || (itemSchema && itemSchema['schema_name'] === schema)) &&
    //                     (!variant || (data['variant'] && data['variant'] === variant)) &&
    //                     (!name || (data['name'] && data['name'] === name))
    //                 ) {
    //                     rarities.push(data['rarity'])
    //                 }
    //                 if (
    //                     data['variant'] &&
    //                     !variants.includes(data['variant']) &&
    //                     (!schema || (itemSchema && itemSchema['schema_name'] === schema)) &&
    //                     (!rarity || (data['rarity'] && data['rarity'] === rarity)) &&
    //                     (!name || (data['name'] && data['name'] === name))
    //                 ) {
    //                     variants.push(data['variant'])
    //                 }
    //             })
    //         if (names.length > 0) {
    //             const options = [{ value: '', label: '-' }]
    //             names
    //                 .sort((a, b) => compareValues(a, b))
    //                 .map((name) => {
    //                     options.push({
    //                         value: name,
    //                         label: name,
    //                     })
    //                 })
    //             setNameDropdownOptions(options)
    //         }
    //         if (rarities.length > 0) {
    //             const options = [{ value: '', label: '-' }]
    //             rarities
    //                 .sort((a, b) => a.toUpperCase() - b.toUpperCase())
    //                 .map((rarity) =>
    //                     options.push({
    //                         value: rarity,
    //                         label: rarity,
    //                     }),
    //                 )
    //             setRarityDropdownOptions(options)
    //         }
    //         if (variants.length > 0) {
    //             const options = [{ value: '', label: '-' }]
    //             variants
    //                 .sort((a, b) => a.toUpperCase() - b.toUpperCase())
    //                 .map((variant) =>
    //                     options.push({
    //                         value: variant,
    //                         label: variant,
    //                     }),
    //                 )
    //             setVariantDropdownOptions(options)
    //         }
    //     }
    // }

    const initialized =
        state.collections !== null &&
        state.collections !== undefined &&
        state.templateData !== null &&
        state.templateData !== undefined &&
        state.schemaData !== null &&
        state.schemaData !== undefined

    useEffect(() => {
        // if (!schemaData && state.schemaData) state.schemaData.then((res) => setSchemaData(res))
        // if (!templateData && state.templateData) state.templateData.then((res) => setTemplateData(res))
        if (
            typeof window !== 'undefined' &&
            ((collection && collection !== '*') || (state.collections && state.collections.length === 1)) &&
            initialized
        ) {
            // const filterCollection = state.collections.filter((item) =>
            //     !collection || collection === '*' ? true : item === collection,
            // )[0]
            // if (schemaData) getSchemasResult(filterCollection)
            // if (templateData) getTemplatesResult(filterCollection)
        } else {
            // setSchemaDropdownOptions([])
        }
    }, [collection, schemaData, templateData, initialized])

    const onSelectSchema = (e) => {
        const query = values

        query['schema'] = e ? e.value : ''

        delete query['name']
        delete query['rarity']
        delete query['variant']

        updateQuerystring(query)
    }

    const onSelectName = (e) => {
        const query = values

        query['name'] = e ? e.value : ''

        updateQuerystring(query)
    }

    const onSelectRarity = (e) => {
        const query = values

        query['rarity'] = e ? e.value : ''

        updateQuerystring(query)
    }

    const onSelectVariant = (e) => {
        const query = values

        query['variant'] = e ? e.value : ''

        updateQuerystring(query)
    }

    const onSelectSorting = (e) => {
        const query = values

        query['sort'] = e ? e.value : ''

        updateQuerystring(query)
    }

    const checkMyListings = (e) => {
        const query = values

        if (query['seller'] === userName) delete query['seller']
        else query['seller'] = userName

        updateQuerystring(query)
    }

    const checkBundles = (e) => {
        const query = values

        if (query['bundles'] === 'true') delete query['bundles']
        else query['bundles'] = 'true'

        updateQuerystring(query)
    }

    return (
        <div>
            <h3 className={cn('text-neutral font-bold text-xl mb-4')}>Filters</h3>
            <CollectionDropdown collection={collection} />
            {schemaDropdownOptions ? (
                <DropdownItem
                    header="Schema"
                    options={schemaDropdownOptions}
                    onChange={onSelectSchema}
                    value={schema}
                />
            ) : (
                ''
            )}
            {nameDropdownOptions ? (
                <DropdownItem header="Name" options={nameDropdownOptions} onChange={onSelectName} value={name} />
            ) : (
                ''
            )}
            {rarityDropdownOptions ? (
                <DropdownItem
                    header="Rarity"
                    options={rarityDropdownOptions}
                    onChange={onSelectRarity}
                    value={rarity}
                />
            ) : (
                ''
            )}
            {variantDropdownOptions ? (
                <DropdownItem
                    header="Variant"
                    options={variantDropdownOptions}
                    onChange={onSelectVariant}
                    value={variant}
                />
            ) : (
                ''
            )}
            {sortDropdownOptions ? (
                <DropdownItem
                    header="Sort By"
                    options={sortDropdownOptions}
                    onChange={onSelectSorting}
                    value={sortBy}
                />
            ) : (
                ''
            )}
            {searchPage === 'market' ? (
                <div className="ml-1">
                    <Input type="checkbox" className="mr-2" checked={seller === userName} onChange={checkMyListings} />
                    My Listings
                </div>
            ) : (
                ''
            )}
            {searchPage === 'auctions' && !winner && !bidder ? (
                <div className="ml-1">
                    <Input type="checkbox" className="mr-2" checked={seller === userName} onChange={checkMyListings} />
                    My Auctions
                </div>
            ) : (
                ''
            )}
            {searchPage === 'market' ? (
                <div className="ml-1">
                    <Input type="checkbox" className="mr-2" checked={bundles} onChange={checkBundles} />
                    Bundles Only
                </div>
            ) : (
                ''
            )}
        </div>
    )
}

export default Filters
