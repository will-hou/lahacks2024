import { useState } from 'react'

const ResultsPage = () => {

    console.log("We are on the following path: " + window.location.pathname)

    return (
        <div className="h-screen w-screen flex flex-col justify-center items-center">
            <h1>Welcome to the results page!</h1>
        </div>
    );
};

export default ResultsPage;
