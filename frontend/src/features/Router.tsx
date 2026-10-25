import type { Config } from "../types/Component"
import Base from "../components/Base"
import Node from "../components/Node"
import COMP from "../const/component"
import History from "./History"
import Chat from "./Chat"
import HashHelper from "../helpers/HashHelper"

export default function Router(): Config{
  const config: Config = {
    key: "router",
    className: "column absoluteFull",
    states: COMP.STATES.BASE.concat([ "route" ]),
    route: HashHelper.route( "" ),
    routes: {
      "": History(),
      "chat/:id": Chat()
    },
    onInit: function(){
      const routes: Config[] = Object.values( this.routes );
      for( const route of routes ){
        route.parent = this.id;
      }
      const route = HashHelper.route();
      if( !route ) window.location.hash = "";
    },
    events: [
      {
        type: "hashchange",
        node: window,
        callback: function(){
          const route = HashHelper.route();
          if( !route && route !== "" ){
            window.location.hash = "";
            return;
          }
          this.state.route.setter( route );
        }
      }
    ],
    setJSX: function(){
      const config: Config = this.routes[ this.state.route.value ];
      config.parent = this.id;
      return ( <Node key={this.state.route.value} config={config}/> )
    }
  };
  return new Base( config );
}
