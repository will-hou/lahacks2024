import { useState } from 'react'

const ComparePage = () => {

    console.log("We are on the following path: " + window.location.pathname)

    return (
        <div className='h-screen w-screen flex justify-center items-center'>
            <h1>Welcome to the compare page</h1>
        </div>
    );
};

export default ComparePage;
