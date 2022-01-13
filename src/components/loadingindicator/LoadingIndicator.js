import React from 'react'

export const LoadingIndicator = (props) => {
    const text = props.text ?? props.children ?? null
    return text ? (
        <div>
            <div className="flex justify-center m-auto">
                <img
                    data-testid="loading-spinner"
                    src="/Loader.svg"
                    className="w-8 h-8 m-auto animate-spin duration-1000"
                    alt="Loading"
                />
            </div>
            <div data-testid="loading-text">{text}</div>
        </div>
    ) : (
        <div className="flex justify-center m-auto">
            <img
                data-testid="loading-spinner"
                src="/Loader.svg"
                className="w-8 h-8 m-auto animate-spin duration-1000"
                alt="Loading"
            />
        </div>
    )
}

export default LoadingIndicator
