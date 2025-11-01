MERN Blog Application

A fully functional MERN (MongoDB, Express, React, Node.js) blog application demonstrating CRUD operations, authentication, categories, comments, image upload, pagination, and modern state management.

This project is part of the PLP Week 4 MERN Deep Integration Assignment.

Features

 Core Functionalities

Create, Read, Update & Delete Blog Posts

Category Management

JWT Authentication (Login & Registration)

Protected Routes

Comments on blog posts

Slug-based routing for SEO-friendly URLs

Image upload for posts (Multer)

Pagination & search

Optimistic UI updates

Real-time category list in post form

API error handling & request interceptors

 Advanced Features

JWT persistent login system

Auto-generate slug from title

Post view counter

MongoDB Atlas integration

Validation (server-side + client-side)

Centralized API service with Axios

Custom hooks for data fetching


 Tech Stack
Layer	Technology
Front-end	React + Vite, React Router, Axios
Back-end	Node.js, Express.js
Database	MongoDB Atlas
Auth	JWT + bcrypt
Styling	TailwindCSS / CSS modules
Image Upload	Multer

 Folder Structure
mern-blog/
 ├── client/               # Frontend
 │   ├── src/
 │   │   ├── pages/
 │   │   ├── components/
 │   │   ├── hooks/
 │   │   ├── services/     # Axios API services
 │   │   ├── context/      # Auth context
 │   │   └── App.jsx
 │   └── package.json
 ├── server/
 │   ├── models/
 │   ├── routes/
 │   ├── controllers/
 │   ├── middleware/
 │   ├── uploads/
 │   └── server.js
 ├── README.md
 └── .env.example

 Installation & Setup

 Clone Repo
git clone https://github.com/yourusername/mern-blog.git
cd mern-blog

 Server Setup
cd server
npm install


Create .env in server/:

PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development


Run server:

npm run dev

 
 Client Setup
cd ../client
npm install


Create .env in client/:

VITE_API_URL=http://localhost:5000/api


Run frontend:

npm run dev

Access
URL	Description
http://localhost:5173
	Frontend
http://localhost:5000
	Backend

API Endpoints

Auth
Method	Endpoint	Function
POST	/api/auth/register	Register user
POST	/api/auth/login	Login

Posts
Method	Endpoint	Function
GET	/api/posts	Get all posts
GET	/api/posts/:idOrSlug	Get single post
POST	/api/posts	Create post
PUT	/api/posts/:id	Update post
DELETE	/api/posts/:id	Delete post
POST	/api/posts/:id/comments	Add comment
Method	Endpoint	Function
GET	/api/categories	Get categories
POST	/api/categories	Create category

Author

Name: Amos G.
Course: PLP MERN Stack Development
Week: 4 – MERN Deep Integration

Conclusion

This MERN Blog demonstrates full-stack capability with clean structure, secure authentication, and modern UX. It meets and exceeds assignment requirements.
