import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WinnersPage from './views/WinnersPage.jsx';
import { RoomProvider } from './RoomContext.jsx';



ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <RoomProvider>

    <BrowserRouter>
      <Routes>
        {/* Route for homepage */}

        <Route exact path="/" element={<App />} />
        {/* Route for any path starting with /room/ */}
        <Route path="/room/:roomId" element={<App />} />
        <Route path="/winner" element={<WinnersPage />} />
      </Routes>

    </BrowserRouter>
  </RoomProvider>


  // </React.StrictMode>
)
