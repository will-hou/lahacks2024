import { useState } from 'react'

import { register } from 'swiper/element/bundle';


import HomePage from './views/HomePage.jsx'
import ComparePage from './views/ComparePage.jsx'
import MapPage from './views/MapPage.jsx';


import './App.css'
import { RoomProvider } from './RoomContext.jsx';
import { Toaster } from 'react-hot-toast';

// register Swiper custom elements
register();


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Toaster />
      <RoomProvider>
        <swiper-container className='h-screen w-screen' pagination="true">
          <swiper-slide>
            <HomePage />
          </swiper-slide>
          <swiper-slide>
            <swiper-container direction="vertical" pagination="true">
              <swiper-slide>
                <ComparePage />
              </swiper-slide>
              <swiper-slide>
                <MapPage />
              </swiper-slide>
            </swiper-container>
          </swiper-slide>
        </swiper-container>
      </RoomProvider>
    </>
  )
}

export default App
