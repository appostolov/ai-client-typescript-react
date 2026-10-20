import Node from './components/Node'
import { useEffect, useState } from 'react';

function App() {

  let config: any = {
    setStates: function(){
      this.state = useState( this );
    },
    onInit: function(){
        console.log("INIT");
        const self = this;
        this.timer = setInterval(() => {
            self.state[1]((c: any) => {
                return Object.assign(
                    {},
                    c,
                    {
                        test: c.test + 1
                    }
                )
            })
        }, 1000)
    },
    onClose: function(){
      clearInterval(this.timer);
      delete this.timer;
      console.log("INIT:CLOSE");
    },
    setEffects: function(){
      const self = this;

      useEffect(() => {

          console.log("UPDATE");

          return () => {
              console.log("UPDATE:CLOSE");
          }

      }, [self.state[0]])
    },
    getJSX: function(){
      return (
          <div>{this.state[0].test}</div>
      )
    },
    test: 0
  };
  
  return (
      <Node config={config} />
  )
}

export default App
