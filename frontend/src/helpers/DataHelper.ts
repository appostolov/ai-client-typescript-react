import type { DataHelper as Type } from "../types/Type"
import DATA from "../data/Data";

const DataHelper: Type = {
    deleteAll() {
        for( const key of Object.keys( DATA ) ){
            delete DATA[key];
        }
    }
};

export default DataHelper;