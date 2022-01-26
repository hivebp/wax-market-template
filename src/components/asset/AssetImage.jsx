import cn from 'classnames'
import React, { useMemo, useState } from 'react'
import config from '../../config.json'

/**
 * @type {React.FC<Partial<Record<'video' | 'img' | 'backimg', string>>>}
 */
const AssetImage = ({ backimg, img, video }) => {
    const [imagePosition, setImagePosition] = useState(0)

    /** @type {({ type: 'video' | 'image', media: any })[]} */
    const mediaFormats = []
    if (video) mediaFormats.push({ type: 'video', media: video })
    if (img) mediaFormats.push({ type: 'image', media: img })
    if (backimg) mediaFormats.push({ type: 'image', media: backimg })

    const selectedMedia = useMemo(() => mediaFormats[imagePosition % mediaFormats.length], [imagePosition])

    const mediaElement = useMemo(
        () =>
            selectedMedia.type === 'video' ? (
                <video width="400" height="400" controls autoPlay={true} muted={false}>
                    <source src={config.ipfs + selectedMedia.media} />
                    Your browser does not support the video tag.
                </video>
            ) : (
                <img className="max-w-full max-h-img-asset m-auto" src={config.ipfs + selectedMedia.media} alt="none" />
            ),
        [selectedMedia],
    )

    return (
        <div className="relative flex justify-center asset-img w-full h-auto border p-4 pb-16 border-none">
            {mediaElement}
            <div className="absolute flex justify-evenly w-full bottom-5 t-img-btn">
                {mediaFormats.map((_, index) => (
                    <div
                        className="h-6 text-base align-middle text-white cursor-pointer bg-transparent outline-none border-none"
                        onClick={() => setImagePosition(index)}
                    >
                        <div
                            className={cn('inline-block rounded-full', 'h-6 w-6', {
                                'bg-primary': index === imagePosition,
                                'bg-paper': index !== imagePosition,
                            })}
                        ></div>
                        <span className={cn('inline-block ml-3 text-sm text-neutral')}>
                            {mediaFormats[index].type === 'image' ? 'Image' : 'Video'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AssetImage
