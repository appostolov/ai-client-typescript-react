import COMP from "../const/component"
import Base from "../components/Base"

export default class Button extends Base{
    declare text: string | undefined
    declare onClick: Function | undefined
    declare type: string
    public states: string[] = [ "disabled", "type" ]

    public setJSX(){
      return (
        <button
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
