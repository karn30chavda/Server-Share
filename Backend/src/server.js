import cors from "cors";
import express from "express";
import fs from "fs";
import mime from "mime";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

const baseDir = "C:\\Users\\Acer\\Desktop\\TELECAST";

// List videos
app.get("/videos", (req, res) => {
  fs.readdir(baseDir, (err, files) => {
    if (err) {
      console.error("Cannot read directory:", err);
      return res.status(500).json({ error: "Cannot read directory" });
    }

    const videos = files
      .filter(
        (f) =>
          f.endsWith(".mp4") ||
          f.endsWith(".webm") ||
          f.endsWith(".ogg") ||
          f.endsWith(".mkv")
      )
      .map((file) => ({
        name: file,
        url: `/video/${encodeURIComponent(file)}`,
      }));

    res.json(videos);
  });
});

// Stream video with range (audio+video working)
app.get("/video/:filename", (req, res) => {
  const filePath = path.join(baseDir, req.params.filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found" });
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  const contentType = mime.getType(filePath) || "application/octet-stream";

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunkSize = end - start + 1;
    const file = fs.createReadStream(filePath, { start, end });

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": contentType,
    });

    file.pipe(res);
  } else {
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": contentType,
    });
    fs.createReadStream(filePath).pipe(res);
  }
});

app.listen(5000, "0.0.0.0", () => {
  console.log("Server running at http://0.0.0.0:5000");
});
