import { useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';


import React from 'react';

const AddPlaceComponent = () => {
    const [value, setValue] = useState(null);

    const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

    const handlePlaceSelect = (selected) => {
        console.log(selected)
    }

    return (
        <div>
            <GooglePlacesAutocomplete
                apiKey={GOOGLE_PLACES_API_KEY}
                selectProps={{
                    onChange: handlePlaceSelect,
                }}
            />
        </div>
    );
};


export default AddPlaceComponent;