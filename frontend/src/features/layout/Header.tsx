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
          this.disable();
        }
      })
    ]
  };
  return new Base( config );
}
