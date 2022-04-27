const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const catRoute = require("./routes/categories");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const port = process.env.PORT || 3000;

dotenv.config();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/build")));
app.use("/img", express.static(path.join(__dirname, "/img")));
mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log("Connected to MongoDB"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "img");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded.");
});

app.delete("/api/delete", (req, res) => {
  fs.unlinkSync("img/" + req.body.filename);
  res.status(200).json("File has been deleted.");
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", catRoute);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

app.listen(port, () => {
  console.log("Backend is running.");
});
