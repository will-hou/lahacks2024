import { useState } from 'react'

const Homepage = () => {

    console.log("We are on the following path: " + window.location.pathname)

    return (
        <div>
            <h1>Welcome to the Homepage</h1>
            <p>This is a boilerplate homepage component.</p>
        </div>
    );
};

export default Homepage;
