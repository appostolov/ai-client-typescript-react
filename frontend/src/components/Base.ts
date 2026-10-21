import type { Config } from "../types/Component"
import { useState } from "react"

export default class Base implements Config{

    protected disabled = false
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
}
