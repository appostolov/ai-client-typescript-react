import type { Helper } from "../types/Component"
import type { Config } from "../types/Component"

let count = 0;

const ComponentHelper: Helper = {
    components: {},
    generateId: function(){
        count++;
        return "comp_" + count;
    },
    register: function( id: string, config: any ){

        if( this.components[id] ) return;

        config.id = id;
        this.components[id] = config;
    },
    remove: function( id: string ){
        delete this.components[id];
    },
    find: function( props: Record<string, any>, first: boolean = false, strict: boolean = true ){

        const result: Config[] = [];

        for( let id of Object.keys( this.components ) ){

            const component = this.components[ id ];
            const keys = Object.keys( props );

            for( let key of keys ){
                
                const equal = component[key] === props[key];

                if( strict && !equal ) break;

                if( equal && !strict ){
                    result.push( component );
                    break;
                }
                
                if( equal && keys.indexOf( key ) === keys.length - 1 ) result.push( component );
            }
            if( first && result.length ) break;
        }
        return result;
    }
};

export default ComponentHelper;