Pansify Backend (Express + PostgreSQL)

This is the backend for Pansify, a modern music review platform.
It provides REST APIs for authentication, songs management, reviews, and song requests.

🏗️ Tech Stack

Node.js + Express

PostgreSQL (via pg, pgAdmin)

dotenv

cors

morgan

🚀 Getting Started
1. Install dependencies
cd pansify-backend
npm install

2. Create a PostgreSQL database

Create a database (example name):

pansify_db

3. Run database schema

Using pgAdmin Query Tool or terminal:

psql -d pansify_db -f schema.sql

4. Environment variables

Create a .env file in the project root:

PORT=5000
DATABASE_URL=postgresql://<username>:<password>@localhost:5432/pansify_db


⚠️ Do not commit .env. Use .env.sample for sharing.

5. Start the server
npm start


Server will run on:

http://localhost:5000

🗂️ Project Structure
pansify-backend/
├── routes/
│   ├── auth.js        # signup & login
│   ├── songs.js       # songs CRUD (admin)
│   ├── reviews.js     # song reviews
│   └── requests.js   # song requests
├── middleware/
│   └── adminAuth.js  # role-based access control
├── schema.sql        # PostgreSQL schema
├── db.js             # pg client
├── server.js         # app entry point
└── .env.sample

📡 API Endpoints

Base URL:

http://localhost:5000

🔐 Authentication Routes

Base URL:

/api/auth

Method	Endpoint	Description
POST	/signup	Register new user
POST	/login	Login existing user
🔸 POST /api/auth/signup

Registers a new user (user or admin).

{
  "full_name": "Admin User",
  "email": "admin@test.com",
  "password": "1234",
  "role": "admin"
}

🔸 POST /api/auth/login

Logs in an existing user.

{
  "email": "admin@test.com",
  "password": "1234"
}

🎵 Songs Routes

Base URL:

/api/songs

Method	Endpoint	Description
GET	/	Get all songs
GET	/:id	Get song details
POST	/	Add new song (admin)
PUT	/:id	Update song (admin)
DELETE	/:id	Delete song (admin)
🔐 Admin-only routes require header:
{
  "x-role": "admin"
}

🔸 POST /api/songs
{
  "title": "Blinding Lights",
  "artist": "The Weeknd",
  "genre": "Pop",
  "cover_url": null
}

🔸 PUT /api/songs/:id
{
  "title": "Updated Title",
  "artist": "Updated Artist",
  "genre": "Pop",
  "cover_url": null
}

🔸 DELETE /api/songs/:id

No request body needed.
Requires x-role: admin header.

⭐ Reviews Routes

Base URL:

/api/songs/:songId/reviews

Method	Endpoint	Description
GET	/	Get reviews for a song
POST	/	Add review to a song
🔸 POST /api/songs/:songId/reviews
{
  "reviewer_name": "Ahmad",
  "reviewer_email": "ahmad@test.com",
  "rating": 5,
  "comment": "Amazing song!"
}

📝 Song Requests Routes

Base URL:

/api/requests

Method	Endpoint	Description
POST	/	Create song request
GET	/	Admin: list all requests
GET	?email=	User: view own requests
PUT	/:id/approve	Approve request (admin)
PUT	/:id/reject	Reject request (admin)
🔸 POST /api/requests
{
  "title": "Bohemian Rhapsody",
  "artist": "Queen",
  "genre": "Rock",
  "requester_email": "user@test.com"
}

🔐 Admin-only actions require:
{
  "x-role": "admin"
}


🛡️ Admin Authorization Middleware

Admin-only endpoints use a simple role-based middleware.

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