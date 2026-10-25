import type { Config, State, Effect, Event, Request } from "../types/Component"
import { useState, useEffect } from "react"
import ComponentHelper from '../helpers/ComponentHelper'
import COMP from "../const/component"

export default class Base implements Config{

    [key: string]: any;
    declare public id: string
    declare public parent: string
    declare public disabled: boolean | undefined
    protected visible: boolean = true;
    protected busy: boolean = false;
    public states = COMP.STATES.BASE
    public state: Record<string, State> = {}
    private effects: Effect[] = []
    private events: Event[] = []

    constructor(config: Config){
        Object.assign( this, config );
    }

    public get node(){
        return this.domRef.current;
    }

    public init() : void {
        ComponentHelper.register( this );
        if( Array.isArray( this.children ) ){
            for( const child of this.children ){
                child.parent = this.id;
            }
        }
        this.addEvents();
    }

    public close() : void {
        this.clearEffects();
        this.clearEvents();
        ComponentHelper.remove( this );
    }

    public domRefUpdated(){
        this.clearEvents();
        this.addEvents();
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

    public getChild(
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

    public getParents(
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

    public getParent(
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

    public addEffect( state: State, effect: Function ): void{
        state.effects.push( effect );
        this.effects.push({
            state: state,
            effect: effect
        });
        effect( state.value );
    }

    protected clearEffects(): void{
        for( const item of this.effects ){
            item.state.effects = item.state.effects.filter( cb => cb !== item.effect );
        }
    }

    protected addEvents(): void {
        for( const event of this.events ){
            this.addEvent( event );
        }
    }

    protected clearEvents(): void {
        if( this.AbortController ) this.AbortController.abort();
        this.AbortController = null;
    }

    public addEvent( event: Event ){

		if( !this.AbortController ) this.AbortController = new AbortController();

		var node;
		if( event.self ) node = this.node;
		else if( event.node ) node = event.node;
		else node = document;
		if( event.selector ) node = node.querySelector( event.selector );
		if( !node ) return;

		event.callback = event.callback.bind( this );

        const options = {
            signal: this.AbortController.signal
        };
		node.addEventListener( event.type, event.callback, options, event.useCapture );
    }

    public show(): void {
        this.state.visible?.setter( true );
    }

    public hide(): void {
        this.state.visible?.setter( false );
    }

    public openDialog( content: Config ): void {
        const root = ( this.key === "root" ) ? this : this.getParent({ key: "root" });
        const dialog = root?.getChild({ key: "dialog" });
        dialog?.open( content );
    }

    public async request( data: Request ){

        const self = this;

        const xhttp: XMLHttpRequest = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            let result;
            if( this.readyState === 4 ){
                const type = this.getResponseHeader("Content-Type");
                if( !type || type.indexOf( "application/json" ) === 0 ){
                    try{
                        result = JSON.parse( xhttp.responseText );
                    }
                    catch( err ){
                        result = xhttp.responseText;
                    }
                }
                else result = xhttp.responseText;
            }

            if( this.readyState === 4 ){
                if( this.status >= 200 && this.status < 300 ) data.success.call( self, result, xhttp );
                else data.error.call( self, result, xhttp );
            }
        };
        xhttp.open( data.method || "POST", data.url, true);
        xhttp.setRequestHeader( "Content-Type", "application/json" );
        xhttp.send( JSON.stringify( data.data ) );
    }

    setBusy( busy: boolean ){
        this.state.busy.setter( busy );
    }
}
