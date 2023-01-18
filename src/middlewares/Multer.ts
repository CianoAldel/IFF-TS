// const multer = require("multer");
// import multer from "multer";
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let object: { folder: string } = req.body;

    /* if certificate not null create folder with path name */
    if (file.fieldname == "certificate") {
      object.folder = "certificate";
    }

    let dir = object.folder;

    if (!object.folder) {
      if (req.originalUrl.split("/")[4] == "imageFish" || req.originalUrl.split("/")[4] == "video") {
        dir = "species";
      }
      dir = req.originalUrl.replace("/api/", "");
    }
    /* if certificate = null create folder with route api path name */
    console.log("dir", dir);

    console.log("req.files", file);

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
