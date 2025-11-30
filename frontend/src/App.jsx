import { useState, useEffect } from 'react'

function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  async function loadRestaurants() {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/restaurants');

      if (!response.ok) {
        throw new Error("Nu s-au putut incarca restaurantele.");
      }
      const data = await response.json();
      setRestaurants(data);
      setError(null);
    } catch (err) {
      console.error("Eroare la incarcarea restaurantelor:", err);
      setError("A aparut o eroare la incarcarea restaurantelor.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {

    loadRestaurants();

  }, []);

  async function handleAddRestaurant(e) {
    e.preventDefault();

    if (!name.trim() || !address.trim()) {
      setFormError("Numele si adresa sunt obligatorii.");
      setFormSuccess(null);
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/api/restaurants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, address }),
      });

      if (!response.ok) {
        throw new Error("Nu s-a putut adauga restaurantul.");
      }

      setFormError(null);
      setFormSuccess("Restaurant adaugat cu succes!");
      setName('');
      setAddress('');
      await loadRestaurants();

    }
    catch (err) {
      console.error("Eroare la adaugarea restaurantului:", err);
      setFormError("A aparut o eroare la adaugarea restaurantului.");
      setFormSuccess(null);
    }
  }

    if (loading) {
      return <p className='status-message'>Se incarca restaurantele...</p>;
    }
    if (error) {
      return <p className='status-message'>{error}</p>;
    }

    return (
      <div className='app-container'>
        <h1>Adauga Restaurant</h1>
        <form onSubmit={handleAddRestaurant} className='add-restaurant-form'>
          <div className='form-row'>
            <label htmlFor='name'>Nume restaurant:</label>
            <input
              id='name'
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className='form-row'>
            <label htmlFor='address'>Adresa restaurant:</label>
            <input
              id='address'
              type='text'
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <button type='submit'>Adauga</button>

          {formError && <p className='status-message error'>{formError}</p>}
          {formSuccess && <p className='status-message success'>{formSuccess}</p>}
        </form>
        <h1>Lista de restaurante</h1>
        {restaurants.length === 0 ? (
          <p className='status-message'>Nu exista restaurante in baza de date.</p>
        ) : (
          <ul className='restaurant-list'>
            {restaurants.map((restaurant) => (
              <li key={restaurant.id}>
                <strong>{restaurant.name}</strong> - {restaurant.address}
              </li>
            ))}
          </ul>
        )}
      </div >
    );
  }

  export default App;