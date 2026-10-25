import Base from "../components/Base"
import COMP from "../const/component"
import type { Config } from "../types/Component"

export default class Textarea extends Base{
    declare text: string | undefined
    declare onChange: Function | undefined
    declare onInput: Function | undefined
    declare className: string | undefined
    public states: string[] = COMP.STATES.BASE.concat([ "text" ])

    constructor(config: Config){
      super( config )
      Object.assign( this, config );
    }

    public setJSX(){
      return (
        <textarea
          ref={this.domRef}
          className={this.getTextareaCss()}
          placeholder={this.placeholder}
          onChange= {this.onChange?.bind( this ) }
          onInput= {this.onInput?.bind( this ) }
          disabled={ this.state.disabled.value }>
          {this?.text}
        </textarea>
      );
    }

    public addEvents(){
      const self = this;
      super.addEvents();
      this.addEvent({
        type: "input",
        self: true,
        callback: function(){
          const node = this.node as HTMLTextAreaElement;
          const text = node.value;
          self.state.text.setter( text );
        }
      });
    }

    public setText( text: string ): void{
      this.state.text.setter( text );
    }

    public getText(){
      return this.state.text.value;
    }

    protected getTextareaCss(): string{
        let css = "borderSolid borderSmall textBorderColor borderRadiusSmall";
 
        if( this.className ) css += " " + this.className;

        if( this.state.disabled.value ) css += " disabled";

        return css;
    }
}
