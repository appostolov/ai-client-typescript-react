import { useEffect, useRef } from 'react';
import ComponentHelper from '../helpers/ComponentHelper'
import type { Props, Config } from "../types/Component"

function Node({ config }: Props) {

    // Generate component ID
    const id = useRef( "" )
    if( !id.current ) id.current = ComponentHelper.generateId();
    // Register the component once / this will skip if ID exists
    ComponentHelper.register( id.current, config );

    // Set STATEs
    // Use them in JSX
    if( config._setStates ) config._setStates();// Initial for the class
    if( config.setStates ) config.setStates();// Passed via config
    
    useEffect(() => {
        // Lifecycle Hook On INIT
        if( config.onInit ) config.onInit();

        return () => {
            // Lifecycle Hook On CLOSE
            if( config.onClose ) config.onClose();

            // Unregister component
            // Reset ID ref
            ComponentHelper.remove( config.id );
            id.current = "";
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
                        child.parent = id.current;
                        return <Node key={i} config={child}/>
                    }
                )
            }
        </div>
    );
}

export default Node