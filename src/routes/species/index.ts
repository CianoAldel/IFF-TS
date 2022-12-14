import speciesController from "../../controllers/Species";
import { Router } from "express";

import upload from "../../middlewares/Multer";

const router = Router();

router.get("/", speciesController.index);
router.get("/:id", speciesController.show);
router.post(
  "/",
  [upload.fields([{ name: "certificate", maxCount: 1 }, { name: "filename[]" }])],
  speciesController.store
);

export default router;
