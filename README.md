# Natours

Natours is a CRUD (Create, Read, Update, Delete) application built with Node.js, Express and MongoDB.

## Features

- User authentication and authorization
  - Sign up and login functionality
  - JWT tokens for authentication
  - Different access rights for users, guides and admins
- Tours
  - Browse available tours
  - View tour details
  - Book tours
  - Review and rate tours
- User profiles
  - View profile information
  - Update profile data
- Credit card payments
  - Integrate payments using Stripe API
- Admin dashboard
  - Manage tours, users, reviews etc.
  - View analytics and statistics

## Usage

The app can be run locally or deployed to a server.

### Local Setup

- Install Node.js and MongoDB
- Clone the repository
- git clone https://github.com/natours.git
- Install dependencies
- npm install
- Set up environment variables in `.env` file
- MongoDB connection string
- JWT secret
- Stripe API keys
- Start the app
- npm run dev

The app will be served at `http://localhost:3000`

### Deployment

The app can be deployed to any hosting platform that supports Node.js like Heroku, AWS, Azure etc.

Make sure to set up environment variables on the platform.

## Technology Stack

- [Node.js](https://nodejs.org/) - Runtime environment
- [Express](https://expressjs.com/) - Web application framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Mongoose](https://mongoosejs.com/) - MongoDB ODM
- [JWT](https://jwt.io/) - Authentication
- [Bcryptjs](https://www.npmjs.com/package/bcryptjs) - Password hashing
- [Stripe](https://stripe.com/) - Payments
- [Pug](https://pugjs.org/) - Templating engine

## Documentation

- Environment variables and configuration are documented in `.env.example`
- For detailed code documentation, check inline comments and JSDoc annotations in source code
