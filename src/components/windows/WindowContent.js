import React from 'react'
import cn from 'classnames'

export default function WindowContent(
    {image, video, collection, schema}
) {
    return (
        <div className="lg:flex lg:justify-between text-center my-4">
            <div className={cn(
                'w-full lg:w-2/5 flex justify-center'
            )}>
                { video ?
                    <video width="190" height="190" loop autoPlay={true} muted={true} playsInline={true} poster={image ? image : ''}>
                        <source src={video} />
                        Your browser does not support the video tag.
                    </video> :
                    <img className="w-48 h-48 m-auto" src={image} alt="none" /> }
            </div>
            <div className={cn(
                'my-2.5 lg:m-auto px-8 w-full lg:w-3/5',
                'text-base overflow-y-auto',
            )}>
                <table className="w-full">
                    <tbody>
                        <tr>
                            <td className="text-white text-left"><b>Collection:</b></td>
                            <td className="text-white text-right">{collection}</td>
                        </tr>
                        <tr>
                            <td className="text-white text-left"><b>Schema:</b></td>
                            <td className="text-white text-right">{schema}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}