import type { Helper } from "../types/Component"
import type { Config } from "../types/Component"

let count = 0;

const ComponentHelper: Helper = {
    components: {},
    generateId: function(){
        count++;
        return "comp_" + count;
    },
    register: function( config: any ){
        const id: string = this.generateId();
        config.id = id;
        if( Array.isArray( config.children ) ){
            for( const child of config.children ){
                child.parent = id;
            }
        }
        this.components[config.id] = config;
    },
    remove: function( config: any){
        delete this.components[config.id];
    },
    find: function( props: Record<string, any> = {}, first: boolean = false, strict: boolean = true ){

        const ids = Object.keys( this.components )
        const keys = Object.keys( props );
        const result: Config[] = [];

        if( !keys.length ){

            if( first ) return [ this.components[ ids[ 0 ] ] ];
            else return Object.values( this.components );
        }

        for( let id of ids ){

            const component = this.components[ id ];

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