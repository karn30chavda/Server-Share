# ServerShare - A Simple File Sharing Platform

![Node.js](https://img.shields.io/badge/Node.js-v14%2B-green.svg)
![React](https://img.shields.io/badge/React-v18-blue.svg)
![Express.js](https://img.shields.io/badge/Express.js-4.x-lightgrey.svg)

ServerShare is a full-stack file sharing platform that categorizes and displays files from a local server directory. The frontend is a responsive React application, and the backend is a lightweight Express.js server.

---

## ✨ Features

- **🖥️ Responsive UI:** Works seamlessly on mobile, tablet, and desktop.
- **📁 Smart Categorization:** Backend automatically serves files from `VIDEOS`, `IMAGES`, `PDF`, `MUSIC`, and `OTHERS` folders.
- **🔍 Powerful Search & Sort:** Instantly search for files within a category and sort them alphabetically (A-Z or Z-A).
- **🖼️ Multiple Views:** Switch between a detailed Grid View and a compact List View.
- **🎥 Video & Audio Support:**
  - Auto-generated video thumbnails for a better browsing experience.
  - Built-in audio player to stream music files directly.
  - Efficient video streaming with support for range requests.
- **📱 Mobile Optimized:** The header intelligently hides on scroll-down and reappears on scroll-up for maximum screen real estate.

---

## Features

### Frontend

- 🖥️ **Responsive UI** — Works on mobile, tablet, and desktop
- 🔍 **Search functionality** — Search files within categories
- 🔄 **Sorting options** — Sort files A → Z or Z → A
- 📁 **Multiple views** — Grid view and list view
- 🎥 **Video thumbnails** — Auto-generated for video files (browser support dependent)
- 🎵 **Audio player** — Built-in audio player for music files
- 📱 **Mobile-friendly header** — Header hides/shows on scroll
- 🎨 **Modern UI** — Clean interface with consistent styling

### Backend

- 📂 **File categorization** — Automatically categorizes files into folders
- 📺 **Video streaming** — Supports partial content (range requests) for smooth playback
- 🔒 **CORS enabled** — Secure cross-origin requests
- 🗄️ **File serving** — Efficient static file delivery and endpoints to list files
- ⚙️ **Configurable base directory** — Easy to point to any root folder

---

## Tech Stack

**Frontend**

- React (v18)
- Axios (HTTP client)
- Lucide React (icons)
- CSS Modules (styling)

**Backend**

- Express.js (web framework)
- CORS (middleware)
- mime (file type detection)
- Node.js (runtime)

---

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- Node.js (v14 or later recommended)
- npm (comes with Node.js)

### Installation

1.  **Clone the repository:**
    (If you haven't already, replace `your-username/servershare` with the actual repository path)

    ```bash
    git clone https://github.com/your-username/servershare.git
    cd servershare
    ```

2.  **Install Backend Dependencies:**

    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```

---

## Configuration

### Backend Configuration

Open `backend/server.js` and set the `baseDir` constant to the absolute path of the directory containing your media files.

```javascript
// backend/server.js
const baseDir = "C:/path/to/your/files"; // <-- Change this to your path
// Example for Linux/macOS: "/home/user/my-files"
```

Your file directory must contain the following sub-folders for the categorization to work correctly:

```text
<your-files-directory>/
├── VIDEOS/
├── IMAGES/
├── PDF/
├── MUSIC/
└── OTHERS/
```

### Frontend Configuration

Open `frontend/src/App.jsx` and update the `BASE_URL` constant to point to your backend server's address. For local development, this is typically `http://localhost:5000`.

```javascript
// frontend/src/App.jsx
const BASE_URL = "http://localhost:5000"; // Adjust if your server IP or port is different
```

---

## Running the Application

1.  **Start the Backend Server:**
    From the `backend` directory, run:

    ```bash
    node server.js
    ```

    The server will start on port 5000 by default.

2.  **Start the Frontend App:**
    From the `frontend` directory, run:
    ```bash
    npm start
    ```
    The React development server will start, and the app will be accessible at `http://localhost:3000`.

---

## File Structure

```text
servershare/
├── backend/
│   ├── node_modules/
│   ├── package.json
│   └── server.js
└── frontend/
    ├── node_modules/
    ├── public/
    ├── src/
    │   ├── App.jsx
    │   ├── index.css
    │   └── index.js
    ├── package.json
    └── ...
```

---

## 🔗 API Endpoints

| Endpoint                    | Method | Description                           |
| --------------------------- | ------ | ------------------------------------- |
| `/files/:category`          | GET    | Get files in a specific category      |
| `/file/:category/:filename` | GET    | Get (stream/download) a specific file |

**Example:**
`GET /files/VIDEOS` → returns list of video files in the `VIDEOS` directory.

---

## 📱 Mobile Optimization

- Header hides on scroll down and reappears on scroll up
- Smooth header transitions and touch-friendly controls
- Responsive grid layout adapts to small screens
- Optimized for mobile interactions (large hit targets, swipe-friendly if added)

---

## 🐞 Troubleshooting

**Files not appearing**

- Confirm files are placed in the correct folder (`VIDEOS`, `IMAGES`, etc)
- Ensure file extensions are supported by your categorization logic
- Verify backend is running and accessible from the frontend

**CORS errors**

- Make sure `cors` middleware is enabled in `server.js`
- Confirm frontend is calling the correct backend origin

**Video thumbnails not generating**

- Ensure videos are in supported formats (`.mp4`, `.webm`, `.ogg`)
- Check browser console for errors — thumbnail generation may require client-side logic or server-side ffmpeg (not included by default)

---

## 🤝 Contributing

Contributions welcome! Suggested flow:

1. Fork the repo
2. Create a branch:
   ```bash
   git checkout -b feature/your-feature
   ```

## 💾 Commit & Push

Commit your changes:

```bash
git commit -m "Add some feature"
```

Push:

```bash
git push origin feature/your-feature
```

Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

---

**ServerShare** — A simple yet powerful solution for organizing and sharing your files!
