import COMP from "../const/component"
import Base from "../components/Base"
import type { Config } from "../types/Component"

export default class Button extends Base{
    declare text: string | undefined
    declare onClick: Function | undefined
    public type: string = COMP.BUTTON.TYPE.SOLID
    public states: string[] = COMP.STATES.BASE.concat([ "type" ])

    constructor(config: Config){
      super( config )
      Object.assign( this, config );
    }

    public setJSX(){
      return (
        <button
          ref={this.domRef}
          className={ this.getButtonCss() }
          onClick= {this?.onClick?.bind( this ) }
          disabled={ this.state.disabled.value }>
          {this?.text}
        </button>
      );
    }

    protected getButtonCss(): string{
      let css = "flexNone centered paddingMedium cursorPointer borderRadiusSmall";
      css += " " + this.getButtonTypeCss();
      if( this.className ) css += " " + this.className;
      if( this.state.disabled.value ) css += " disabled";
      return css;
    }

    protected getButtonTypeCss(): string{
      switch( this.state.type.value ){
        case COMP.BUTTON.TYPE.SOLID:
          return "mainBackgroundColor backColor";
        case COMP.BUTTON.TYPE.BORDER:
          return "backBackgroundColor mainColor mainBorderColor borderSolid borderSmall";
        case COMP.BUTTON.TYPE.TEXT:
          return "backBackgroundColor mainColor";
      }
      return "";
    }

    public setButtonType( type: string ): void{
      this.state.type.setter( type );
    }
}
