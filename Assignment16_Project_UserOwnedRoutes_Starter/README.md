# CST218 Assignment 16 Starter Pack — User-Owned Routes

This starter pack demonstrates:
- Register + login that returns a token (JWT)
- Auth middleware (Bearer token)
- A protected /profile route
- A user-owned CRUD router for /entries

## Setup
1. Install dependencies:
   npm install
2. Paste your MongoDB connection string into `.env`
3. Start:
   node server.js

## Routes
- POST /register
- POST /login   -> returns token
- GET  /profile (protected)
- CRUD: /entries (all protected, ownership enforced)
