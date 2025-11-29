import { useState, useEffect } from 'react'

function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    async function loadRestaurants() {
      try {
        const response = await fetch('http://localhost:3000/api/restaurants');

        if (!response.ok) {
          throw new Error("Nu s-au putut incarca restaurantele.");
        }

        const data = await response.json();
        setRestaurants(data);
      } catch (err) {
        console.error(err);
        setError("A aparut o eroare la incarcarea restaurantelor.");
      } finally {
        setLoading(false);
      }
    }

    loadRestaurants();
  }, []);

  if (loading) {
    return <p className='status-message'>Se incarca restaurantele...</p>;
  }
  if (error) {
    return <p className='status-message'>{error}</p>;
  }

  if (restaurants.length === 0) {
    return <p className='status-message'>Nu exista restaurante in baza de date</p>;
  }

  return (
    <div className = 'app-container'>
      <h1>Lista de restaurante</h1>
      <ul className='restaurant-list'>
        {restaurants.map((restaurant) => (
          <li key={restaurant.id}>
            <strong>{restaurant.name}</strong> - {restaurant.address}
          </li>
        ))}
      </ul>
    </div >
  );
}

export default App;