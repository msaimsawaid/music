# Music World - React Web Application

A dynamic music discovery platform built with React, featuring real-time search, AI-powered music assistance, and integration with multiple APIs.

## 📋 Project Overview

Music World is a comprehensive React-based web application that allows users to discover music, search for artists and songs, interact with an AI music assistant, and explore GitHub user profiles. The application demonstrates modern web development practices including dynamic data loading, API integration, and responsive design.

## 🛠️ Technologies Used

- **Frontend:** React 18, React Router DOM
- **Styling:** Custom CSS with CSS Variables
- **APIs:** GitHub REST API, iTunes Search API, Hugging Face AI API
- **Backend Services:** Firebase Firestore
- **State Management:** React Hooks (useState, useEffect)
- **Storage:** LocalStorage, Cookies
- **Version Control:** GitHub

## 📁 Project Structure

```public
|-- assets
   |-- album1.jpg
   |-- album2.jpg
   |-- album3.jpg
   |-- album4.jpg
   |-- artist1.jpg
   |-- artist2.jpg
   |-- artist3.jpg
   |-- hero.jpg
   |-- member1.jpg
   |-- member2.jpg
   |-- member3.jpg
   |-- playlist1.jpg
   |-- playlist2.jpg
   |-- playlist3.jpg
   |-- the sins.mp4
```
```src/
├── components/          # Reusable React components
│   ├── Header.js
│   ├── Footer.js
│   ├── AIChat.js
│   ├── SearchBar.js
│   ├── ThemeToggle.js
│   ├── LoadSpinner.js
│   ├── ErrorBoundary.js
│   ├── VideoPlayer.js
│   └── NewsletterSignup.js
├── pages/              # Page components
│   ├── Home.js
│   ├── About.js
│   ├── Artists.js
│   ├── Albums.js
│   ├── Playlists.js
│   ├── Contact.js
│   └── GitHubSearch.js
├── services/           # API and service integrations
│   ├── firebase.js
│   ├── itunesApi.js
│   ├── githubApi.js
│   ├── aiService.js
│   └── localStorageService.js
├── data/              # JSON data files
│   ├── musicData.json
│   └── content.json
└── App.js
```            

# Main application component

## 🔌 API Integrations

### 1. GitHub REST API
- **Endpoint:** `https://api.github.com/search/users`
- **Usage:** Search and display GitHub user profiles
- **Implementation:** `services/githubApi.js`
- **Features:** User search, profile display with avatars, follower counts, and bio information

### 2. iTunes Search API
- **Endpoint:** `https://itunes.apple.com/search`
- **Usage:** Music search and popular songs display
- **Implementation:** `services/itunesApi.js`
- **Features:** Real-time music search, audio previews, album artwork

### 3. Hugging Face AI API
- **Endpoint:** `https://api-inference.huggingface.com/models`
- **Usage:** AI-powered music assistance
- **Implementation:** `services/aiService.js`
- **Features:** Natural language conversations about music, artist information, recommendations

### 4. Firebase Firestore
- **Usage:** Contact form data storage
- **Implementation:** `services/firebase.js`
- **Features:** Form submission, data persistence, fallback to localStorage

## 🎯 Features

### Task 1: React Music Application
- **Dynamic Content Loading:** All content loaded from JSON files and APIs
- **Real-time Search:** Instant search with debouncing for music and artists
- **AI Music Assistant:** Chat interface for music-related queries
- **Theme Toggle:** Dark/Light mode with localStorage persistence
- **Form Handling:** Contact form with Firebase integration
- **Video Integration:** Embedded music videos and content

### Task 2: GitHub User Search
- **User Search:** Find GitHub users by username
- **Profile Display:** Show user avatars, bios, and statistics
- **Profile Links:** Direct links to GitHub profiles
- **Error Handling:** Comprehensive error states and loading indicators

## 🚀 Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- npm 
- Firebase account (for form storage)
- Hugging Face account (for AI API)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/music-world.git
   cd music-world
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_HUGGING_FACE_API_KEY=your_hugging_face_key
   ```

4. **Run the development server**
   ```bash
   npm start
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📱 Pages Overview

### Home Page
- Hero section with real-time search
- Popular songs from iTunes API
- Featured playlists and new releases
- AI Chat assistant
- Video player section

### Artists Page
- Dynamic artist cards loaded from JSON
- Genre information and images
- Favorite functionality

### Albums Page
- Music album displays
- Dynamic data from JSON
- Error handling for images

### GitHub Search Page
- User search interface
- GitHub API integration
- Profile cards with statistics

### Contact Page
- Form with Firebase storage
- Validation and success states
- Fallback to localStorage

### About Page
- Team information
- Project description
- Dynamic content loading

## 🔧 Custom Hooks and Services

### LocalStorage Service
- Theme preference persistence
- Favorite artists storage
- User preferences

### API Services
- Centralized API configuration
- Error handling
- Loading states management

## 📸 Screenshots

### Home Page
![Home Page](screenshots/home.png)

### GitHub Search
![GitHub Search](screenshots/github_search.png)

### Artists Page
![Artists Page](screenshots/artists.png)

### Contact Page
![Contact Page](screenshots/contact.png)

### Album Page
![Album Page](screenshots/Album.png)

### About Page
![About Page](screenshots/About.png)

## 👥 Team Contributions

### Member 1: M Bilal Ali Saif
- **Responsibilities:** 
  - Project architecture and setup
  - Home page development
  - API integrations (iTunes, GitHub)
  - Real-time search functionality
  - Firebase configuration
  - Deployment setup

### Member 2: M Umair
- **Responsibilities:**
  - Component development (Header, Footer, Cards)
  - Styling and responsive design
  - JSON data structure design
  - LocalStorage services
  - Documentation

### Member 3: M Saim Sawaid
- **Responsibilities:**
  - AI Chat integration
  - Theme toggle functionality
  - Form handling and validation
  - Error boundary implementation
  - Testing and bug fixes
---
