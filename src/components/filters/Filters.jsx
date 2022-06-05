import { ArrowDownward } from '@material-ui/icons'
import cn from 'classnames'
import React, { useMemo, useState } from 'react'
import { useCollections, useSchemas, useTemplates } from '../../api/api_hooks'
import { useMediaQuery } from '../../hooks/mediaquery'
import { useUAL } from '../../hooks/ual'
import CollectionDropdown from '../collectiondropdown'
import DropdownItem from '../collectiondropdown/DropdownItem'
import Input from '../common/util/input/Input'
import SvgIcon from '../common/util/SvgIcon'
import { useQuerystring } from '../helpers/Helpers'

/** @typedef {import('react-dropdown').Option} Option */

/**
 *
 * @typedef {Record<'value' | 'label', string>} SortOptions
 */

/**
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
const strCompare = (a, b) => a.localeCompare(b)

/**
 * @param {string} value
 * @param {number} count
 * @returns {Option}
 */
const toOptions = (value, count) => ({ label: `${value} (${count})`, value })

/**
 *
 * @param {Record<string, number>} data
 * @returns {Option[]}
 */
const makeOptions = (data) => [
    { value: '', label: '-' },
    ...Object.keys(data)
        .sort(strCompare)
        .map((value) => toOptions(value, data[value])),
]

/**
 * @type {(handler: (value: string) => void) => React.ChangeEventHandler<HTMLInputElement>}
 */
const createInputChangeHandler = (handler) => (event) => handler(event.target.value)
/**
 * @type {(handler: (value: string) => void) => (option: Option) => void}
 */
