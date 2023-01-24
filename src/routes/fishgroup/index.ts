import { Router } from "express";
import fishGroupController from "../../controllers/FishGroup/index";
import upload from "../../middlewares/Multer";

const router = Router();

router.post("/upload", [upload.fields([{ name: "fishGroupFile" }])], fishGroupController.insertFishFileCSV);
router.get("/get", fishGroupController.get);
router.get("/getById/:id", fishGroupController.getById);
router.post("/update/:id", fishGroupController.update);
router.post("/delete/:id", fishGroupController.delete);

export default router;
