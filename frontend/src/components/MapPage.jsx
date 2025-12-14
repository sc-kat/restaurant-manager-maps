import { Link } from "react-router-dom";
import LoadMapKey from "./RestaurantsMap";
import PropTypes from "prop-types";
import "./App.css";

function MapPage({ restaurants }) {
  console.log("restaurants in MapPage:", restaurants);
  return (
    <div className="app-container">
      {/* <nav className="main-nav">
        <Link to="/">Lista restaurante</Link>
        {" | "}
        <Link to="/map">Vezi harta restaurantelor</Link>
      </nav> */}
      <h1>Harta restaurantelor</h1>
      <LoadMapKey restaurants={restaurants} />
    </div>
  );
}

MapPage.propTypes = {
  restaurants: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      latitude: PropTypes.number,
      longitude: PropTypes.number,
    })
  ).isRequired,
};

export default MapPage;
