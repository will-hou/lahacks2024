import React from 'react';
import { BACKEND_ENDPOINT } from '../constants';
import { useRoomContext } from '../RoomContext.jsx';
import toast, { Toaster } from 'react-hot-toast';

const RestaurantCard = ({ place_id, name, link, photo_reference, price_level, rating }) => {
    // Function to generate price level icons based on the integer value
    const [selected, setSelected] = React.useState(false);
    
    const { roomID, individualID, isFinishedVoting, setIsFinishedVoting, setRestaurantOne, setRestaurantTwo} = useRoomContext();

    const onVoteToast = () => toast.success('Voted successfully!');
    
    async function vote() {
        const baseUrl = BACKEND_ENDPOINT + 'vote';
        const url = `${baseUrl}?place_id=${place_id}&room_id=${roomID}&individual_id=${individualID}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const responseData = await response.json();
            console.log(responseData);
            setIsFinishedVoting(responseData.finished_voting);
            setRestaurantOne(null);
            setRestaurantTwo(null);
            onVoteToast();
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }

    async function handleSelectConfirm() {
        console.log("Trying to vote")
        await vote();
    }

    return (
        <>
            {!selected ? (
                <>
                    <div onClick={() => { setSelected(!selected) }} className='relative flex justify-center items-center border-2 border-gray bg-gray rounded-lg h-[30vh] w-full p-3'>

                        <img
                            src={photo_reference}
                            className="absolute inset-0 rounded-lg shadow-md w-full h-full object-cover"
                            alt="Image"
                        />
                        <div className="absolute inset-0 gap-2 flex flex-col justify-center items-center bg-white bg-opacity-30 rounded-lg px-6 py-4">
                            <h1 className='text-xl shadow-xl font-bold bg-white bg-opacity-90 rounded-lg px-4 py-2'>{name}</h1>
                            <div className='flex shadow-xl items-center'>
                                <p className="bg-white shadow-xl bg-opacity-90 text-gray-700 rounded-full px-4 py-1 text-sm"> {rating} </p>
                            </div>
                            <div onClick={(e) => e.stopPropagation()} className="bg-white shadow-xl cursor-pointer bg-opacity-90 rounded-full border p-2 px-4 max-w-[80%] max-h-[30%]">
                                {/* Your button content */}
                                <p className='text-sm'>
                                    <a href={link} target='_blank' rel='noopener noreferrer'>
                                        More Details
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>

                </>
            ) :
                // Selected
                <div onClick={() => { setSelected(!selected) }} className='relative flex gap-3 flex-col justify-center items-center border-2 border-gray bg-slate-900 rounded-lg h-[30vh] w-full p-3'>

                    <h1 className='font-bold text-2xl text-white px-4 py-2'>{name}</h1>
                    <div onClick={handleSelectConfirm} className="cursor-pointer text-center border-dashed border-white border-2 rounded-full w-5/6 px-4 py-2 text-white">
                        Confirm
                    </div>
                </div>
            }
        </>
    );
};

export default RestaurantCard;
