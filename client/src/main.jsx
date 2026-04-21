import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(255,255,255,0.95)',
            color: '#7d0a2a',
            fontFamily: 'Georgia, serif',
            borderRadius: '999px',
            padding: '12px 20px',
            boxShadow: '0 4px 20px rgba(192, 24, 74, 0.3)',
          },
        }}
      />
    </>
  </React.StrictMode>,
)
