# 🎵 Music World - Advanced MERN Stack Application

> **Course**: Web Programming (A4)
> **Student ID**: i232117
> **Stack**: MongoDB, Express, React, Node.js

A production-ready full-stack web application for managing music albums with robust Authentication, Role-Based Access Control (RBAC), and advanced features like Image Upload, Search/Filtering, and Rate Limiting.

---

## 🚀 Features

### 🔐 Authentication & Security
- **JWT Authentication**: Secure stateless authentication using JSON Web Tokens.
- **Role-Based Access Control (RBAC)**:
  - **User**: Can view albums, manage *their own* albums, and update their profile.
  - **Admin**: Has elevated privileges to manage **ALL** albums and users via a dedicated Admin Dashboard.
- **Rate Limiting**:
  - General API: 100 requests / 15 mins.
  - Auth Routes: Strict 5 attempts / 15 mins (Brute-force protection).
- **Password Hashing**: Secure storage using `bcryptjs`.

### 💿 Album Management
- **CRUD Operations**: Create, Read, Update, Delete albums.
- **Image Upload**: Upload album covers using `multer` (served statically).
- **Advanced Querying**:
  - **Search**: Search by title or artist.
  - **Filtering**: Filter by genre.
  - **Pagination**: Efficient data loading.
- **Ownership Protection**: Users can only edit/delete albums they created (Admins can override).

### 👤 User Management
- **Dashboard**: Personalized user dashboard with stats.
- **Profile Updates**: Users can update their username/email.
- **Password Management**: Secure password change functionality.
- **Admin Panel**: Dedicated route (`/admin`) for administrators.

---

## 🛠️ Technology Stack

### Backend (`/server`)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Security**: `bcryptjs`, `jsonwebtoken`, `express-rate-limit`, `cors`
- **File Handling**: `multer`
- **Testing**: `jest`, `supertest`, `mongodb-memory-server`

### Frontend (`/client`)
- **Library**: React.js (Hooks & Context API)
- **Routing**: React Router v6
- **HTTP Client**: Axios (with Interceptors for Auto-Auth)
- **Styling**: Modern CSS3 (Grid/Flexbox, Linear Gradients, Glassmorphism)

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas Connection String

### 1. Server Setup
```bash
cd server
npm install

# Create .env file
echo "PORT=5000" > .env
echo "MONGODB_URI=your_mongodb_atlas_connection_string" >> .env
echo "JWT_SECRET=your_super_secret_key" >> .env
echo "JWT_EXPIRES_IN=30d" >> .env
echo "NODE_ENV=development" >> .env

# Run Development Server
npm run dev
```

### 2. Client Setup
```bash
cd client
npm install

# Start React App
npm start
```

Access the app at `http://localhost:3000`.

---

## 🧪 Running Tests

The backend includes a comprehensive test suite using **Jest** and **In-Memory MongoDB**. Tests cover Authentication, Album CRUD, and RBAC scenarios.

```bash
cd server

# Run all tests
npm test

# Run with coverage report
npm run test:coverage
```

**Key Test Scenarios:**
- ✅ User Registration & Login
- ✅ Protected Route Access
- ✅ Album Creation (with defaults)
- ✅ RBAC: Admin can delete any album; User cannot delete others' albums.

---

## 📂 API Documentation

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| **AUTH** | | | |
| `POST` | `/api/auth/register` | Register new user | Public |
| `POST` | `/api/auth/login` | Login user | Public |
| **USERS** | | | |
| `PATCH` | `/api/users/profile` | Update profile info | Private |
| `PATCH` | `/api/users/updatePassword` | Change password | Private |
| **ALBUMS** | | | |
| `GET` | `/api/albums` | Get all albums (w/ search/filter) | Public |
| `POST` | `/api/albums` | Create new album | Private |
| `PATCH` | `/api/albums/:id` | Update album | API Owner/Admin |
| `DELETE` | `/api/albums/:id` | Delete album | API Owner/Admin |

---

## 📸 Screenshots

*(Add your screenshots of Dashboard, Login, and Album views here)*

---

## 🚀 Deployment

### Frontend Deployment (Vercel)

This project is configured for automatic deployment to Vercel on every git push.

#### Initial Setup

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Configure Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com) and sign in with GitHub
   - Click "Add New Project"
   - Import your `music-world-react` repository
   - Vercel will auto-detect the configuration from `vercel.json`

3. **Configure Environment Variables in Vercel**:
   - In your Vercel project dashboard, go to **Settings** → **Environment Variables**
   - Add the following variable:
     - `REACT_APP_API_URL`: Your deployed backend URL (see below)

4. **Deploy**:
   - Click "Deploy"
   - Future git pushes will automatically trigger new deployments

### Backend Deployment (Recommended: Railway/Render)

Since Vercel is optimized for frontend, deploy your Express backend separately:

#### Option 1: Railway (Recommended)

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository and choose the `server` directory
4. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Your JWT secret key
   - `PORT`: 5000
   - `NODE_ENV`: production
5. Railway will provide a URL (e.g., `https://your-app.railway.app`)
6. Update `REACT_APP_API_URL` in Vercel to: `https://your-app.railway.app/api`

#### Option 2: Render

1. Go to [render.com](https://render.com) and sign in
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add the same environment variables as Railway
6. Update Vercel's `REACT_APP_API_URL` with your Render URL

### Environment Variables Reference

#### Client (`.env`)
```bash
REACT_APP_API_URL=https://your-backend-url.com/api
```

#### Server (`.env`)
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/musicworld
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=30d
PORT=5000
NODE_ENV=production
```

> **Note**: Never commit `.env` files to git. Use `.env.example` as a template.

---

**Developed for Web Programming Assignment 4**

