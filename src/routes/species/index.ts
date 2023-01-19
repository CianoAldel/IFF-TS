import speciesController from "../../controllers/Species";
import { Router } from "express";
import upload from "../../middlewares/Multer";
import middleware from "../../middlewares/passport-auth";

const router = Router();

router.get("/filter", speciesController.filter);

router.post(
  "/",
  [upload.fields([{ name: "imageFish" }, { name: "video" }, { name: "certificate", maxCount: 1 }])],
  speciesController.add
);
router.post("/update/video", [upload.fields([{ name: "video" }])], speciesController.insertOrupdateVDO);

router.post("/update/imageFish", [upload.fields([{ name: "imageFish" }])], speciesController.insertOrupdateImageFish);
router.post("/update/certificate", [upload.fields([{ name: "certificate" }])], speciesController.updateCertificate);

router.get("/", speciesController.index);

router.get("/data", speciesController.data);
router.get("/data/image/:id", speciesController.dataImageId);
router.get("/data/:id", speciesController.dataId);
router.get("/edit/:id", speciesController.edit);
router.post("/update/:id", speciesController.update);
router.get("/delete/:id", speciesController.delete);

router.post(
  "/update/",
  [upload.fields([{ name: "filenames" }, { name: "video" }, { name: "certificate", maxCount: 1 }])],
  speciesController.update
);

router.post(
  "/update/filename",
  [upload.fields([{ name: "filenames" }, { name: "video" }, { name: "certificate", maxCount: 1 }])],
  speciesController.update
);

router.post(
  "/",
  [upload.fields([{ name: "filenames" }, { name: "video" }, { name: "certificate", maxCount: 1 }])],
  speciesController.add
);

router.get("/:id", speciesController.show);

export default router;
