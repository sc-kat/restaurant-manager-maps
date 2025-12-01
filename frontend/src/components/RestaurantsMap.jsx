import {GoogleMap, Marker, useJsApiLoader} from '@react-google-maps/api';
import "./App.css";

//setare centru harta, Bucuresti
const defaultCenter = {
    lat: 44.4268,
    lng: 26.1025
};

function RestaurantsMap({restaurants}) {
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyAJAHrceuyZZKRbOcrVQ2GFicDqGW65gbY' 
    });

     console.log('Restaurante primite:', restaurants);
     
    if (loadError) {
        return <div>Eroare la incarcarea hartii</div>;
    }
    if (!isLoaded) {
        return <div>Se incarca harta...</div>;
    }

    return (
        <GoogleMap
            mapContainerClassName="map-container"
            center={defaultCenter}
            zoom={12}
        >
            {/* <Marker position={defaultCenter} /> */}
            {restaurants && restaurants.map((restaurant) => (
                <Marker
                    key={restaurant.id}
                    position={{ lat: restaurant.latitude, lng: restaurant.longitude }}
                    title={restaurant.name}
                />
            ))}
        </GoogleMap>
    );
}

export default RestaurantsMap;