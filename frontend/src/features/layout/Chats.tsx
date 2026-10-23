import type { Config } from "../../types/Component"
import Button from "../../components/Button"
import Base from "../../components/Base"

export default function Chats(): Config{
  const config: Config = {
    className: "flexNone paddingSmall",
    children: [
      new Button({
        text: "Chats",
        events: [
          {
            type: "click",
            self: true,
            callback: function(){
              window.location.hash = "chat/123";
            }
          }
        ]
      })
    ]
  };
  return new Base( config );
}
