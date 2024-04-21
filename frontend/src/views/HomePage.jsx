import { useState } from 'react'
import Modal from 'react-modal';
import React from 'react';

import './HomePage.css';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';


const Homepage = () => {
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [selectedPlace, setSelectedPlace] = React.useState(null);

    const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;


    console.log("We are on the following path: " + window.location.pathname)

    function closeModal() {
        setIsOpen(false);
    }


    function addRestaurant() {
        closeModal();
        console.log(selectedPlace)
    }

    return (
        <>
            <div className="h-screen w-screen flex flex-col gap-6 justify-center items-center px-5 pb-20">
                <h1 className="text-5xl font-bold"> Picky</h1>
                <div className="flex flex-row gap-5 ">
                    <div className='flex flex-row gap-2 items-center'>
                        <div className="h-3 w-3 rounded-full bg-green-500 flex justify-center items-center" />
                        <p> 2 Online </p>
                    </div>
                    <p> | </p>
                    <p> Los Angeles, CA </p>
                </div>
                <div className="bg-gray-300 bg-opacity-50 rounded-lg p-4 w-full flex justify-center">
                    <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className='underline'> Tap to copy link </a>
                </div>
                <div className='flex items-center justify-center bg-opacity-50 rounded-lg h-1/5 border-dashed border-2 border-black p-4'>
                    <p className='text-center'>
                        Our picks based on your group's taste will appear here. Add some restaurants first!
                    </p>
                </div>
                <button className="fixed bottom-12 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => setIsOpen(true)}
                >
                    Add
                </button>


            </div>

            <Modal
                isOpen={modalIsOpen}
                className="Modal"
                overlayClassName="Overlay"
                contentLabel="Example Modal"
                ariaHideApp={false}
                shouldCloseOnOverlayClick={true}
            >
                <div className="bg-white p-5 w-[90vw] rounded-xl shadow-xl">
                    <button className="absolute top-0 right-0 mt-2 mr-2 font-bold" onClick={() => closeModal()}>×</button>
                    <div className='flex flex-col gap-5 p-0 m-0'>
                        <h1 className='font-bold w-full'>Search for a restaurant</h1>
                        <GooglePlacesAutocomplete
                            apiKey={GOOGLE_PLACES_API_KEY}
                            selectProps={{
                                selectedPlace,
                                onChange: setSelectedPlace,
                            }}
                            >
                            
                        </GooglePlacesAutocomplete>

                        <button
                            onClick={addRestaurant}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </Modal>

        </>

    );
};



export default Homepage;
