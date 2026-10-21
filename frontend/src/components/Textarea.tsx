import Base from "../components/Base"
import { useState } from "react"

export default class Textarea extends Base{
    declare text: string | undefined
    declare onChange: Function | undefined
    declare onInput: Function | undefined
    declare className: string | undefined

    protected _setStates(){
      super._setStates(); 
      this.state.text = useState( this.text )
    }

    public setJSX(){
      return (
        <textarea
          className={ this.getTextareaCss() }
          onChange= {this?.onChange?.bind( this ) }
          onInput= {this?.onInput?.bind( this ) }
          disabled={ this.state.disabled[0] }>
          {this?.text}
        </textarea>
      );
    }

    public setText( text: string ): void{
      this.state.text[1]( text );
    }

    protected getTextareaCss(): string{
        let css = "";

        if( this.className ) css = this.className;
        else css = "borderSolid borderSmall textBorderColor borderRadiusSmall";

        if( this.state.disabled[0] ) css += " disabled";

        return css;
    }
}
