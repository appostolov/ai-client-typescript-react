import type { Config } from "../types/Component"
import Base from "../components/Base"
import Router from "./Router"
import Dialog from "../dialogs/Dialog"

export default function Root(): Config{
  const config: Config = {
    key: "root",
    className: "absoluteFull",
    children: [
        Router(),
        Dialog()
    ]
  };
  return new Base( config );
}
