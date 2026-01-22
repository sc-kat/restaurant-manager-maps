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
# Restaurant Manager cu Google Maps

Aplicatia este un manager de restaurante, care include:

* backend (API REST)
* frontend (React, tip SPA)
* autentificare utilizator (JWT)
* integrare cu Google Maps pentru afisarea restaurantelor pe harta

Aplicatia permite:

* creare cont si autentificare
* fiecare utilizator vede si gestioneaza DOAR restaurantele proprii
* adaugare / editare / stergere restaurante
* afisarea restaurantelor pe harta folosind coordonate reale

---

## Tehnologii folosite

**Backend**

* Node.js
* Express
* Prisma (ORM)
* SQLite (baza de date)
* JSON Web Token (JWT) pentru autentificare
* Google Geocoding API (transformare adresa -> coordonate)

**Frontend**

* React
* React Router
* Fetch / Axios pentru apeluri catre API
* Google Maps JavaScript API

---

## Structura proiectului

* `backend/` - codul pentru server (API REST + acces la baza de date)
* `frontend/` - codul pentru aplicatia React (SPA)
* `README.md` - acest fisier de documentatie

---

# Configurare variabile de mediu (OBLIGATORIU)

In folderul `backend/` creeaza fisierul:

### `backend/.env`

```env
JWT_SECRET=schimba_asta_cu_un_secret_lung_si_random
GOOGLE_MAPS_API_KEY=cheia_ta_google_maps
```

**Explicatii:**

* `JWT_SECRET` – string random folosit pentru semnarea token-urilor
* `GOOGLE_MAPS_API_KEY` – cheia obtinuta din Google Cloud Console

⚠️ Fisierul `.env` NU trebuie urcat in Git.

---

## Backend (API REST)

Backend-ul este facut cu Node.js, Express, Prisma si SQLite.

### Cum pornesc backend-ul

1. Deschid terminalul in folderul `backend`:

   ```bash
   cd backend
   ```

2. Instalez dependintele:

   ```bash
   npm install
   ```

3. Creez baza de date si rulez migrarile Prisma:

   ```bash
   npx prisma migrate dev
   ```

4. Pornesc serverul:

   ```bash
   npm run dev
   ```

Serverul ruleaza pe:

```
http://localhost:3000
```

---

## Endpoint-uri disponibile

### Test

* `GET /api/health`
  Verifica daca serverul raspunde.

---

### Autentificare

* `POST /api/auth/register`
  Creeaza cont nou

```json
{
  "email": "test@test.ro",
  "name": "Test User",
  "password": "parola123"
}
```

* `POST /api/auth/login`
  Autentificare utilizator

```json
{
  "email": "test@test.ro",
  "password": "parola123"
}
```

Returneaza:

* token JWT
* date user

---

### Restaurante (PROTEJATE CU JWT)

⚠️ Toate rutele de mai jos necesita header:

```
Authorization: Bearer <token>
```

* `GET /api/restaurants`
  Returneaza restaurantele utilizatorului logat

* `GET /api/restaurants/:id`
  Returneaza restaurant dupa ID

* `POST /api/restaurants`
  Creeaza restaurant nou

```json
{
  "name": "Pizza Buna",
  "address": "Strada X, Bucuresti"
}
```

* `PUT /api/restaurants/:id`
  Actualizeaza restaurant

```json
{
  "name": "Nume nou",
  "address": "Adresa noua"
}
```

* `DELETE /api/restaurants/:id`
  Sterge restaurantul

---

### Config public

* `GET /api/config`
  Returneaza cheia Google Maps pentru frontend

---

# Frontend (React SPA)

### Pornire frontend

1. Deschid terminalul in folderul `frontend`:

```bash
cd frontend
```

2. Instalez dependintele:

```bash
npm install
```

3. Pornesc aplicatia:

```bash
npm run dev
```

Frontend-ul ruleaza pe:

```
http://localhost:5173
```

---

## Functionalitati frontend

* pagina Login (`/login`)
* salvare token in `localStorage`
* protectie rute:

  * fara token -> redirect automat la `/login`
* CRUD restaurante
* harta Google Maps cu markere
* fiecare user vede DOAR restaurantele proprii
* logout

---

## Observatii importante

* Backend si frontend trebuie pornite simultan
* Fara `.env` configurat, backend-ul NU porneste
* Cheia Google trebuie restrictionata in Google Cloud Console
