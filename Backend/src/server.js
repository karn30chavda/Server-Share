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

const allowedCategories = {
  VIDEOS: ["mp4", "webm", "ogg", "mkv"],
  IMAGES: ["jpg", "jpeg", "png", "gif", "bmp"],
  PDF: ["pdf"],
  MUSIC: ["mp3", "wav", "aac"],
  OTHERS: [], // files not in above exts
};

app.get("/files/:category", (req, res) => {
  const category = req.params.category.toUpperCase();

  if (!allowedCategories.hasOwnProperty(category)) {
    return res.status(400).json({ error: "Invalid category" });
  }

  const folderPath = path.join(baseDir, category);

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error("Cannot read directory:", err);
      return res.status(500).json({ error: "Cannot read directory" });
    }

    let filteredFiles = [];

    if (category === "OTHERS") {
      const allExts = Object.values(allowedCategories)
        .flat()
        .map((ext) => ext.toLowerCase());

      filteredFiles = files.filter((f) => {
        const ext = path.extname(f).slice(1).toLowerCase();
        return !allExts.includes(ext);
      });
    } else {
      filteredFiles = files.filter((f) => {
        const ext = path.extname(f).slice(1).toLowerCase();
        return allowedCategories[category].includes(ext);
      });
    }

    const response = filteredFiles.map((file) => ({
      name: file,
      url: `/file/${category}/${encodeURIComponent(file)}`,
    }));

    res.json(response);
  });
});

app.get("/file/:category/:filename", (req, res) => {
  const category = req.params.category.toUpperCase();
  const filename = req.params.filename;

  if (!allowedCategories.hasOwnProperty(category)) {
    return res.status(400).json({ error: "Invalid category" });
  }

  const filePath = path.join(baseDir, category, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found" });
  }

  if (category === "VIDEOS") {
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
  } else {
    res.sendFile(filePath);
  }
});

app.listen(5000, "0.0.0.0", () => {
  console.log("Server running at http://0.0.0.0:5000");
});
