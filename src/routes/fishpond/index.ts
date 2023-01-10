import { Router } from "express";
import fishPondController from "../../controllers/Fishpond/index";
const router = Router();

router.get("/", fishPondController.show);
router.post("/add", fishPondController.add);
router.get("/edit/:id", fishPondController.edit);
router.post("/update/:id", fishPondController.update);
router.post("/delete/:id", fishPondController.delete);

export default router;
