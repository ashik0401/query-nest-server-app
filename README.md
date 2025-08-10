# Product Recommendation System

A dynamic and responsive web application that allows users to post queries about products they wish to avoid and get product recommendations from other users. The platform promotes informed decision-making through community feedback and suggestions.

![BiteLog Screenshot](https://i.postimg.cc/wvn5Tv3Q/Screenshot-2025-08-10-130008.png)

## 🌐 Live Site

[Visit Live Website](https://query-nest-web-13121.web.app/)

## 🚀 Project Purpose

The Product Recommendation System helps users to:
- Post queries about products they are not satisfied with.
- Get better product alternatives through recommendations.
- Interact with community queries.
- Manage personal queries and recommendations with full CRUD functionality.

## ✨ Key Features

### Authentication
- Firebase Authentication with Email/Password and Google Login.
- JWT-based authentication to secure private routes.
- User state maintained on route reloads using cookies and JWT.

### Core Functionality
- **Add Query**: Authenticated users can submit queries about unsatisfactory products.
- **My Queries**: Users can view, update, and delete their own queries.
- **All Queries**: View all user queries with search and layout toggle features.
- **Query Details**: See query details and user information, and add/view recommendations.
- **Add Recommendations**: Suggest better alternatives with reasons and media.
- **My Recommendations**: View and delete personal recommendations.
- **Recommendations For Me**: View recommendations made by others for your queries.

### Extra Home Page Components
- **TrendingDiscussions**: Highlights popular discussions.
- **WhyChooseUs**: Emphasizes the platform's value and vision.
- **TopContributors**: Showcases the most active or impactful users on the platform.

### UI/UX
- Beautiful, responsive design for mobile, tablet, and desktop.
- 404 error page for invalid routes.
- Navbar and footer with dynamic rendering based on login status.
- Conditional rendering of routes and components.

### Security
- Firebase config and MongoDB URI stored securely using `.env` files.
- JWT token stored in cookies for authentication.
- Protected backend routes with token verification middleware.

### Tools & Technologies

**Client Side**
- React
- React Router
- Firebase Authentication
- Tailwind CSS
- Axios
- React Hot Toast
- React Icons
- SweetAlert2

**Server Side**
- Node.js
- Express.js
- MongoDB
- CORS
- JWT
- dotenv

## 📦 NPM Packages Used

**Frontend**
- axios
- react-router-dom
- react-hot-toast
- sweetalert2
- react-icons
- firebase

**Backend**
- express
- cors
- jsonwebtoken
- mongodb
- dotenv
- cookie-parser


## 📜 Functional Requirements Covered

- Firebase & JWT authentication
- Add, update, delete queries
- Add and delete recommendations
- Personal and global view of recommendations
- Recommendation count increment/decrement
- Responsive UI
- Search and layout toggle on All Queries
- 404 error handling
- Environment variable security
- Deployment with CORS and route reload support

 ## How to Run This Project Locally
## 1️⃣ Clone the Repository
Open your terminal and run:

## 2️⃣ Setup the Client (Frontend)
Go into the client folder:

cd client
Install dependencies:

npm install
Create a .env file in the client folder and add your Firebase configuration:


- VITE_apiKey=YOUR_FIREBASE_API_KEY
- VITE_authDomain=YOUR_FIREBASE_AUTH_DOMAIN
- VITE_projectId=YOUR_FIREBASE_PROJECT_ID
- VITE_storageBucket=YOUR_FIREBASE_STORAGE_BUCKET
- VITE_messagingSenderId=YOUR_FIREBASE_MESSAGING_SENDER_ID
- VITE_appId=YOUR_FIREBASE_APP_ID
- VITE_serverUrl=http://localhost:5000
- Start the frontend:


npm run dev
The frontend should now run on http://localhost:5173 (Vite default).

## 3️⃣ Setup the Server (Backend)
Open another terminal and go to the server folder:


cd ../server
Install dependencies:

npm install
Create a .env file in the server folder with:


- PORT=5000
- DB_URI=YOUR_MONGODB_CONNECTION_STRING
- ACCESS_TOKEN_SECRET=YOUR_SECRET_KEY
- CLIENT_URL=http://localhost:5173
- Start the backend server:


npm run dev

## ✅ Deployment Checkpoints

- No CORS/404/504 issues
- Firebase domain authorization included
- Private routes protected with JWT
- Reload-safe route protection
- Fully working client and server on deployment

## 👨‍💻 Author

**Ashik Mahmud**  

