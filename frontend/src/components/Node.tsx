import { useEffect } from 'react';
import type { Props, Config } from "../types/Component"

function Node({ config }: Props) {

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

    // Set EFFECTs
    if( config.setEffects ) config.setEffects();

    // Set JSX
    if( config.setJSX ) return config.setJSX();
    // Or render children
    else return (
        <div className={config.className}>
            {
                config.children?.map(
                    ( child: Config, i: number ) => {
                        return <Node key={i} config={child}/>
                    }
                )
            }
        </div>
    );
}

export default Node