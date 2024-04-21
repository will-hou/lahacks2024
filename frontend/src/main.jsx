import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';


ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <BrowserRouter>
    <Routes>
      {/* Route for homepage */}
      <Route exact path="/" element={<App/>} />
      {/* Route for any path starting with /room/ */}
      <Route path="/room/:roomId" element={<App/>} />
    </Routes>

  </BrowserRouter>

  // </React.StrictMode>
)
