import React, {useContext, useEffect, useState} from 'react';
import cn from "classnames";
import WindowButton from './WindowButton';
import WindowContent from './WindowContent';

import ErrorMessage from "../common/util/ErrorMessage";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import config from "../../config.json";
import {Context} from "../marketwrapper";
import {claimPack} from "../helpers/Helpers";
import ResultWindow from "./ResultWindow";


function UnboxPopup(props) {
    const asset = props['asset'];

    const {collection, schema, name, data} = asset;

    const image = data['img'] ? data['img'].includes('http') ? data['img'] : config.ipfs + data['img'] : '';

    const video = data['video'] ? data['video'].includes(
        'http') ? data['video'] : config.ipfs + data['video'] : '';

    const ual = props['ual'] ? props['ual'] : {'activeUser': null};
    const activeUser = ual['activeUser'];

    const callBack = props['callBack'];

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const closeCallBack = props['closeCallBack'];
    const [animation, setAnimation] = useState(null);
    const [showAnimation, setShowAnimation] = useState(true);
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState([]);
    const [pack, setPack] = useState(null);
    const [templates, setTemplates] = useState(null);

    const [ state, dispatch ] = useContext(Context);


    const parsePacks = (data) => {
        const packs = data[0];
        const templatesRes = data[1];

        if (templatesRes && templatesRes.success) {
            setTemplates(templatesRes.data);
        }

        for (let i = 0; i < packs.length; i++) {
            if (packs[i].templateId.toString() === asset.template.template_id.toString()) {
                setPack(packs[i]);
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        Promise.all([
            state.packData,
            state.templateData
        ]).then(res => parsePacks(res));
    }, [pack === null]);


    const loadResults = (templateIds) => {
        if (templateIds && templateIds.length > 0) {
            const results = [];
            for (let i = 0; i < templateIds.length; i++) {
                templates.map(template => {
                    if (template.template_id.toString() === templateIds[i].toString()) {
                        results.push(template);
                    }
                })
            }

            setResults(results);

            if (pack.displayData && pack.displayData.animation && pack.displayData.animation.drawing) {
                const data = pack.displayData.animation.drawing.data;
                const video = data ? data.video : null;
                const bgColor = pack.displayData.animation.drawing.bg_color;

                if (video) {
                    setAnimation({video: video, bgColor: bgColor});
                }
            }
        } else {
            throw 'Could not load Pack';
        }
        setIsLoading(false);
    }

    const getPackResult = () => {
        claimPack(pack, asset, activeUser).then(res => loadResults(res));
    };

    const claim = async () => {
        setIsLoading(true);
        try {
            if (!pack) {
                throw 'Unable to Load Pack';
            }
            getPackResult();
        } catch (e) {
            callBack({unboxed: false, error: e});
            console.log(e);
            setError(e.message);
        }
    };

    const cancel = () => {
        callBack({unboxed: false});
        closeCallBack();
    };

    const acknowledge = () => {
        callBack({unboxed: true});
        closeCallBack();
    };

    const stopAnimation = () => {
        setShowAnimation(false);
        setShowResults(true);
    };

    return (
        animation ?
        <ResultWindow
            stopAnimation={stopAnimation}
            showResults={showResults}
            showAnimation={showAnimation}
            results={results}
            animation={animation}
            acknowledge={acknowledge}
        />
        : <div className={cn(
            'fixed top-1/2 transform -translate-y-1/2',
            'left-1/2 transform -translate-x-1/2',
            'w-11/12 max-w-popup lg:max-w-popup-lg h-auto',
            'max-h-popup md:max-h-popup-lg',
            'p-3 lg:p-8 m-0',
            'text-sm text-neutral font-light opacity-100',
            'bg-paper rounded-xl shadow-lg z-100',
            'backdrop-filter backdrop-blur-lg',
        )}>
            <img className="absolute z-50 cursor-pointer top-4 right-4 w-4 h-4 " onClick={cancel} src="/close_btn.svg" alt="X" />
            <div className="text-xl sm:text-2xl md:text-3xl mt-4 lg:mt-0 text-center">{name}</div>
            <WindowContent image={image} video={video} collection={collection['name']} schema={schema['schema_name']} />
            <div className="text-lg text-left my-4">
                {`Claim ${name}?`}
            </div>
            {
                error ? <ErrorMessage error={error} /> : ''
            }

            {isLoading ? <div className="mb-2">
                <LoadingIndicator />
            </div> : <div className={cn(
                'relative m-auto mt-5 h-20 lg:h-8',
                'flex justify-evenly lg:justify-end'
            )}>
                <WindowButton text="Cancel" onClick={cancel} className="text-neutral bg-paper border-neutral" />
                <WindowButton text="Claim" onClick={claim} id={'unbox-button'} />
            </div> }
        </div>
    );
}

export default UnboxPopup;
