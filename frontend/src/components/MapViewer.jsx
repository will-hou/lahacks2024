import { useState, useEffect } from 'react'
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

const MapViewer = () => {

    const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);


    useEffect(() => {
        // Check if Geolocation is supported by the browser
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            return;
        }

        // Get the user's current position
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
            },
            (err) => {
                setError(`Error retrieving location: ${err.message}`);
            }
        );
    }, []); // Empty dependency array ensures that this effect runs only once


    console.log(location)

    if (location) {
        return (
            <APIProvider apiKey={GOOGLE_PLACES_API_KEY} libraries={["places"]}>
                <Map
                    className='h-96 w-96'
                    defaultCenter={{ lat: location.latitude, lng: location.longitude }}
                    defaultZoom={15}
                    gestureHandling={'cooperative'}
                    disableDefaultUI={true}   
                >
                    <Marker
                        position={{ lat: location.latitude, lng: location.longitude }}
                        clickable={true}
                        onClick={() => alert('marker was clicked!')}
                        title={'clickable google.maps.Marker'} />
                </Map>
            </APIProvider>
        );

    }

};

export default MapViewer;
