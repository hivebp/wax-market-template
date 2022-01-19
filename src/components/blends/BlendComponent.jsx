import cn from 'classnames'
import React, { useContext, useEffect, useState } from 'react'
import { getCollection, getTemplate } from '../../api/fetch'
import { useUAL } from '../../hooks/ual'
import AssetImage from '../asset/AssetImage'
import CheckIndicator from '../check/CheckIndicator'
import Page from '../common/layout/Page'
import Header from '../common/util/Header'
import Button from '../common/util/input/Button'
import LoadingIndicator from '../loadingindicator/LoadingIndicator'
import { Context } from '../marketwrapper'
import MyAssetList from './MyAssetList'
import TemplateIngredient from './TemplateIngredient'

const BlendComponent = (props) => {
    const blend = props.blend
    const [state, dispatch] = useContext(Context)

    const [collection, setCollection] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingBlend, setIsLoadingBlend] = useState(false)
    const [wasBlended, setWasBlended] = useState(false)
    const [templates, setTemplates] = useState([])
    const { ingredients, display_data, collection_name } = blend

    const ual = useUAL()
    const activeUser = ual['activeUser']
    const userName = activeUser ? activeUser['accountName'] : null

    const selectedAssets = state.selectedAssets

    /** @type {{ template: any, assignedAsset: any }[]} */
    const templatesNeeded = []
    /** @type {string[]} */
    const searchTemplates = []
    /** @type {string[]} */
    const assignedAssetIds = []

    ingredients.map((ingredient) => {
        if (ingredient[0] === 'TEMPLATE_INGREDIENT') {
            for (let i = 0; i < ingredient[1].amount; i++) {
                let assignedAsset = null
                selectedAssets &&
                    selectedAssets.map((asset) => {
                        if (
                            !assignedAsset &&
                            !assignedAssetIds.includes(asset['asset_id']) &&
                            asset.template.template_id.toString() === ingredient[1].template_id.toString()
                        ) {
                            assignedAsset = asset
                            assignedAssetIds.push(asset['asset_id'])
                        }
                    })

                if (!Object.keys(searchTemplates).includes(ingredient[1].template_id)) {
                    searchTemplates[ingredient[1].template_id] = {
                        collection_name: ingredient[1].collection_name,
                    }
                }

                templates.map((template) => {
                    if (template.template_id.toString() === ingredient[1].template_id.toString()) {
                        templatesNeeded.push({
                            template: template,
                            assignedAsset: assignedAsset,
                        })
                    }
                })
            }
        }
    })

    const data = JSON.parse(display_data)

    const { image, name } = data

    const title = `Check out ${blend.name}`

    const parseTemplates = (res) => {
        const temps = []

        res.map((template) => {
            if (template && template.success) {
                temps.push(template.data)
            }
        })

        setTemplates(temps)
        setIsLoading(false)
        setIsLoadingBlend(false)
    }

    useEffect(() => {
        Promise.all(
            Object.keys(searchTemplates).map((template_id) => {
                return getTemplate({ templateId: template_id, collectionName: searchTemplates[template_id] })
            }),
        ).then((res) => parseTemplates(res))

        getCollection(collection_name).then((res) => res && res.success && setCollection(res.data))

        dispatch({ type: 'SET_SELECTED_ASSETS', payload: null })
    }, [collection_name, wasBlended])

    const blendMore = async () => {
        setWasBlended(false)
    }

    const blendAction = async () => {
        setIsLoadingBlend(true)
        await activeUser.signTransaction(
            {
                actions: [
                    {
                        account: 'atomicassets',
                        name: 'transfer',
                        authorization: [
                            {
                                actor: userName,
                                permission: activeUser['requestPermission'],
                            },
                        ],
                        data: {
                            from: userName,
                            memo: 'blend:' + blend.blend_id,
                            asset_ids: selectedAssets.map((asset) => asset.asset_id),
                            to: 'blend.nefty',
                        },
                    },
                ],
            },
            {
                expireSeconds: 300,
                blocksBehind: 0,
            },
        )
        setWasBlended(true)
    }

    const ready =
        wasBlended ||
        (templatesNeeded.length > 0 &&
            templatesNeeded
                .map((template) => template.assignedAsset && template.assignedAsset !== undefined)
                .reduce((a, b) => a && b))

    return (
        <Page id="BlendPage">
            <Header title={title} image={image} description={data['description']} />
            {isLoading ? (
                <LoadingIndicator />
            ) : (
                <div className={cn('container mx-auto pt-10')}>
                    <div className="w-full h-auto text-center md:px-10">
                        <div className="flex items-center justify-center h-auto">
                            <div className="w-full md:w-96 flex flex-col items-center">
                                <div
                                    className={cn(
                                        'relative w-full text-center rounded-md overflow-hidden',
                                        'text-base break-words',
                                        'backdrop-filter backdrop-blur-sm border border-paper',
                                        'shadow-md bg-paper',
                                    )}
                                >
                                    <AssetImage asset={{ data: { img: image } }} />
                                    <div className={cn('absolute w-full bottom-4 left-1/2 transform -translate-x-1/2')}>
                                        {name}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Button
                            className={cn(
                                'py-1 px-8 text-secondary mt-3 mb-3 mx-auto',
                                'cursor-pointer text-sm font-bold leading-relaxed uppercase',
                                'rounded-3xl outline-none',
                                { 'bg-primary': ready },
                                { 'bg-paper': !ready },
                            )}
                            onClick={wasBlended ? blendMore : blendAction}
                            disabled={!ready}
                        >
                            {wasBlended ? 'Blend More' : 'Blend'}
                        </Button>
                        {wasBlended ? <CheckIndicator /> : ''}
                        {isLoadingBlend ? (
                            <LoadingIndicator />
                        ) : (
                            !wasBlended && (
                                <div className="bg-paper px-4 py-2 rounded">
                                    <div className="text-left p-2 text-xl">Ingredients</div>
                                    <div
                                        className={cn(
                                            'w-full grid grid-cols-4 md:grid-cols-6 2xl:grid-cols-8 gap-2 md:gap-10',
                                        )}
                                    >
                                        {isLoading ? (
                                            <LoadingIndicator />
                                        ) : (
                                            templatesNeeded.map((template, index) => (
                                                <TemplateIngredient template={template} index={index} />
                                            ))
                                        )}
                                    </div>
                                </div>
                            )
                        )}
                        {!isLoadingBlend && !wasBlended && (
                            <div className="mt-5 bg-paper px-4 py-2 rounded">
                                <div className="text-left p-2 text-xl">My Assets</div>
                                <MyAssetList
                                    templates={templates}
                                    {...props}
                                    templatesNeeded={templatesNeeded.filter((template) => !template.assignedAsset)}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Page>
    )
}

export default BlendComponent
