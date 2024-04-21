import { memo, useEffect, useState } from 'react'
import Modal from 'react-modal';
import React from 'react';

import './HomePage.css';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import toast, { Toaster } from 'react-hot-toast';
import ReactLoading from 'react-loading';

import { BACKEND_ENDPOINT } from '../constants';
const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

const POLLING_INTERVAL = 5000;

const Homepage = () => {
    const [modalIsOpen, setIsOpen] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [inCreatedRoom, setInCreatedRoom] = useState(false);
    const [roomID, setRoomID] = useState(null);
    const [individualId, setIndividualId] = useState(null);
    const [numInRoom, setNumInRoom] = useState(0);

    const onRoomJoinToast = () => toast.success('Successfully joined room');
    const onRoomCreateToast = () => toast.success('Successfully created room');
    const onRestaurantAddToast = () => toast.success('Suggestion received by the group');
    const onRestaurantAddModalToast = () => toast.success('Successfully added restaurant');
    const onRestaurantAddFailedToast = () => toast.error('Not a restaurant');

    function fetchNumIndividuals(roomId) {
        return fetch(`${BACKEND_ENDPOINT}numindividuals/?room_id=${roomId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data =>
                setNumInRoom(data)
            )
            .catch(error => {
                console.error('Error fetching data:', error);
                return null;
            });
    }

    useEffect(() => {
        console.log("Running useeffect")
        const regex = /\/room\/\d+/;

        if (regex.test(window.location.pathname)) {
            setInCreatedRoom(true);

            // RoomID
            const rid = window.location.pathname.match(/\d+/)[0]
            setRoomID(rid)

            console.log("Attempting to join room")
            fetch(BACKEND_ENDPOINT + "room/" + rid, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => response.json())
                .then(data => {
                    setIndividualId(data.individual_id)
                    onRoomJoinToast();
                }
                ).catch((error) => {
                    console.error('Error:', error);

                })
            return
        } else {
            console.log("Not in room. Attempting to connect to server to create room")
            // Not in created room

            //     // Create room
            fetch(BACKEND_ENDPOINT, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    console.log("Room created with id: " + data.room_id)

                    setIndividualId(data.individual_id)
                    setRoomID(data.room_id)
                    // Set the URL to also match the actual room URL
                    window.history.replaceState("", "", "/room/" + data.room_id);
                    onRoomCreateToast();
                }
                ).catch((error) => {
                    console.error('Error:', error);
                });
        }
    }, [])

    useEffect(() => {
        console.log("Room ID: " + roomID)
        console.log("Individual ID: " + individualId)
        console.log("Num in room: " + numInRoom)
    }, [roomID, individualId])

    // Fetch number of people in room every 10 seconds
    useEffect(() => {
        // Define a function to fetch data
        const fetchData = async () => {
            try {
                if (roomID) {
                    await fetchNumIndividuals(roomID);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        // Call fetchData initially
        fetchData();

        // Set up interval to call fetchData every 5 seconds
        const intervalId = setInterval(fetchData, POLLING_INTERVAL);

        // Clean up the interval on component unmount
        return () => clearInterval(intervalId);
    }, [roomID]); // Dependency array with roomID

    function closeModal() {
        setIsOpen(false);
    }

    async function addRestaurant() {
        closeModal();
        onRestaurantAddModalToast();
        console.log("Trying to add restaurant")
        console.log(selectedPlace)

        const queryParams = new URLSearchParams({
            place_id: selectedPlace.value.place_id,
            room_id: roomID, // Adjust as needed
            individual_id: individualId, // Adjust as needed
        });

        const url = `${BACKEND_ENDPOINT}add-restaurant?${queryParams}`;
        console.log(url)

        try {
            const response = await fetch(url, { 'method': 'POST' });

            if (!response.ok) {
                throw new Error('Failed to add restaurant');
            }

            console.log('Restaurant added successfully');
            onRestaurantAddToast();

        } catch (error) {
            console.error('Error adding restaurant:', error);
            onRestaurantAddFailedToast();
        }
    }

    return (
        <>
            <Toaster />

            {/* Display loading circle if we aren't in the room yet*/}
            {(!individualId) ? (
                <div className='flex gap-5 flex-col justify-center items-center h-screen w-screen'>
                    <ReactLoading type="spin" color="#000" height={50} width={50} />
                    <h1>Connecting to room...</h1>
                </div>
            ) :
                <>
                    <div className="h-screen w-screen flex flex-col gap-6 justify-center items-center px-5 pb-20">
                        <h1 className="text-5xl font-bold"> Picky</h1>
                        <div className="flex flex-row gap-5 ">
                            <div className='flex flex-row gap-2 items-center'>
                                <div className="h-3 w-3 rounded-full bg-green-500 flex justify-center items-center" />
                                <p> {numInRoom} online </p>
                            </div>
                            <p> | </p>
                            <p> Los Angeles, CA </p>
                        </div>
                        <div className="bg-gray-300 bg-opacity-50 rounded-lg p-4 w-full flex justify-center">
                            <a href="#" onClick={() => { navigator.clipboard.writeText(window.location.href) }} className='underline'> Tap to copy link </a>
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
            }
        </>
    );
};



export default Homepage;
