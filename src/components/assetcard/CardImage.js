import React, { useEffect, useState } from 'react'
import config from '../../config.json'
import cn from 'classnames'

function CardImage(props) {
    const index = props['index']
    const asset = props['asset']

    const data = 'data' in asset ? asset['data'] : asset['immutable_data']

    const image = data['img'] ? (data['img'].includes('http') ? data['img'] : config.ipfs + data['img']) : ''
    let video = data['video'] ? (data['video'].includes('http') ? data['video'] : config.ipfs + data['video']) : ''

    if (data && Object.keys(data).includes('video')) {
        video = data['video'].includes('http') ? data['video'] : config.ipfs + data['video']
    }

    useEffect(() => {}, [index, video])

    return (
        <div className="flex content-center">
            {image ? (
                <img className="preview-img my-auto max-h-full" src={image} alt="none" />
            ) : (
                video && (
                    <video
                        className={cn('w-full')}
                        id={'video' + index}
                        width="190"
                        height="190"
                        loop
                        src={video}
                        autoPlay={true}
                        muted={true}
                        preload={true}
                        poster={image ? image : ''}
                    />
                )
            )}
        </div>
    )
}

export default CardImage
