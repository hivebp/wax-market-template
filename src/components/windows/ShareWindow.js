import React, { useEffect, useRef, useState } from 'react'
import cn from 'classnames'

import {
    FacebookShareButton,
    FacebookIcon,
    LineShareButton,
    LineIcon,
    RedditShareButton,
    RedditIcon,
    TelegramShareButton,
    TelegramIcon,
    TwitterShareButton,
    TwitterIcon,
    WeiboShareButton,
    WeiboIcon,
    WhatsappShareButton,
    WhatsappIcon,
} from 'react-share'

function useOutsideAlerter(ref, callBack) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                event.preventDefault()
                event.stopPropagation()
                callBack()
            }
        }
        // Bind the event listener
        document.addEventListener('click', handleClickOutside)
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener('click', handleClickOutside)
        }
    }, [ref])
}

function OutsideAlerter(props) {
    const wrapperRef = useRef(null)
    const callBack = props['callBack']
    useOutsideAlerter(wrapperRef, callBack)

    return <div ref={wrapperRef}>{props.children}</div>
}

function ShareWindow(props) {
    const link = props['link']
    const callBack = props['callBack']

    const close = () => {
        callBack(false)
    }

    return (
        <OutsideAlerter callBack={() => close()}>
            <div
                className={cn(
                    'absolute top-10 right-0 w-32 h-auto p-6',
                    'text-base font-light z-40',
                    'rounded-lg backdrop-filter-none shadow-md opacity-100',
                    'bg-gradient-to-br from-gray-500 via-700 to-gray-900',
                    'lg:backdrop-filter lg:backdrop-blur-md',
                )}
            >
                <div className="absolute mt-0 ml-0 top-0.5 left-0 w-6 h-6 opacity-70">
                    <img src="/share-outline.svg" alt="share" onClick={() => close()} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <TelegramShareButton
                        url={link}
                        quote={
                            'NFTHive.io - NFT Market on the WAX Blockchain - Simpleassets & Atomicassets - All Markets'
                        }
                        hashtag="#nfts"
                    >
                        <TelegramIcon size={36} />
                    </TelegramShareButton>
                    <TwitterShareButton
                        url={link}
                        quote={
                            'NFTHive.io - NFT Market on the WAX Blockchain - Simpleassets & Atomicassets - All Markets'
                        }
                        hashtag="#nfts"
                    >
                        <TwitterIcon size={36} />
                    </TwitterShareButton>
                    <FacebookShareButton
                        url={link}
                        quote={
                            'NFTHive.io - NFT Market on the WAX Blockchain - Simpleassets & Atomicassets - All Markets'
                        }
                        hashtag="#nfts"
                    >
                        <FacebookIcon size={36} />
                    </FacebookShareButton>
                    <LineShareButton
                        url={link}
                        quote={
                            'NFTHive.io - NFT Market on the WAX Blockchain - Simpleassets & Atomicassets - All Markets'
                        }
                        hashtag="#nfts"
                    >
                        <LineIcon size={36} />
                    </LineShareButton>
                    <RedditShareButton
                        url={link}
                        quote={
                            'NFTHive.io - NFT Market on the WAX Blockchain - Simpleassets & Atomicassets - All Markets'
                        }
                        hashtag="#nfts"
                    >
                        <RedditIcon size={36} />
                    </RedditShareButton>
                    <WhatsappShareButton
                        url={link}
                        quote={
                            'NFTHive.io - NFT Market on the WAX Blockchain - Simpleassets & Atomicassets - All Markets'
                        }
                        hashtag="#nfts"
                    >
                        <WhatsappIcon size={36} />
                    </WhatsappShareButton>
                    <WeiboShareButton
                        url={link}
                        quote={
                            'NFTHive.io - NFT Market on the WAX Blockchain - Simpleassets & Atomicassets - All Markets'
                        }
                        hashtag="#nfts"
                    >
                        <WeiboIcon size={36} />
                    </WeiboShareButton>
                </div>
            </div>
        </OutsideAlerter>
    )
}

export default ShareWindow
