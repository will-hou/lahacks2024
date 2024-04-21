import React, { useState, useEffect } from 'react';
import RestaurantCard from '../components/RestaurantCard';
import { useRoomContext } from '../RoomContext';
import { BACKEND_ENDPOINT } from '../constants';


function WinnersPage() {

    const { roomID } = useRoomContext();
    const [winner, setWinner] = useState(null);

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

    useEffect(() => {
        console.log('fetching winner');
        const fetchWinnerData = async () => {
            const url = `${BACKEND_ENDPOINT}winner?room_id=${roomID}`;

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();

                if (data.winner) {
                    console.log("Find winner")
                    console.log(data.winner);
                    setWinner(data.winner);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            }

        };

        fetchWinnerData();
    }, []);


    return (
        <div className='flex flex-col px-5 gap-5 justify-center items-center h-screen w-screen'>
            <h1 className='text-8xl'>🎉</h1>
            <h1 className='font-bold text-2xl'>You're Going To </h1>
            <RestaurantCard
                place_id={winner?.place_id}
                name={winner?.name}
                link={winner?.link}
                photo_reference={getImageUrl(winner?.photo_reference, 400, 400)}
                price_level={winner?.price_level}
                rating={winner?.rating} />
        </div>
    );
}

export default WinnersPage;
