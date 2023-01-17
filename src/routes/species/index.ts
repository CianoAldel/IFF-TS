import speciesController from "../../controllers/Species";
import { Router } from "express";
import upload from "../../middlewares/Multer";
import middleware from "../../middlewares/passport-auth";

const router = Router();
router.post(
  "/",
  [upload.fields([{ name: "filenames" }, { name: "video" }, { name: "certificate", maxCount: 1 }])],
  speciesController.add
);
router.get("/", speciesController.index);
router.get("/data", speciesController.data);
router.get("/data/:id", speciesController.dataId);
router.get("/edit/:id", speciesController.edit);
router.post("/update/:id", speciesController.update);
router.get("/delete/:id", speciesController.delete);
router.post(
  "/update/image/:id",
  [upload.fields([{ name: "filenames" }, { name: "video" }, { name: "certificate", maxCount: 1 }])],
  speciesController.updateImage
);

router.post(
  "/",
  [upload.fields([{ name: "filenames" }, { name: "video" }, { name: "certificate", maxCount: 1 }])],
  speciesController.add
);

router.get("/filter", speciesController.filter);

router.get("/:id", speciesController.show);

export default router;
