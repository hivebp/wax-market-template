import cn from 'classnames'
import React from 'react'
import config from '../../config.json'

/** @type {React.FC<{ asset: import('../../api/fetch').Asset }>} **/
const CardImage = ({ asset }) => {
    const data = 'data' in asset ? asset['data'] : asset['immutable_data']

    const image = data['img'] ? (data['img'].includes('http') ? data['img'] : config.ipfs + data['img']) : ''
    let video = data['video'] ? (data['video'].includes('http') ? data['video'] : config.ipfs + data['video']) : ''

    if (data && Object.keys(data).includes('video')) {
        video = data['video'].includes('http') ? data['video'] : config.ipfs + data['video']
    }

    return (
        <div className="flex content-center">
            {image ? (
                <img className="preview-img my-auto max-h-full" src={image} alt="none" />
            ) : (
                video && (
                    <video
                        className={cn('w-full')}
                        width="190"
                        height="190"
                        loop
                        src={video}
                        autoPlay={true}
                        muted={true}
                        preload="auto"
                        poster={image ? image : ''}
                    />
                )
            )}
        </div>
    )
}

export default CardImage
