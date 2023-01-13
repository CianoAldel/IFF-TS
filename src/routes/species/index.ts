import speciesController from "../../controllers/Species";
import { Router } from "express";
import upload from "../../middlewares/Multer";
import middleware from "../../middlewares/passport-auth";

const router = Router();

router.get("/", speciesController.index);
router.get("/filter", speciesController.filter);
router.get("/:id", speciesController.show);
router.post(
  "/",
  [upload.fields([{ name: "certificate", maxCount: 1 }, { name: "filenames" }])],
  speciesController.store
);

export default router;
