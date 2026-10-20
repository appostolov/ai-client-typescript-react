import type { Helper } from "../types/Component"

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
    }
};

export default ComponentHelper;