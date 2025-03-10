# Image Management Website

## Overview
This is a web application that allows users to:
- Register and authenticate
- Create nested folders
- Upload images into folders
- Search for images by name
- Delete folders and images
- Paginate images for better user experience

## Tech Stack
- **Frontend:** React.js (Vite), Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)



### Backend Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/AyushSharma72/folder.git
   ```
2. Navigate to the backend folder:
   ```sh
   cd backend
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Create a `.env` file and add:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
5. Start the backend server:
   ```sh
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and add:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
4. Start the frontend server:
   ```sh
   npm run dev
   ```


### Login Credentials
Email: taskmaster991@gmail.com  
Password: Ayush@1234



