import type { Config } from "../../types/Component"
import Base from "../../components/Base"
import Header from "./Header"
import Content from "./Content"

export default function Root(): Config{
  const config: Config = {
    key: "root",
    className: "column absoluteFull",
    children: [
        Header(),
        Content()
    ]
  };
  return new Base( config );
}
