let count = 0;

const ComponentHelper = {
    components: {},
    generateId: function(){
        console.log("GENERATE");
        count++;
        console.log(count);
        return "comp_" + count;
    },
    register: function( id: string, config: any ){

        if( this.components[id] ) return;
        
        config.id = id;
        this.components[id] = config;

        console.log("ADD: " + config.id);
    },
    remove: function( id: string ){
        delete this.components[id];

        console.log("REMOVE: " + id);
    }
};

export default ComponentHelper;