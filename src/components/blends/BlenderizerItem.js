import cn from 'classnames'
import React, { useContext, useEffect, useState } from 'react'
import CollectionTitle from '../assetcard/CollectionTitle'
import Link from '../common/util/input/Link'
import LoadingIndicator from '../loadingindicator/LoadingIndicator'
import { Context } from '../marketwrapper'
import BlendPreviewImage from './BlendPreviewImage'

function BlenderizerItem(props) {
    const [state, dispatch] = useContext(Context)
    const [isLoading, setIsLoading] = useState(true)
    const [template, setTemplate] = useState(null)

    const blend = props['blend']

    const { target, collection } = blend

    const parseTemplates = (res) => {
        if (
            res &&
            res['success'] &&
            res['data'].filter((template) => template.template_id.toString() === target.toString()).length > 0
        )
            setTemplate(res['data'].filter((template) => template.template_id.toString() === target.toString())[0])

        setIsLoading(false)
    }

    const initialized = state && state.templateData

    useEffect(() => {
        if (initialized) {
            state.templateData.then(parseTemplates)
        }
    }, [target, initialized])

    return (
        <div className={cn('w-full')}>
            {isLoading || !template ? (
                <LoadingIndicator />
            ) : (
                <div
                    className={cn(
                        'relative w-full mx-auto rounded-md overflow-hidden',
                        'flex flex-col',
                        'text-base break-words',
                        'backdrop-filter backdrop-blur-sm border border-paper',
                        'shadow-md bg-paper',
                    )}
                >
                    <CollectionTitle collection={collection} />
                    <Link href={`/blenderizer/${collection}/${target}`}>
                        <div className={cn('w-full')}>
                            <BlendPreviewImage {...props} asset={template} />
                        </div>
                        <div
                            className={cn(
                                'w-full flex justify-center items-center p-2 h-16',
                                'text-center text-base font-light text-neutral',
                            )}
                        >
                            View Blend
                        </div>
                    </Link>
                </div>
            )}
        </div>
    )
}

export default BlenderizerItem
