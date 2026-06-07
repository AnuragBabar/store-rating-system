# RateHub (Store Rating System)

A full-stack web application that allows users to submit and view ratings for stores registered on the platform. The application features a robust single login system with distinct dashboards and functionalities for System Administrators, Store Owners, and Normal Users.

## Tech Stack
- **Frontend:** React.js, Vite
- **Backend:** Express.js, Node.js
- **Database:** MySQL, Sequelize ORM

## Features
- **User Registration/Login:** Secure JWT-based authentication with bcrypt password hashing.
- **Admin Dashboard:** Centralized control panel to manage all users and stores. Includes sorting, filtering, and detailed statistic tracking.
- **Store Owner Dashboard:** Dedicated interface for store owners to monitor their store's average ratings and see exactly who rated them.
- **Store Ratings:** Interactive 1-to-5 star rating system for regular users.
- **Search, Filter, Sorting:** Full support across data tables for ascending/descending sorts and real-time filtering.

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server

### Database Setup
1. Create a MySQL database (e.g., `ratehub_db`).
2. Update the database credentials inside `backend/.env`.

### Backend
```bash
cd store-rating-system/backend
npm install

# Optional: Seed the database with sample data
npm run seed

# Start the server
npm start
```

### Frontend
```bash
cd store-rating-system/frontend
npm install

# Start the development server
npm run dev
```

## User Roles
- **Admin:** Can add new stores, add normal users, add other admin users, and view platform-wide statistics.
- **Store Owner:** Can view their owned stores, see the average rating per store, and view a detailed list of users who submitted those ratings.
- **Normal User:** Can sign up, search/view registered stores, and submit/modify 1-to-5 star ratings for individual stores.

## Sample Credentials (If Seeded)
If you ran `npm run seed`, the following accounts are available for testing:
- **Admin:** `admin@ratehub.in` / `Admin@123`
- **Store Owner:** `mukesh@reliance.in` / `Owner@123`
- **Normal User:** `rahul.sharma@gmail.com` / `User@123`
