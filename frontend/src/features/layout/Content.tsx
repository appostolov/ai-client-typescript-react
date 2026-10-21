import type { Config } from "../../types/Component"
import Base from "../../components/Base"
import Textarea from "../../components/Textarea"

export default function Content(): Config{
  const config: Config = {
    key: "content",
    children: [
      new Textarea({
        disabled: true,
        className: "marginSmall mainBorderColor borderSolid borderSmall"
      })
    ]
  };
  return new Base( config );
}
