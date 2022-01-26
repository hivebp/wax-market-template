import React from 'react'
import config from '../../config.json'

/**
 * @type {React.FC<{ data: Partial<{ immutable_data: any, mutable_data: any}> }>}
 */
export const PreviewImage = ({ data: { immutable_data, mutable_data } }) => {
    const data = immutable_data ?? mutable_data

    if (!data) return null

    const { img, video } = data

    if (!img && !video) return null

    const imageSrc = img.includes('http') ? img : config.ipfs + img
    const videoSrc = undefined // video.includes('http') ? video : config.ipfs + video

    return (
        <div className="flex content-center">
            {/* {video ? (
                <video
                    className="w-full"
                    width="190"
                    height="190"
                    loop
                    autoPlay={true}
                    muted={true}
                    playsInline={true}
                    poster={img ? imageSrc : undefined}
                >
                    <source src={videoSrc} />
                    Your browser does not support the video tag.
                </video>
            ) : (
                )} */}
            <img className="preview-img my-auto" src={imageSrc} alt="none" />
        </div>
    )
}

export default PreviewImage
