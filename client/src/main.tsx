import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import './index.css'

/*
Connects my React App to the actual HTML file that displays it.

as HTMLElement - you have to be explicit about this, that way
TS catches a potential null error at compile time. Why? Can't 
mount a react app onto nothing. JS would ran the file
without considering whether it's empty or not, thus 
crashing at runtime.
*/

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
)