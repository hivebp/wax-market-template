import React from 'react';
import cn from "classnames";


function ErrorMessage(props) {
    const error = props['error'];
    // const layer = props['layer'];
    const layer = true;
    
    return (
        <div
            className={cn(
                'fixed top-64 left-error py-3 px-4',
                'flex flex-row items-center',
                'bg-yellow-300 bg-opacity-20',
                'border-2 border-solid rounded-2xl border-yellow-300',
                {'z-30' : layer},
            )}
        >
            <div className="m-auto">
                <img className="w-5 h-5" src="/Warning_icn.svg" alt="!" />
            </div>
            <div className="pl-4 m-auto">
                {error}
                Caution!<br/>
                Some errors came out.
            </div>
        </div>
    );
}

export default ErrorMessage;
