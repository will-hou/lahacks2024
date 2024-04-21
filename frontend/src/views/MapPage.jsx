import { useState } from 'react'
import MapViewer from '../components/MapViewer';

const MapPage = () => {
    return (
        <div className="h-screen w-screen flex flex-col justify-center items-center">
            <h1>Welcome to the map page</h1>
            <MapViewer/>
        </div>
    );
};

export default MapPage;
