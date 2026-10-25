import { useEffect, useRef } from 'react';
import type { Props, Config } from "../types/Component"

function Node({ config }: Props) {

    config.domRef = useRef<HTMLDivElement>(null);

    // Set STATEs
    if( config.setStates ) config.setStates();
    
    useEffect(() => {
        // INIT component
        config.init();
        // Lifecycle Hook On INIT
        if( config.onInit ) config.onInit();

        return () => {
            // Lifecycle Hook On CLOSE
            if( config.onClose ) config.onClose();
            // CLOSE component
            config.close();
        }
    }, []);

    useEffect(() => {
        config.domRefUpdated();
    }, [ config.domRef ]);

    // Set EFFECTs
    if( config.setEffects ) config.setEffects();

    if( config.state.visible?.value ){

        if( config.setJSX ) return config.setJSX();
        // Or render children
        else return (
            <div ref={config.domRef} className={config.className}>
                {
                    config.children?.map(
                        ( child: Config, i: number ) => {
                            return <Node key={i} config={child}/>
                        }
                    )
                }
                {config.state.busy?.value && <div className="absoluteFull centered smokeBackgroundColor">
                    <div className="flexNone fontSizeHuge bee-buzz">🐝</div>
                </div>}
            </div>
        );
    }
}

export default Node