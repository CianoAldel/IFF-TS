import storageController from "../../controllers/Storage";
import { Router } from "express";
const router = Router();
import upload from "../../middlewares/Multer";

router.post("/:id/uploadVdo", storageController.vdo);
router.post("/:id/upload", [upload.fields([{ name: "filename[]" }])], storageController.upload);
router.post("/:folder", storageController.removeAll);
router.delete("/:folder/:id", storageController.destroy);

export default router;
