import cn from "classnames";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import ResultList from "../packs/ResultList";
import React from "react";

function ResultWindow(props) {
    const stopAnimation = props['stopAnimation'];
    const showResults = props['showResults'];
    const showAnimation = props['showAnimation'];
    const results = props['results'];
    const animation = props['animation'];
    const acknowledge = props['acknowledge'];
    const bgColor = animation['bgColor'];

    const isLoading = props['isLoading'];
    return (
        <div style={{backgroundColor: bgColor}} className={cn(
            'fixed left-0 top-0',
            'w-full h-full',
            'text-sm text-neutral font-light opacity-100',
            'bg-paper rounded-xl shadow-lg z-100',
            'backdrop-filter backdrop-blur-lg',
        )}>
            <div className={cn('flex h-full')}>
                {showAnimation && !showResults ? <video className={cn("flex object-fill align-middle m-auto")} id={'unbox-animation'} onEnded={stopAnimation}
                                                        autoPlay={true} muted={false}>
                    <source src={animation.video} />
                    Your browser does not support the video tag.
                </video> : <div id={'Results'}>
                    {isLoading ? <LoadingIndicator /> : <div>
                        <ResultList
                            results={results}
                        />
                    </div>}
                </div> }
            </div>
            <img className="absolute z-50 cursor-pointer top-4 right-4 w-4 h-4 " id={'stop-animation'} onClick={
                showAnimation ? stopAnimation : acknowledge} src="/close_btn_bright.svg" alt="X" />
        </div>
    );
}

export default ResultWindow;