const createDropdownSelectHandler = (handler) => (option) => handler(option.value)

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
    const [queryparams, updateQuerystring] = useQuerystring()

    const collection = queryparams['collection'] ? queryparams['collection'] : '*'
    const schema = queryparams['schema'] ? queryparams['schema'] : ''
    const name = queryparams['name'] ? queryparams['name'] : ''
    const rarity = queryparams['rarity'] ? queryparams['rarity'] : ''
    const variant = queryparams['variant'] ? queryparams['variant'] : ''
    const seller = queryparams['seller'] ? queryparams['seller'] : ''
    const bundles = queryparams['bundles'] ? queryparams['bundles'] === 'true' : false
    const searchPage = queryparams['searchPage'] ? queryparams['searchPage'] : ''
    const winner = props['winner']
    const bidder = props['bidder']
    const ual = useUAL()
    const activeUser = ual?.['activeUser']
    const userName = activeUser ? activeUser['accountName'] : null
    const sortBy = queryparams['sort'] ?? props.defaultSort ?? 'name_asc'
    const [open, setOpen] = useState(false)

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

    const { data: collections, loading } = useCollections()
    const collectionFilter = useMemo(
        () => (collection && collection !== '*' ? [collection] : collections),
        [collection, collections],
    )
    const filter = useMemo(
        () => ({
            collections: collectionFilter,
        }),
        [collectionFilter],
    )
    const { data: schemaData, loading: schemasLoading } = useSchemas(filter)
    const { data: templateData, loading: templatesLoading } = useTemplates(filter)

    const schemaDropdownOptions = useMemo(
        () => [
            { value: '', label: '-' },
            ...schemaData
                .filter((item) => collection === '*' || item.collection.collection_name === collection)
                .sort((a, b) => a.schema_name.localeCompare(b.schema_name))
                .map((item) => ({
                    value: item.schema_name,
                    label: item.schema_name,
                })),
        ],
        [schemaData],
    )

    const { nameDropdownOptions, rarityDropdownOptions, variantDropdownOptions } = useMemo(() => {
        /** @type {Record<string, number>} */
        const nameCounter = {}
        /** @type {Record<string, number>} */
        const rarityCounter = {}
        /** @type {Record<string, number>} */
        const variantCounter = {}

        const filteredTemplateData = templateData.filter((item) => {
            const data = item.immutable_data
            if (collection !== '*' && item.collection.collection_name !== collection) return false
            if (schema && item.schema.schema_name !== schema) return false
            if (rarity && data.rarity !== rarity) return false
            if (variant && data.variant !== variant) return false
            return true
        })

        filteredTemplateData.forEach((item) => {
            const data = item.immutable_data
            if ('name' in data) nameCounter[data.name.toLowerCase()] = (nameCounter[data.name.toLowerCase()] || 0) + 1
            if ('rarity' in data)
                rarityCounter[data.rarity.toLowerCase()] = (rarityCounter[data.rarity.toLowerCase()] || 0) + 1
            if ('variant' in data)
                variantCounter[data.variant.toLowerCase()] = (variantCounter[data.variant.toLowerCase()] || 0) + 1
        })

        return {
            nameDropdownOptions: makeOptions(nameCounter),
            rarityDropdownOptions: makeOptions(rarityCounter),
            variantDropdownOptions: makeOptions(variantCounter),
        }
    }, [templateData, collection, schema, rarity, variant])

    const onSelectSchema = createDropdownSelectHandler((value) => {
        const query = queryparams

        query.schema = value

        delete query.name
        delete query.rarity
        delete query.variant

        updateQuerystring(query)
    })

    const onSelectName = createDropdownSelectHandler((value) => updateQuerystring({ name: value }, true))
    const onSelectRarity = createDropdownSelectHandler((value) => updateQuerystring({ rarity: value }, true))
    const onSelectVariant = createDropdownSelectHandler((value) => updateQuerystring({ variant: value }, true))
    const onSelectSorting = createDropdownSelectHandler((value) => updateQuerystring({ sort: value }, true))
    const checkMyListings = createInputChangeHandler((value) => {
        const query = queryparams

        if (query.seller === userName) delete query.seller
        else query.seller = userName

        updateQuerystring(query)
        window.location.reload(false)
    })

    const checkBundles = createInputChangeHandler((value) => {
        const query = queryparams

        if (query.bundles === 'true') delete query.bundles
        else query.bundles = 'true'

        updateQuerystring(query)
    })

    const inputs = useMemo(
        () => (
            <>
                <CollectionDropdown collection={collection} />
                {schemaDropdownOptions.length ? (
                    <DropdownItem
                        header="Schema"
                        options={schemaDropdownOptions}
                        onChange={onSelectSchema}
                        value={schema}
                    />
                ) : null}
                {nameDropdownOptions.length ? (
                    <DropdownItem header="Name" options={nameDropdownOptions} onChange={onSelectName} value={name} />
                ) : null}
                {rarityDropdownOptions.length ? (
                    <DropdownItem
                        header="Rarity"
                        options={rarityDropdownOptions}
                        onChange={onSelectRarity}
                        value={rarity}
                    />
                ) : null}
                {variantDropdownOptions.length ? (
                    <DropdownItem
                        header="Variant"
                        options={variantDropdownOptions}
                        onChange={onSelectVariant}
                        value={variant}
                    />
                ) : null}
                {sortDropdownOptions.length ? (
                    <DropdownItem
                        header="Sort By"
                        options={sortDropdownOptions}
                        onChange={onSelectSorting}
                        value={sortBy}
                    />
                ) : null}
                {searchPage === 'market' ? (
                    <>
                        <div className="ml-1">
                            <Input
                                type="checkbox"
                                className="mr-2"
                                checked={seller === userName}
                                onChange={checkMyListings}
                            />
                            My Listings
                        </div>
                        <div className="ml-1">
                            <Input type="checkbox" className="mr-2" checked={bundles} onChange={checkBundles} />
                            Bundles Only
                        </div>
                    </>
                ) : null}
                {searchPage === 'auctions' && !winner && !bidder ? (
                    <div className="ml-1">
                        <Input
                            type="checkbox"
                            className="mr-2"
                            checked={seller === userName}
                            onChange={checkMyListings}
                        />
                        My Auctions
                    </div>
                ) : null}
            </>
        ),
        [
            bidder,
            bundles,
            checkBundles,
            checkMyListings,
            collection,
            name,
            nameDropdownOptions,
            onSelectName,
            onSelectRarity,
            onSelectSchema,
            onSelectSorting,
            onSelectVariant,
            rarity,
            rarityDropdownOptions,
            schemaDropdownOptions,
            searchPage,
            seller,
            sortBy,
            sortDropdownOptions,
            userName,
            variant,
            variantDropdownOptions,
            winner,
        ],
    )

    // @TODO read this value somehow from tailwind
    const small = useMediaQuery('(max-width: 768px)', true)

    if (small)
        return (
            <div>
                <header className="flex items-center mb-4" onClick={() => setOpen((open) => !open)}>
                    <button className={cn('transition-transform transform-gpu', { 'rotate-180': !open })}>
                        <SvgIcon icon={<ArrowDownward fontSize="medium" />} />
                    </button>
                    <h3 className="text-neutral font-bold text-xl border-b-4 border-primary">Filters</h3>
                </header>
                <div className={cn('overflow-hidden transition-height', { 'h-auto': open }, { 'h-0': !open })}>
                    {inputs}
                </div>
            </div>
        )

    return (
        <div>
            <h3 className={cn('text-neutral font-bold text-xl mb-4')}>Filters</h3>
            {inputs}
        </div>
    )
}

export default Filters
