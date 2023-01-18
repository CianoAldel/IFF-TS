import speciesController from "../../controllers/Species";
import { Router } from "express";
import upload from "../../middlewares/Multer";
import middleware from "../../middlewares/passport-auth";

const router = Router();
router.post(
  "/",
  [upload.fields([{ name: "imageFish" }, { name: "video" }, { name: "certificate", maxCount: 1 }])],
  speciesController.add
);
router.post("/update/video", [upload.fields([{ name: "video" }])], speciesController.insertOrupdateVDO);

router.post("/update/imageFish/", [upload.fields([{ name: "imageFish" }])], speciesController.insertOrupdateImageFish);

router.get("/", speciesController.index);
router.get("/data", speciesController.data);
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
  "/update/certificate/:productId",
  [upload.fields([{ name: "certificate" }])],
  speciesController.updateCertificate
);

router.post(
  "/",
  [upload.fields([{ name: "filenames" }, { name: "video" }, { name: "certificate", maxCount: 1 }])],
  speciesController.add
);

router.get("/filter", speciesController.filter);

router.get("/:id", speciesController.show);

export default router;
