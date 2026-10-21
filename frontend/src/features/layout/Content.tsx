import type { Config } from "../../types/Component"
import Base from "../../components/Base"

export default function Content(): Config{
  const config: Config = {
    key: "content"
  };
  return new Base( config );
}
