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
          className={ this.getTextareaCss() }
          onChange= {this?.onChange?.bind( this ) }
          onInput= {this?.onInput?.bind( this ) }
          disabled={ this.state.disabled.value }>
          {this?.text}
        </textarea>
      );
    }

    public setText( text: string ): void{
      this.state.text.setter( text );
    }

    protected getTextareaCss(): string{
        let css = "";

        if( this.className ) css = this.className;
        else css = "borderSolid borderSmall textBorderColor borderRadiusSmall";

        if( this.state.disabled.value ) css += " disabled";

        return css;
    }
}
