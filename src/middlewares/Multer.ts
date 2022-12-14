// const multer = require("multer");
// import multer from "multer";
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let { folder } = req.body;

    if (file.fieldname == "certificate") {
      folder = "certificate";
    }

    let dir = folder;

    if (!folder) {
      dir = req.originalUrl.replace("/api/", "");
    }

    dir = path.join(__dirname, `../../public/storage/${dir}`);

    fs.access(dir, function (error) {
      if (error) {
        console.log("Directory does not exist.");
        return fs.mkdir(dir, (error) => cb(error, dir));
      } else {
        console.log("Directory exists.");
        return cb(null, dir);
      }
    });
  },
  filename: function (req, file, cb) {
    let ext;
    if (path.extname(file.originalname)) {
      ext = path.extname(file.originalname);
    } else {
      ext = ".jpg";
    }

    const fullName = Date.now() + ext;
    cb(null, fullName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1000 * 1024 * 1024,
  },
});

export = upload;
