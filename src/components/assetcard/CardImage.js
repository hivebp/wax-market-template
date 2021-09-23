import React from "react";
import config from "../../config.json";


function CardImage(props) {
    const index = props['index'];
    const asset = props['asset'];

    const data = 'data' in asset ? asset['data'] : asset['immutable_data'];

    const image = data['img'] ? data['img'].includes(
        'http') ? data['img'] : config.ipfs + data['img'] : '';
    let video = data['video'] ? data['video'].includes(
        'http') ? data['video'] : config.ipfs + data['video'] : '';

    if (data && Object.keys(data).includes('video')) {
        video = data['video'].includes('http') ? data['video'] : config.ipfs + data['video'];
    }

    return (
        <div className="flex content-center">
            {
                image ?
                    <img className="preview-img my-auto max-h-full" src = {image} alt="none" /> :
                video ?
                    <video className="w-full" id={'video'+index} width="190" height="190" loop
                           autoPlay={true} muted={true} playsInline={true} poster={image ? image : ''}>
                        <source src={video} />
                        Your browser does not support the video tag.
                    </video>
                : ''
             }
        </div>
    );
}

export default CardImage;