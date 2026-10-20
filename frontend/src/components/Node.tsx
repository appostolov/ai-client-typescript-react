import { useEffect } from 'react';

function Node({ config }: any) {

    if( config.setStates ) config.setStates( config );
    
    useEffect(() => {

        if( config.onInit ) config.onInit();

        return () => {
            if( config.onClose ) config.onClose();
        }
    }, []);

    if( config.setEffects ) config.setEffects();

    if( config.getJSX ) return config.getJSX();
    else return (
        <div className={config.className}>
            {
                config.children?.map(
                    ( child: any, i: Number ) => <Node key={i} config={child}/>
                )
            }
        </div>
    );
}

export default Node