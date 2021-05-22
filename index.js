const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const fs = require("fs");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  //reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

const app = express();
require("dotenv").config();

app.get("/", async (req, res, next) => {
  return res.status(200).send(`OK`);
});

app.post("/profile", upload.single("avatar"), function (req, res, next) {
  console.log(req.file);
  res.status(200).send(req.file);
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
});

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(helmet());
app.use(compression());

const port = process.env.APP_PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Listing to port ${port}...`);
});
