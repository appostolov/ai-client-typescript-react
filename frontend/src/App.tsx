import Node from './components/Node'
import { useEffect, useState } from 'react';

function root(){
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
    setJSX: function(){
      console.log("JSX");
      return (
          <div key={"root"}>{this.state[0].test}</div>
      )
    },
    test: 0,
    children: [
      {
        setStates: function(){
          this.state = useState( this );
        },
        setJSX: function(){
          return (<div>{this.state[0].parent}</div>);
        }
      },
      {
        setStates: function(){
          this.state = useState( this );
        },
        setJSX: function(){
          return (<div>{this.state[0].parent}</div>);
        }
      }
    ]
  };
  return config;
}

function App() {
  return (
    <Node config={root()} />
  )
}

export default App
