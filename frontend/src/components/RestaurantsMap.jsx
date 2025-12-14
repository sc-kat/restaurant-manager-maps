import {GoogleMap, Marker, useJsApiLoader} from '@react-google-maps/api';
import "./App.css";
import { useState,useEffect } from 'react';
import { useMemo } from 'react';


//setare centru harta, Bucuresti
const defaultCenter = {
    lat: 44.4268,
    lng: 26.1025
};

function LoadMapKey({restaurants}) {
   const [apiKey, setApiKey] = useState(null);
   const [keyLoading, setKeyLoading] = useState(true);

   useEffect(() => {

    async function fetchApiKey() {
        try {
            const response = await fetch('http://localhost:3000/api/config');
            const data = await response.json();
            setApiKey(data.googleMapsApiKey);
        } catch (error) {
            console.error('Eroare la preluarea cheii API:', error);
        } finally {
            setKeyLoading(false);
        }       
    }

    fetchApiKey();
   }, []);

   return keyLoading ? (<p>Se incarca harta...</p>) : apiKey ? <MapWithKey apiKey={apiKey} restaurants={restaurants} /> : (<p>Eroare la incarcarea cheii API.</p>); 
}

function MapWithKey({apiKey, restaurants}) {
    // console.log("API Key:", apiKey);
    

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: apiKey,
    });
    const mapContainerStyle = useMemo(() => ({
        width: '100%',
        height: '500px'
    }), []);        
    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={defaultCenter}  
            zoom={12}
        >
            {restaurants && restaurants.length > 0 && restaurants.map((restaurant) => (
                restaurant.latitude && restaurant.longitude && 
                <Marker
                    key={restaurant.id}
                    position={{ lat: restaurant.latitude, lng: restaurant.longitude }}
                    title={restaurant.name}
                />
            ))}
        </GoogleMap>
    ) : <p>Se incarca harta...</p>;
    
}


export default LoadMapKey;