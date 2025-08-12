
# 🎥 Server Share - Video Streaming Web App



A local video streaming server with React frontend and Express backend.

Browse, search, sort, and play videos stored on your machine from a sleek web interface.



---



## 🚀 Features



- List all video files from a local directory (supports `.mp4`, `.webm`, `.ogg`, `.mkv`)

- Video streaming with range requests for smooth playback (supports pause/resume)

- Search videos by name with instant filtering

- Sort videos alphabetically (asc/desc toggle)

- Two viewing modes: List (table) and Detail (grid cards)

- Play videos directly in browser or open in new tab

- Responsive UI with modern design and Lucide icons



---



## 🛠 Tech Stack



| Layer    | Technologies                          |

| -------- | ------------------------------------- |

| Backend  | Node.js, Express, CORS, fs, mime, Nodemon      |

| Frontend | React, Axios, Lucide React Icons, CSS |



---



## 🗂 Project Structure



```

server-share/

├── Backend/

│   ├── src/

│   │   └── server.js        # Express backend API and video streaming

│   └── package.json

├── Frontend/

│   ├── src/

│   │   ├── App.jsx          # Main React app component

│   │   ├── index.css        # Styling for app

│   │   └── main.jsx

│   ├── public/

│   ├── package.json         # Frontend dependencies & scripts

│   └── vite.config.js

├── README.md

```



---



## 📋 Backend Setup



1. Make sure you have Node.js installed (v14+ recommended)



2. Change the `baseDir` variable in `src/server.js` to your video folder path:



   ```js

   const baseDir = "C:\\Users\\Acer\\Desktop\\TELECAST";

   ```



3. Install dependencies for backend:



   ```sh

   npm install

   ```



4. Run backend server:

   ```sh

   npm run dev

   ```



**Backend API endpoints:**



- `GET /videos` — Returns list of videos in the directory

- `GET /video/:filename` — Streams the requested video with range support



---



## ⚛️ Frontend Setup



1. Navigate to frontend folder:



   ```sh

   cd Frontend

   ```



2. Install frontend dependencies:



   ```sh

   npm install

   ```



3. Run the React app (using Vite):

   ```sh

   npm run dev -- --host

   ```



Frontend fetches videos from `http://<YOUR_BACKEND_IP>:5000/videos`.

Update this IP in `App.jsx` if your backend runs elsewhere.



---



## 🔧 How It Works



- Backend scans your specified folder and returns all video files.

- Frontend fetches this list, lets you search and sort.

- Video URLs are proxied via backend `/video/:filename` route, streaming with range support.

- You can switch between list and detail views for better browsing experience.



---



## 🎨 UI Preview



**List View**



| #   | Name        | Play |

| --- | ----------- | ---- |

| 1   | Sample1.mp4 | ▶️   |

| 2   | Sample2.mkv | ▶️   |



**Detail View**

Grid cards with video thumbnails and play buttons.



---



## 💡 Tips



- Ensure your `baseDir` folder has read permissions.

- Use absolute path for Windows (`C:\\...`) or Linux/Mac (`/home/user/videos`).

- To access from other devices, ensure backend IP and port are reachable on your network.



---



## 🤝 Contributing



Contributions, issues, and feature requests are welcome!

Feel free to fork and send PRs.



---



## 📜 License



MIT License © 2025 Karan



Made with ❤️


