import type { Config } from "../types/Component"
import COMP from "../const/component"
import Base from "../components/Base"

export default function Button(config: Config): Config{
  const button: Config = {
    setJSX: function(){
      return (
        <button
          className={css(this)}
          onClick={this?.onClick.bind(this)}
          disabled={this.state.disabled[0]}>
          {this?.text}
        </button>
      );
    }
  };
  const test = new Base( Object.assign( button, config ) );
  return test;
}

function css(config: Config): string{
  let css = "flexNone centered paddingMedium cursorPointer borderRadiusSmall";
  css += " " + buttonType(config.type);
  if( config.state.disabled[0] ) css += " disabled";
  return css;
}

function buttonType(type: string | undefined): string{
  const defaultType = COMP.BUTTON.TYPE.SOLID;
  if( !type || !Object.values(COMP.BUTTON.TYPE).includes(type) ){
    type = defaultType;
  }
  switch(type){
    case COMP.BUTTON.TYPE.SOLID:
      return "mainBackgroundColor backColor";
    case COMP.BUTTON.TYPE.BORDER:
      return "backBackgroundColor mainColor mainBorderColor borderSolid borderSmall";
    case COMP.BUTTON.TYPE.TEXT:
      return "backBackgroundColor mainColor";
  }
  return "";
}
