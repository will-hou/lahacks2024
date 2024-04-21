import React from 'react';

const RestaurantCard = ({ place_id, name, link, photo_reference, price_level, rating }) => {
    // Function to generate price level icons based on the integer value

    return (
        <div className='relative flex justify-center items-center border-2 border-gray bg-gray rounded-lg h-[30vh] w-full p-3'>
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
                <div className="bg-white shadow-xl bg-opacity-90 rounded-full border p-2 px-4 max-w-[80%] max-h-[30%]" onClick={() => window.open("https://google.com", "_blank")}>
                    {/* Your button content */}
                    <p className='text-sm'>
                        <a href={link} target='_'>
                            More Details
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RestaurantCard;
