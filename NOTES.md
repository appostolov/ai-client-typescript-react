# I will first update .gitignore to prevent any files start being tracked

# Create the root workspace package manager file
`npm init -y`

# Install the utility to run both apps simultaneously
npm install concurrently --save-dev

# Generate the frontend via Vite template
`npm create vite@latest frontend -- --template react-ts`
* I got this error `SyntaxError: The requested module 'node:util' does not provide an export named 'styleText'`
    * I will upgrade NodeJS using `winget upgrade OpenJS.NodeJS`
    * The operation failed with `No installed package found matching input criteria.`
        * I will install instead of upgrade `winget install OpenJS.NodeJS.LTS`
* Lets try `npm create vite@latest frontend -- --template react-ts` again
* It is done, but I needed to update `/frontend/vite.config.ts` to be able to communicate with my backend
```
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
```

# It is time for the backend
## 1. Create and enter backend folder
`mkdir backend`
`cd backend`
## 2. Initialize the backend node settings
`npm init -y`
# 3. Install core backend framework and TypeScript tooling
`npm install express`
`npm install --save-dev @types/express typescript @types/node ts-node nodemon`
# 4. Create the backend TypeScript settings file
`npx tsc --init`

## I updated the backend/tsconfig.json with this:
```
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

## Added scripts to backend/package.json
```
"scripts": {
  "dev": "nodemon src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js"
}
```

## It is time to create the backend/index.js
`mkdir src`
`touch src/index.ts`
```
import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Backend is running smoothly!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

# Boot up and Run the Environment
go to the root `cd ..`
run `npm run dev`
* I needed to install express and nodemon in the backend folder again, but it is working now

# Built & Run
1. Clone the repo `git clone https://github.com/appostolov/ai-client-typescript-react.git`
2. Enter the root directory `cd ai-client-typescript-react`
3. Install dependencies `npm install`
4. Run the app `npm run dev`

# Thoughts about React
* Nice first glance
* Good to have JSX
* I is very hard to understand the lifecycle of the components
* Indirect lifecycle hooks
* Hidden rules to skip some loops - very hard to debug
* It was difficult to extract configurable points
* The component function parameters are passed by reference
* The lifecycle hooks are called async
* States and JSX are executed sync
* The component function is central place. It is executed on every stage
* React use hidden checks to skip some executions and preserve instances
* It was hard to implement interface for configuring dynamic component structures

# The framework is ready ( Node.tsx, ComponentHandler.ts, etc. ).
# Lets start building the chat client
* First stop - the layout
  I see window, with header on top, with container under it
* Some CSS library is needed as well as colors
  Imported index.css and ColorHelper
* Some buttons will be placed in the header
  So we need a Button component

# Button Component
* We need to extend Node to have centreal control over every component
* We want to be able to pass onClick function for the Button
* We want to be able to enable/disable a button
* We want multiple button types e.g. Solid, Border, Text, etc.

# Central enable/disable function
* Every component can have it's own implementation about enable/disable, but they all will be wired to property e.g. enabled
* I want center implementation in Node component for this
* There will be other central implementations for similar things
* The implementation should include changing the component configuration and trigger rerender

# Funny ES6 story
* When add class properties in the constructor TypeScript does not see them
* If you define them to calm TS the constructor overrides them and everything is good
* But for a child class the story is different
  * The parent constructor is invoked first
  * Then child class properties are evaluated and they override the parent constructor work
  * But if you remove the properties form the child TS complains, because you use them in methods
* The solution is just ot declare the properties
  This way the TS is calm and parent constructor work is not overriden

# Central function in the child
Just like Base provide enable/disable for childs I will implement Button setType to exersise the same reusable approach but for child component.
* It is super easy, because I already have the setter from useState

# Connect The Nodes
* Now I'm able to build structure of Nodes
* Nodes have central functionalities
* I need to enable them to find and interact with each other
* Find parent/childs will be implemented in Base
* We will need a way to listen for changes cross nodes

# Funny React
* Every invoke of the component function should produce the same number of useState and useEffect and in the same order :D
* Updated Base component to generate states and effects out of the box
* Tested component communication and state exchange

# Ready To Go
No I can build component structure fast and exchange state between them
It is time to go with the AI client itself
* When searching for soution for the FE routing I realized event subscription mechanism is needed

# Event Subscription Implementation
* Updated Node to pass the DOM instance
* Implemented Base add/clear Events
* React is changing the DOM element on the fly :D

# Check This Out ;D
* I watch property state
* Based on the state I switch two components
* The look identical, but are two different components with own events etc.
* React is actually REUSING the furst one to look like the second, but forget to switch events :D
* I found this by clicking visibly different buttons, but hitting the same event listener
* :D:D:D
* And if I provide totally different components to avoid reusing the first one
* React complains about difference in the hook order
* :D:D:D

# To Exchange Components Base On State Pass Key Property!!!

# One Last UI Component - Dialog
* To look functional some actions will need confirmation
* Dialogs are showing and hiding, but they are ordinary UI Components
* I will implement show hide functionality in Base for all components

# Components Should Handle HTTP Requests
* I will implement central Base functionality for HTTP requests
* Because my FE and BE are served on different ports it is considered CORS
* I needed to configure node express
Run `npm install cors` and `npm i --save-dev @types/cors`
Then add
```
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
```

# I have pretty functional chat alsready in frontend/src/features/Chat
* what I need now is some busy indication
* I will implement busy indication fo the Base

# Time for Tests
* Gemini suggests Jest + Supertest for the BE and Vitest for the FE
* They look good so I will use them

# Install Jest + Supertest
* `npm install --save-dev jest ts-jest @types/jest supertest @types/supertest ts-node`
* jest.config.js created in /backend
```
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node', // Crucial: sets the environment to Node
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
};
```
* Created backend/src/__tests__/app.test.ts file
* Run `npm install --save-dev @types/jest --prefix backend`
* Add `"types": ["jest", "node"]` to `tsconfig.json`
* Run the tests from backend folder `npm test`

# Test for the Frontend
* `cd frontend`
* `npm install --save-dev vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event`
* Add `"test": "vitest"` in package.json scripts
* Add `"types": ["vitest/globals", "@testing-library/jest-dom"]` to `frontend/tsconfig.json`
* Run with `npm test`
* `npm install --save-dev jsdom`
* Created frontend/src/setupTests.ts file
```
import '@testing-library/jest-dom';
```

