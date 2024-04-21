import { useState } from 'react'

const Homepage = () => {

    console.log("We are on the following path: " + window.location.pathname)

    return (
        <div className="h-screen w-screen flex justify-center items-center">
            <h1>Welcome to the Homepage</h1>
        </div>
    );
};

export default Homepage;
