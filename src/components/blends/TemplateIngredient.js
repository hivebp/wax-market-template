import cn from 'classnames'
import React, { useContext, useEffect } from 'react'
import PreviewImage from '../assetcard/PreviewImage'
import { Context } from '../marketwrapper'

function TemplateIngredient(props) {
    const template = props['template']
    const index = props['index']
    const [state, dispatch] = useContext(Context)

    const selectedAssets = state.selectedAssets

    const selected = template.assignedAsset && template.assignedAsset.asset_id

    useEffect(() => {
        if (!selected) {
        }
    }, [selected])

    const removeAsset = (asset) => {
        if (asset) {
            const newSelectedAssets = []
            selectedAssets &&
                selectedAssets.map((ass) => {
                    if (ass.asset_id !== asset.asset_id) {
                        newSelectedAssets.push(ass)
                    }
                })
            dispatch({ type: 'SET_SELECTED_ASSETS', payload: newSelectedAssets })
        }
    }

    return (
        <div
            className={cn(
                'relative w-full mx-auto rounded-md overflow-hidden',
                'flex flex-col',
                'text-base break-words',
                'backdrop-filter backdrop-blur-sm border',
                'shadow-md bg-paper',
                { 'border-primary': selected },
            )}
            id={'AssetPreview_' + index}
            onClick={() => removeAsset(template.assignedAsset)}
        >
            <div className={cn('')}>
                <div className={cn('w-full')}>
                    <PreviewImage {...props} asset={template.template} />
                </div>
                <div>{template.template.name}</div>
                <div>Template: {template.template.template_id}</div>
            </div>
        </div>
    )
}

export default TemplateIngredient
