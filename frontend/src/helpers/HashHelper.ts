import type { HashHelper as Type } from "../types/Type"

const HashHelper: Type = {
    routes: [
        "",
        "chat/:id"
    ],
    route: function( def ){
        let hash = window.location.hash;
        if( !hash ) return hash;
        if( hash.length ) hash = hash.split( "#" )[1];
        const parts = hash.split( "/" );
        if( parts.length === 2 && parts[0] === "chat" ) return "chat/:id";

        if( def !== undefined ) return def;
    },
    id: function(){
        const route = this.route();
        if( route === "chat/:id" ) return window.location.hash.split( "/" ).at( -1 );
    }
};

export default HashHelper;