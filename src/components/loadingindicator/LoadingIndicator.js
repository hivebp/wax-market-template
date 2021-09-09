import React from 'react';


function LoadingIndicator(props) {
    const text = props['text'];
    return text ?
    (
        <div>
            <div className="flex justify-center m-auto">
                <img src="/Loader.svg" className="w-8 h-8 m-auto animate-spin duration-1000" alt="Loading" />
            </div>
            <div>{text}</div>
        </div>
    ) : (
        <div className="flex justify-center m-auto">
            <img src="/Loader.svg" className="w-8 h-8 m-auto animate-spin duration-1000" alt="Loading" />
        </div>
    );
}

export default LoadingIndicator;
