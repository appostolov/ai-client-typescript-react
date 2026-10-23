import type { Config } from "../../types/Component"
import Base from "../../components/Base"
import Node from "../../components/Node"
import Chats from "./Chats"
import Chat from "./Chat"

export default function Router(): Config{
  const config: Config = {
    key: "router",
    className: "column absoluteFull",
    states: [ "route" ],
    route: "",
    routes: {
      "": Chats(),
      "chat/:id": Chat()
    },
    events: [
      {
        type: "hashchange",
        node: window,
        callback: function(){
          let hash = window.location.hash;
          if( hash.length ) hash = hash.split( "#" )[1];
          const parts = hash.split( "/" );
          let route: string;

          if( parts.length === 2 && parts[0] === "chat" ) route = "chat/:id";
          else route = "";

          this.state.route.setter( route );
        }
      }
    ],
    setJSX: function(){
      const config: Config = this.routes[ this.state.route.value ];
      return ( <Node key={this.state.route.value} config={config}/> )
    }
  };
  return new Base( config );
}
