# AI Chat Manager (TypeScript & React & Node.js/Express)

The essence of this project is a **Framework built on top of React** dedicated to creation of massive structures of interconected functionalities. An app in the Framework is a tree of Nodes capable of handling states, effects, events, views, as well as finding other Nodes and sync with their state and actions.

The current example is **AI Chat Manager** where the user starts, chats and delete conversations with AI models via OpenAI Open Router API.
The FE located at `/frontend/src/features` is implemented in under **600 lines of code** using the Framework.

Raw creation journey thoughts can be found in `NOTES.md`

## 🚀 Build & Run
1. Clone the repo
```bash
git clone https://github.com/appostolov/ai-client-typescript-react.git
```
2. Install dependencies
```bash
npm install
```
3. Get OpenRouter API Key `https://developer.puter.com/tutorials/how-to-get-openrouter-api-key/`
4. Paste the Key at `backend/.env` file `OPENROUTER_API_KEY` property
5. Run the app
```bash
npm run dev
```

## ❓ Understand The Framework

`App.tsx` nests `<Node config={ new Base( Config ) }>` in its JSX.  
This Node is the root of the whole app three build of other Nodes, that receive other Base, Button or Textarea configurations.  
Node invokes Config functions opening the door for React useState, useEffect and JSX.

Base provides common functionalities like disable, hide, addEvent, request, getChild, getParent, addEffect, etc.
```javascript
export default class Base implements Config{
    protected visible: boolean = true;
    protected busy: boolean = false;
    // Other properties

    constructor(config: Config){
        Object.assign( this, config );
    }
    public init(): void
    protected setStates(): void
    public getChildren(): Config[]
    // Other methods
}
```
The object passed to new Base( Config ) configures the states, effectgs, events, children, adds and overrides methods.  
The configuration will produce three structure of Nodes who can present data, listen for user events, interact with each other and the outside world.

e.g. `/features/Router.tsx`
```javascript
// Router is function to produce new instance every time
export default function Router(): Config{                       
  const config: Config = {

    // others use this.getParent({ key: "router" }) or this.getChild({ key: "router" })
    key: "router",    
    
    // Add css classes to the DOM node
    className: "column absoluteFull",

    // Generate states -> Base states + "route"
    states: COMP.STATES.BASE.concat([ "route" ]),

    // Default route state value
    route: HashHelper.route( "" ),

    // Custom property - the possible routes
    routes: {
      "": History(),
      "chat/:id": Chat()
    },

    // INIT lifecycle hook
    onInit: function(){
      const routes: Config[] = Object.values( this.routes );
      for( const route of routes ){
        route.parent = this.id;
      }
      const route = HashHelper.route();
      if( !route ) window.location.hash = "";
    },

    // Browser events
    // Sync URL hash with route state
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

    // Show certain Node structure based on the URL hash (route)
    // The Node Config to show is History() or Chat() - see routes ^
    setJSX: function(){
      const config: Config = this.routes[ this.state.route.value ];
      config.parent = this.id;
      return ( <Node key={this.state.route.value} config={config}/> )
    }
  };
  return new Base( config );
}
```

## Code Review 👀

* /components/`Node.tsx` - Universal React component accepting `Base` instance as parameter. **This is the only React component needed for this reamework.**
* /components/`Base.tsx` - Base abstract component configuration everyone extends ( Button, Textarea ... ). Central place for functionalities like `show/hide`, `enable/disable`, `busy`, etc.
* /components/`Button.tsx` - Extends Base class, transforms JSX output, adds extra state and expose setter for button type
* /components/`Textarea.tsx` - Transforms JSX, addEvent to sync state with textarea value, expose getter and setter
* /helpers/`ComponentHelper.ts` - Manage components cache and provides search functionalities
* /features/`Chat.tsx` - The Node structure for Chat view

```text
ai-client-typescript-react/
├── root
├── backend/
└── frontend/
    ├── src/
    │   ├── components/ - Abstract components Node, Base, Button, Textarea
    │   ├── const/      - Constants used across the project e.g. color scheme, button types, etc.
    │   ├── css/        - Reusable css classes
    │   ├── dialogs/    - Abstract Dialog and custom configurations that extends it e.g. Standard
    │   ├── features/   - 📱 AI Chat Manager front end
    │   ├── helpers/    - Helpers for Components, URL Hash and Colors
    │   ├── types/      - TypeScript interfaces
    │   ├── App.tsx     - Dummy React component to inject the app's root component e.g. `/features/Root.tsx`
    │   ├── main.tsx    - Standard React createRoot script

    
```

## 🧪 Testing
* Run all tests
```bash
npm run test:all
```
* Run FE tests
```bash
npm run test:frontend
```
* Run BE tests
```bash
npm run test:backend
```

## 🛠️ Main Tech Stack

*   **Monorepo Engine:** npm Workspaces
*   **Concurrently Runner:** Concurrently 10.x
*   **Frontend Client:** React 19, TypeScript, Vite
*   **Frontend Testing:** Vitest, React Testing Library, JSDOM
*   **Backend Server:** Node.js, Express, TypeScript, ts-node
*   **Backend Testing:** Jest, Supertest, ts-jest

## 🤔 Conclusion
If you find a way to get the technology maximum with less words and repetition you hit the sweet spot between flexibility and abstraction.
The place of the stack keywords and API structures is in the inheritence core. End implementations should be clean, flexible, self descriptive and portable with configuration like, near plain text syntax.
---