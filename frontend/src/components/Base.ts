import type { Config } from "../types/Component"
import { useState } from "react"
import ComponentHelper from '../helpers/ComponentHelper'

export default class Base implements Config{

    declare public id: string
    declare protected disabled: boolean | undefined
    protected state: Record<string, [any, Function]> = {}

    constructor(config: Config){
        Object.assign( this, config );
    }

    protected _setStates(){
        this.state.disabled = useState( this.disabled )
    }

    public enable(){
        this.state.disabled[1]( false );
    }

    public disable(){
        this.state.disabled[1]( true );
    }

    public getChildren( props: Record<string, any>, deep: boolean = false ): Config[]{
        const filter = Object.assign(
            {
                parent: this.id
            },
            props
        );
        const children =  ComponentHelper.find( filter, false, true );

        if( !deep ) return children;

        const descendants = [];

        for( let child of children ){
            const grandChildren = child.getChildren( props, deep );
            descendants.push( ...grandChildren );
        }

        children.push( ...descendants );

        return children;
    }
}
