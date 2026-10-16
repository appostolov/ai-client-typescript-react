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
```import { defineConfig } from 'vite'
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
})```
