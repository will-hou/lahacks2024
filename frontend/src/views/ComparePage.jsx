import { useState, useEffect } from 'react'
import { useRoomContext } from '../RoomContext.jsx';

import RestaurantCard from '../components/RestaurantCard.jsx';
import { BACKEND_ENDPOINT } from '../constants.js';

import { useNavigate } from 'react-router-dom';

const CHECK_IF_VOTING_ELIGIBLE_INTERVAL = 5000

const ComparePage = () => {

    const [canStartVoting, setCanStartVoting] = useState(false)
    const { roomID, individualID, restaurantOne, restaurantTwo, setRestaurantOne, setRestaurantTwo, isFinishedVoting} = useRoomContext();
    
    const navigate = useNavigate();


    const getImageUrl = (photoReference, maxWidth, maxHeight) => {
        const API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
        ; // Replace 'YOUR_API_KEY' with your actual API key
        const baseUrl = 'https://maps.googleapis.com/maps/api/place/photo';
        const params = new URLSearchParams({
            photoreference: photoReference,
            sensor: false,
            maxwidth: maxWidth,
            maxheight: maxHeight,
            key: API_KEY
        });
        const imageUrl = `${baseUrl}?${params.toString()}`;
        return imageUrl;
    };

    const fetchPair = async () => {

        const url = `${BACKEND_ENDPOINT}get-pair?room_id=${roomID}&individual_id=${individualID}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            console.log("Got data", data)
            setRestaurantOne(data.restaurant_one);
            setRestaurantTwo(data.restaurant_two);
            console.log(restaurantOne)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        if (canStartVoting & !restaurantOne & !isFinishedVoting) {
            console.log("Trying to fetch pair")
            fetchPair();
        }
    }, [canStartVoting, restaurantOne]);

    useEffect(() => {
        if (isFinishedVoting) {
            console.log("Voting is finished")
            //  Navigate to the winners page 
            navigate("/winner");
        }

    }, [isFinishedVoting]);

    // Check if we can start voting
    useEffect(() => {
        const fetchData = async () => {
            if (!roomID) {
                return;
            }
            try {
                console.log("Fetching restaurants from room " + roomID);

                const response = await fetch(BACKEND_ENDPOINT + 'restaurants?room_id=' + roomID);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const jsonData = await response.json();
                if (jsonData.length >= 2) {
                    console.log("Can start voting");
                    setCanStartVoting(true);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        let intervalId;

        if (!canStartVoting) {
            intervalId = setInterval(fetchData, CHECK_IF_VOTING_ELIGIBLE_INTERVAL); // Polling every 5 seconds
        }

        // Cleanup function to clear the interval
        return () => {
            clearInterval(intervalId);
        };
    }, [roomID, canStartVoting]);



    const shouldRenderCards = restaurantOne !== null && restaurantTwo !== null;
    return (
        shouldRenderCards && (
            <div className='h-screen w-screen gap-4 p-5 flex justify-center flex-col items-center'>
                <h1>Welcome to the compare page</h1>
                <RestaurantCard
                    place_id={restaurantOne.place_id}
                    name={restaurantOne.name}
                    link={restaurantOne.link}
                    photo_reference={getImageUrl(restaurantOne.photo_reference, 400, 400)}
                    price_level={restaurantOne.price_level}
                    rating={restaurantOne.rating}
                />
                <div className="inline-block bg-gray-800 text-white px-4 py-2 rounded-full">
                    Tap on the restaurant you prefer
                </div>
                <RestaurantCard
                    place_id={restaurantTwo.place_id}
                    name={restaurantTwo.name}
                    link={restaurantTwo.link}
                    photo_reference={getImageUrl(restaurantTwo.photo_reference, 400, 400)}
                    price_level={restaurantTwo.price_level}
                    rating={restaurantTwo.rating}
                />
            </div>
        )
    );
};

export default ComparePage;