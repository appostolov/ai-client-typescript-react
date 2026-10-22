import type { Config } from "../types/Component"
import { useState } from "react"
import ComponentHelper from '../helpers/ComponentHelper'

export default class Base implements Config{

    declare public id: string
    declare public parent: string
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

    public getChildren(
        props: Record<string, any> = {},
        deep: boolean = false,
        first: boolean = false,
        strict: boolean = true
    ): Config[]{

        if( !deep ){
            const filter = Object.assign(
                {
                    parent: this.id
                },
                props
            );
            return ComponentHelper.find( filter, first, strict );
        }

        const filter = Object.assign(
            {
                parent: this.id
            }
        );
        const children =  ComponentHelper.find( filter );
        const descendants = [];

        for( let child of children ){
            const grandChildren = child.getChildren( {}, true );
            descendants.push( ...grandChildren );
        }

        children.push( ...descendants );

        const keys = Object.keys( props );
        const result: Config[] = [];

        if( !keys.length ){

            if( first ) return [ children[ 0 ] ];
            else return children;
        }

        for( let child of children ){

            for( let key of keys ){
                
                const equal = child[key] === props[key];

                if( strict && !equal ) break;

                if( equal && !strict ){
                    result.push( child );
                    break;
                }
                
                if( equal && keys.indexOf( key ) === keys.length - 1 ) result.push( child );
            }
            if( first && result.length ) break;
        }
        return result;
    }

    getChild(
        props: Record<string, any> = {},
        strict: boolean = true
    ): Config | void {

        const children: Config[] = this.getChildren(
            props,
            true,
            true,
            strict
        );
        return children[ 0 ];
    }

    getParents(
        props: Record<string, any> = {},
        first: boolean = false,
        strict: boolean = true
    ): Config[]{

        const parents = [];
        let parent = ComponentHelper.components[ this.parent ];

        while( parent ){
            parents.push( parent );
            parent = ComponentHelper.components[ parent.parent ];
        }
        if( !parents.length ) return parents;

        const keys = Object.keys( props );
        const result: Config[] = [];

        if( !keys.length ){

            if( first ) return [ parents[ 0 ] ];
            else return parents;
        }

        for( let parent of parents ){

            for( let key of keys ){
                
                const equal = parent[key] === props[key];

                if( strict && !equal ) break;

                if( equal && !strict ){
                    result.push( parent );
                    break;
                }
                
                if( equal && keys.indexOf( key ) === keys.length - 1 ) result.push( parent );
            }
            if( first && result.length ) break;
        }
        return result;
    }

    getParent(
        props: Record<string, any> = {},
        strict: boolean = true
    ): Config | void {

        const parents: Config[] = this.getParents(
            props,
            true,
            strict
        );
        return parents[ 0 ];
    }
}
