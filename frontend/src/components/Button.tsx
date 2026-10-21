import type { Config } from "../types/Component"
import COMP from "../const/component"

export default function Button(config: Config): Config{
  const button: Config = {
    setJSX: function(){
      return (
        <button
          className={css(config)}
          onClick={this?.onClick.bind(config)}
          disabled={this?.disabled}>
          {this?.text}
        </button>
      );
    }
  };
  return Object.assign( button, config );
}

function css(config: Config): string{
  let css = "flexNone centered paddingMedium cursorPointer borderRadiusSmall";
  css += " " + buttonType(config.type);
  if( config.disabled ) css += " disabled";
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
