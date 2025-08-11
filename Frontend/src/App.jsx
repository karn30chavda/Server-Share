import axios from "axios";
import {
  LayoutGrid,
  List,
  PlayCircle,
  Search,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { useEffect, useState } from "react";
import "./index.css";

function App() {
  const [videos, setVideos] = useState([]);
  const [sortAsc, setSortAsc] = useState(true);
  const [view, setView] = useState("detail");
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://192.168.0.105:5000/videos")
      .then((res) => setVideos(res.data))
      .catch((err) => console.error(err));
  }, []);

  const getMimeType = (fileName) => {
    if (fileName.endsWith(".mp4")) return "video/mp4";
    if (fileName.endsWith(".webm")) return "video/webm";
    if (fileName.endsWith(".ogg")) return "video/ogg";
    return "video/mp4";
  };

  const sortedVideos = [...videos].sort((a, b) =>
    sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  );

  const filteredVideos = sortedVideos.filter((video) =>
    video.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-inner">
          <div className="logo-section">
            <PlayCircle className="icon-large orange-icon" />
            <span className="logo-text">Server Share</span>
          </div>
          <div className="controls-section">
            <div className="search-box">
              <Search className="icon-medium gray-icon" />
              <input
                type="text"
                placeholder="Search videos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>
            <button
              onClick={() => setSortAsc((prev) => !prev)}
              className="btn btn-sort"
              title="Sort by Name"
              type="button"
            >
              {sortAsc ? <SortAsc size={18} /> : <SortDesc size={18} />}
            </button>
            <button
              onClick={() => setView("list")}
              className={`btn btn-view ${view === "list" ? "active" : ""}`}
              title="List View"
              type="button"
            >
              <List />
            </button>
            <button
              onClick={() => setView("detail")}
              className={`btn btn-view ${view === "detail" ? "active" : ""}`}
              title="Detail View"
              type="button"
            >
              <LayoutGrid />
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        {filteredVideos.length === 0 ? (
          <div className="no-videos">No videos found.</div>
        ) : view === "list" ? (
          <div className="table-wrapper">
            <table className="video-table">
              <thead>
                <tr className="table-header-row">
                  <th>#</th>
                  <th>Name</th>
                  <th>Play</th>
                </tr>
              </thead>
              <tbody>
                {filteredVideos.map((video, idx) => (
                  <tr key={video.name} className="table-row">
                    <td>{idx + 1}</td>
                    <td className="video-name-cell">
                      <span className="video-name-text">{video.name}</span>
                    </td>
                    <td>
                      <a
                        href={`http://192.168.0.105:5000${video.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-play"
                      >
                        <PlayCircle className="icon-small" />
                        Play
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid-container">
            {filteredVideos.map((video) => (
              <div key={video.name} className="video-card">
                <video
                  controls
                  className="video-player"
                  preload="metadata"
                  src={`http://192.168.0.105:5000${video.url}`}
                  type={getMimeType(video.name)}
                />
                <div className="video-info ">
                  <p className="video-title">{video.name}</p>

                  <a
                    href={`http://192.168.0.105:5000${video.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-play"
                  >
                    <PlayCircle className="icon-small" />
                    Play
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
