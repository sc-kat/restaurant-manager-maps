import { useState, useEffect } from 'react'
import LoadMapKey from './RestaurantsMap';
import { apiFetch } from "../apiFetch";
import { Link, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import LoginPage from "./LoginPage";


function App() {

  const navigate = useNavigate();
  const location = useLocation();

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  const [editingRestaurantId, setEditingRestaurantId] = useState(null);

  async function loadRestaurants() {
    try {
      setLoading(true);
      const response = await apiFetch('http://localhost:3000/api/restaurants');

      if (!response.ok) {
        let serverMsg = "";
        try {
          const errData = await response.json();
          serverMsg = errData.error || JSON.stringify(errData);
        } catch {
          serverMsg = "";
        }

        throw new Error(`HTTP ${response.status} ${serverMsg}`);
      }
      const data = await response.json();
      setRestaurants(data);
      setError(null);
    } catch (err) {
      console.error("Eroare la incarcarea restaurantelor:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (location.pathname === "/login") return;

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    loadRestaurants();
  }, [navigate, location.pathname]);

  async function handleAddRestaurant(e) {
    e.preventDefault();

    if (!name.trim() || !address.trim()) {
      setFormError("Numele si adresa sunt obligatorii.");
      setFormSuccess(null);
      return;
    }
    try {
      const url = editingRestaurantId
        ? `http://localhost:3000/api/restaurants/${editingRestaurantId}`
        : "http://localhost:3000/api/restaurants";

      const method = editingRestaurantId ? "PUT" : "POST";

      const response = await apiFetch(url, {
        method: method,
        body: JSON.stringify({ name, address }),
      });

      if (!response.ok) {
        throw new Error(
          editingRestaurantId
            ? "Nu s-a putut actualiza restaurantul."
            : "Nu s-a putut adauga restaurantul."
        );
      }

      setFormError(null);
      setFormSuccess(
        editingRestaurantId
          ? "Restaurant actualizat cu succes!"
          : "Restaurant adaugat cu succes!"
      );
      setName("");
      setAddress("");
      setEditingRestaurantId(null);
      await loadRestaurants();
    } catch (err) {
      console.error("Eroare la adaugarea restaurantului:", err);
      setFormError(
        editingRestaurantId
          ? "A aparut o eroare la actualizarea restaurantului."
          : "A aparut o eroare la adaugarea restaurantului."
      );
      setFormSuccess(null);
    }
  }

  function handleEdit(restaurant) {
    setEditingRestaurantId(restaurant.id);
    setName(restaurant.name);
    setAddress(restaurant.address);
    setFormError(null);
    setFormSuccess(null);
  }
  function handleCancelEdit() {
    setEditingRestaurantId(null);
    setName("");
    setAddress("");
  }

  async function handleDelete(restaurantId) {
    if (!window.confirm("Esti sigur ca vrei sa stergi acest restaurant?")) {
      return;
    }
    try {
      const response = await apiFetch(`http://localhost:3000/api/restaurants/${restaurantId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error("Nu s-a putut sterge restaurantul.");
      }
      setFormSuccess("Restaurant sters cu succes!");
      await loadRestaurants();
    } catch (err) {
      console.error("Eroare la stergerea restaurantului:", err);
      setFormError("A aparut o eroare la stergerea restaurantului.");
      setFormSuccess(null);
    }
  }

  if (location.pathname !== "/login") {
    if (loading) {
      return <p className='status-message'>Se incarca restaurantele...</p>;
    }
    if (error) {
      return <p className='status-message'>{error}</p>;
    }
  }

  return (
    <div className="app-container">
      <nav className="main-nav">
        <Link to="/">Lista restaurante</Link>
        {" | "}
        <Link to="/map">Vezi harta restaurantelor</Link>
        {" | "}
        <Link to="/login">Login</Link>
        {" | "}
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login", { replace: true });
          }}
        >
          Logout
        </button>
      </nav>

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/map" element={<LoadMapKey restaurants={restaurants} />} />
        <Route path="*" element={
          <>
            <h1>{editingRestaurantId ? "Editeaza Restaurant" : "Adauga Restaurant"}</h1>
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
              <div className='form-buttons'>
                <button type='submit'>{editingRestaurantId ? "Actualizeaza Restaurant" : "Adauga Restaurant"}</button>
                {editingRestaurantId && <button type='button' onClick={handleCancelEdit}>Anuleaza</button>}
              </div>

                {formError && (
                  <p className="status-message error">{formError}</p>
                )}
                {formSuccess && (
                  <p className="status-message success">{formSuccess}</p>
                )}
              </form>
              <h1>Lista de restaurante</h1>
              {restaurants.length === 0 ? (
                <p className="status-message">
                  Nu exista restaurante in baza de date.
                </p>
              ) : (
                <ul className="restaurant-list">
                  {restaurants.map((restaurant) => (
                    <li key={restaurant.id} className="restaurant-item">
                      <div>
                        <strong>{restaurant.name}</strong> -{" "}
                        {restaurant.address}
                      </div>
                      <div className="restaurant-actions">
                        <button onClick={() => handleEdit(restaurant)}>
                          Editeaza
                        </button>
                        <button onClick={() => handleDelete(restaurant.id)}>
                          Sterge
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
