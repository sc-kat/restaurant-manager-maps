import {GoogleMap, Marker, useJsApiLoader} from '@react-google-maps/api';
import "./App.css";
import { useState,useEffect } from 'react';
import { useMemo } from 'react';

//setare centru harta, Bucuresti
const defaultCenter = {
    lat: 44.4268,
    lng: 26.1025
};

function RestaurantsMap({restaurants}) {
   const [apiKey, setApiKey] = React.useState(null);
   const [keyLoading, setKeyLoading] = React.useState(true);

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

   
    
}


export default RestaurantsMap;