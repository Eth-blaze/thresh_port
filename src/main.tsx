import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Snowfall from 'react-snowfall'
import { Loader } from '@react-three/drei'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Loader/>
    <Snowfall snowflakeCount={300} speed={[0.5,3]} wind={[0.2,2]} />
    <App />
  </StrictMode>,
)
