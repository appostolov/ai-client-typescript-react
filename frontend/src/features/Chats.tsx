import type { Config } from "../types/Component"
import Button from "../components/Button"
import Base from "../components/Base"
import Standard from "../dialogs/Standard"

export default function Chats(): Config{
  const config: Config = {
    className: "flexNone paddingSmall",
    children: [
      new Button({
        text: "Chats",
        onClick: function(){
          this.openDialog( Standard({}) );
        }
      })
    ]
  };
  return new Base( config );
}
