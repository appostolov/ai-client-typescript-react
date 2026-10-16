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
