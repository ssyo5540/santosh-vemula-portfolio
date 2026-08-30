import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import VideosPage from './pages/VideosPage'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <VideosPage />
  </StrictMode>,
)
