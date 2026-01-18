# 🧠 Pansify Backend
## Express.js + PostgreSQL REST API

This project is the backend implementation for **Pansify**, a modern music review platform.
The backend provides RESTful APIs to support user authentication, songs management, reviews,
and song requests. It is built using **Node.js, Express, and PostgreSQL**, following the same
simple structure and concepts taught in the course.

---

# 🏗️ Technology Stack

- **Node.js** – JavaScript runtime
- **Express.js** – Backend framework
- **PostgreSQL** – Relational database
- **pg** – PostgreSQL client for Node.js
- **dotenv** – Environment variable management
- **cors** – Cross-origin request handling
- **morgan** – HTTP request logging

---

# 🚀 Getting Started

## 1️⃣ Install Dependencies

```bash
cd pansify-backend
npm install


pansify_db
 
 psql -d pansify_db -f schema.sql



Create a .env file in the project root: 

PORT=5000
DATABASE_URL=postgresql://<username>:<password>@localhost:5432/pansify_db


Start the Server

npm start


The backend will run on:

http://localhost:5000

 ```


## 🗂️ Project Structure
```
pansify-backend/
├── routes/
│   ├── auth.js        # Signup & login endpoints
│   ├── songs.js       # Songs CRUD operations
│   ├── reviews.js     # Song reviews endpoints
│   └── requests.js   # Song requests management
│
├── middleware/
│   └── adminAuth.js  # Admin authorization middleware
│
├── schema.sql        # PostgreSQL database schema
├── db.js             # Database connection
├── server.js         # Express app entry point
├── .env.sample       # Environment variables example
└── README.md
```


## API Overview

Base URL for all endpoints:

http://localhost:5000

### 🔐 Authentication API

**Base Route**: '/api/auth'

| Method | Endpoint | Description            |
| ------ | -------- | ---------------------- |
| POST   | /signup  | Register a new user    |
| POST   | /login   | Login an existing user |


POST /api/auth/signup

Registers a new user (user or admin).

```json
{
  "full_name": "User One",
  "email": "user@test.com",
  "password": "1234",
  "role": "user"
}
```

POST /api/auth/login

Logs in an existing user.
```json

{
  "email": "user@test.com",
  "password": "1234"
}
```

##🎵 Songs API

Base Route

/api/songs

Available Endpoints

| Method | Endpoint | Description               |
| ------ | -------- | ------------------------- |
| GET    | /        | Get all songs             |
| GET    | /:id     | Get song details          |
| POST   | /        | Add new song (Admin only) |
| PUT    | /:id     | Update song (Admin only)  |
| DELETE | /:id     | Delete song (Admin only)  |


##🔐 Admin Authorization

Admin-only requests must include the following header:
```json
{
  "x-role": "admin"
}
```

POST /api/songs
```json
{
  "title": "Blinding Lights",
  "artist": "The Weeknd",
  "genre": "Pop",
  "cover_url": null
}
```

PUT /api/songs/:id
```json
{
  "title": "Updated Title",
  "artist": "Updated Artist",
  "genre": "Pop",
  "cover_url": null
}
```

DELETE /api/songs/:id

No request body required.
Only the song ID and admin header are needed.


##⭐ Reviews API

Base Route

/api/songs/:songId/reviews

Available Endpoints

Method	Endpoint	Description
GET	/	Get all reviews for a song
POST	/	Add a review for a song



POST /api/songs/:songId/reviews
```json
{
  "reviewer_name": "Ahmad",
  "reviewer_email": "ahmad@test.com",
  "rating": 5,
  "comment": "Amazing song!"
}
```

##📝 Song Requests API

Base Route

/api/requests

Available Endpoints

| Method | Endpoint     | Description                  |
| ------ | ------------ | ---------------------------- |
| POST   | /            | Create a song request        |
| GET    | /            | Admin: view all requests     |
| GET    | ?email=      | User: view own requests      |
| PUT    | /:id/approve | Approve request (Admin only) |
| PUT    | /:id/reject  | Reject request (Admin only)  |


POST /api/requests 
```json
{
  "title": "Bohemian Rhapsody",
  "artist": "Queen",
  "genre": "Rock",
  "requester_email": "user@test.com"
}
```

##🛡️ Admin Authorization Middleware

Admin-only routes are protected using a simple middleware.

```
export default function adminAuth(req, res, next) {
  const role = req.headers["x-role"];
  if (role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
}

If the header is missing or role is not admin, the API returns:

{
  "message": "Admin access only"
}
```

#🎯 Final Outcome

This backend provides:

A fully functional REST API

Persistent PostgreSQL data storage

Role-based admin authorization

Clean, modular Express structure

Easy frontend integration






