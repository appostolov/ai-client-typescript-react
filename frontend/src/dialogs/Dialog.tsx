import type { Config } from "../types/Component"
import Base from "../components/Base"
import Node from "../components/Node"
import COMP from "../const/component"

let count = 0;

export default function Dialog(): Config{
  const config: Config = {
    key: "dialog",
    className: "absoluteFull centered paddingLarge smokeBackgroundColor",
    visible: false,
    states: COMP.STATES.BASE.concat([ "content" ]),
    onInit: function(){
      count++;
    },
    setJSX: function(){
      return (
        <div ref={config.domRef} className={config.className}>
          <Node key={count} className={config.className} config={this.state.content.value}/>
        </div>
      )
    },
    open: function( content: Config ){
      content.parent = this.id;
      this.state.content.setter( content );
      this.state.visible.setter( true );
    },
    remove: function(){
      this.state.visible.setter( false );
      this.state.content.setter( {} );
    }
  };
  return new Base( config );
}
