import type { Config } from "../../types/Component"
import Button from "../../components/Button"
import Base from "../../components/Base"

export default function Header(): Config{
  const config: Config = {
    className: "flexNone",
    key: "header",
    children: [
      new Button({
        type: "button_border",
        text: "hello",
        onClick: function(){
          const types = [
            "button_solid",
            "button_border",
            "button_text"
          ];
          let index = types.indexOf( this.state.type.value );
          index++;
          if( index > types.length ) index = 0;
          this.state.type.setter( types[index] );
        }
      }),
      new Button({
        text: "heyhey",
        onInit: function(){
          const self = this;
          setTimeout(() => {
            const header = self.getParent({ key: "header" });
            const button = header.getChild({ text: "hello" });
            const effect = function( val: any ){
              self.state.type.setter( val );
            };
            self.addEffect( button.state.type, effect );
          });
        }
      })
    ]
  };
  return new Base( config );
}
