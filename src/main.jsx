import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Prevent browser scroll restoration from restoring the page to mid-animation,
// which would cause GSAP to initialize scrub animations at non-zero progress
// and record wrong "from" values after invalidateOnRefresh clears cached states.
if (typeof window !== 'undefined') {
  history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
