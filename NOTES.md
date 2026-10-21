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