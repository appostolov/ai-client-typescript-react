import type { Config } from "../../types/Component"
import Button from "../../components/Button"

export default function Header(): Config{
  const config: Config = {
    className: "flexNone",
    key: "header",
    children: [
      Button({
        type: "button_border",
        text: "hello",
        disabled: true,
        onClick: function(){
          debugger;
        }
      })
    ]
  };
  return config;
}
