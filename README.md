# Restaurant Manager cu Google Maps

Aplicatia este un manager de restaurante, care include:
- backend (API REST)
- frontend (React, tip SPA)
- integrare cu Google Maps pentru afisarea restaurantelor pe harta

---

## Tehnologii folosite

**Backend**
- Node.js
- Express
- Prisma (ORM)
- SQLite (baza de date)
- JSON Web Token (JWT) pentru autentificare

**Frontend**
- React
- React Router
- Fetch / Axios pentru apeluri catre API
- Google Maps JavaScript API

---

## Structura proiectului

- `backend/` - codul pentru server (API REST + acces la baza de date)
- `frontend/` - codul pentru aplicatia React (SPA)
- `README.md` - acest fisier de documentatie

---

## Backend (API REST)

Backend-ul este facut cu Node.js, Express, Prisma si SQLite.  

### Cum pornesc backend-ul

1. Deschid terminalul in folderul `backend`:

   cd backend

2. Instalez dependintele (prima data):

   npm install

3. Pornesc serverul:

   npm run dev

Serverul ruleaza pe `http://localhost:3000`.

### Endpoint-uri disponibile (Restaurant)

- `GET /api/health`  
  Verifica daca serverul raspunde.

- `GET /api/restaurants`  
  Returneaza lista tuturor restaurantelor.

- `GET /api/restaurants/:id`  
  Returneaza un restaurant dupa id (ex: `/api/restaurants/1`).

- `POST /api/restaurants`  
  Creeaza un restaurant nou. Exemplu de body JSON:

  {
    "name": "Pizza Buna",
    "address": "Strada X"
  }

- `PUT /api/restaurants/:id`  
  Actualizeaza un restaurant existent. Exemplu de body JSON:

  {
    "name": "Nume nou",
    "address": "Adresa noua"
  }

- `DELETE /api/restaurants/:id`  
  Sterge restaurantul cu id-ul dat.
