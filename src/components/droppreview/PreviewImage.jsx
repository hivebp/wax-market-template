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

    console.log(`img, vid::: ${img}, ${video}`)
    console.log(`img, vid::: ${img}, ${video}`)

    console.log('config.ipfs + video', config.ipfs + video)
    console.log("img.includes('http') ? img : config.ipfs + img", config.ipfs + img)

    if (img) {
        const imageSrc = img.includes('http') ? img : config.ipfs + img
        return (
            <div className="flex content-center">
                {<img className="preview-img my-auto" src={imageSrc} alt="none" />}
            </div>
        )
    } else if (video) {
        let imageSrc = null

        if(imageSrc) {
            imageSrc = img.includes('http') ? img : config.ipfs + img
        }
        const videoSrc = video.includes('http') ? video : config.ipfs + video

        return (
            <div className="flex content-center">
                { <video
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
                </video>}
            </div>
        )
    } else {
        return <div className="flex content-center">No data</div>
    }
}

export default PreviewImage
