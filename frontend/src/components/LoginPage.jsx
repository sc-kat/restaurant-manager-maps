import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("test1@test.ro");
  const [password, setPassword] = useState("parola123");
  const [error, setError] = useState(null);

  async function handleLogin(e) {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login esuat.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
    } catch (err) {
      console.error("Eroare login:", err);
      setError("A aparut o eroare la login.");
    }
  }

  return (
    <div className="app-container">
      <nav className="main-nav">
        <Link to="/">Lista restaurante</Link>
      </nav>

      <h1>Login</h1>

      <form onSubmit={handleLogin} className="add-restaurant-form">
        <div className="form-row">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-row">
          <label htmlFor="password">Parola:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Login</button>

        {error && <p className="status-message error">{error}</p>}
      </form>
    </div>
  );
}

export default LoginPage;
