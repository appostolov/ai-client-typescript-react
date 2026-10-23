import type { Config, State, Effect } from "../types/Component"
import { useState, useEffect } from "react"
import ComponentHelper from '../helpers/ComponentHelper'

export default class Base implements Config{

    [key: string]: any;
    declare public id: string
    declare public parent: string
    declare public disabled: boolean | undefined
    public states = [ "disabled" ];
    public state: Record<string, State> = {}
    private effects: Effect[] = []

    constructor(config: Config){
        Object.assign( this, config );
    }

    public init() : void {
        ComponentHelper.register( this );
    }

    public close() : void {
        this.clearEffects();
        ComponentHelper.remove( this );
    }

    protected setStates(){
        for( const key of this.states ){
            const state = useState( this[key] );
            if( !this.id ){
                this.state[key] = {
                    value: state[0],
                    setter: state[1],
                    effects: []
                }
            }
            else{
                Object.assign(
                    this.state[key],
                    {
                        value: state[0],
                        setter: state[1]
                    }
                );
            }
        }
    }

    protected setEffects(){
        const self = this;
        for( const key of this.states ){
            useEffect(() => {
                for( const effect of self.state[key].effects ){
                    effect( self.state[key].value );
                }
            }, [ this.state[key].value ]);
        }
    }

    public enable(){
        this.state.disabled.setter( false );
    }

    public disable(){
        this.state.disabled.setter( true );
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

    addEffect( state: State, effect: Function ): void{
        state.effects.push( effect );
        this.effects.push({
            state: state,
            effect: effect
        });
        effect( state.value );
    }

    clearEffects(): void{
        for( const item of this.effects ){
            item.state.effects = item.state.effects.filter( cb => cb !== item.effect );
        }
    }
}
