import axios from "axios";
import {
  ChevronDown,
  File,
  FileQuestion,
  FileText,
  Folder,
  Image,
  LayoutGrid,
  List,
  Music,
  PauseCircle,
  PlayCircle,
  Search,
  SortAsc,
  SortDesc,
  Video,
  View,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import "./index.css";

const BASE_URL = "http://192.168.0.107:5000";

function App() {
  const categories = ["VIDEOS", "IMAGES", "PDF", "MUSIC", "OTHERS"];
  const [category, setCategory] = useState("VIDEOS");
  const [files, setFiles] = useState([]);
  const [sortAsc, setSortAsc] = useState(true);
  const [view, setView] = useState("detail");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showCategories, setShowCategories] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [thumbnails, setThumbnails] = useState({});
  const categoryMenuRef = useRef();
  const audioRef = useRef(null);
  const videoRefs = useRef({});
  const headerRef = useRef(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${BASE_URL}/files/${category}`)
      .then((res) => {
        setFiles(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [category]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        showCategories &&
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(event.target)
      ) {
        setShowCategories(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCategories]);

  // Generate video thumbnails
  useEffect(() => {
    if (category === "VIDEOS") {
      const newThumbnails = { ...thumbnails };

      files.forEach((file) => {
        if (!thumbnails[file.url]) {
          const video = document.createElement("video");
          video.src = `${BASE_URL}${file.url}#t=0.5`;
          video.crossOrigin = "anonymous";
          video.preload = "metadata";

          video.onloadeddata = () => {
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            newThumbnails[file.url] = canvas.toDataURL();
            setThumbnails({ ...newThumbnails });
          };

          video.load();
          videoRefs.current[file.url] = video;
        }
      });
    }
  }, [files, category]);

  // Hide/show header on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 0) {
        // At top of page, show header
        setIsHeaderVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        // Scrolling down, hide header
        setIsHeaderVisible(false);
      } else {
        // Scrolling up, show header
        setIsHeaderVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getMimeType = (fileName) => {
    if (fileName.endsWith(".mp4")) return "video/mp4";
    if (fileName.endsWith(".webm")) return "video/webm";
    if (fileName.endsWith(".ogg")) return "video/ogg";
    if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg"))
      return "image/jpeg";
    if (fileName.endsWith(".png")) return "image/png";
    if (fileName.endsWith(".gif")) return "image/gif";
    if (fileName.endsWith(".pdf")) return "application/pdf";
    return "application/octet-stream";
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "VIDEOS":
        return <Video size={20} />;
      case "IMAGES":
        return <Image size={20} />;
      case "PDF":
        return <FileText size={20} />;
      case "MUSIC":
        return <Music size={20} />;
      default:
        return <FileQuestion size={20} />;
    }
  };

  const togglePlayPause = (fileUrl, fileName) => {
    if (playingAudio === fileUrl) {
      // Pause currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingAudio(null);
    } else {
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
      }

      // Play new audio
      const audio = new Audio(`${BASE_URL}${fileUrl}`);
      audio.play();
      audioRef.current = audio;
      setPlayingAudio(fileUrl);

      // Handle when audio ends
      audio.onended = () => {
        setPlayingAudio(null);
      };
    }
  };

  const sortedFiles = [...files].sort((a, b) =>
    sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  );

  const filteredFiles = sortedFiles.filter((file) =>
    file.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-section">
          <Folder className="icon-large" />
          <h1 className="logo-text">ServerShare</h1>
        </div>

        <div className="category-menu" ref={categoryMenuRef}>
          <div
            className="menu-header"
            onClick={() => setShowCategories(!showCategories)}
          >
            <span>CATEGORIES</span>
            <ChevronDown
              className={`chevron ${showCategories ? "open" : ""}`}
            />
          </div>

          {showCategories && (
            <div className="category-items">
              {categories.map((cat) => (
                <div
                  key={cat}
                  className={`category-item ${
                    category === cat ? "active" : ""
                  }`}
                  onClick={() => {
                    setCategory(cat);
                    setShowCategories(false);
                  }}
                >
                  {getCategoryIcon(cat)}
                  <span>{cat}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="sidebar-footer">
          <p>Server Share v2.0</p>
          <p>© {new Date().getFullYear()}</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header
          ref={headerRef}
          className={`header ${isHeaderVisible ? "visible" : "hidden"}`}
        >
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder={`Search ${category.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="header-controls">
            <button
              onClick={() => setSortAsc((prev) => !prev)}
              className={`btn btn-sort ${sortAsc ? "active" : ""}`}
              title="Sort by Name"
              type="button"
            >
              {sortAsc ? <SortAsc size={20} /> : <SortDesc size={20} />}
              <span className="sort-text">{sortAsc ? "A-Z" : "Z-A"}</span>
            </button>

            <div className="view-toggles">
              <button
                onClick={() => setView("detail")}
                className={`btn btn-view ${view === "detail" ? "active" : ""}`}
                title="Grid View"
                type="button"
              >
                <LayoutGrid size={20} />
                <span className="view-text">Grid</span>
              </button>
              <button
                onClick={() => setView("list")}
                className={`btn btn-view ${view === "list" ? "active" : ""}`}
                title="List View"
                type="button"
              >
                <List size={20} />
                <span className="view-text">List</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="content-area">
          <div className="content-header">
            <h2>{category}</h2>
            <p>{filteredFiles.length} files</p>
          </div>

          {isLoading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading files...</p>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="no-files">
              <File size={48} />
              <h3>No files found</h3>
              <p>Try another category or search term</p>
            </div>
          ) : view === "list" ? (
            <div className="table-container">
              <table className="file-table">
                <thead>
                  <tr>
                    <th className="th-name">Name</th>
                    <th className="th-action">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.map((file) => (
                    <tr key={file.name} className="table-row">
                      <td className="file-name">
                        {getCategoryIcon(category)}
                        <span className="file-name-text">{file.name}</span>
                      </td>
                      <td className="file-action">
                        {category === "MUSIC" ? (
                          <button
                            onClick={() => togglePlayPause(file.url, file.name)}
                            className="btn btn-open"
                          >
                            {playingAudio === file.url ? (
                              <>
                                <PauseCircle size={18} />
                                <span>Pause</span>
                              </>
                            ) : (
                              <>
                                <PlayCircle size={18} />
                                <span>Play</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <a
                            href={`${BASE_URL}${file.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-open"
                          >
                            <View size={18} />
                            <span>View</span>
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid-container">
              {filteredFiles.map((file) => (
                <div key={file.name} className="file-card">
                  <div className="file-preview">
                    {category === "VIDEOS" ? (
                      <div className="video-container">
                        {thumbnails[file.url] ? (
                          <img
                            src={thumbnails[file.url]}
                            alt={`Error loading thumbnail for ${file.name}`}
                          />
                        ) : (
                          <div className="video-placeholder">
                            <Video size={48} />
                          </div>
                        )}
                        <div className="play-overlay"></div>
                      </div>
                    ) : category === "IMAGES" ? (
                      <img
                        src={`${BASE_URL}${file.url}`}
                        alt={file.name}
                        className="image-file"
                      />
                    ) : category === "MUSIC" ? (
                      <div className="file-icon-container">
                        <Music size={48} />
                      </div>
                    ) : (
                      <div className="file-icon-container">
                        {category === "PDF" ? (
                          <FileText size={48} className="file-icon-large" />
                        ) : (
                          <File size={48} className="file-icon-large" />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="file-info">
                    <p className="file-title">{file.name}</p>
                    {category === "MUSIC" ? (
                      <button
                        onClick={() => togglePlayPause(file.url, file.name)}
                        className="btn btn-download"
                      >
                        {playingAudio === file.url ? (
                          <>
                            <PauseCircle size={18} />
                            <span>Pause</span>
                          </>
                        ) : (
                          <>
                            <PlayCircle size={18} />
                            <span>Play</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <a
                        href={`${BASE_URL}${file.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-download"
                      >
                        <View size={18} />
                        <span>View</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
