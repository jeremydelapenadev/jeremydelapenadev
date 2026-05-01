# System Requirements

- Node.js (v18+ recommended)
- npm
- MongoDB (local or cloud via MongoDB Atlas)
- Git
- Code editor (e.g., VS Code)

## Project Structure

```connectispaces/
│
├── backend/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── api/seedSpaces.js
│   └── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   └── assets/css
│   │   └── components/
│   │   └── context/
│   │   └── hooks/
│   └── App.jsx
└── README.md```

## Environment Variables

Create a `.env` file in the backend:

`PORT=8080
DB_URI=your_mongodb_connection_string`

## Installation

1. Clone Repository

`git clone https://github.com/jeremydelapenadev/2025-10-07-SE-PT-AU-NZ/tree/8a2e25b2194f5baa266ffc0308a0994a4a4618e5/CapstoneProject/ConnectiSpaces/
cd connectispaces`

2. Install Dependencies

Backend:

`cd backend
npm install`

Frontend:

`cd frontend
npm install`

3. Run the Application

Backend:

`npm start`

Frontend:

`npm run dev`

4. (Optional) Run Both Concurrently
In the root folder of the project,

`npm install concurrently`

In the root package.json, add:

`"scripts": {
  "dev": "concurrently \"cd backend && npm start\" \"cd frontend && npm run dev\""
}`

Then run:

`npm run dev`

## Testing
Use Thunder Client or Postman to test API endpoints:

`/api/users
/api/auth/login
/api/spaces
/api/reviews
/api/posts
/api/comments
/api/likes
/api/favourites`

## Database Setup
- Ensure MongoDB is running.
- Seed initial data (users, spaces), if required.
- Use MongoDB Compass for inspection.
