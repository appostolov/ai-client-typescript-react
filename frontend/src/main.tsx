import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/index.css'
import './css/animation.css'
import ColorHelper from './helpers/ColorHelper'
import COLOR from './const/color'
import App from './App.tsx'

ColorHelper.deploy( COLOR );

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
