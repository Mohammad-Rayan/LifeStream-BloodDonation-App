# LifeStream Backend

This is the backend for the Blood Donation Application, built with Node.js, Express, and MongoDB. It provides RESTful APIs for user management, authentication, and blood request handling.

## Features
- User registration and authentication (JWT)
- Blood request creation and management
- Role-based access (admin, donor, recipient)
- Request logging and middleware
- MongoDB integration via Mongoose

## Prerequisites
- Node.js (v16 or higher recommended)
- npm
- MongoDB database (local or Atlas)

## Getting Started
1. **Clone the repository:**
	```sh
	git clone <repo-url>
	cd Blood-Donation-Backend
	```
2. **Install dependencies:**
	```sh
	npm install
	```
3. **Configure environment variables:**
	- Create a `.env` file in the root directory with the following:
	  ```env
	  PORT=3000
	  MONGO_URI=your_mongodb_connection_string
	  JWT_SECRET=your_jwt_secret
	  ```
4. **Start the server:**
	```sh
	npm start
	```
	The server will run on `http://localhost:3000` by default.

## Project Structure
```
├── server.js                # Entry point
├── config/                  # Database config
├── controllers/             # Route controllers
├── middlewares/             # Custom middleware
├── models/                  # Mongoose models
├── routes/                  # API routes
├── utils/                   # Utility functions
├── logs/                    # Log files
├── .env                     # Environment variables
├── package.json             # Project metadata
```

## API Endpoints
- `/api/users` - User registration, login, profile
- `/api/blood-requests` - Create, view, and manage blood requests

## Deployment
1. Set environment variables on your server (never commit `.env` to public repos).
2. Use a process manager like PM2 or deploy to a cloud provider (Heroku, Vercel, etc).
3. Ensure MongoDB is accessible from your deployment environment.

## Security Notes
- Never expose your `.env` file or secrets.
- Use HTTPS in production.
  
## � Contributors

- **[Mohammad Rayan](https://github.com/Mohammad-Rayan)** - Full-stack Development, Project Lead
- **[Abdul Wahab Subhani](https://github.com/Abdul-Wahab-Subhani)** - Frontend Development

## License
ISC

## Authors
- Mohammad Rayan
