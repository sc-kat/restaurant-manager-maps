import React from 'react';
import { Link } from 'react-router-dom';
import RestaurantsMap from './RestaurantsMap';
import './App.css';

function MapPage({restaurants}) {
    return (
        <div className="app-container">
            <nav className='main-nav'>
                <Link to="/">Lista restaurante</Link>
                {" | "}
                <Link to="/map">Vezi harta restaurantelor</Link>
            </nav>
            <h1>Harta restaurantelor</h1>
            <RestaurantsMap restaurants={restaurants} />
        </div>
    );
}

export default MapPage;