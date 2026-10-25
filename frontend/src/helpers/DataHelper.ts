import type { DataHelper as Type } from "../types/Type"
import type { Answer } from "../types/Chat"
import DATA from "../data/Data";

const DataHelper: Type = {
    deleteAll() {
        for( const key of Object.keys( DATA ) ){
            delete DATA[key];
        }
    },
    delete( id ){
        delete DATA[id];
    },
    answer( answer: Answer ){
        if( DATA[answer.chat] ) DATA[answer.chat].push( answer.message );
        else DATA[answer.chat] = [answer.message];
    }
};

export default DataHelper;