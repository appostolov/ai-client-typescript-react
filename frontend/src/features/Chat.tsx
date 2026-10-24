import type { Config } from "../types/Component"
import Button from "../components/Button"
import Textarea from "../components/Textarea"
import Base from "../components/Base"

export default function Chat(): Config{
  const config: Config = {
    className: "flexNone paddingSmall",
    children: [
      new Base({
        className: "paddingSmall mainBackgroundColor",
        events: [
          {
            type: "click",
            self: true,
            callback: function(){
              window.location.hash = "";
            }
          }
        ]
      })
    ]
  };
  return new Base( config );
}
