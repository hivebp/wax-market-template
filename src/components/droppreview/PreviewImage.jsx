import React from 'react'
import config from '../../config.json'

function PreviewImage(props) {
    const index = props['index']
    const asset = props['asset']

    const data = Object.keys(asset).includes('immutable_data') ? asset['immutable_data'] : asset['mutable_data']

    const image = asset['immutable_data']['img']
        ? asset['immutable_data']['img'].includes('http')
            ? asset['immutable_data']['img']
            : config.ipfs + asset['immutable_data']['img']
        : ''
    let video = asset['immutable_data']['video']
        ? asset['immutable_data']['video'].includes('http')
            ? asset['immutable_data']['video']
            : asset['immutable_data']['video'].includes('http')
            ? asset['immutable_data']['video']
            : config.ipfs + data['video']
        : ''

    return (
        <div className="flex content-center">
            {image ? (
                <img className="preview-img my-auto" src={image} alt="none" />
            ) : video ? (
                <video
                    className="w-full"
                    id={'video' + index}
                    width="190"
                    height="190"
                    loop
                    autoPlay={true}
                    muted={true}
                    playsInline={true}
                    poster={image ? image : ''}
                >
                    <source src={video} />
                    Your browser does not support the video tag.
                </video>
            ) : (
                ''
            )}
        </div>
    )
}

export default PreviewImage
